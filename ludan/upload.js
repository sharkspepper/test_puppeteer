const puppeteer = require('puppeteer');
const settings = require('./settings.js');
const { customKeyboard, addMenu } = require("../utils/utils");

(async () => {
    const browser = await puppeteer.launch(settings.launch)
    // console.log(browser.wsEndpoint())
    const page = await browser.newPage()

    // 上传任务界面
    await page.goto(`${settings.targetUrl}/#/upload`);
    // 菜单
    await addMenu(page)
    await page.on('load',async ()=>{
        // 防止页面刷新,菜单消失
        await addMenu(page)
    })
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
    await customKeyboard(page, "张老四")
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