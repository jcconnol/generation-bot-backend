var scheduler = require('./index');

async function runGetPoemCheck(){
    let response = await scheduler.handler({
        "body": JSON.stringify({
            category: "poem",
            wordCount: 45
        })
    });

    console.log(response);

    response = await scheduler.handler({
        "body": JSON.stringify({
            category: "site",
            wordCount: 45,
            siteName: "ramseysolutions"
        })
    });

    console.log(response);

    response = await scheduler.handler({
        "body": JSON.stringify({
            category: "tweets",
            wordCount: 45
        })
    });

    console.log(response);

    response = await scheduler.handler({
        "body": JSON.stringify({
            category: "rapSong",
            wordCount: 45
        })
    });

    console.log(response);

    return response;
}

runGetPoemCheck();