import json
import datetime
import index

def main():
    print(index.endpoint({ "bucket_path": "fish-cam"}, {}))

    index.endpoint({
         "body": JSON.stringify({
             category: "poem",
             wordCount: 45
         })
    });

def runGetPoemCheck():
     response = index.endpoint({
         "body": JSON.stringify({
             "category": "site",
             "wordCount": 45,
             "siteName": "ramseysolutions"
         })
     });

     response = index.endpoint({
         "body": JSON.stringify({
             "category": "tweets",
             "wordCount": 45
         })
     });

    response = index.endpoint({
        "body": JSON.stringify({
            "category": "rapSongs",
            "wordCount": 45
        })
    });


    return response

if __name__ == "__main__":
    main()
