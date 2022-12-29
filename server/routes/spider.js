const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');


const router = express.Router();
require('dotenv').config();

router.use(express.urlencoded({extended: false}));
router.use(express.static(__dirname + '/public'));


const get_course_type = () => {
    const t = JSON.parse(fs.readFileSync('./course_type.json', 'utf-8'));
    return t['type'];
}

const spi = async () => {


    const subject = get_course_type();

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    const downloadPath = path.resolve('./raw');
    await client.send('Page.setDownloadBehavior', {
        behavior: 'allow',
        downloadPath: downloadPath
    });


    await page.goto('https://cusis.cuhk.edu.hk/psc/CSPRD_9/EMPLOYEE/HRMS/c/CU_SCR_MENU.CU_TMSR801.GBL?Page=CU_TMSR801_ENTRY&Action=U');
    
    //login to cusis
    await page.type('#userNameInput', process.env.CUSIS_AC);
    await page.type('#passwordInput', process.env.CUSIS_PW);
    await page.keyboard.press('Enter');  

    await page.waitForTimeout(3000);

    await page.select('select[name="CLASS_SRCH_WRK2_STRM$35$"]', '2270');


    for(var i=0;i<subject.length;i++) {

        await page.waitForTimeout(1000);

        const box = await page.$('#CU_RC_TMSR801_SUBJECT');
        await box.click({clickCount: 3});
        await box.type(subject[i]);


        await page.keyboard.press('Enter');

                
        //press the button to download excel
        const downLoad = await page.waitForXPath('//a[@class="PSHYPERLINK PTDOWNLOAD1"]');
        
        await Promise.all([
            downLoad.evaluate(el => el.click()),
        ]);

        await page.waitForTimeout(3000);
        
    //press the 'New Search' Button 
        const newSearch = await page.waitForXPath('//a[@name="CU_RC_TMSR801_SSR_PB_NEW_SEARCH"]');

        await Promise.all([
            newSearch.evaluate(el => el.click()),
        ]);
            
       fs.rename('raw/ps.xls', 'raw/' + subject[i] + '.xls', (err) => {
            if(err) throw err;
       }); 

    }
    

    await page.close();    
}

router.get('/', (req, res) => {
    spi(); 
    res.redirect(200,'..');
})

module.exports = router;