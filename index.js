var responses = require('./responses');
var AWS = require('aws-sdk');
const def = require('./definitions');
const { GetObjectCommand, S3Client } = require('@aws-sdk/client-s3')
const client = new S3Client()

AWS.config.update({region: 'us-east-2'});

exports.handler = async (event) => {
    console.log(event);
    let s3Response;
    let s3 = new AWS.S3({apiVersion: '2006-03-01'});
    let response = responses(400, "generation data not retrieved");

    var eventBody = JSON.parse(event.body);

    let hasMoreFields = await hasExtraFields(eventBody, {
        "category":"1",
        "wordCount":1,
        "siteName":"1",
        "genLimit": 1
    });

    if(hasMoreFields){
        return response;
    }

    if(eventBody.wordCount > def.MAX_WORD_COUNT){
        return response;
    }

    let bucketKey = eventBody.category;
    let wordCount = eventBody.wordCount;
    let siteName = eventBody.siteName;
    let genLimit = eventBody.genLimit;

    let approved_bucket_keys = [
        "poems",
        "tweets",
        "sites",
        "rapSongs"
    ]
    
    try {

        if (!approved_bucket_keys.includes(bucketKey)) {
            console.log("No Phrases returned");
            throw new Error('Not approved category!')
        }
    
        bucketKey = bucketKey + ".txt"
    
        let params = {Bucket: 'bot-gen', Key: bucketKey}

        // const command = new GetObjectCommand(params);

        console.log(bucketKey)
        s3Response = await getObject("bot-gen", bucketKey)
        
        console.log("s3Response");
        console.log(s3Response.substr(0,155))

        let phraseArray = s3Response.split("\n||||||||||||||||||||||||||\n")
        if (phraseArray.length < 1){
            console.log("No Phrases returned");
            throw new Error('No phrases were returned')
        }

        phraseArray.length = genLimit;

        response = responses(200, JSON.stringify({
            phrases: phraseArray
        }));

    } catch (error) {
        console.log(error);
        return responses(500, error);
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

function randomProperty (obj) {
    var keys = Object.keys(obj);
    var randomIndex = Math.floor(Math.random()*keys.length);
    var randomProperty = keys[randomIndex];

    return randomProperty;
}

function getObject (Bucket, Key) {
  return new Promise(async (resolve, reject) => {
    const getObjectCommand = new GetObjectCommand({ Bucket, Key })

    try {
      const response = await client.send(getObjectCommand)
  
      // Store all of data chunks returned from the response data stream 
      // into an array then use Array#join() to use the returned contents as a String
      let responseDataChunks = []

      // Handle an error while streaming the response body
      response.Body.once('error', err => reject(err))
  
      // Attach a 'data' listener to add the chunks of data to our array
      // Each chunk is a Buffer instance
      response.Body.on('data', chunk => responseDataChunks.push(chunk))
  
      // Once the stream has no more data, join the chunks into a string and return the string
      response.Body.once('end', () => resolve(responseDataChunks.join('')))
    } catch (err) {
      // Handle the error or throw
      console.log(err)
      return reject(err)
    } 
  })
}