const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
require('dotenv').config();

router.use(express.urlencoded({extended: false}));
router.use(express.static(__dirname + '/public'));

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
    
    await browser.close();    
}

router.get('/', (req, res) => {
    res.send('spidering');
    spi(); 
})

module.exports = router;