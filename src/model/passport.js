'use strict';

// config/passport.js

// load all the things we need
const LocalStrategy = require('passport-local').Strategy;
const mongoDBConfig = require("./db/mongoConfig.js").mongoDBConfig;
// load up the user model
//var mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
//const dbconfig = require('./database');
const connection = mongoDBConfig.connection;
//const connection = mysql.createConnection(dbconfig.connection);

//connection.query('USE ' + dbconfig.database);
// expose this function to our app using module.exports
module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user._id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        
        // APAGAR
        console.log("passport.deserializeUser: " + id);


        const User = mongoDBConfig.collections[0].model;
        //const UserCollectionIndex = User.getUserCollectionIndex();
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });


    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        }, function (req, email, password, done) { // callback with email and password from our form
            const User = mongoDBConfig.collections[0].model;
            User.getUserByEmail(email, function (err, result) {
                if (err) {
                    return done(err);
                }
                if (result === -1) {
                    return done(null, false, req.flash('loginMessage', 'Utilizador não registado.')); // req.flash is the way to set flashdata using connect-flash
                }
                // if the user is found but the password is wrong
                if (!User.validatePassword(password, result.password)) {
                    return done(null, false, req.flash('loginMessage', 'Password inválida.')); // create the loginMessage and save it to session as flashdata
                }
                // all is well, return successful user
                
                /* Testes
                const newUser = {
                    _id: "5cb9f678c254ae4e701d8d88",
                    name: "c"
                }
                //User.deleteUser("5cb9e6c623034322d0afe004");
                User.updateUser(newUser);*/


                return done(null, result, req.flash('loginMessage', 'Bem vindo!.'));
            });
        })
    );
};
