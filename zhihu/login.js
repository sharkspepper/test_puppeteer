const puppeteer = require('puppeteer');
const settings = require('./settings.js');
const { customKeyboard } = require("../utils/utils");

(async () => {
    const browser = await puppeteer.launch(settings.launch)
    // console.log(browser.wsEndpoint())
    const page = await browser.newPage();
    await page.goto(settings.targetUrl);
})();