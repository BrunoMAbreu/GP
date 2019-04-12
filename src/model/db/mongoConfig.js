//const MongoClient = require('mongodb').MongoClient;
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const fs = require("fs");
const userSchema = new Schema(require("./schemas/user.js"));



let mongoDBConfig = {
    name: "quintaDoMiao",
    url: process.env.MONGO_URL || "mongodb://localhost:27017/",
    connection: null,
    collections: [{
        name: "users"
    }]
}

let connectMongoDB = function () {
    const mongoDB = mongoDBConfig.url + mongoDBConfig.name;
    Mongoose.connect(mongoDB, { useNewUrlParser: true });
    mongoDBConfig.connection = Mongoose.connection;
    mongoDBConfig.connection.on('error', console.error.bind(console, 'Connection error:'));
    mongoDBConfig.connection.once('open', function () {
        console.log("Connection to mongodb established");

    });
    createUserCollection();
};


let createUserCollection = function () {
    const UserModel = Mongoose.model('User', userSchema);

    // PARA TESTAR -- APAGAR
    const user = new UserModel({
        id: 2, name: 'ana', email: "ana@gmail.com", password: "asdadasdas",
        phone: "123456789", profile: "voluntary", birthDate: new Date(), registerDate: new Date()
    });
    user.save().then(() => console.log('user saved'));

}

let insertUser = function () {

}


// "== null" is correct, not "=== null"

/*
    if (mongoDBConfig.connection == null) {
        MongoClient.connect(mongoDBConfig.url, { useNewUrlParser: true, autoReconnect: true }).then(client => {
            let db = client.db(mongoDBConfig.name);
            mongoDBConfig.collections.push({
                name: "Users",
                collection: db.collection("Users", {
                    validator: {
                        $jsonSchema: {
                            title: "User",
                            description: "User schema for mongoDB; subset of JSON",
                            bsonType: "object",
                            required: [
                                "id",
                                "name",
                                "email",
                                "password",
                                "phone",
                                "profile",
                                "birthdate.year",
                                "birthdate.month",
                                "birthdate.day",
                                "isLogged"
                            ],
                            uniqueItems: [
                                "id",
                                "email"
                            ],
                            properties: {
                                id: {
                                    bsonType: "int",
                                    minimum: 1
                                },
                                name: {
                                    bsonType: "string"
                                },
                                email: {
                                    bsonType: "string"
                                },
                                password: {
                                    bsonType: "string",
                                    minLength: 8
                                },
                                phone: {
                                    bsonType: "string"
                                },
                                profile: {
                                    bsonType: "string",
                                    enum: [
                                        "voluntary",
                                        "worker"
                                    ]
                                },
                                "birthdate.year": {
                                    bsontype: "int",
                                    minimum: 1919
                                },
                                "birthdate.month": {
                                    bsonType: "int",
                                    minimum: 1,
                                    maximum: 12
                                },
                                "birthdate.day": {
                                    "bsonType": "int",
                                    "minimum": 1,
                                    "maximum": 31
                                },
                                isLogged: {
                                    bsonType: "boolean"
                                }
                            }
                        },
                        validationAction: "warn"
                    }
                })
            });
            mongoDBConfig.connection = client;


            db.collection.validate(true);

            /// Só para testar login; APAGAR
            /*
                        let user = { id: 1, name: "toni" };
                        db.collection("Users").insertOne(user, function (err, res) {
                            if (err) throw err;
                            console.log("Document inserted");
            
                        });
                        */
//db.users.find({}); 


//console.log(mongoDBConfig.connection);

//console.log(mongoDBConfig.collections[0].collection);
//collection = db.collection('my-collection');

//closeDBConnection();

/*
}).catch(error => console.error(error));


}



}
*/
connectMongoDB();




// Listen for the signal interruption (ctrl-c); Close the MongoDB connection
process.on('SIGINT', () => {
    //mongoDBConfig.connection.close();
    Mongoose.disconnect();
    process.exit();
});

module.exports.connectMongoDB = connectMongoDB;
module.exports.mongoDBConfig = mongoDBConfig;