const express = require('express');
const puppeteer = require('puppeteer');
const router = express.Router();
require('dotenv').config();

router.use(express.urlencoded({extended: false}));
router.use(express.static(__dirname + '/public'));

router.get('/', (req, res) => {
    res.send('spidering');

})

module.exports = router;