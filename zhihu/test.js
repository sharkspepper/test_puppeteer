const puppeteer = require('puppeteer');
const settings = require('./settings.js');
const { customKeyboard } = require("../utils/utils");

(async () => {
    const browser = await puppeteer.launch(settings.launch)
    const page = await browser.newPage();
    await page.goto(settings.targetUrl);
    
    // await page.waitForSelector('div[role="list"]')
    const isRecommend = await page.$$(".Card.TopstoryItem.TopstoryItem-isRecommend")
    console.log("isRecommend.length:",isRecommend.length)
    const title = await isRecommend[0].$x('//*[@id="TopstoryContent"]/div/div/div/div[1]/div/div/div/h2/div/a')

    console.log("title[0].toString():",await title[0].toString())
    console.log(typeof await title[0].asElement())
    console.log("title[0].boundingBox():",await title[0].boundingBox())
    console.log("title[0].boxModel():",await title[0].boxModel())
    const properties = await title[0].getProperties();
    console.log(properties)

    const jsHandle = await title[0].getProperty("innerText")
    console.log(await jsHandle.jsonValue())
    // page.close();
    // await browser.close();
})();