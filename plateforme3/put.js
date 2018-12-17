exports.handler = async (event) => {
    var AWS = require('aws-sdk')
    const util = require('util')
    AWS.config.update({region: 'eu-west-3', maxRetries: 1})

    const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'})

    const getParams = {
      TableName: 'Clicks',
      Key: {
        'id': { N: '1' },
      }
    };

    const response = {
        statusCode: 200,
    };

    ddb.getPromise = util.promisify(ddb.getItem)
    try {
        let data = await ddb.getPromise(getParams)

        const nb = parseInt(data.Item.nb.N, 10)
        const putParams = {
          TableName: 'Clicks',
          Item: {
            'id' : { N: '1' },
            'nb' : { N: JSON.stringify(nb ? nb + 1 : 1) },
          }
        };

        ddb.putPromise = util.promisify(ddb.putItem)
        try {
            let data = await ddb.putPromise(putParams)
        } catch (err) {
            console.log("Error", err)
            response.statusCode = 500
        }
    } catch (err) {
        console.log("Error", err)
        response.statusCode = 500
    }

    return response
};
