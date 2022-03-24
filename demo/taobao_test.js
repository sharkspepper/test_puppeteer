(async() => {
    // 模拟登录
    async function login(page){
        console.log('正在登陆....')
        await page.goto('https://login.1688.com/member/signin.htm', {
            waitUntil: 'networkidle2',   // 等待网络空闲，在跳转加载页面
            waitUntil: 'domcontentloaded'
        })
        await page.waitForSelector("#loginchina > iframe")
        // 找到iframe
        const frame = (await page.frames())[1];
        // 跳到iframe页面去
        await page.goto(frame.url())
        // 输入账号密码
        await page.waitForSelector("#fm-login-id")
        await page.type('#fm-login-id', account, { delay: 10 })
        await page.waitFor(1000)
        await page.waitForSelector("#fm-login-password")
        await page.type('#fm-login-password', pwd, { delay: 10 })
        // 验证是否有滑块
        if (await page.$('#nocaptcha-password #nc_1_n1z')) {
            // 获取滑块位置
            let slidePosition = await getRect(page, "#nc_1_n1z")
            // 滑块可滑动区域
            let blockPosition = await getRect(page, "#nc_1__scale_text")
            // 鼠标初始位置
            let initialX = slidePosition.x + slidePosition.width / 2
            let initialY = slidePosition.y + slidePosition.height / 2
            let xlength  = blockPosition.width - slidePosition.width * 0.75
            // 开始移动滑块
            for(let i = 0; i < 4; i++){
                // await page.waitFor(1500)
                await move(page, initialX, initialY, xlength)
                await page.waitFor(1500)
                let errEl = await page.$("#nocaptcha-password .errloading")
                if(errEl){
                    // 出错重置
                    await page.click("#nocaptcha-password .errloading a")
                    await page.waitForSelector("#nc_1_n1z")
                }else{
                    break
                }
            }
        }
        await page.click('.fm-btn button')
        await page.waitForSelector(".company-name")
        console.log("登陆成功")
    }

    // 获取元素位置
    async function getRect(page, selector) {
        return await page.$eval(selector, el => {
            let res = el.getBoundingClientRect()
            return {
              x: res.x,
              y: res.y,
              width: res.width,
              height: res.height
            }
        })
    }
    // 将鼠标移到某处
    async function move(page, initialX, initialY, xlength = 0, ylength = 0) {
        const mouse = page.mouse
        await mouse.move(initialX, initialY)
        await mouse.down()
        await mouse.move(initialX + xlength, initialY + ylength, { steps: 20 })
        await page.waitFor(3000)
        await mouse.up()
    }
})()