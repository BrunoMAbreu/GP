<<<<<<< HEAD
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

    // UPDATE: update user data
    app.get('/workers/update/:id', function (req, res) {
        const User = mongoDBConfig.collections[0].model;
        User.getUser({ user_id: req.params.id }, function (err, result) {
            if (err) console.log(err);
            console.log("result: ", result)

            const user = result[0];
            const userData = {
                username: user.username,
                email: user.email,
                phone: user.phone,
                birthDate: user.birthDate
            }
            console.log("userData: ", userData)

            res.render('updateUser', { description: "Actualizar utilizador", isUserLogged: isUserLogged(req, res), op_submenu: setOpSubmenu(req, res), user: userData });
         });
        //firstLine: firstLine,
        //users: users,
        //searchColumnRowspan: searchColumnRowspan
        //});
        //res.render('');
        //});

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

    // Users' List
    app.get('/workers', function (req, res) {
        const User = mongoDBConfig.collections[0].model;
        let users = [];
        const route = "workers";
        const profile = "funcionário";

        const reqQuery = req.query;
        let query = { profile: profile };
        if (Object.getOwnPropertyNames(reqQuery).length !== 0) {
            for (let [key, value] of Object.entries(reqQuery)) {
                if (value !== "") {
                    query[key] = (key === "birthDate")
                        ? { '$gte': value }
                        : { '$regex': value, '$options': 'i' }
                }
            }
        }
        User.getUser(query, function (err, result) {
            result.forEach(element => {
                users.push({
                    user_id: element.user_id,
                    username: element.username,
                    email: element.email,
                    phone: element.phone,
                    birthDate: element.birthDate.toISOString().slice(0, 10),
                    route: route,
                    showActions: true
                });
            });
            const searchColumnRowspan = 12;
            while (users.length < searchColumnRowspan) {
                users.push({
                    user_id: "",
                    username: "",
                    email: "",
                    phone: "",
                    birthDate: "",
                    route: route,
                    showActions: false
                });
            }
            const firstLine = users.shift();
            res.render('workersList', {
                description: "Funcionários",
                isUserLogged: isUserLogged(req, res),
                op_submenu: setOpSubmenu(req, res),
                firstLine: firstLine,
                users: users,
                searchColumnRowspan: searchColumnRowspan
            });
        });
    });



    // DELETE: delete user
    app.delete('/workers/delete/:id', function (req, res) {
        const User = mongoDBConfig.collections[0].model;
        User.deleteUser(req.params.id, function (result) {
            res.redirect('/workers');
        })
    });



    /*
        app.post('/workers', function (req, res) {
            console.log("POST: " + 111111)
            console.log("req.params: ", req.params)
            console.log("req.body: ", req.body)
            console.log("POST: " + 222222)
        }); */


    // Administrator adds worker
    app.post('/addUser', function (req, res) {
        console.log(">>req: ", req)
        res.render('addUser', {
            description: "Funcionário - Adicionar",
            isUserLogged: isUserLogged(req, res),
            op_submenu: setOpSubmenu(req, res),
            profile: req.body.worker
        });

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

=======
'use strict';

const mongoDBConfig = require("../model/db/mongoConfig").mongoDBConfig;

module.exports = function (app, passport) {

    // Submenu of "Operações"
    const op_submenu = [
        { href: "/volunteers", name: "Voluntários", type: ["Administrador"] }, //, "Funcionário"
        { href: "/workers", name: "Funcionários", type: ["Administrador"] },
        { href: "/intervencoesMedicas_sub", name: "Intervenções Médicas", type: ["Administrador", "Funcionário"] },
        { href: "/agenda_sub", name: "Agenda", type: ["Administrador", "Funcionário", "Voluntário"] },
        { href: "/animais_sub", name: "Animais", type: ["Administrador", "Funcionário", "Voluntário"] },
        { href: "/adopcoes_sub", name: "Adopções", type: ["Administrador", "Funcionário"] },
        { href: "/apadrinhamentos_sub", name: "Apadrinhamentos", type: ["Administrador", "Funcionário"] },
        { href: "/entradaESaidaAnimais_sub", name: "Entrada e Saída de Animais", type: ["Administrador", "Funcionário"] }
    ]

    let selectedMenu = {
        home: false,
        animals: false,
        volunteering: false,
        operations: false,
        about: false
    }

    //kubernetes index
    app.get('/healthz', function (req, res) {
        res.send('ok');
    });

    /////////// Handlebar
    app.get('/', function (req, res) {
        res.render('home', { description: "Home page", isUserLogged: isUserLogged(req, res), op_submenu: setOpSubmenu(req, res), selectedMenu: setPropertyTrue(selectedMenu, "home") });
    });
    app.get('/login', function (req, res) {
        let flashMessage = { show: false, msg: req.flash('loginMessage')[0] }
        if (flashMessage.msg) {
            flashMessage.show = true;
        }
        res.render('login', { description: "Login", isUserLogged: isUserLogged(req, res), flashMessage: flashMessage, op_submenu: setOpSubmenu(req, res), selectedMenu: setPropertyTrue(selectedMenu, "home") });
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
        res.render('register', { description: "Registo", isUserLogged: isUserLogged(req, res), flashMessage: flashMessage, op_submenu: setOpSubmenu(req, res), selectedMenu: setPropertyTrue(selectedMenu, "home") });
    });

    // GET: View worker's data
    app.get('/workers/:id', isLoggedIn, function (req, res) {
        const User = mongoDBConfig.collections[0].model;
        User.getUser({ user_id: req.params.id }, function (err, result) {
            if (err) console.log(err);
            const user = result[0];
            const userData = {
                user_id: req.params.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                birthDate: user.birthDate.toISOString().slice(0, 10),
                profile: user.profile
            }
            let selected = {
                administrator: false,
                worker: false,
                volunteer: false
            }
            switch (userData.profile) {
                case "administrador":
                    selected.administrator = true;
                    break;
                case "funcionário":
                    selected.worker = true;
                    break;
                case "voluntário":
                    selected.volunteer = true;
                    break;
                default:
                    break;
            }
            if (req.session.passport.user.profile === "administrador") {
                res.render('updateWorker', {
                    description: "Actualizar funcionário",
                    isUserLogged: isUserLogged(req, res),
                    op_submenu: setOpSubmenu(req, res),
                    user: userData,
                    selected: selected,
                    selectedMenu: setPropertyTrue(selectedMenu, "operations")
                });
            } else {
                res.redirect('/');
            }

        });
    });

    // GET: View volunteer's data
    app.get('/volunteers/:id', isLoggedIn, function (req, res) {
        const User = mongoDBConfig.collections[0].model;
        User.getUser({ user_id: req.params.id }, function (err, result) {
            if (err) console.log(err);
            const user = result[0];
            const userData = {
                user_id: req.params.id,
                username: user.username,
                email: user.email,
                phone: user.phone,
                birthDate: user.birthDate.toISOString().slice(0, 10),
                profile: user.profile
            }
            let selected = {
                administrator: false,
                worker: false,
                volunteer: false
            }
            switch (userData.profile) {
                case "administrador":
                    selected.administrator = true;
                    break;
                case "funcionário":
                    selected.worker = true;
                    break;
                case "voluntário":
                    selected.volunteer = true;
                    break;
                default:
                    break;
            }
            if (req.session.passport.user.profile === "administrador") {
                res.render('updateVolunteer', {
                    description: "Actualizar voluntário",
                    isUserLogged: isUserLogged(req, res),
                    op_submenu: setOpSubmenu(req, res),
                    user: userData,
                    selected: selected,
                    selectedMenu: setPropertyTrue(selectedMenu, "operations")
                });
            } else {
                res.redirect('/');
            }
        });
    });

    // PUT: Update worker's data
    app.put('/workers/:id', isLoggedIn, function (req, res) {
        const User = mongoDBConfig.collections[0].model;
        const newUserData = {
            username: req.body.username,
            email: req.body.email,
            phone: req.body.phone,
            birthDate: req.body.birthDate,
            profile: req.body.profile
        };
        User.updateUser(newUserData, function (data) {
            if (data !== null) {
                res.status(400).send(true);
            } else {
                res.status(400).send(false);
            }
        });
    });


    // PUT: Update volunteer's data
    app.put('/volunteers/:id', isLoggedIn, function (req, res) {
        if (req.session.passport.user.profile === "administrador") {
            const User = mongoDBConfig.collections[0].model;
            const newUserData = {
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                birthDate: req.body.birthDate,
                profile: req.body.profile
            };
            User.updateUser(newUserData, function (data) {
                if (data !== null) {
                    res.status(400).send(true);
                } else {
                    res.status(400).send(false);
                }
            });
        } else {
            res.redirect('/');
        }
    });


    // Login
    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/',
        successFlash: true,
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

    // Workers' List
    app.get('/workers', isLoggedIn, function (req, res) {
        const User = mongoDBConfig.collections[0].model;
        let users = [];
        const route = "workers";
        const profile = "funcionário";

        const reqQuery = req.query;
        let query = { profile: profile };
        if (Object.getOwnPropertyNames(reqQuery).length !== 0) {
            for (let [key, value] of Object.entries(reqQuery)) {
                if (value !== "") {
                    query[key] = (key === "birthDate")
                        ? { '$gte': value }
                        : { '$regex': value, '$options': 'i' }
                }
            }
        }
        User.getUser(query, function (err, result) {
            result.forEach(element => {
                users.push({
                    user_id: element.user_id,
                    username: element.username,
                    email: element.email,
                    phone: element.phone,
                    birthDate: element.birthDate.toISOString().slice(0, 10),
                    route: route,
                    showActions: true
                });
            });
            const searchColumnRowspan = 12;
            while (users.length < searchColumnRowspan) {
                users.push({
                    user_id: "",
                    username: "",
                    email: "",
                    phone: "",
                    birthDate: "",
                    route: route,
                    showActions: false
                });
            }
            const firstLine = users.shift();

            if (req.session.passport.user.profile === "administrador") {
                res.render('workersList', {
                    description: "Funcionários",
                    isUserLogged: isUserLogged(req, res),
                    op_submenu: setOpSubmenu(req, res),
                    firstLine: firstLine,
                    users: users,
                    searchColumnRowspan: searchColumnRowspan,
                    route: route,
                    selectedMenu: setPropertyTrue(selectedMenu, "operations")
                });
            } else {
                res.redirect('/');
            }
        });
    });


    // Volunteers' List
    app.get('/volunteers', isLoggedIn, function (req, res) {
        const User = mongoDBConfig.collections[0].model;
        let users = [];
        const route = "volunteers";
        const profile = "voluntário";

        const reqQuery = req.query;
        let query = { profile: profile };
        if (Object.getOwnPropertyNames(reqQuery).length !== 0) {
            for (let [key, value] of Object.entries(reqQuery)) {
                if (value !== "") {
                    query[key] = (key === "birthDate")
                        ? { '$gte': value }
                        : { '$regex': value, '$options': 'i' }
                }
            }
        }
        User.getUser(query, function (err, result) {
            result.forEach(element => {
                users.push({
                    user_id: element.user_id,
                    username: element.username,
                    email: element.email,
                    phone: element.phone,
                    birthDate: element.birthDate.toISOString().slice(0, 10),
                    route: route,
                    showActions: true
                });
            });
            const searchColumnRowspan = 12;
            while (users.length < searchColumnRowspan) {
                users.push({
                    user_id: "",
                    username: "",
                    email: "",
                    phone: "",
                    birthDate: "",
                    route: route,
                    showActions: false
                });
            }
            const firstLine = users.shift();
            if (req.session.passport.user.profile === "administrador") {
                res.render('workersList', {
                    description: "Voluntários",
                    isUserLogged: isUserLogged(req, res),
                    op_submenu: setOpSubmenu(req, res),
                    firstLine: firstLine,
                    users: users,
                    searchColumnRowspan: searchColumnRowspan,
                    route: route,
                    selectedMenu: setPropertyTrue(selectedMenu, "operations")
                });
            } else {
                res.redirect('/');
            }
        });
    });



    // DELETE: delete worker
    app.delete('/workers/:id', isLoggedIn, function (req, res) {
        if (req.session.passport.user.profile === "administrador") {
            const User = mongoDBConfig.collections[0].model;
            User.deleteUser(req.params.id, function (result) {
                res.redirect('/workers');
            });
        } else {
            res.redirect('/');
        }
    });


    // DELETE: delete volunteer
    app.delete('/volunteers/:id', isLoggedIn, function (req, res) {
        if (req.session.passport.user.profile === "administrador") {
            const User = mongoDBConfig.collections[0].model;
            User.deleteUser(req.params.id, function (result) {
                res.redirect('/volunteers');
            });
        } else {
            res.redirect('/');
        }
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

/**
 * Switches properties of object true or false, if they have the same name of prop parameter
 * @param {*} object
 * @param {*} prop
 * @returns transformed object
 */
function setPropertyTrue(object, prop) {
    for (let property in object) {
        if (object.hasOwnProperty(property)) {
            object[property] = (property === prop);
        }
    }
    return object;
}


// route middleware to make sure... DESNECESSÁRIO?
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}



>>>>>>> 15a6b2dcd8310d99cdb157c4341d71125db00c84
