const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
require('dotenv').config();

router.use(express.urlencoded({extended: false}));
router.use(express.static(__dirname + '/public'));


const t = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.setViewport({width: 1366, height: 768});
    await page.goto('http://localhost:1000');
    
    await page.waitForTimeout(3000);

    await page.select('select[name="cars"]', '2');

    await page.type('input[name="t"]', 'CSCI');
    await page.hover('select[name="cars"]');
    await page.mouse.down();

    //await page.waitForSelector('input[name="CU_RC_TMSR801_SUBJECT"]');
    //console.log('gkj');

}

const spi = async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://cusis.cuhk.edu.hk/psc/CSPRD_9/EMPLOYEE/HRMS/c/CU_SCR_MENU.CU_TMSR801.GBL?Page=CU_TMSR801_ENTRY&Action=U');
    
    //login to cusis
    await page.type('#userNameInput', process.env.CUSIS_AC);
    await page.type('#passwordInput', process.env.CUSIS_PW);
    await page.keyboard.press('Enter');  

    await page.waitForTimeout(3000);

    await page.select('select[name="CLASS_SRCH_WRK2_STRM$35$"]', '2270');

    await page.waitForTimeout(1000);

    await page.type('#CU_RC_TMSR801_SUBJECT', 'CSCI');

    await page.keyboard.press('Enter');

    await page.waitForSelector('a.PSHYPERLINK PTDOWNLOAD1');

    await page.$eval('a.PSHYPERLINK PTDOWNLOAD1', form => form.click());
    
}

router.get('/', (req, res) => {
    res.send('spidering');
    spi(); 
})

module.exports = router;