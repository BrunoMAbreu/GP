const MongoClient = require('mongodb').MongoClient;
//const ObjectId = require('mongodb').ObjectId;
//const mongoDBConfig = require("./src/model/db/mongoConfig.js");


let mongoDBConfig = {
    "name": "quintaDoMiao",
    "url": process.env.MONGO_URL || "mongodb://localhost:27017/",
    "connection": null,
    "collections": []
}


let connectMongoDB = function () {

    // "== null" is correct, not "=== null"
    if (mongoDBConfig.connection == null) {
        MongoClient.connect(mongoDBConfig.url, { useNewUrlParser: true, autoReconnect: true }).then(client => {
            let db = client.db(mongoDBConfig.name);
            mongoDBConfig.collections.push({
                "name": "Users",
                "collection": db.collection("Users")
            });
            mongoDBConfig.connection= client;

        


            //console.log(mongoDBConfig.connection);

            //console.log(mongoDBConfig.collections[0].name);
            //collection = db.collection('my-collection');

            //closeDBConnection();
        }).catch(error => console.error(error));


    }



}

connectMongoDB();




// Listen for the signal interruption (ctrl-c); Close the MongoDB connection
process.on('SIGINT', () => {
    mongoDBConfig.connection.close();
    process.exit();
});

module.exports.connectMongoDB = connectMongoDB;
module.exports.mongoDBConfig = mongoDBConfig;