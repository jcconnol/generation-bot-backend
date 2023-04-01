import boto3
import json
import responses

S3_BUCKET_NAME = "bot-gen"

REQUIRED_KEYS = [
    "category",
    "wordCount"
]

def endpoint(event):

    # check if required fields exist on object
    # pull file from s3
    # generate sentences from object
    # return generated object(s)

    if hasExtraKeys(event) or !haveRequiredKeys(event):
        return responses(400, "incorrect keys provided")

    s3_filename = ""

    match event.category:
        case "poems":
            s3_filename = "poems.txt"
        case "rapSongs":
            s3_filename = "rapSongs.txt"
        case "tweets":
            s3_filename = "tweets.txt"
        case _:
            return responses(400, "category not recognized")

    if event.wordCount > 150 or event.wordCount < 1:
        return responses(400, "please provide a valid word count")

    s3_data = retrieveGenerationData(s3_filename)

def retrieveGenerationData(filename):
    s3_client = boto3.client('s3')
    response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=filename)
    bytes = response['Body'].read()
    utf8Object = json.loads(bytes.decode('utf-8'))
    return utf8Object

def haveRequiredKeys(inputObj):
    print("whatever")


def hasExtraKeys(object, fieldObj){
    var keys = Object.keys(object);
    for (var i = 0; i < keys.length; i++) {
        if(!fieldObj[keys[i]]){
            return true;
        }
    }

    return false;
}

def buildPhrase(wordObj, maxCount) {
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

def parseGeneratedText(fullString){
    return fullString.split("\n||||||||||\n")
}
