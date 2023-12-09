import json
import datetime
import index

def main():
    runGetDataCheck()

def runGetDataCheck():
    response = index.endpoint({
         "body": json.dumps({
             "category": "songs",
             "wordCount": 45
         })
     });

    print(response)

    # response = index.endpoint({
    #     "body": json.dumps({
    #         "category": "tweets",
    #         "wordCount": 45
    #     })
    # });

    # print(response)

    # response = index.endpoint({
    #     "body": json.dumps({
    #         "category": "rapSongs",
    #         "wordCount": 45
    #     })
    # });

    # print(response)

    return response

if __name__ == "__main__":
    main()
