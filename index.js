var express = require('express');
var cors = require('cors');

var app = express();

app.use(cors());

app.all('*', (req, res) => {
    res.status(412);
    res.json({status: 412, message: 'Precondition failed'});
});

module.exports = app;
