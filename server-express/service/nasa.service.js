const axios = require('axios');

/**
 * @param {string} userInput the user's input to the search bar
 * @returns {array} array of results
 */

exports.getNASAData = async (userInput) => {
	const NASA_API_URL = 'https://images-api.nasa.gov/search'
	const response = await axios.get(NASA_API_URL, {
		params: {
			q: userInput
		}
	});
	return response.data.collection.items;
}