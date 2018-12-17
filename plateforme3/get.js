exports.handler = async (event) => {
    var AWS = require('aws-sdk')
    const util = require('util')
    AWS.config.update({region: 'eu-west-3', maxRetries: 1})

    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'})

    var params = {
      TableName: 'Clicks',
      Key: {
        'id': {N: '1'},
      }
    };

    let response = {
        statusCode: 200,
    };

    ddb.getPromise = util.promisify(ddb.getItem)
    try {
        const data = await ddb.getPromise(params)
        console.log(data.Item.nb.N)
        response.body = JSON.stringify({ nb: data.Item.nb.N })
    } catch (err) {
        console.log("Error", err)
        response.statusCode = 500
        response.data = err
    }

    return response
};
