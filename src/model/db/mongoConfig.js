/* eslint-disable no-console */
const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const passportLocalMongoose = require('passport-local-mongoose');
const autoIncrement = require('mongoose-auto-increment');

const usersCollectionName = "users";
const animalsCollectionName = "animals";
const adoptionsCollectionName = "adoptions";

// Object to be exported
let mongoDBConfig = {
    name: "quintaDoMiao",
    url: process.env.MONGO_URL || "mongodb://localhost:27017/",
    mongoose: null,
    connection: null,
    collections: [{
        name: usersCollectionName,
        schema: null,
        model: null,
        saltRounds: 12
    },
    {
        name: animalsCollectionName,
        schema: null,
        model: null
    },
    {
        name: adoptionsCollectionName,
        schema: null,
        model: null
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
    mongoDBConfig.mongoose = Mongoose;
    mongoDBConfig.connection = Mongoose.connection;
    mongoDBConfig.connection.on('error', console.error.bind(console, 'Connection error:'));
    mongoDBConfig.connection.once('open', function () {
        console.log("Connection to mongodb established");
        createUserCollection();
        createAnimalCollection();
        createAdoptionCollection();



        // Isto APAGA a colecção "user"; Só para testes!!!!!
        /*
        Mongoose.connection.collections['users'].drop(function (err) {
            console.log('collection dropped');
        });*/

        // Para testar; APAGAR -------------------------------
        let testUserEmailAdmin = "a@a";
        let testUserProfileAdmin = "administrador";
        getUserByEmail(testUserEmailAdmin, function (err, result) {
            if (result) {
                updateUser({ _id: result._id, profile: testUserProfileAdmin }, function (err, result) {
                })
            } else {
                insertUser("Anabela Carrapateira", testUserEmailAdmin, "a", "1234654651", new Date(), function (err, res) {
                    getUserByEmail(testUserEmailAdmin, function (err, result) {                       
                        updateUser({ _id: result._id, profile: testUserProfileAdmin }, function (err, result) {
                        })
                    })
                });
            }
        })
        let testUserProfileFunc = "funcionário";
        insertUser("André Feitor", "a@f", "a", "1234654651", new Date(), function (err, res) {
            getUserByEmail("a@f", function (err, result) {
                updateUser({ _id: result._id, profile: testUserProfileFunc }, function (err, result) {
                })
            })
        });
        insertUser("Ana Fonseca", "b@f", "a", "1234654651", new Date(), function (err, res) {
            getUserByEmail("b@f", function (err, result) {
                updateUser({ _id: result._id, profile: testUserProfileFunc }, function (err, result) {
                })
            })
        });
        insertUser("Arlequim Farofa", "c@f", "a", "1234654651", new Date(), function (err, res) {
            getUserByEmail("c@f", function (err, result) {
                updateUser({ _id: result._id, profile: testUserProfileFunc }, function (err, result) {
                })
            })
        });

        insertAdoption(19, "5cdda56c2b9fe8beac697d4a", function (res) {
            console.log("Farofa Adoption: ", res)
        });
        insertAdoption(8, "5cdd91a5dbf287c6f020baf8", function (res) {
            console.log("Carrapateira Adoption: ", res)
        });

        // FIM: Para testar; APAGAR -------------------------------

        cb();
    });
    //createUserCollection();
};
//require('./schemas/animal.model');

/**
 * Creates mongoDB collection "User"
 */
let createUserCollection = function () {
    const userSchema = new Schema(require("./schemas/user.js"), { collection: usersCollectionName });
    autoIncrement.initialize(mongoDBConfig.connection);
    userSchema.plugin(autoIncrement.plugin, { model: 'userModel', field: 'user_id', startAt: 1 });

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
            element.schema.statics.getUserByProfile = getUserByProfile;
            element.schema.statics.getUser = getUser;
            element.schema.statics.updateUser = updateUser;
            element.schema.statics.deleteUser = deleteUser;
            element.model = Mongoose.model('userModel', userSchema);
        }
    })
}


let createAnimalCollection = function () {
    const animalSchema = new Schema(require("./schemas/animal.model.js"), { collection: animalsCollectionName });
    autoIncrement.initialize(mongoDBConfig.connection);
    animalSchema.plugin(autoIncrement.plugin, { model: 'animalModel', field: 'animal_id', startAt: 1 });

    mongoDBConfig.collections.forEach(element => {
        if (element.name === animalsCollectionName) {
            element.schema = animalSchema;
            element.model = Mongoose.model('animalModel', animalSchema);
        }
    })
}


