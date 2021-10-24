require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({region:'ap-southeast-2'});
const dynamodb  = new AWS.DynamoDB.DocumentClient();
const DBName = 'nasa-mudcracks';

exports.uploadToDynamo = async (nasa_id, predictions) => {

}

exports.readFromDynamo = async (nasa_id) => {
	
}
exports.checkFromDynamo = async (nasa_id) => {
    const params = {
        TableName: DBName,
        Key:
        {
            nasa_id: nasa_id
        },
        AttributesToGet: [
           'nasa_id'
        ]
    }

    var exists = false;
    let result = await dynamodb.get(params).promise();
    if (result.Item !== undefined && result.Item !== null) {
      exists = true
    }

    return (exists)
}