require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update({region:'ap-southeast-2'});
const dynamodb  = new AWS.DynamoDB.DocumentClient();
const fs = require('fs');
const DBName = 'nasa-mudcracks';

exports.uploadToDynamo = async (predictions, nasa_id) => {
    const fileContent = predictions;

    const params = {
        TableName: DBName,
        Item:
        {
            nasa_id: nasa_id,
            json: fileContent
        },
    }

    await dynamodb.put(params).promise(function(err, data) {
        if (err) {
            console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
        }
    });

    console.log("Successfully uploaded data to DynamoDB: " + DBName + "/" + nasa_id);
}

exports.readFromDynamo = async (nasa_id) => {
    const params = {
        TableName: DBName,
        Key:
        {
            nasa_id: nasa_id
        },
        AttributesToGet: [
           'json'
        ]
    }

    let result = await dynamodb.get(params).promise();
    return result.Item.json;
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