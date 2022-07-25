function response(code, message) {
    if(code === 400){
        return {
            "statusCode": 400,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": 'application/json',
            },
            "body": message,
            "isBase64Encoded": false
        }
    }
    else if(code === 200){
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": 'application/json',
            },
            "body": message,
            "isBase64Encoded": false
        }
    }
    else {
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": 'application/json',
            },
            "body": "something went wrong",
            "isBase64Encoded": false
        }
    }
}

module.exports = response;