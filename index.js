const puppeteer = require('puppeteer');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT || 5001; 


async function getHashtag(keyword){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://inflact.com/tools/instagram-hashtag-generator/#/topics/');
    await page.waitForSelector('.InputElement--3fjog3');
    await page.type('.InputElement--3fjog3', keyword);
    await page.click('.ButtonText--1o39ncz');
    await page.waitForSelector('.ListHashtagElement--13u2epa');
    const data = await page.evaluate(()=>{
        const array = Array.from(document.querySelectorAll('.ListHashtagElement--13u2epa'));
        return array.map((e)=>({
            hashtag: e.querySelector('.ListHashtagTitle--d95b8k').textContent
        }));
    });
    browser.close();
    return data;
}


app.post('/api', async (req,res)=>{
    const hashtagKeyword = req.body.hashtagKeyword;
    if(!hashtagKeyword){
        res.status(404);
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