const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const passportLocalMongoose = require('passport-local-mongoose');
<<<<<<< HEAD
=======
const autoIncrement = require('mongoose-auto-increment');
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721

const usersCollectionName = "users";

// Object to be exported
let mongoDBConfig = {
    name: "quintaDoMiao",
    url: process.env.MONGO_URL || "mongodb://localhost:27017/",
    connection: null,
    collections: [{
        name: usersCollectionName,
        schema: null,
        model: null,
        saltRounds: 12
    }]
}
/*
let mongoDBFunctions = {
    getUserCollectionIndex: getUserCollectionIndex
}*/

/**
 * Connects to mongoDB; stores the connection in mongoDBConfig.connection
 */
let connectMongoDB = function (cb) {
    const mongoDB = mongoDBConfig.url + mongoDBConfig.name;
    Mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, autoIndex: true });
    mongoDBConfig.connection = Mongoose.connection;
    mongoDBConfig.connection.on('error', console.error.bind(console, 'Connection error:'));
    mongoDBConfig.connection.once('open', function () {
        console.log("Connection to mongodb established");
<<<<<<< HEAD
=======
        createUserCollection();

>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721


        // Isto APAGA a colecção "user"; Só para testes!!!!!
        /*
        Mongoose.connection.collections['users'].drop(function (err) {
            console.log('collection dropped');
        });*/

<<<<<<< HEAD
        // PAra testar; APAGAR -------------------------------
        insertUser("Anabela Carrapateira", "a@a", "a", "1234654651", "Administrador", new Date(), function (res) {
            //console.log("__res: ", res)
        });

        cb();
    });
    createUserCollection();
=======
        // Para testar; APAGAR -------------------------------
        let testUserEmailAdmin = "a@a";
        let testUserProfileAdmin = "administrador";
        getUserByEmail(testUserEmailAdmin, function (err, result) {
            if (result) {
                updateUser({ _id: result._id, profile: testUserProfileAdmin }, function () {
                })
            } else {
                insertUser("Anabela Carrapateira", testUserEmailAdmin, "a", "1234654651", new Date(), function (res) {
                    getUserByEmail(testUserEmailAdmin, function (err, result) {
                        updateUser({ _id: result._id, profile: testUserProfileAdmin }, function () {
                        })
                    })
                });
            }
        })
        let testUserProfileFunc = "funcionário";
        insertUser("André Feitor", "a@f", "a", "1234654651", new Date(), function (res) {
            getUserByEmail("a@f", function (err, result) {
                updateUser({ _id: result._id, profile: testUserProfileFunc }, function () {
                })
            })
        });
        insertUser("Ana Fonseca", "b@f", "a", "1234654651", new Date(), function (res) {
            getUserByEmail("b@f", function (err, result) {
                updateUser({ _id: result._id, profile: testUserProfileFunc }, function () {
                })
            })
        });
        insertUser("Arlequim Farofa", "c@f", "a", "1234654651", new Date(), function (res) {
            getUserByEmail("c@f", function (err, result) {
                updateUser({ _id: result._id, profile: testUserProfileFunc }, function () {
                })
            })
        });
        // FIM: Para testar; APAGAR -------------------------------

        cb();
    });
    //createUserCollection();
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
};
require('../animal.model');

/**
 * Creates mongoDB collection "User"
 */
let createUserCollection = function () {
    const userSchema = new Schema(require("./schemas/user.js"), { collection: usersCollectionName });
<<<<<<< HEAD
=======
    autoIncrement.initialize(mongoDBConfig.connection);
    userSchema.plugin(autoIncrement.plugin, { model: 'userModel', field: 'user_id', startAt: 1 });

>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
    mongoDBConfig.collections.forEach(element => {
        if (element.name === usersCollectionName) {
            element.schema = userSchema;
            element.schema.plugin(passportLocalMongoose);
            element.schema.pre('save', function (next) {
                let user = this;
                if (!user.isModified('password')) {
                    return next();
                }
                bcrypt.genSalt(element.saltRounds, function (err, salt) {
                    bcrypt.hash(user.password, salt, null, function (err, hash) {
                        user.password = hash;
                        next();
                    });
                });
            });
            element.schema.statics.validatePassword = validatePassword;
            element.schema.statics.getUserCollectionIndex = getUserCollectionIndex;
            element.schema.statics.insertUser = insertUser;
            element.schema.statics.getUserByEmail = getUserByEmail;
            element.schema.statics.getUserById = getUserById;
<<<<<<< HEAD
=======
            element.schema.statics.getUserByProfile = getUserByProfile;
            element.schema.statics.getUser = getUser;
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
            element.schema.statics.updateUser = updateUser;
            element.schema.statics.deleteUser = deleteUser;
            element.model = Mongoose.model('userModel', userSchema);
        }
    })
}


/**
 * CREATE: Inserts new user into mongoDB
 * @param {*} name User name
 * @param {*} email User email
 * @param {*} password User password
 * @param {*} phone User phone number
 * @param {*} profile User profile (ie, worker or volunteer)
 * @param {*} birthDate User birth date
 */
