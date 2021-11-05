const axios = require('axios');
const Jimp = require('jimp');
const cv = require('../public/javascripts/libraries/opencv');
const { Canvas, createCanvas, Image, ImageData, loadImage } = require('canvas');
const { JSDOM } = require('jsdom');
const { writeFileSync } = require('fs');
const flaskPort = 5000;

/**
 * GET request to Flask server for prediction information.
 * @param imagePath The local path to the image file.
 */
exports.getMudCracksPredictions = async (imagePath) => {
	const MUDCRACKS_API_URL = `http://localhost:5000/predict`;
	const predictions = await axios.get(MUDCRACKS_API_URL, {
		params: {
			imagePath: imagePath,
		}
	})
	.catch((error)=>{
		return new Error("Can not connect to Flask server: " + error.message);
	});

	return predictions;
}

/**
 * GET request to Flask server to draw images using prediction information.
 * @param imagePath The local path to the image file.
 */
 exports.drawMudCracksPredictions = async (imagePath, predictions) => {
	const MUDCRACKS_API_URL = `http://localhost:5000/draw`;
	await axios
	.get(MUDCRACKS_API_URL, {
		params: {
			imagePath: imagePath
		},
		data: predictions,
		headers: { "Content-Type": "application/json" },
	})
	.catch((error)=>{
		return new Error("Can not connect to Flask server: " + error.message);
	});
}