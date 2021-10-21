const { getNASAData } = require('../service/nasa.service');
const { downloadImage } = require('../service/downloadImage.service')
const { getMudCracksPredictions } = require('../service/mudcracks.service');
const { readFromS3, uploadToS3 } = require('../service/awsS3.service');
const { readFromMongo, uploadToMongo } = require('../service/mongoDB.service');

exports.getPredictions = async (req, res, next) => {
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
	// TODO Step 1: Get input from user
	const userInput = req.query.search;

	// TODO Step 2: Using input, get image's link(s) & nasa_id(s) from NASA API
	const imageData = await getNASAData(userInput);
	// TODO if imageDate[i]['links'].length > 1 => skip
	const url = imageData[3]['links'][0]['href'];
	const nasa_id = imageData[3]['data'][0]['nasa_id'];	
	

	// TODO Step 3: Using image's meta data, download image to NASA images (local folder)
	const imagePath = await downloadImage(url, nasa_id);

	// TODO Step 4: Using image, get predictions Flask server
	const flaskResponse = await getMudCracksPredictions(imagePath);
	const predictions = flaskResponse['data'][0]['boundingBox'];
	console.log(predictions);

	res.status(200).json({
		message: 'success',
		data: predictions
	});
}