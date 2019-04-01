'use strict';

let express = require("express");
let bodyParser = require("body-parser");
let routes = require('./src/routes/api.js');

let app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));


app.use('/api', routes);

let server = app.listen(8081, function () {
    const host = server.address().address === "::" 
        ? "localhost" 
        : server.address().address;
    const port = server.address().port;
    
    // apagar antes de build
    console.log("Example app listening at http://%s:%s", host, port);
});



