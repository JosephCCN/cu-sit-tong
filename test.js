const express = require('express');
const app = express();


app.set('view-engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
    res.render('test.ejs');
});

app.listen(1000);