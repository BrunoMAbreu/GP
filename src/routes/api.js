'use strict';

const express = require('express');
const router = express.Router();
const mongoConfig = require("../model/db/mongoConfig").mongoDBConfig;
const path = require("path");


//const auth = require("../controller/authController.js");
/*
// restrict index for logged in user only
router.get('/', auth.home);

// route to register page
router.get('/register', auth.register);

// route for register action
router.post('/register', auth.doRegister);

// route to login page
router.get('/login', auth.login);

// route for login action
router.post('/login', auth.doLogin);

// route for logout action
router.get('/logout', auth.logout);
*/
module.exports = function (app, passport) {

    //kubernetes index
    app.get('/healthz', function (req, res) {
        res.send('ok');
    });

    /////////// Handlebar
    app.get('/', function (req, res) {
        res.render('home', { description: "Home page", isUserLogged: isUserLogged(req, res) });
    });
    app.get('/login', function (req, res) {
        res.render('login', { description: "Login", isUserLogged: isUserLogged(req, res) });
    });
    app.get('/register', function (req, res) {
        res.render('register', { description: "Register", isUserLogged: isUserLogged(req, res) });
    });

    // Login
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        successFlash: true,
        //successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }),
        //  Não executa o callback:
        function (req, res) {

            console.log("/login callback res: ", res);

            //console.log(req.user); // http://www.passportjs.org/docs/authenticate/
            console.log("hello");
            /*if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');*/
        }
    );
    // User Register
    app.post('/register', passport.authenticate('local-register', {
        successRedirect: '/',
        successFlash: true,
        //successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect: '/register', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }),
        //  Não executa o callback:
        function (req, res) {
            //console.log(req.user); // http://www.passportjs.org/docs/authenticate/
            console.log("hello");
            /*if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');*/
        }
    );


    // Access the session as req.session
    /*
    app.get('/', function(req, res, next) {
        if (req.session.views) {
            req.session.views++
            res.setHeader('Content-Type', 'text/html')
            res.write('<p>views: ' + req.session.views + '</p>')
            res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
            res.end()
        } else {
            req.session.views = 1
            res.end('welcome to the session demo. refresh!')
        }
    })*/




    // Must be last route
    app.get('*', function (req, res) {
        res.status(404).render('404', {
            layout: false,
            description: "404 - Page not found"
        });
    });


    function isUserLogged(req, res) {

        //console.log(" req.user: ",  req.user)

        if(req.user){
            //console.log("app.locals.passport.user.name: ", app.locals.passport.user.name)
            return {
                isLogged: true,
                username: req.user.username,
                profile: req.user.profile
            }
        }

        //console.log("app.locals.passport.email: ", app.locals.passport.user)
        return { isLogged: false}
    }
}






/*
router.post('/processLogin', function (req, res) {

    const user = new mongoConfig.collections[0].model();
    user.authenticateUser(req.body.email, req.body.password, function (err, user) {
        if (err) {
            res.send('false');
            res.end();
        } else {
            //req.session.user_id = 0;
            const urlPath = "http://" + req.headers.host + "/index.html";
            //console.log("urlPath: " + urlPath);

            //console.log(user._id);

            req.session.user_id = user._id;
            //res.redirect('/protected_page');


            // res.redirect(urlPath); // ALTERAR e VERIFICAR cookies

            /////
            res.redirect("test");
            //res.end();
        }


    }); */
/*
mongoConfig.collections[0].model.authenticateUser(req.body.email, req.body.password, function(){
    console.log("GREAT SUCCESS");
});*/
//console.log(userModel);
/*userModel.authenticateUser(req.body.email, req.body.password, function(){
    console.log("GREAT SUCCESS");
});*/
//console.log(mongoConfig.collections[0].model);

//console.log(req.body.email);
//console.log(req.body.password);


//console.log(app.locals.teste);


//console.log(dbConnection);

// alterar validateUser...
/* if (auth.validateUser(req.body.email, req.body.password)) {
     res.redirect(__dirname + './../../public/index.html');
     
 } */

//});

// GET /teste
/*
router.get('/test', function (req, res, next) {
    console.log("test");
    res.redirect(__dirname + "./../../public/teste.html");
});
*/

// GET /logout
/*
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/');
            }
        });
    }
});*/
/*
router.get('*', function (req, res) {
    res.send('Erro, URL inválido.');
});

module.exports = router;
*/

// route middleware to make sure
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

