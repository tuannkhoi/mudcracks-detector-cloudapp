const download = require('image-downloader');

/**
 * @param {string} url the image's url
 * @param {string} nasa_id the image's nasa_id
 * @returns {string} imagePath (local) path to the downloaded image
 */

exports.downloadImage = async (url, nasa_id) => {
	const options = {
		url,
		dest: `./../NASA images/${nasa_id}.jpg`
	}
	download.image(options)
		.then(({ filename }) => {
			console.log('Saved to ', filename);
		})
		.catch((err) => console.error(err));
	return options.dest;
}