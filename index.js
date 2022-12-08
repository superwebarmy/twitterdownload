const puppeteer = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 5001; 


async function getHashtag(keyword){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.all-hashtag.com/hashtag-generator.php');
    await page.waitForSelector('#keyword');
    await page.type('#keyword', keyword);
    await page.waitForSelector('.btn-gen');
    await page.click('.btn-gen');
    await page.waitForSelector('#copy-hashtags');
    const hash = await page.evaluate(()=>{
        return document.querySelector('#copy-hashtags').textContent;
    });
    const array = hash.split(' ');
    const objectArray = array.map((e)=>({
        hashtag: e
    }));
    browser.close();
    return objectArray;
}



app.post('/api', async (req,res)=>{
    const hashtagKeyword = req.body.hashtagKeyword;
    if(!hashtagKeyword){
        res.status(400);
        res.send({
            error: 'please pass the required parameter in the body'
        });
    } else {
        const hashtagArray = await getHashtag(hashtagKeyword);
        res.status(200);
        res.send(hashtagArray);
    }
});


app.listen(PORT, ()=>{
    console.log('listening');
});