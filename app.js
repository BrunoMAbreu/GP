const connectMongoDB = require("./src/model/db/mongoConfig.js").connectMongoDB;
const mongoDBConfig = require("./src/model/db/mongoConfig.js").mongoDBConfig;
const passport = require("passport");
connectMongoDB(() => {
    const User = mongoDBConfig.collections[0].model;
    require('./src/model/passport')(passport);
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
/*
    passport.use(
        'local-signup',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true // allows us to pass back the entire request to the callback
        },
            function (req, username, password, done) {
                // find a user whose email is the same as the forms email
                // we are checking to see if the user trying to login already exists
                connection.query("SELECT * FROM users WHERE username = ?", [username], function (err, rows) {
                    if (err)
                        return done(err);
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                    } else {
                        // if there is no user with that username
                        // create the user
                        var newUserMysql = {
                            username: username,
                            password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                        };

                        var insertQuery = "INSERT INTO users ( username, password ) values (?,?)";

                        connection.query(insertQuery, [newUserMysql.username, newUserMysql.password], function (err, rows) {
                            newUserMysql.id = rows.insertId;

                            return done(null, newUserMysql);
                        });
                    }
                });
            })
    );*/
    passport.serializeUser(User.serializeUser());
    passport.deserializeUser(User.deserializeUser());
});
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/routes/api.js");
const session = require("express-session");
var cookieParser = require('cookie-parser');
const path = require("path");
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');


let app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    secret: 'mybrainhurts',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());


//kubernetes index
app.get('/healthz', function (req, res) {
    res.send('ok');
});


// routes ======================================================================
require('./src/routes/api.js')(app, passport); // load our routes and pass in our app and fully configured passport

//app.use('/api', routes);




let server = app.listen(8080, function () {
    const host = server.address().address === "::"
        ? "localhost"
        : server.address().address;
    const port = server.address().port;

    console.log("App listening at http://%s:%s", host, port);
})

