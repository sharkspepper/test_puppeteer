// const puppeteer = require('puppeteer');
// (async () => {
//     const targetUrl = "http://192.168.1.18:8080"
//     const browser = await puppeteer.launch({
//         browserWSEndpoint:`ws://${host}:${port}/devtools/browser/<id>`,   //一个 浏览器 websocket 端点链接。
//         ignoreHTTPSErrors:true, //是否在导航期间忽略 HTTPS 错误
//         slowMo: 100,            //放慢浏览器执行速度，方便测试观察
//         defaultViewport:{
//             width: 1280,
//             height: 960
//         },
//     })
// })()