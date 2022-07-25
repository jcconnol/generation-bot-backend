//TODO retrieve data from S3 bucket based on category from input
//Create object for S3 bucket
//TODO add poem bucket
//TODO add tweet generation
//TODO add songs generation - different genres
//TODO website one

var responses = require('./responses');
var AWS = require('aws-sdk');
const def = require('./definitions')

AWS.config.update({region: 'us-east-2'});

//TODO set variable for s3 response here
let s3PoemResponse;

exports.handler = async (event) => {
    console.log(event);
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    let response = responses(400, "Ticket Data not retrieved");
    let bucketKey;

    var eventBody = JSON.parse(event.body);

    let hasMoreFields = await hasExtraFields(eventBody, {
        "category":"1",
        "wordCount":"1"
    });

    if(hasMoreFields){
        return response;
    }

    if(eventBody.wordCount > def.MAX_WORD_COUNT){
        return response;
    }

    let category = eventBody.category;
    let wordCount = eventBody.wordCount;
    
    switch(category) {
        case "poem":
            bucketKey = "poem.json"
            break;
        case "tweets":
            bucketKey = "tweets.json"
            break;
        default:
            bucketKey = ""
    }


    let params = {Bucket: 'bot-gen', Key: bucketKey}

    if(!s3PoemResponse){
        s3PoemResponse = await s3.getObject(params).promise();
    }
    
    if(!s3PoemResponse.Body){
        console.log(s3PoemResponse);
    }
    else{
        let s3Obj = JSON.parse(s3PoemResponse.Body);
        let phraseArray = []

        for(var i = 0; i < def.PHRASE_COUNT; i++){
            phrase = await buildPhrase(s3Obj, wordCount);
            phraseArray.push(phrase)
        }

        response = responses(200, {
            phrases: phraseArray
        });
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
        if(!wordArray.length){
            break;
        }

        let randomIndex = Math.floor(Math.random()*wordArray.length)
        let randomWord = wordArray[randomIndex]

        message += ' ' + randomWord

        wordArray = wordObj[randomWord]
    }
     
    return message;
}

function randomProperty (obj) {
    var keys = Object.keys(obj);
    return obj[keys[ keys.length * Math.random() << 0]];
};