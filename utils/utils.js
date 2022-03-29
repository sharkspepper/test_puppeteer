exports.customKeyboard =  async function ( page, str, {delay} = {delay: 20}, randomDelay = 20){
    const upStrs = ['~','!','@','#','$','%','^','&','*','(',')','_','+','{','}','|',':','"','<','>','?','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
    const downStrs = ['`','1','2','3','4','5','6','7','8','9','0','-','=','[',']','\\',';','\'',',','.','/','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    for(let i=0;i<str.length;i++){
        let rm = Math.floor(Math.random()*randomDelay)
        if(upStrs.includes(str[i])){
            await page.keyboard.down('Shift');
            await page.keyboard.press(str[i], {delay: delay + rm})
            await page.keyboard.up('Shift');
        }else if(downStrs.includes(str[i])){
            await page.keyboard.press(str[i], {delay: delay + rm})
        }else{
            await page.keyboard.type(str[i], {delay: delay + rm})
        }
    }
}

exports.addMenu = async function(page){
    await page.addScriptTag({path :"../utils/menu/js/jquery-3.2.1.min.js"})
    await page.addScriptTag({path :"../utils/menu/js/common.js"})
    await page.addScriptTag({path :"../utils/menu/js/menu.js"})
    await page.addStyleTag({path :"../utils/menu/css/main.css"})
    await page.addStyleTag({path :"../utils/menu/css/image.css"})
    await page.addStyleTag({path :"../utils/menu/css/menu.css"})
}