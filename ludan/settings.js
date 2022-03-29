const UserAgent = require("user-agents");
const path = require('path')
const userDataDir = path.join(__dirname,"./userData")

const userAgent = new UserAgent({
    deviceCategory: "desktop",
    platform: "Linux x86_64",
});
module.exports = {
    launch:{
        headless: false,   //有浏览器界面启动
        slowMo: 100,       //放慢浏览器执行速度，方便测试观察
        // defaultViewport:{
        //     width: 1280,
        //     height: 960
        // },
        defaultViewport:null,//全屏
        timeout:30 * 1000,
        // args:[
        //     `--user-agent=${userAgent}`,
        // ],
        userDataDir: userDataDir,//浏览器配置数据
    },
    targetUrl:"http://192.168.1.18:8080",
    user:{
        account:"王瑞",
        password:"hc654321"
    }
}