let createAdoptionCollection = function () {
    const adoptionSchema = new Schema(require("./schemas/adoptions.js"), { collection: adoptionsCollectionName });
    autoIncrement.initialize(mongoDBConfig.connection);
    adoptionSchema.plugin(autoIncrement.plugin, { model: 'adoptionModel', field: 'adoption_id', startAt: 1 });

    mongoDBConfig.collections.forEach(element => {
        if (element.name === adoptionsCollectionName) {
            element.schema = adoptionSchema;
            element.schema.plugin(passportLocalMongoose);

            //element.schema.statics.validatePassword = validatePassword;
            element.schema.statics.getAdoptionCollectionIndex = getAdoptionCollectionIndex;
            element.schema.statics.insertAdoption = insertAdoption;

            //element.schema.statics.getUserByEmail = getUserByEmail;
            //element.schema.statics.getUserById = getUserById;
            //element.schema.statics.getUserByProfile = getUserByProfile;
            element.schema.statics.getAdoption = getAdoption;
            element.schema.statics.updateAdoption = updateAdoption;
            element.schema.statics.deleteAdoption = deleteAdoption;

            element.model = Mongoose.model('adoptionModel', adoptionSchema);
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
let insertUser = function (name, email, password, phone, birthDate, callback) {
    let index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        console.error("Collection " + usersCollectionName + " not in mongoDBConfig");
    }
    //mongoDBConfig.collections[index].model.findOne({}).sort({ $natural: -1 }).exec((err, result) => {
    const newUser = {
        username: name,
        email: email,
        password: password,
        phone: phone,
        birthDate: birthDate
    }
    // Insert
    mongoDBConfig.collections[0].model.create(newUser, function (err, res) {
        if (err) return console.error("error: " + err);
        callback(err, res);
    });
    //});
}



/**
 * CREATE: Inserts new adoption into mongoDB
 * @param {*} user_id User id (integer)
 * @param {*} animal_id animal id (objectID, string)
 * @param {*} callback 
 */
let insertAdoption = function (user_id, animal_id, callback) {
    let index = getCollectionIndex(adoptionsCollectionName);
    if (index === -1) {
        console.error("Collection " + adoptionsCollectionName + " not in mongoDBConfig");
    }
    const newAdoption = {
        user_id: user_id,
        animal_id: animal_id
    }
    // Insert
    mongoDBConfig.collections[index].model.create(newAdoption, function (err, res) {
        if (err) return console.error("error: " + err);
        callback(res);
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
 * READ: returns users with given profile
 * @param {*} profile "administrador", "funcionário", "voluntário"
 * @param {*} callback
 * @returns users object array
 */
let getUserByProfile = function (profile, callback) {
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
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
let getUser = function (searchObject, callback) {
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.find(searchObject, function (err, result) {
        if (err) console.log(err);
        callback(err, result);
    });
}


/**
 * READ: returns adoptions with given query parameters
 * @param {*} searchObject 
 * @param {*} callback
 * @returns adoptions object array 
 */
let getAdoption = function (searchObject, callback) {
    const index = getCollectionIndex(adoptionsCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.find(searchObject, function (err, result) {
        if (err) console.log(err);
        callback(err, result);
    });
}


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
        callback(err, data);
    });
}


/**
 * UPDATE:updates adoption data
 * @param {*} newAdoptionData Object with properties to be changed (_id required and immutable). eg, {_id:"...", name:"Bobby"}
 */
let updateAdoption = function (newAdoptionData, callback) {
    const index = getCollectionIndex(adoptionsCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.findOneAndUpdate({ _id: newAdoptionData._id }, newAdoptionData, { new: true }, function (err, data) {
        if (err) console.log(err);
        callback(err, data);
    });
}



/**
 * DELETE: deletes user with given id
 * @param {*} id mongo document _id (ObjectID: hexadecimal as a string)
 */
let deleteUser = function (id, callback) {
    const index = getCollectionIndex(usersCollectionName);
    if (index === -1) {
        return -1;
    }
    mongoDBConfig.collections[index].model.findOneAndRemove({ user_id: id }, function (err, data) {
        if (err) console.log(err);
        //console.log("data: ", data)
        //  eg, if(data.deletedCount ===1)...
        callback(data);
    });
}


/**
 * DELETE: deletes adoption with given id
 * @param {*} id mongo document _id (ObjectID: hexadecimal as a string)
 */
let deleteAdoption = function (id, callback) {
    const index = getCollectionIndex(adoptionsCollectionName);
    if (index === -1) {
        return -1;
    }

    console.log(">deleteAdoption")

    mongoDBConfig.collections[index].model.findOneAndRemove({ adoption_id: id }, function (err, data) {
        if (err) console.log(err);
        callback(data);
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
 * Returns index of the collection in mongoDBConfig.collections[] 
 * @param {*} collectionName 
 */
let getAdoptionCollectionIndex = function () {
    let index = -1;
    for (let i = 0; i < mongoDBConfig.collections.length; i++) {
        if (mongoDBConfig.collections[i].name === adoptionsCollectionName) {
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