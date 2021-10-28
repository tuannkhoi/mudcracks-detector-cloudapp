const Jimp = require('jimp');

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