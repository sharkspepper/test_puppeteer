const puppeteer = require('puppeteer');
const tesseract = require('tesseract.js');
const UserAgent = require("user-agents");
const { customKeyboard, addMenu } = require("../utils/utils");
const path = require('path')
const userDataDir = path.join(__dirname,"./userData")
const targetUrl = "http://192.168.1.18:8080"
const account = "王瑞";
const password = "hc654321";

// https://zhuanlan.zhihu.com/p/76237595
// http://www.puppeteerjs.com/
const userAgent = new UserAgent({
    deviceCategory: "desktop",
    platform: "Linux x86_64",
});
(async () => {
    const browser = await puppeteer.launch({
        headless: false,   //有浏览器界面启动
        slowMo: 100,       //放慢浏览器执行速度，方便测试观察
        defaultViewport:null,
        timeout:30 * 1000,
        // args:[
        //     `--user-agent=${userAgent}`,
        // ],
        userDataDir: userDataDir,//浏览器配置数据
    })
    // console.log(browser.wsEndpoint())

    const page = await browser.newPage();
    await page.goto(targetUrl,{
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
    await customKeyboard(page, account);

    // 填充密码
    const pwdInput = await page.$('.secondline input[type=password]');
    await pwdInput.focus();
    await customKeyboard(page, password);

    //  捕获验证码
    const vcode = await page.$('.secondline svg');
    const captchaPath = path.join(__dirname,"../documents")
    await vcode.screenshot({path: captchaPath+"/captcha.png"})
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

    // 菜单
    await addMenu(page)
    await page.on('load',async ()=>{
        // 防止页面刷新,菜单消失
        await addMenu(page)
    })
    // 上传任务界面
    await page.goto(`${targetUrl}/#/upload`);
    // 填写信息
    // 案件类型
    const el_select1 = await page.$$('.el-select')
    el_select1[0].click()
    await page.waitForSelector('.el-select-dropdown')
    const el_select_dropdown1 = await page.$$('.el-select-dropdown[x-placement="bottom-start"] .el-select-dropdown__item')
    el_select_dropdown1[1].click()

    // 优先级
    const el_select2 = await page.$$('.el-select')
    el_select2[1].click()
    await page.waitForSelector('.el-select-dropdown')
    const el_select_dropdown2 = await page.$$('.el-select-dropdown[x-placement="bottom-start"] .el-select-dropdown__item')
    el_select_dropdown2[1].click()

    // 姓名 证件号
    const inputSelector = ".el-form-item .el-form-item__content>.el-input>.el-input__inner"
    await page.$$eval(inputSelector, nodes => nodes.map(el => el.value="")) //清空值
    // console.log(inputValues)
    const inputs = await page.$$(inputSelector)
    await inputs[0].focus()
    await customKeyboard(page,"张老四")
    await inputs[1].focus()
    await customKeyboard(page, "123456789012345678")
    
    // await page.waitForSelector('.el-col.el-col-12')


    // 上传图片
    const uploadFile = await page.$('.el-upload__input')
    await uploadFile.uploadFile('../uploadImage/1.jpg','../uploadImage/2.jpg','../uploadImage/3.jpg')

    const uploadbtn= await page.$$('.el-button')
    // 点击上传按钮
    await uploadbtn[0].click()
    // 等待图片显示
    await page.waitForSelector('.el-col.el-col-12')

    // 点击提交案件按钮
    // await uploadbtn[1].click()

    // 截图
    const screenshot = path.join(__dirname,"../documents")
    await page.screenshot({
        path: screenshot + '/capture.png',  //图片保存路径
        type: 'png',
        fullPage: true, //边滚动边截图
        // clip: {x: 0, y: 0, width: 1920, height: 800}
    });

    // page.close();
    // await browser.close();
})();