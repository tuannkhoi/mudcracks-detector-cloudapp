require('dotenv').config();
const AWS = require('aws-sdk');
const { TooManyRequests } = require('http-errors');
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
const bucket = 'nasa-mudcracks';
const fs = require('fs');
const region = 'ap-southeast-2';

async function checkObject (bucket, objectKey) {
	var success = true;
	try {
	  const params = {
		Bucket: bucket,
		Key: objectKey 
	  }

	  const data = await s3.headObject(params).promise().catch((error) => {
		success = false;
	  });

	  return success;
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
	return await getUrl(bucket, nasa_id);
}

exports.checkFromS3 = async (nasa_id) => {
	const resultJSON = await checkObject(bucket, nasa_id);

	return resultJSON;
}

exports.readFromS3 = async (nasa_id) => {
	const resultJSON = await getObject(bucket, nasa_id);

	return resultJSON;
}

exports.uploadToS3 = async (localPath, nasa_id) => {
	const fileContent = fs.readFileSync(localPath);

	const params = {
		Bucket: bucket,
		Key: nasa_id, 
		Body: fileContent
	  }

	const uploadPromise = new AWS.S3({apiVersion: '2006-03-01'}).putObject(params).promise();
	uploadPromise.then(function(data) {
	  console.log("Successfully uploaded data to " + bucket + "/" + nasa_id);
	});
	
	return (`https://${params.Bucket}.s3.${region}.amazonaws.com/${params.Key}`);
}
