const { getNASAData } = require('../service/nasa.service');
const { downloadImage } = require('../service/downloadImage.service')
const { getMudCracksPredictions } = require('../service/mudcracks.service');

exports.getPredictions = async (req, res, next) => {
	/**
	 * Get input from user
	 * Use input, get image's URL and nasa_id from Nasa API
	 * if nasa_id is found in Redis
	 * 		data = Redis response
	 * else if nasa_id is found in S3
	 * 		data = S3 response
	 * 		save data to Redis
	 * else
	 * 		download image as "nasa_id.jpg"
	 * 		get predictions from Flask server
	 * 		data = Flask response
	 * 		save data to Redis & S3
	 * Send data to client
	 */
	// Step 1: Get input from user
	const userInput = req.query.search;

	// Step 2: Using input, get image's link(s) & nasa_id(s) from NASA API
	const imageData = await getNASAData(userInput);
	// TODO if imageDate[i]['links'].length > 1 => skip
	const url = imageData[4]['links'][0]['href'];
	const nasa_id = imageData[4]['data'][0]['nasa_id'];
	console.log(url, ' ', nasa_id);

	// Step 3: Using image's meta data, download image to NASA images (local folder)
	const imagePath = await downloadImage(url, nasa_id);

	// Step 4: Using image, get predictions Flask server
	const predictions = getMudCracksPredictions(imagePath);

	res.status(200).json({
		message: 'success',
		// data: predictions,
		data: predictions
	})
}