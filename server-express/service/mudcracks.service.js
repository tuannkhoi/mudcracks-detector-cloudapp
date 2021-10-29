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
exports.getMudCracksPredictions = async (req, imagePath) => {
	const MUDCRACKS_API_URL = `${req.protocol}://${req.hostname}:${flaskPort}/predict`;
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
 exports.predictFile = (localPath,predictions) => {
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
			reject(error)
		})
    });
}