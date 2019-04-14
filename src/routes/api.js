const express = require('express');
const router = express.Router();
const mongoConfig = require("../model/db/mongoConfig").mongoDBConfig;

// !!!!!!
//const app = require("../../app.js").app;
//let app = express(); //////////////////////////
//let auth = require(__dirname + "./../model/auth")

// Temp - alterar para limitar import ao estritamente necessário 
//const users = require('../model/db/users');
//console.log(users.CollectionName); // teste

router.post('/processLogin', function (req, res) {

    const user = new mongoConfig.collections[0].model();
    user.authenticateUser(req.body.email, req.body.password, function(err, user){
        if(err){
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
        
        
    });
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

});

// GET /logout
router.get('/test', function (req, res, next) {
    console.log("test");
    res.redirect(__dirname + "./../../public/index.html");
});


// GET /logout
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
});

router.get('*', function (req, res) {
    res.send('Erro, URL inválido.');
});

module.exports = router;