import boto3
import json
from responses import response
import random
from botocore.exceptions import NoCredentialsError

s3_client = boto3.client('s3', region_name='us-east-2')

S3_BUCKET_NAME = "markov-chain-generations"

REQUIRED_KEYS = ["category"]

def endpoint(event):
    eventBody = json.loads(event["body"])

    if not haveExtraKeys(eventBody) and haveRequiredKeys(eventBody):
        return response(400, "Incorrect keys provided")

    s3_folder = ""

    match eventBody["category"]:
        case "poems":
            s3_folder = "poems/"
            info_type = "poem"
        case "songs":
            s3_folder = "songs/"
            info_type = "song"
        case "tweets":
            s3_folder = "tweets/"
            info_type = "tweets"
        case _:
            return response(400, "category not recognized")

    if eventBody["wordCount"] > 150 or eventBody["wordCount"] < 1:
        return response(400, "please provide a valid word count")

    try:
        print(info_type)
        prase = retrieveGeneratedData(s3_folder, info_type)

        return response(200, { "phrase": prase })

    except Exception as e:
        print(e)
        return response(500, e)

def retrieveGeneratedData(folder_name, info_type):
    s3 = boto3.client('s3')

    try:
        objects = s3.list_objects_v2(Bucket=S3_BUCKET_NAME, Prefix=folder_name, MaxKeys=10000)

        object_count = objects.get('KeyCount', 0)
        print(type(object_count))
        random_object_num = random.randint(0, object_count)


        object_name = f"{folder_name}markov_gen_{info_type}_{random_object_num}_v1.txt"
        print(object_name)
        object_content = s3.get_object(Bucket=S3_BUCKET_NAME, Key=object_name)['Body'].read().decode('utf-8')
        print(object_content)
        return object_content

    except NoCredentialsError:
        print("Credentials not available.")
        return None

def haveRequiredKeys(inputObj):
    for value in REQUIRED_KEYS:
        if value not in inputObj.keys():
            return False

    return True

def haveExtraKeys(inputObj):
    for key in list(inputObj.keys()):
        if key not in REQUIRED_KEYS:
            return False
    return True
