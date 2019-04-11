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


exports.app = app;


/*
fs.readFile(filePath, (errRead, data) => {
    if (errRead) throw errRead;

    mongoDBConfig = JSON.parse(data); */

    // Initialize Mongo connection once   
    /*
    MongoClient.connect(mongoDBConfig.url, { useNewUrlParser: true, autoReconnect: true }, (errConnect, database) => {
        if (errConnect) throw errConnect;

        dbClient = client;
*/
        //mongoDBConfig.db = database;

        //console.log(mongoDBConfig.db);
        //const mongoDBConfigString = JSON.stringify(mongoDBConfig);

        //console.log(mongoDBConfigString);
/*
        fs.writeFile(filePath, mongoDBConfig, (errWrite) => {
            if (errWrite) throw errWrite;
        })*/
        /*
    })
    
}); 


//const mongoDBConfig = require(filePath);
//console.log(mongoDBConfig);



//exports.db = db;



// Reuse database object in request handlers
/*
app.get("/", function (req, res) {
    db.collection("replicaset_mongo_client_collection").find({}, function (err, docs) {
        docs.each(function (err, doc) {
            if (doc) {
                console.log(doc);
            }
            else {
                res.end();
            }
        });
    });
});
*/