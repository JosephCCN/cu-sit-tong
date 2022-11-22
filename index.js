const express = require('express');
const { Client } = require('pg');
require('dotenv').config();
const app = express();


const pg_client = new Client({
    user: process.env.PG_USER,
    host: 'localhost',
    database: process.env.PG_DB,
    password: process.env.PG_PW,
    port: process.env.PG_PORT,
});

pg_client.connect((err) => {
    if(err) throw err;
    console.log('connected');
});

app.set('view-engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.listen(8081);