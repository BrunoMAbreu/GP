'use strict';

const express = require("express");
const bodyParser = require("body-parser");
const routes = require('./src/routes/api.js');
const session = require('express-session');
let app = express();
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
//app.set('trust proxy', 1) // trust first proxy

app.use(session({
    secret: 'mybrainhurts',
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: true
    }
}))

app.use(express.static('public'));

const connectMongoDB = require("./src/model/db/mongoConfig.js").connectMongoDB;
connectMongoDB();

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

