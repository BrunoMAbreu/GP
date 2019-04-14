const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

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


/**
 * Connects to mongoDB; stores the connection in mongoDBConfig.connection
 */
let connectMongoDB = function () {
    const mongoDB = mongoDBConfig.url + mongoDBConfig.name;
    Mongoose.connect(mongoDB, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });
    mongoDBConfig.connection = Mongoose.connection;
    mongoDBConfig.connection.on('error', console.error.bind(console, 'Connection error:'));
    mongoDBConfig.connection.once('open', function () {
        console.log("Connection to mongodb established");

        // PAra testar; APAGAR -------------------------------
        insertUser("a", "a", "a", "1234654651", "worker", new Date());
        /*console.log("true: " + validateUser("mescla@gmail.com", "abcedef"));
        console.log("false: " + validateUser("mescla@gmail2.com", "abcedef"));
        console.log("false: " + validateUser("mescla@gmail.com", "abcedefg"));*/

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
            //element.schema.methods.validatePassword = validatePassword;

            // Authentication
            element.schema.methods.authenticateUser = function (email, password, callback) {
                element.model.findOne({ email: email }).exec(function (err, user) {
                    if (err) {
                        return callback(err);
                    } else if (!user) {
                        let err = new Error('User not found.');
                        err.status = 401;
                        return callback(err);
                    }
                    bcrypt.compare(password, user.password, function (err, result) {
                        if (result === true) {
                            return callback(null, user);
                        } else {
                            return callback();
                        }
                    })
                });
            }
            // Model creation
            element.model = Mongoose.model('userModel', userSchema);
        }
    })
}


/**
 * Inserts new user into mongoDB
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
            id: ++result.id,
            name: name,
            email: email,
            password: password,//encryptPassword(password),
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
 * Returns index of the collection in mongoDBConfig.collections[] 
 * @param {*} collectionName 
 */
let getCollectionIndex = function (collectionName) {
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
 * Validates password
 * @param {*} password Input string
 * @param {*} cb Callback function
 */
let validatePassword = function (password, cb) {
    bcrypt.compare(password, this.password, function (err, isMatch) {
        cb(err, isMatch);
    });
};


/**
 * Validates user
 * @param {*} email Login email
 * @param {*} password Login password
 * @returns false if email doesn't exist or password is wrong, true otherwise
 */
/*
let validateUser = function (email, password) {
    let index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        console.error("Collection " + usersCollectionName + " not in mongoDBConfig");
    }

    const isValid = mongoDBConfig.collections[index].model.findOne({ email: email }, { password: true, _id: false }, (err, obj) => {
        if (err) {
            console.error(err);
        }
        return (obj === undefined || obj === null) ? false : validatePassword(password, obj.password);
    });


    //console.log(user);
    return isValid;
}
*/









// Listens for the signal interruption (ctrl-c); Closes the MongoDB connection
process.on('SIGINT', () => {
    //mongoDBConfig.connection.close();
    Mongoose.disconnect();
    process.exit();
});


//connectMongoDB();////////////// INVOCAR em APP.js na raiz

module.exports.connectMongoDB = connectMongoDB;
module.exports.mongoDBConfig = mongoDBConfig;