'use strict';
const connectMongoDB = require("./src/model/db/mongoConfig.js").connectMongoDB;
const mongoDBConfig = require("./src/model/db/mongoConfig.js").mongoDBConfig;
const passport = require("passport");
connectMongoDB(() => {
    const User = mongoDBConfig.collections[0].model;
    passport.use(new LocalStrategy(User.authenticate()));

/*
    passport.use(new LocalStrategy(
        function (email, password, done) {
            User.findOne({ email: email }, function (err, user) {
                if (err) { return done(err); }
                if (!user) {
                    return done(null, false, { message: 'Incorrect email.' });
                }
                if (!user.validPassword(password)) {
                    return done(null, false, { message: 'Incorrect password.' });
                }
                return done(null, user);
            });
        }
    )); */
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
});
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/routes/api.js");
const session = require("express-session");
var cookieParser = require('cookie-parser');
const path = require("path");
//const MongoStore = require("connect-mongo")(session);
const LocalStrategy = require('passport-local').Strategy;

//const User = require('../models/users');
let app = express();



app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(session({
    secret: 'mybrainhurts',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
/*
connectMongoDB.then(() => {
    const User = connectMongoDB.collections[0].model;
    passport.use(new LocalStrategy(User.authenticate()));
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
})
*/


/*passport.use(new LocalStrategy({
    usernameField: 'email'
},
    function (username, password, done) {
        const usersCollectionIndex = 0;

        connectMongoDB.collection[usersCollectionIndex].findOne({ email: username }, function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            
            
            if (!user.authenticateUser(password)) { return done(null, false); }
            return done(null, user);
        });
    }
));*/




//app.set('trust proxy', 1) // trust first proxy
/*
app.use(session({
    secret: 'mybrainhurts',
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: true
    }
}));
*/
// required for passport
// secret for session
/*
app.use(session({
    secret: 'sometextgohere',
    saveUninitialized: true,
    resave: true,
    //store session on MongoDB using express-session + connect mongo
    store: new MongoStore({
        url: config.url,
        collection: 'sessions'
    })
}));*/














////////////////////////////////
app.use(express.static(path.join(__dirname, "public")));
//app.use(express.static('public'));



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

