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
app.use(express.urlencoded({extended: false}));

function time_to_min(t) {
    let min = parseInt(t[0]) * 600 + parseInt(t[1]) * 60 + parseInt(t[3]) * 10 + parseInt(t[4]);
    return min;
}

app.get('/', (req, res) => {
    res.render('index.ejs');
});

app.get('/search', (req, res) => {
    let start_time = req.query.start_time;
    let end_time = req.query.end_time;
    let query = 'SELECT * from course where start_time>=' + String(start_time) + ' AND end_time <= ' + String(end_time) + ';';
    pg_client.query(query, (err, res) => {
        console.log(err ? err.stack: res.rows);
    });
    res.render('search_res.ejs', {start_time: start_time, end_time: end_time});
});

app.post('/search', (req, res) => {
    let st = time_to_min(String(req.body.start_time));
    let et = time_to_min(String(req.body.end_time));
    let url = 'search/?start_time=' + String(st) + '&end_time=' + String(et);
    res.redirect(url);
});

app.listen(8081);