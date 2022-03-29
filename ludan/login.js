const puppeteer = require('puppeteer');
const settings = require('./settings.js');
const { customKeyboard } = require("../utils/utils");

(async () => {
    const browser = await puppeteer.launch(settings.launch)
    // console.log(browser.wsEndpoint())

    const page = await browser.newPage();
    await page.goto(settings.targetUrl,{
        timeout: 30 * 1000,
        waitUntil: [
            // 'load',              //等待 “load” 事件触发
            // 'domcontentloaded',  //等待 “domcontentloaded” 事件触发
            'networkidle0',      //在 500ms 内没有任何网络连接
            // 'networkidle2'       //在 500ms 内网络连接个数不超过 2 个
        ]
     });

    // 登录
    // 填充用户名
    const nameInput = await page.$('.firstline input[type=text]');
    await nameInput.focus(); 
    await customKeyboard(page, settings.user.account);

    // 填充密码
    const pwdInput = await page.$('.secondline input[type=password]');
    await pwdInput.focus();
    await customKeyboard(page, settings.user.password);

    // //  捕获验证码
    // const vcode = await page.$('.secondline svg');
    // const captchaPath = path.join(__dirname,"../documents")
    // await vcode.screenshot({path: captchaPath+"/captcha.png"})
    // // 识别验证码
    // const worker = tesseract.createWorker({
    //     logger: log => console.log(log),
    // })
    // await worker.load();
    // await worker.loadLanguage('eng');
    // await worker.initialize('eng');
    // const {data: text} = await worker.recognize(captchaPath)
    // console.log("Captcha Data:", text.text)
    // await worker.terminate();
    // await page.waitForTimeout(1800)
    // 填充验证码
    const vcodeInput = await page.$('.secondline input[type=text]');
    await vcodeInput.focus();
    await customKeyboard(page, "wrwe");

    // 登录按钮
    const loginBtn = await page.$('.lastline button');
    await Promise.all([
        page.waitForNavigation(),
        loginBtn.click() //登录
    ])

    // # 页面会话的cookies
    // const cookies = await page.cookies()
    // console.log(cookies)
    
})();