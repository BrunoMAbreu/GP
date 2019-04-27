const LocalStrategy = require('passport-local').Strategy;
const mongoDBConfig = require("./db/mongoConfig.js").mongoDBConfig;
const bcrypt = require('bcrypt-nodejs');
const connection = mongoDBConfig.connection;


module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        const sessionUser = { _id: user._id, userid: user.user_id ,username: user.username, email: user.email, phone: user.phone, profile: user.profile };
        done(null, sessionUser);
        //done(null, user._id); //versão anterior
    });
    // used to deserialize the user
    passport.deserializeUser(function (sessionUser, done) {
        const User = mongoDBConfig.collections[0].model;
        User.findById(sessionUser._id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(
        'local-register',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
            function (req, email, password, done) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                const User = mongoDBConfig.collections[0].model;
                User.getUserByEmail(email, function (err, result) {
                    if (err) {
                        return done(err);
                    }
                    if (result === -1) {
                        return done(null, false, req.flash('registerMessage', 'Colecção não existe.'));
                    }
                    if (result === null) {
                        //(name, email, password, phone, profile, birthDate, callback)
                        // if the user doesn't already exist in the db
                        User.insertUser(req.body.userName, email, password, req.body.phoneNumber, req.body.profile, req.body.birthDate, function (result) {
                            
                            console.log("passport.use('local-register' >> req.session: ", req.session);
                            
                            return done(null, result, req.flash('loginMessage', 'Bem vindo!.'));
                        })

                    }



                });
            })
    );

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

            //console.log("111 passport.use('local-login' >> req.session: ", req.session);

            const User = mongoDBConfig.collections[0].model;
            User.getUserByEmail(email, function (err, result) {
                if (err) {
                    return done(err);
                }
                if (result === null || result === -1) {
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

                //console.log("222 passport.use('local-login' >> req.session: ", req.session);
                return done(null, result, req.flash('loginMessage', 'Bem vindo!.'));
            });
        })
    );
};
