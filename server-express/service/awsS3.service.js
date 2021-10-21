require('dotenv').config();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const bucketName = 'nasa-mudcracks';
const params = {
	Bucket: bucketName,
};

exports.readFromS3 = async (nasa_id) => {
	params.Key = nasa_id;
}

exports.uploadToS3 = async (nasa_id) => {
	params.Key = nasa_id;
}
