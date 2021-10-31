const { getNASAData } = require('../service/nasa.service');
const { downloadImage } = require('../service/downloadImage.service')
const { getMudCracksPredictions, drawMudCracksPredictions } = require('../service/mudcracks.service');
const { checkFromS3, getUrlFromS3, uploadToS3 } = require('../service/awsS3.service');
const { checkFromDynamo, readFromDynamo, uploadToDynamo } = require('../service/dynamoDB.service');
const { returnArray, handleLimitQuery, handleSearchQuery } = require('../service/queryHandler.service')
const { removeFiles } = require('../service/fileHandler.service')
const routePath = `../NASA images/`;

/**
 * Serve s3 link for an image 
 * @param imageData 
 */
async function getPrediction(req, imageData) {
	/**
	 * Get input from user
	 * Use input, get image's URL and nasa_id from Nasa API
	 * if nasa_id is found in S3
	 * 		serve data (imgLink) from S3
	 * else if nasa_id is found in MongoDB
	 * 		download image as "nasa_id.jpg"
	 * 		get predictions data from MongoDB
	 * 		draw new image with predictions data
	 * 		upload processed image to S3
	 * 		serve data (imgLink) from S3
	 * else
	 * 		download image as "nasa_id.jpg"
	 * 		get predictions from Flask server
	 * 		data = Flask response
	 * 		draw new image and replace the current "nasa_id.jpg"
	 * 		upload predictions to MongoDB and processed image to S3
	 * 		serve data (imgLink) from S3
	 * Send image_link to client
	 */
	const url = imageData['links'][0]['href'];

	const nasa_id = imageData['data'][0]['nasa_id'] + '.jpg';

	let s3Path;
	
	if(await checkFromS3(nasa_id)){
		s3Path = await getUrlFromS3(nasa_id);
	}
	else if (await checkFromDynamo(nasa_id)) {
		const localPath = await downloadImage(url, nasa_id);	
		const predictions = await readFromDynamo(nasa_id);
		await drawMudCracksPredictions(localPath, predictions);
		s3Path = await uploadToS3(localPath, nasa_id);
	}
	else {
		const localPath = await downloadImage(url, nasa_id);	
		const flaskResponse = await getMudCracksPredictions(localPath);
		const predictions = await returnArray(flaskResponse['data']);
		await uploadToDynamo(predictions, nasa_id);
		s3Path = await uploadToS3(localPath, nasa_id);
	}

	return s3Path;
}


exports.getPredictions = async (req, res, next) =>{
	try {
		const userInput = req.query.search;
		const limit = req.query.limit;
		if (!handleSearchQuery(userInput)) throw new Error('The search query should not be empty');
		if (!handleLimitQuery(limit)) throw new Error('The limit query should be a positive integer');

		const imageData = await getNASAData(userInput);

		const filteredImageData = imageData.filter(function (image) {
			return !image['href'].includes('video') &&  !image['href'].includes('audio');
		})
		
		const slicedImageData = filteredImageData.slice(0, limit);
		let s3Paths = [];

		await slicedImageData.reduce(async (promise, image) => {     
			await promise; // wait for the last promise to be resolved
			result = await getPrediction(req, image)
			if(await result){
				s3Paths.push(result);
			}
		}, Promise.resolve());

		await removeFiles(routePath);
		console.log("Finished serving s3Paths");

		if (s3Paths.length <= 0) throw new Error('There is no result for that query from NASA API');

		res.status(200).json({
			message: "success",
			data: s3Paths
		});
    }
    catch (error) {
        res.status(500).json({ message: "failure", errorMessage: error.message });
    }
}