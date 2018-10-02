'use strict';

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.scan = (event, context, callback) => {
    const param = event.queryStringParameters;
    if (!param.phone_number) {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            body: {
                error: 'Validation Failed.'
            },
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE,
        FilterExpression: 'phone_number = :phone_number',
        ExpressionAttributeValues: {
            ':phone_number': param.phone_number,
        },
    };

    // fetch all sms from the database
    dynamoDb.scan(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                body: error,
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
        callback(null, response);
    });
};
