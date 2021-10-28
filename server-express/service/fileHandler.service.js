const fs = require('fs');
const path = require('path');

/**
 * Remove all files in the folder path corresponding to the route path.
 * @param routePath 
 */
 exports.removeFiles = (routePath) => {
    return new Promise((resolve, reject)=>{

        // directoryPath = getLocalPath(routePath);
		directoryPath = routePath;

        fs.readdir(directoryPath, async function (err, files) {
            if (err) {
                console.log('Unable to scan directory: ' + err)
                reject(new Error(`Could not scan directory: ${err.message}`))
            } 

            for (const file of files){
                fs.unlink(path.join(directoryPath, file), err => {
                    if (err) reject(err);
                  });
            }
            resolve();
        });   
    })
}