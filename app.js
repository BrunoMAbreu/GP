'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const routes = require('./src/routes/api.js');
let app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api', routes);

//kubernetes
//index
app.get('/healthz', function (req, res) {
    res.send('ok');
});

let server = app.listen(8080, function () {
    const host = server.address().address === "::"
        ? "localhost"
        : server.address().address;
    const port = server.address().port;

    console.log("App listening at http://%s:%s", host, port);
})

