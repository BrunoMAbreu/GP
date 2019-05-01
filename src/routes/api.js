'use strict';

const mongoDBConfig = require("../model/db/mongoConfig").mongoDBConfig;

module.exports = function (app, passport) {

    // Submenu of "Operações"
    const op_submenu = [
        { href: "/voluntarios_sub", name: "Voluntários", type: ["Administrador", "Funcionário"] },
        { href: "/workers", name: "Funcionários", type: ["Administrador"] },
        { href: "/intervencoesMedicas_sub", name: "Intervenções Médicas", type: ["Administrador", "Funcionário"] },
        { href: "/agenda_sub", name: "Agenda", type: ["Administrador", "Funcionário", "Voluntário"] },
        { href: "/animais_sub", name: "Animais", type: ["Administrador", "Funcionário", "Voluntário"] },
        { href: "/adopcoes_sub", name: "Adopções", type: ["Administrador", "Funcionário"] },
        { href: "/apadrinhamentos_sub", name: "Apadrinhamentos", type: ["Administrador", "Funcionário"] },
        { href: "/entradaESaidaAnimais_sub", name: "Entrada e Saída de Animais", type: ["Administrador", "Funcionário"] }
    ]

    //kubernetes index
    app.get('/healthz', function (req, res) {
        res.send('ok');
    });

    /////////// Handlebar
    app.get('/', function (req, res) {
        res.render('home', { description: "Home page", isUserLogged: isUserLogged(req, res), op_submenu: setOpSubmenu(req, res) });
    });
    app.get('/login', function (req, res) {

        let flashMessage = { show: false, msg: req.flash('loginMessage')[0] }
        if (flashMessage.msg) {
            flashMessage.show = true;
        }
        res.render('login', { description: "Login", isUserLogged: isUserLogged(req, res), flashMessage: flashMessage, op_submenu: setOpSubmenu(req, res) });
    });
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
    app.get('/register', function (req, res) {
        let flashMessage = { show: false, msg: req.flash('registerMessage')[0] }
        if (flashMessage.msg) {
            flashMessage.show = true;
        }
        res.render('register', { description: "Registo", isUserLogged: isUserLogged(req, res), flashMessage: flashMessage, op_submenu: setOpSubmenu(req, res) });
    });

    // Login
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        successFlash: true,
        //successRedirect : '/profile', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }),
        //callback se tiver sucesso:
        function (req, res) {
            console.log("login teve sucesso") // alterar
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
        //callback se tiver sucesso:
        function (req, res) {
            console.log("register teve sucesso") // alterar
        }
    );

    app.get('/workers', function (req, res) {
        const User = mongoDBConfig.collections[0].model;
        let users = [];
        User.getUserByProfile("funcionário", function (err, result) {
            result.forEach(element => {
                const user = {
                    user_id: element.user_id,
                    username: element.username,
                    email: element.email,
                    phone: element.phone,
                    birthDate: element.birthDate.toISOString().slice(0, 10)
                }
                users.push(user);
            });
            const searchColumnRowspan = 5;
            while(users.length < searchColumnRowspan){
                users.push({
                    user_id: "",
                    username: "",
                    email: "",
                    phone: "",
                    birthDate: ""
                });
            }

            const firstLine = users.shift();
            res.render('workersList', {
                description: "Funcionários",
                isUserLogged: isUserLogged(req, res),
                op_submenu: setOpSubmenu(req, res),
                firstLine: firstLine,
                users: users
            });
        })
    });




    var animalAPI = require('./animalRoutes.js');
    app.use('/animal', animalAPI);

    // Must be last route
    app.get('*', function (req, res) {
        res.status(404).render('404', {
            layout: false,
            description: "404 - Page not found"
        });
    });

    function isUserLogged(req, res) {
        if (req.user) {
            const userType = req.user.profile[0].toUpperCase() + req.user.profile.slice(1);
            return {
                isLogged: true,
                username: req.user.username,
                profile: userType
            }
        }
        return { isLogged: false }
    }

    /**
     * Sets submenu items of "Operações"
     * @param {*} req HTTP request
     * @param {*} res HTTP response
     * @returns array of objects
     */
    function setOpSubmenu(req, res) {
        // If not logged in, return empty array
        if (req.session.passport === undefined || req.session.passport.user === undefined) {
            return [];
        }
        const userType = req.session.passport.user.profile;
        switch (userType) {
            case "administrador":
                return op_submenu;
            case "funcionário":
                return removeObjectFromArray(op_submenu, "Funcionário");
            case "voluntário":
                return removeObjectFromArray(op_submenu, "Voluntário");
            default:
                break;
        }
    }
}

/**
 * Iterates the array and removes object elements that do not have a given property
 * @param {*} originalArray 
 * @param {*} propertyToRemain 
 * @returns new array
 */
let removeObjectFromArray = function (originalArray, propertyToRemain) {
    //Deep Copy
    let newArray = JSON.parse(JSON.stringify(originalArray));

    for (let i = newArray.length - 1; i >= 0; i--) {
        if (newArray[i].type.indexOf(propertyToRemain) === -1) {
            newArray.splice(i, 1);
        }
    }
    return newArray;
}

// route middleware to make sure... DESNECESSÁRIO?
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

