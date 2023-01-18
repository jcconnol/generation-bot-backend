var scheduler = require('./index');

async function runGetPoemCheck(){
    // let response = await scheduler.handler({
    //     "body": JSON.stringify({
    //         category: "poem",
    //         wordCount: 45,
    //         genLimit: 3
    //     })
    // });

    // console.log(response);

    // response = await scheduler.handler({
    //     "body": JSON.stringify({
    //         category: "site",
    //         wordCount: 45,
    //         siteName: "ramseysolutions",
    //         genLimit: 3
    //     })
    // });

    // console.log(response);

    // response = await scheduler.handler({
    //     "body": JSON.stringify({
    //         category: "tweets",
    //         wordCount: 45,
    //         genLimit: 3
    //     })
    // });

    // console.log(response);

    response = await scheduler.handler({
        "body": JSON.stringify({
            category: "rapSongs",
            wordCount: 45,
            genLimit: 3
        })
    });

    console.log(response)
    return response;
}

runGetPoemCheck();