'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const passportLocalMongoose = require('passport-local-mongoose');

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
    Mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
    mongoDBConfig.connection = Mongoose.connection;
    mongoDBConfig.connection.on('error', console.error.bind(console, 'Connection error:'));
    mongoDBConfig.connection.once('open', function () {
        console.log("Connection to mongodb established");

        // PAra testar; APAGAR -------------------------------
        insertUser("a", "a", "a", "1234654651", "worker", new Date());

        cb();
    });
    createUserCollection();
};


/**
 * Creates mongoDB collection "User"
 */
let createUserCollection = function () {
    const userSchema = new Schema(require("./schemas/user.js"), { collection: usersCollectionName });
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
            element.schema.statics.getUserByEmail = getUserByEmail;
            element.schema.statics.getUserById = getUserById;
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
let insertUser = function (name, email, password, phone, profile, birthDate) {
    let index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        console.error("Collection " + usersCollectionName + " not in mongoDBConfig");
    }
    mongoDBConfig.collections[index].model.findOne({}).sort({ $natural: -1 }).exec((err, result) => {
        const newUser = {
            user_id: ((result === null) ? 1 : ++result.user_id),
            name: name,
            email: email,
            password: password, //encryptPassword(password),
            phone: phone,
            profile: profile,
            birthDate: birthDate
        }
        // Insert
        mongoDBConfig.collections[0].model.create(newUser, (err, res) => {
            if (err) return console.error("error: " + err);
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
 * UPDATE:updates user data
 * @param {*} newUserData Object with proprieties to be changed (_id required and immutable). eg, {_id:"...", name:"Ana"}
 */
let updateUser = function(newUserData){
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.findOneAndUpdate({_id: newUserData._id}, newUserData, function (err, data) {
        if (err) console.log(err);
        
        console.log("let updateUser: " + data) //  substituir Output por outro tipo de validação?
        //  eg, if(data.deletedCount ===1)...
    });
}




/**
 * DELETE: deletes user with given id
 * @param {*} id mongo document _id (ObjectID: hexadecimal as a string)
 */
let deleteUser = function (id) {
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.findByIdAndDelete({ _id: id }, function (err, data) {
        if (err) console.log(err);
        console.log(data) //  substituir Output por outro tipo de validação?
        //  eg, if(data.deletedCount ===1)...
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