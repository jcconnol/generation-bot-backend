var responses = require('./responses');
var AWS = require('aws-sdk');
const def = require('./definitions')

AWS.config.update({region: 'us-east-2'});

exports.handler = async (event) => {
    console.log(event);
    let s3Response;
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    let response = responses(400, "generation data not retrieved");
    let bucketKey;

    var eventBody = JSON.parse(event.body);

    let hasMoreFields = await hasExtraFields(eventBody, {
        "category":"1",
        "wordCount":1,
        "siteName":"1"
    });

    if(hasMoreFields){
        return response;
    }

    if(eventBody.wordCount > def.MAX_WORD_COUNT){
        return response;
    }

    let category = eventBody.category;
    let wordCount = eventBody.wordCount;
    let siteName = eventBody.siteName;
    
    switch(category) {
        case "poem":
            bucketKey = "poem.json"
            break;
        case "tweets":
            bucketKey = "tweets.json"
            break;
        case "site":
            bucketKey = `site-${siteName}.json`
            break;
        case "rapSong":
            bucketKey = "rapSongs.json"
            break;
        case "rapSongs":
            bucketKey = "rapSongs.json"
            break;
        default:
            bucketKey = ""
    }

    let params = {Bucket: 'bot-gen', Key: bucketKey}

    if(!s3Response){
        s3Response = await s3.getObject(params).promise();
    }
    
    if(!s3Response.Body){
        console.log("s3Response");
    }
    else{
        try {
            console.log("s3Response");
            let s3ResponseBody;
            
            s3ResponseBody = await s3Response.Body.toString('utf-8'); 
            
            let phraseArray = await parseGeneratedText(s3ResponseBody);
            console.log(phraseArray)

            response = responses(200, JSON.stringify({
                phrases: phraseArray
            }));
        } catch (error) {
            console.log(error);
            return responses(500, "Server error");
        }
    }

    return response;
}

async function hasExtraFields(object, fieldObj){
    var keys = Object.keys(object);
    for (var i = 0; i < keys.length; i++) {
        if(!fieldObj[keys[i]]){
            return true;
        }
    }

    return false;
}

async function buildPhrase(wordObj, maxCount) {
    //Picks the next word over and over until word count achieved
    let message = "";
    let randomFirstWord = randomProperty(wordObj);
    message = randomFirstWord;
    let wordArray = wordObj[randomFirstWord]

    for (let index = 0; index < maxCount-1; index++) {
        if(!wordArray || !wordArray.length){
            break;
        }

        let randomIndex = Math.floor(Math.random()*wordArray.length)
        let randomWord = wordArray[randomIndex]

        message += ' ' + randomWord

        wordArray = wordObj[randomWord]
    }
    
    return message;
}

async function parseGeneratedText(fullString){
    return fullString.split("\n||||||||||\n")
}