var scheduler = require('./index');

async function runGetPoemCheck(){
    let response = await scheduler.handler({
        "body": JSON.stringify({
            category: "poem",
            wordCount: 45
        })
    });

    console.log(response);

    return response;
}

runGetPoemCheck();