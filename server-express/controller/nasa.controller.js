const { getNASAData } = require('../service/nasa.service');
const { downloadImage } = require('../service/downloadImage.service')
const { getMudCracksPredictions } = require('../service/mudcracks.service');
const { getUrlFromS3, checkFromS3, readFromS3, uploadToS3 } = require('../service/awsS3.service');
const { readFromMongo, uploadToMongo } = require('../service/mongoDB.service');
const { checkFromDynamo, readFromDynamo, uploadToDynamo } = require('../service/dynamoDB.service');
const Jimp = require('jimp');
const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');
const { JSDOM } = require('jsdom');
const { writeFileSync } = require('fs');
const cv = require('../public/javascripts/libraries/opencv');

/**
 * Return query as array to use array.reduce with async/await.
 * @param query 
 */
 function returnArray(query){
    if(!Array.isArray(query)){
        return [query];
    }
    else{
        return query;
    }
}

// exports.getPredictions = async (req, res, next) => {
// 	/**
// 	 * Get input from user
// 	 * Use input, get image's URL and nasa_id from Nasa API
// 	 * if nasa_id is found in S3
// 	 * 		serve data (imgLink) from S3
// 	 * else if nasa_id is found in MongoDB
// 	 * 		download image as "nasa_id.jpg"
// 	 * 		get predictions data from MongoDB
// 	 * 		draw new image with predictions data
// 	 * 		upload processed image to S3
// 	 * 		serve data (imgLink) from S3
// 	 * else
// 	 * 		download image as "nasa_id.jpg"
// 	 * 		get predictions from Flask server
// 	 * 		data = Flask response
// 	 * 		draw new image and replace the current "nasa_id.jpg"
// 	 * 		upload predictions to MongoDB and processed image to S3
// 	 * 		serve data (imgLink) from S3
// 	 * Send image_link to client
// 	 */
// 	// TODO Step 1: Get input from user
// 	const userInput = req.query.search;

// 	// TODO Step 2: Using input, get image's link(s) & nasa_id(s) from NASA API
// 	const imageData = await getNASAData(userInput);
// 	// TODO if imageDate[i]['links'].length > 1 => skip
// 	const url = imageData[3]['links'][0]['href'];
// 	const nasa_id = imageData[3]['data'][0]['nasa_id'];	
	

// 	// TODO Step 3: Using image's meta data, download image to NASA images (local folder)
// 	const imagePath = await downloadImage(url, nasa_id);

// 	// TODO Step 4: Using image, get predictions Flask server
// 	const flaskResponse = await getMudCracksPredictions(imagePath);
// 	const predictions = flaskResponse['data'][0]['boundingBox'];
// 	console.log(predictions);

// 	res.status(200).json({
// 		message: 'success',
// 		data: predictions
// 	});
// }

/**
 * Use jsdom and node-canvas to define global variables,
 * for cv.matFromImageData() and cv.imshow(), to emulate HTML DOM.
 * Source: https://docs.opencv.org/3.4/dc/de6/tutorial_js_nodejs.html
 */
 function installDOM() {
    const dom = new JSDOM();
    global.document = dom.window.document;
    // The rest enables DOM image and canvas and is provided by node-canvas
    global.Image = Image;
    global.HTMLCanvasElement = Canvas;
    global.ImageData = ImageData;
    global.HTMLImageElement = Image;
}

/**
 * POST request to get prediction information.
 * Use Jimp/OpenCV libraries to manipulate and save images.
 * @param localPath The local path to the image file.
 * @param predictions The local path to the predicted image file. 
 */
 function predictFile(localPath,predictions){
    return new Promise((resolve, reject) => {
		Jimp.read(localPath)
		.then(async (image) =>{
			const src = cv.matFromImageData(image.bitmap); 
			const w = src.cols;
			const h = src.rows;    
			// emulate a minimal HTML DOM
			installDOM();

			const canvas = createCanvas(w, h);
			let s = new cv.Scalar(255, 0, 0, 255)

			await predictions.reduce(async (promise, prediction) => {
				await promise; // wait for the last promise to be resolved
				
				if (prediction.probability > 0.1){ // only draw predictions within a probability limit
					bbox = prediction.boundingBox;
					x = (bbox.left * w);
					y = (bbox.top * h);
					width = ((bbox.width) * w);
					height = ((bbox.height) * h);
					
					cv.rectangle(src, new cv.Point(x, y), new cv.Point(x+width, y+height), s, 3);
				}
			}, Promise.resolve());
			

			cv.imshow(canvas, src); // apply openCV changes to the HTMLCanvasElement object
			
			writeFileSync(localPath, canvas.toBuffer('image/jpeg'));
			src.delete();;
			setTimeout(function() {
				resolve();
			}, 1000); // prevent HTTP 429 
		})
		.catch((error) => {
			console.log(error);
		})
    });
}

async function getPrediction(imageData) {
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
	// TODO if imageData[i]['links'].length > 1 => skip
	const url = imageData['links'][0]['href'];
	const nasa_id = imageData['data'][0]['nasa_id'] + '.jpg';	
	var s3Path;
	
	// if nasa_id is found in s3
	if(await checkFromS3(nasa_id)){
		//serve image link  from s3
		s3Path = await getUrlFromS3(nasa_id);
	}
	// else if nasa_id is found in DynamoDB
	else if (await checkFromDynamo(nasa_id)) {
		const localPath = await downloadImage(url, nasa_id);	
		const predictions = await readFromDynamo(nasa_id);
		await predictFile(localPath, predictions);
		s3Path = await uploadToS3(localPath, nasa_id);
	}
	else {
		const localPath = await downloadImage(url, nasa_id);	
		const flaskResponse = await getMudCracksPredictions(localPath);
		const predictions = await returnArray(flaskResponse['data'][0]);
		await uploadToDynamo(predictions, nasa_id);
		s3Path = await uploadToS3(localPath, nasa_id);
	}

	return s3Path;
}

exports.getPredictions = async (req, res, next) =>{
	// TODO Step 1: Get input from user
	const userInput = req.query.search;

	// TODO Step 2: Using input, get image's link(s) & nasa_id(s) from NASA API
	const imageData = await getNASAData(userInput);
	console.log(imageData);
	var s3Paths = [];

	await imageData.reduce(async (promise, image) => {     
		await promise; // wait for the last promise to be resolved
		s3Paths.push(await getPrediction(image));
	}, Promise.resolve());

	res.status(200).json(s3Paths);
}