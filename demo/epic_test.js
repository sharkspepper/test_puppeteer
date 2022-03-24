const puppeteer = require('puppeteer');
const UserAgent = require("user-agents");
const path = require('path')
const userDataDir = path.join(__dirname,"./userData")
const targetUrl = "https://www.epicgames.com/site/login";
const account = "1604535034@qq.com";
const password = "q1w2e3r4...";

const userAgent = new UserAgent({
    deviceCategory: "desktop",
    platform: "Linux x86_64",
});
(async () => {
    const browser = await puppeteer.launch({
        headless: false,   //有浏览器界面启动
        slowMo: 100,       //放慢浏览器执行速度，方便测试观察
        defaultViewport:{
            width: 1280,
            height: 960
        },
        timeout:30 * 1000,
        args:[
            `--user-agent=${userAgent}`,
        ],
        userDataDir: userDataDir,//浏览器配置数据
    })

    // 自定义键盘输入
    Object.prototype.customKeyboard = async function(str){
        const upStrs = ['~','!','@','#','$','%','^','&','*','(',')','_','+','{','}','|',':','"','<','>','?','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
        const downStrs = ['`','1','2','3','4','5','6','7','8','9','0','-','=','[',']','\\',';','\'',',','.','/','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
        for(let i=0;i<str.length;i++){
            let rm = Math.floor(Math.random()*20)
            if(upStrs.includes(str[i])){
                await page.keyboard.down('Shift');
                await page.keyboard.press(str[i], {delay: 10 + rm})
                await page.keyboard.up('Shift');
            }else if(downStrs.includes(str[i])){
                await page.keyboard.press(str[i], {delay: 10 + rm})
            }else{
                await page.keyboard.type(str[i], {delay: 10 + rm})
            }
        }
    }

    const page = await browser.newPage();
    await page.goto(targetUrl,{
        timeout: 30 * 1000,
        waitUntil: [
            'load',              //等待 “load” 事件触发
            'domcontentloaded',  //等待 “domcontentloaded” 事件触发
            'networkidle0',      //在 500ms 内没有任何网络连接
            'networkidle2'       //在 500ms 内网络连接个数不超过 2 个
        ]
     });

    // 以epic登录
    const loginEpicElement = await page.$('#login-with-epic');
    await Promise.all([
        loginEpicElement.click(),
        page.waitForNavigation()
    ]);

    //输入账号
    await page.waitForSelector('#email')
    const accountElement = await page.$('#email');
    await accountElement.focus(); 
    await page.customKeyboard(account)

    //输入密码
    await page.waitForSelector('#password')
    const passwordElement = await page.$('#password');
    await passwordElement.focus(); 
    await page.customKeyboard(password)

    //点击确定按钮进行登录
    const okButtonElement = await page.$('#sign-in');
    //等待页面跳转完成，一般点击某个按钮需要跳转时，都需要等待 page.waitForNavigation() 执行完毕才表示跳转成功
    await Promise.all([
        okButtonElement.click(),
        page.waitForNavigation({
            timeout: 30 * 1000,
            waitUntil: [
                'load',              //等待 “load” 事件触发
                'domcontentloaded',  //等待 “domcontentloaded” 事件触发
                'networkidle0',      //在 500ms 内没有任何网络连接
                'networkidle2'       //在 500ms 内网络连接个数不超过 2 个
            ]
         })  
    ]);


    // 截图
    await page.screenshot({
        path: './screenshot/capture.png',  //图片保存路径
        type: 'png',
        fullPage: true, //边滚动边截图
        // clip: {x: 0, y: 0, width: 1920, height: 800}
    });

    page.close();
    await browser.close();
})();