<<<<<<< HEAD
let insertUser = function (name, email, password, phone, profile, birthDate, callback) {
=======
let insertUser = function (name, email, password, phone, birthDate, callback) {
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
    let index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        console.error("Collection " + usersCollectionName + " not in mongoDBConfig");
    }
    mongoDBConfig.collections[index].model.findOne({}).sort({ $natural: -1 }).exec((err, result) => {
        const newUser = {
<<<<<<< HEAD
            user_id: ((result === null) ? 1 : ++result.user_id),
=======
            //user_id: ((result === null) ? 1 : ++result.user_id),
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
            username: name,
            email: email,
            password: password,
            phone: phone,
<<<<<<< HEAD
            profile: profile.toLowerCase(),
=======
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
            birthDate: birthDate
        }
        // Insert
        mongoDBConfig.collections[0].model.create(newUser, function (err, res) {
            if (err) return console.error("error: " + err);
            callback(res);
        });
    });
}


/**
 * READ: returns user with given email address
 * @param {*} email user email
 * @param {*} callback
 * @returns user object
 */
let getUserByEmail = function (email, callback) {
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.findOne({ email: email }).exec((err, result) => {
        if (err) console.log(err);
<<<<<<< HEAD
=======

>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
        callback(err, result);
    });
}


/**
 * READ: returns user with given id
 * @param {*} id mongo document _id (ObjectID: hexadecimal as a string)
 * @returns user object
 */
let getUserById = function (id, callback) {
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.findById(id, function (err, result) {
        if (err) console.log(err);
        callback(err, result);
    });
}


/**
<<<<<<< HEAD
 * UPDATE:updates user data
 * @param {*} newUserData Object with proprieties to be changed (_id required and immutable). eg, {_id:"...", name:"Ana"}
 */
let updateUser = function (newUserData) {
=======
 * READ: returns users with given profile
 * @param {*} profile "administrador", "funcionário", "voluntário"
 * @param {*} callback
 * @returns users object array
 */
let getUserByProfile = function (profile, callback) {
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
<<<<<<< HEAD
    mongoDBConfig.collections[index].model.findOneAndUpdate({ _id: newUserData._id }, newUserData, function (err, data) {
        if (err) console.log(err);

        console.log("let updateUser: " + data) //  substituir Output por outro tipo de validação?
        //  eg, if(data.deletedCount ===1)...
=======
    mongoDBConfig.collections[index].model.find({ profile: profile.toLowerCase() }, function (err, result) {
        if (err) console.log(err);
        callback(err, result);
    });
}

/**
 * READ: returns users with given query parameters
 * @param {*} searchObject 
 * @param {*} callback
 * @returns users object array
 */
let getUser = function(searchObject, callback){
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.find(searchObject, function (err, result) {
        if (err) console.log(err);
        callback(err, result);
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
    });
}


<<<<<<< HEAD
=======
/**
 * UPDATE:updates user data
 * @param {*} newUserData Object with properties to be changed (_id required and immutable). eg, {_id:"...", username:"Ana"}
 */
let updateUser = function (newUserData, callback) {
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.findOneAndUpdate({ _id: newUserData._id }, newUserData, { new: true }, function (err, data) {
        if (err) console.log(err);
        callback(data);
    });
}
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721


/**
 * DELETE: deletes user with given id
 * @param {*} id mongo document _id (ObjectID: hexadecimal as a string)
 */
<<<<<<< HEAD
let deleteUser = function (id) {
=======
let deleteUser = function (id, callback) {
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
<<<<<<< HEAD
    mongoDBConfig.collections[index].model.findByIdAndDelete({ _id: id }, function (err, data) {
        if (err) console.log(err);
        console.log(data) //  substituir Output por outro tipo de validação?
        //  eg, if(data.deletedCount ===1)...
=======
    mongoDBConfig.collections[index].model.findOneAndRemove({ user_id: id }, function (err, data) {
        if (err) console.log(err);
        //console.log("data: ", data)
        //  eg, if(data.deletedCount ===1)...
        callback(data);
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
    });
}








/**
 * Returns index of the collection in mongoDBConfig.collections[] 
 * @param {*} collectionName 
 */
let getCollectionIndex = function (collectionName) {
    let index = -1;
    for (let i = 0; i < mongoDBConfig.collections.length; i++) {
        if (mongoDBConfig.collections[i].name === collectionName) {
            index = i;
            break;
        }
    }
    return index;
}


/**
 * Returns index of the collection in mongoDBConfig.collections[] 
 * @param {*} collectionName 
 */
let getUserCollectionIndex = function () {
    let index = -1;
    for (let i = 0; i < mongoDBConfig.collections.length; i++) {
        if (mongoDBConfig.collections[i].name === usersCollectionName) {
            index = i;
            break;
        }
    }
    return index;
}

/**
 * Compares and validates password
 * @param {*} password user input
 * @param {*} StoredHashedPassword password in database
 */
let validatePassword = function (password, StoredHashedPassword) {
    return (bcrypt.compareSync(password, StoredHashedPassword));
};



// Listens for the signal interruption (ctrl-c); Closes the MongoDB connection
process.on('SIGINT', () => {
    //mongoDBConfig.connection.close();
    Mongoose.disconnect();
    process.exit();
});




module.exports.connectMongoDB = connectMongoDB;
module.exports.mongoDBConfig = mongoDBConfig;