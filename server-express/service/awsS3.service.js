require('dotenv').config();
const AWS = require('aws-sdk');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const bucketName = 'nasa-mudcracks';

async function checkObject (bucket, objectKey) {
	try {
	  const params = {
		Bucket: bucket,
		Key: objectKey 
	  }
  
	  const data = await s3.headObject(params).promise();
  
	  return "File Found in S3";
	} catch (e) {
	  throw new Error(`Could not retrieve file from S3: ${e.message}`)
	}
}

async function getObject (bucket, objectKey) {
	try {
	  const params = {
		Bucket: bucket,
		Key: objectKey 
	  }
  
	  const data = await s3.getObject(params).promise();
  
	  return data.Body.toString('utf-8');
	} catch (e) {
	  throw new Error(`Could not retrieve file from S3: ${e.message}`)
	}
}

function getUrl(bucket,objectKey){
	return new Promise((resolve, reject) => {
		const params = {
			Bucket: bucket,
			Key: objectKey 
		  }

		const region = 'ap-southeast-2';
	
		resolve(`https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`) 
	})
}

exports.getUrlFromS3 = async (nasa_id) => {
	return await getUrl(bucketName, nasa_id);
}

exports.checkFromS3 = async (nasa_id) => {
	const resultJSON = await checkObject(bucketName, nasa_id);

	return resultJSON;
}

exports.readFromS3 = async (nasa_id) => {
	const resultJSON = await getObject(bucketName, nasa_id);

	return resultJSON;
}

exports.uploadToS3 = async (nasa_id) => {
	params.Key = nasa_id;
}
