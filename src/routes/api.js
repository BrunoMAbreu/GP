const express = require('express');
const router = express.Router();
const mongoConfig = require("../model/db/mongoConfig").mongoDBConfig;


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
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        successFlash: true,
        //successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }),
        // Não executa o callback:
        function (req, res) {
            console.log(req.user); // http://www.passportjs.org/docs/authenticate/
            console.log("hello");
            if (req.body.remember) {
                req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
                req.session.cookie.expires = false;
            }
            res.redirect('/');
        });
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