const download = require('image-downloader');
const Jimp = require('jimp');

/**
 * @param {string} url the image's url
 * @param {string} nasa_id the image's nasa_id
 * @returns {string} options.dest (local) path to the downloaded image
 */
// exports.downloadImage = async (url, nasa_id) => {
// 	const options = {
// 		url,
// 		dest: `../NASA images/${nasa_id}.jpg`
// 	}
// 	await download.image(options)
// 		.then(({ filename }) => {
// 			console.log('Saved to ', filename);
// 		})
// 		.catch((err) => console.error(err));
// 	return options.dest;
// }

/**
 * Save the image to the local folder.
 * @param imageUrl The url of the image.
 * @param nasa_id The image's nasa_id.
 */
 exports.downloadImage = (url,nasa_id) => {
    return new Promise((resolve, reject) => {
		const imagePath = `../NASA images/${nasa_id}`;
        Jimp.read(encodeURI(url))
        .then(async function(image) {
            await image
            .writeAsync(imagePath)

            console.log(`${url} downloaded`);
            resolve(imagePath);
        })
        .catch((error) => {
            console.log(error);
            reject(error);
        });
    });
}