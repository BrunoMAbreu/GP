const mongoClient = require('mongodb').MongoClient;

const dbName = "quintaDoMiao";
const url = 'mongodb://localhost:27017/' + dbName;


mongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
    if (err) throw err;
    let database = db.db(dbName);

    // Collections
    createUsersCollection(database);
    // inserir outras collections (schemas)

    db.close();
});


function createUsersCollection(database) {
    database.collection('users', {
        validator: {
            $jsonSchema: {
                bsonType: "object",
                required: ["_id", "userID", "name", "email", "password", "userType", "birthdate"],
                properties: {
                    _id: {
                        bsonType: "objectId",
                        description: "must be an objectId and is required"
                    },
                    userID: {
                        bsonType: "int",
                        description: "must be an int and is required"
                    },
                    name: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    email: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    password: {
                        bsonType: "string",
                        description: "must be a string and is required"
                    },
                    userType: {
                        enum: ["volunteer", "employee", "administrator"],
                        description: "can only be one of the enum values and is required"
                    },
                    birthdate: {
                        bsonType: "date",
                        description: "must be a date and is required"
                    }
                }
            }
        }
    })
}


insertUser();


function insertUser() {
    mongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        let database = db.db(dbName);

        console.log("estimatedDocumentCount: " + database.collection("users").estimatedDocumentCount({}));

        database.collection("users").deleteMany();
        let lastId = (database.collection("users").estimatedDocumentCount({}) !== 0)
            ? database.collection("users").find({}, { _id: 0, userId: 1, name: 0, email: 0, password: 0, userType: 0, birthdate: 0 }).sort({ userId: -1 }).limit(1)
            : 0;

        //console.log(lastId);
        /*
                let user = { _id: lastId++, name: "Ana", email: "ana@email.com" };
                database.collection("users").insertOne(user, function (err, res) {
                    if (err) throw err;
        
                    console.log("1 document inserted");
                    console.log(database.collection("users").find({}));
                    db.close();
                });
                */

        db.close();
    });
}


