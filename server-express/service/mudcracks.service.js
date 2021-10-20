const axios = require('axios');

exports.getMudCracksPredictions = async (imagePath) => {
	const MUDCRACKS_API_URL = 'http://127.0.0.1:5000/predict';
	const predictions = await axios.get(MUDCRACKS_API_URL, {
		params: {
			imagePath: '../NASA images/PIA1412.jpg',
			// imagePath,
		}
	});
	return predictions;
}