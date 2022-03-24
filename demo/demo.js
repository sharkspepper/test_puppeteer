const pupeteer = require('puppeteer');
const tesseract = require('tesseract.js');
const twilio = require('twilio');

const uid = "7418138";
const index1 = "1212881";
const index2 = "201";
const TWILIO_SID = "TWILIO_SID";
const TWILIO_AUTH_TOKEN = "TWILIO_AUTH_TOKEN"

const client = twilio(TWILIO_SID, TWILIO_AUTH_TOKEN);

const NUMBER_SEND = "+919555010431"
const SANDBOX_NUMBER = "+14155238886"

async function startWork()
{

    const worker = tesseract.createWorker({
        tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        tessedit_pageseg_mode: tesseract.PSM.SINGLE_LINE,
        logger: log => console.log(log),
    })

    const browser = await pupeteer.launch()
    const page = await browser.newPage()
    await page.goto("https://results.cisce.org/")

    await page.waitForXPath("//*[@id=\"UniqueId\"]")
    await page.waitForXPath("//*[@id=\"CenterCode\"]")
    await page.waitForXPath("//*[@id=\"SerialNumber\"]")
    await page.waitForXPath('//*[@id="imgCaptcha"]')

    await page.select("#courseDropDown", "ICSE");

    await page.type("#UniqueId", uid);
    await page.type("#CenterCode", index1);
    await page.type("#SerialNumber", index2);

    await page.waitForSelector("#imgCaptcha")

    const captchaDiv = await page.$x("//*[@id=\"imgCaptcha\"]")
    await captchaDiv[0].screenshot({path: 'captcha.png'})
    
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const {data: text} = await worker.recognize('captcha.png')

    console.log("Captcha Data:", text.text)
    if(text.text.length === 0 || text.text === "" || text.text === " " || text.text === null || text.text === undefined || text.text.trim() === "")
    {
        text.text = "YFCXZ"
    }
    text.text.replace('/\s/g', '')
    await page.type("#Captcha", text.text)

    await worker.terminate() 

    await page.click("#showResultButton", {delay: 9})

    const didSomethingWentWrong = await page.waitForSelector("#ResultViewTable > div:nth-child(1) > div:nth-child(1) > span:nth-child(1)", { visible: true, timeout: 1200 }).then(async () => {
        console.log("Captcha not correct!   Retrying...")
        await page.close()
        await browser.close()
        startWork()
        return
    }).catch(async () => {

    })

    const isVisible = await page.waitForSelector("#errorDiv > div:nth-child(1) > span:nth-child(2)", {visible: true, timeout: 1800}).then(async () => {
        console.log("Captcha not correct!   Retrying...")
        await page.close()
        await browser.close()
        startWork()
    }).catch(async () => {
        console.log("Captcha correct! Capturing Screenshot")
        await page.screenshot({path: 'test.png'})
        await page.waitForTimeout(1800)
        const resultView = await page.$x('//*[@id="ResultView"]')
        await resultView[0].screenshot({path: 'result.png'})
        
        await uploadImage()

        client.messages.create({
            from: 'whatsapp:' + SANDBOX_NUMBER,
            to: 'whatsapp:' + NUMBER_SEND,
            mediaUrl: 'https://viewresult.herokuapp.com'
        }).then(messsage => {
            console.log(messsage.sid, messsage.status)
        }).catch(error => console.log(error))

        await page.close()
        await browser.close()
        return

    })

}

async function uploadImage()
{
    const browser = await pupeteer.launch()
    const page = await browser.newPage()
    await page.goto("https://viewresult.herokuapp.com/post")
    const uploadFile = await page.$x("/html/body/form/input[1]")
    await uploadFile[0].uploadFile('result.png')
    const submitButton = await page.$x("/html/body/form/input[2]")
    submitButton[0].click()
    await page.waitForTimeout(600)
    await page.close()
    await browser.close()
    console.log("Uploaded Image Successfully!!!")
}

startWork()