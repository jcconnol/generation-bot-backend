import boto3
import json
from responses import response
import random
import os

s3_client = boto3.client('s3', region_name='us-east-2')

S3_BUCKET_NAME = "bot-gen"

REQUIRED_KEYS = [
    "category",
    "wordCount"
]

def endpoint(event):

    eventBody = json.loads(event["body"])

    if not haveExtraKeys(eventBody) and haveRequiredKeys(eventBody):
        return response(400, "Incorrect keys provided")

    s3_filename = ""

    match eventBody["category"]:
        case "poems":
            s3_filename = "poems.txt"
        case "rapSongs":
            s3_filename = "rapSongs.txt"
        case "tweets":
            s3_filename = "tweets.txt"
        case _:
            return response(400, "category not recognized")

    if eventBody["wordCount"] > 150 or eventBody["wordCount"] < 1:
        return response(400, "please provide a valid word count")

    try:
        s3_data = retrieveGenerationData(s3_filename)

        prase = buildPhrase(s3_data, eventBody["wordCount"])

        return response(200, { "phrase": prase })

    except Exception as e:
        print(e)
        return response(500, e)

def retrieveGenerationData(filename):
    response = s3_client.get_object(Bucket=S3_BUCKET_NAME, Key=filename)
    bytes = response['Body'].read()
    utf_8_object = bytes.decode('utf-8')
    generation_json = parseGeneratedText(utf_8_object)

    print(generation_json)

    return generation_json

def haveRequiredKeys(inputObj):
    for value in REQUIRED_KEYS:
        if value not in inputObj.keys():
            return False

    return True

def haveExtraKeys(inputObj):
    for key in list(inputObj.keys()):
        print(key)
        if key not in REQUIRED_KEYS:
            print(key)
            print(REQUIRED_KEYS)
            return False

    return True

def randomPropertyItem(wordObj):
    return random.choice(list(wordObj.items()))

def randomArrayElem(array):
    return random.choice(array)

def buildPhrase(wordObj, maxCount):
    message = ""
    randomWordArray = randomPropertyItem(wordObj)
    randomWord = randomArrayElem(randomWordArray)
    message = randomWord

    for index in range(maxCount-1):
        print("whatever")


    return message

def parseGeneratedText(fullString):
    return fullString.split("\n||||||||||\n")
