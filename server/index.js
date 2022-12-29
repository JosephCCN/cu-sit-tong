const express = require('express');
const app = express();


app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.render('index.ejs');
});

//routing start
const search = require('./routes/search.js');
const spider = require('./routes/spider.js');

app.use('/search', search);
app.use('/spider', spider);
//routing end


app.listen(8081);