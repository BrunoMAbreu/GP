const mongoDBConfig = require("../model/db/mongoConfig").mongoDBConfig;
const express = require('express');
var router = express.Router();
//var mongoose = require('mongoose');
let Animal;
setTimeout(function () {
    Animal = mongoDBConfig.collections[1].model;
}, 2000);
//mongoose.model('animals');

var Handlebars = require('handlebars');

const op_submenu = [
    { href: "/volunteers", name: "Voluntários", type: ["Administrador", "Funcionário"] }, //, "Funcionário"
    { href: "/workers", name: "Funcionários", type: ["Administrador"] },
    { href: "/users", name: "Utilizadores", type: ["Administrador"] },
    { href: "/animals", name: "Animais", type: ["Administrador", "Funcionário", "Voluntário"] },
    { href: "/adoptions", name: "Adopções", type: ["Administrador", "Funcionário"] },
    { href: "/movements", name: "Entrada e Saída de Animais", type: ["Administrador", "Funcionário"] }
]

let selectedMenu = {
    home: false,
    animals: false,
    volunteering: false,
    operations: false,
    about: false
}

Handlebars.registerHelper('ifBoolCond', function(param, options) {
    if(param === true) 
      return options.fn(this);

      return options.inverse(this);
  });
  Handlebars.registerHelper('ifGenderCond', function(param, options) {
    if(param === "Male") 
      return options.fn(this);

        return options.inverse(this);
  });
  Handlebars.registerHelper('ifNullCond', function(param, options) {
    if(param === "") 
      return options.fn(this);

    return options.inverse(this);
  });

  Handlebars.registerHelper('ifAdoptedCond', function(param, options) {
    if(param === "Adotado") 
      return options.fn(this);

    return options.inverse(this);
  });

  Handlebars.registerHelper('ifAvailableCond', function(param, options) {
    if(param === "Disponível") 
      return options.fn(this);

    return options.inverse(this);
  });

  Handlebars.registerHelper('ifAvailableForAdoptionCond', function(param, options) {
    if(param !== "Adotado") 
      return options.fn(this);

    return options.inverse(this);
  });

router.get('/add', (req, res) => {
    if (req.session.passport.user.profile === "administrador" ||
        req.session.passport.user.profile === "funcionário") {
        let flashMessage = { show: false, msg: req.flash('addAnimalMessage')[0] }
        let flashMessage1 = { show: false, msg: req.flash('addDateMessage')[0] }
            if (flashMessage.msg) {
                flashMessage.show = true;
            }
            if (flashMessage1.msg) {
                flashMessage1.show = true;
            }
        res.render("animal/addOrEdit", {
            viewTitle : "Adicionar Animal",
            isUserLogged: isUserLogged(req, res),
            op_submenu: setOpSubmenu(req, res),
            selectedMenu: setPropertyTrue(selectedMenu, "operations"),
            flashMessage: flashMessage,
            flashMessage1: flashMessage1,
            isUpdate: false
        });
    }
    else{
        res.redirect("/");
    }
});

router.get('/details/:id', (req, res) => {
    Animal.findById(req.params.id, (err, doc) => {
        if(!err){
            var monthFormat = "";
            var dayFormat = "";
            if((doc.birthday.getMonth() + 1) >= 10)
                monthFormat = (doc.birthday.getMonth() + 1);
            else
                monthFormat = "0" + (doc.birthday.getMonth() + 1);

            if((doc.birthday.getDate() + 1) >= 10)
                dayFormat = doc.birthday.getDate();
            else
                dayFormat = "0" + doc.birthday.getDate();

            var birthday = dayFormat + "-" + monthFormat + "-" + doc.birthday.getFullYear();
            var normalUser = false;
            if(!isUserLogged(req, res).isLogged || 
            req.session.passport.user.profile === "utilizador") normalUser = true;

            res.render("animal/details", {
                viewTitle: doc.nome,
                animal: doc,
                birthday: birthday,
                isUserLogged: isUserLogged(req, res),
                op_submenu: setOpSubmenu(req, res),
                selectedMenu: setPropertyTrue(selectedMenu, "operations"),
                normalUser: normalUser
            });
        }
    });
});

router.post('/add', (req, res) => {
    if(req.body._id == null || req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);    
});

router.get('/catalog', (req, res) => {
    Animal.find((err, docs) => {
        if(!err){
            res.render("animal/catalog", {
                catalog: docs,
                isUserLogged: isUserLogged(req, res),
                op_submenu: setOpSubmenu(req, res),
                selectedMenu: setPropertyTrue(selectedMenu, "animals"),
            });
        }
        else{
            console.log("Error in retrieving employee list : " + err);
        }
    });
});

router.get('/', isLoggedIn, (req, res) => {
    let animals = [];

    const reqQuery = req.query;
    let query = {};
    let isSearching = false;
    Animal.find(query, function (err, docs){
        if (req.session.passport.user.profile === "administrador" ||
        req.session.passport.user.profile === "funcionário" ||
        req.session.passport.user.profile === "voluntário") {
            if(!err){
                let isVolunteerLogged = false;
                const searchColumnRowspan = 12;
                if(req.session.passport.user.profile === "voluntário") isVolunteerLogged = true;
                docs.forEach(element => {
                    var dog;
                    if(reqQuery.dog === "true")  dog = true;
                    if(reqQuery.dog === "false") dog = false;

                    var vaccinated;
                    if(reqQuery.vaccinated === "true")  vaccinated = true;
                    if(reqQuery.vaccinated === "false") vaccinated = false;

                    var sterilized;
                    if(reqQuery.sterilized === "true")  sterilized = true;
                    if(reqQuery.sterilized === "false") sterilized = false;

                    if(reqQuery.name !== undefined) var re = new RegExp(reqQuery.name.toUpperCase(), 'g');
                    var animalBirthday;
                    if(reqQuery.birthday !== undefined){
                        var monthFormat = "";
                        var dayFormat = "";
                        if((element.birthday.getMonth() + 1) >= 10)
                            monthFormat = (element.birthday.getMonth() + 1);
                        else
                            monthFormat = "0" + (element.birthday.getMonth() + 1);

                        if((element.birthday.getDate() + 1) >= 10)
                            dayFormat = element.birthday.getDate();
                        else
                            dayFormat = "0" + element.birthday.getDate();

                            animalBirthday = element.birthday.getFullYear() + "-" + monthFormat + "-" + dayFormat;
                    } 
                    if((element.name.toUpperCase().match(re) || reqQuery.name === element.name || reqQuery.name === undefined || reqQuery.name === "") &&
                    (reqQuery.gender === element.gender || reqQuery.gender === undefined || reqQuery.gender === "") &&
                    (reqQuery.birthday === animalBirthday || reqQuery.birthday === undefined || reqQuery.birthday === "") &&
                    (dog === element.dog || reqQuery.dog === undefined || reqQuery.dog === "") &&
                    (vaccinated === element.vaccinated || reqQuery.vaccinated === undefined || reqQuery.vaccinated === "") &&
                    (sterilized === element.sterilized || reqQuery.sterilized === undefined || reqQuery.sterilized === "")){
                        animals.push({
                            postSearch: !(animals.length < searchColumnRowspan),
                            _id: element._id,
                            name: element.name,
                            gender: element.gender,
                            vaccinated: element.vaccinated,
                            birthday: element.birthday.toISOString().slice(0, 10),
                            dog: element.dog,
                            sterilized: element.sterilized,
                            showActions: true,
                            isVolunteerLogged: isVolunteerLogged
                        });
                    }
                });
                while (animals.length < searchColumnRowspan) {
                    animals.push({
                        postSearch: false,
                        _id: "",
                        name: "",
                        gender: "",
                        vaccinated: "",
                        birthDate: "",
                        dog: "",
                        sterilized: "",
                        showActions: false
                    });
                }
                const firstLine = animals.shift();
                res.render("animal/list", {
                    list: animals,
                    firstLine: firstLine,
                    isUserLogged: isUserLogged(req, res),
                    op_submenu: setOpSubmenu(req, res),
                    selectedMenu: setPropertyTrue(selectedMenu, "operations"),
                    searchColumnRowspan: searchColumnRowspan,
                    route: "animals",
                    isVolunteerLogged: isVolunteerLogged
                });
            }
            else{
                console.log("Error in retrieving employee list : " + err);
            }
        }
        else{
            res.redirect("/");
        }
    });
});

router.get('/update/:id', (req, res) => {
    if (req.session.passport.user.profile === "administrador" ||
        req.session.passport.user.profile === "funcionário") {
            let flashMessage = { show: false, msg: req.flash('addAnimalMessage')[0] }
            let flashMessage1 = { show: false, msg: req.flash('addDateMessage')[0] }
                if (flashMessage.msg) {
                    flashMessage.show = true;
                }
                if (flashMessage1.msg) {
                    flashMessage1.show = true;
                }
        Animal.findById(req.params.id, (err, doc) => {
            if(!err){
                var monthFormat = "";
                var dayFormat = "";
                console.log(doc.birthday);
                if((doc.birthday.getMonth() + 1) >= 10)
                    monthFormat = (doc.birthday.getMonth() + 1);
                else
                    monthFormat = "0" + (doc.birthday.getMonth() + 1);

                if((doc.birthday.getDate() + 1) >= 10)
                    dayFormat = doc.birthday.getDate();
                else
                    dayFormat = "0" + doc.birthday.getDate();

                var birthday = doc.birthday.getFullYear() + "-"  + monthFormat + "-" + dayFormat;
                res.render("animal/addOrEdit", {
                    viewTitle: "Atualizar " + doc.name,
                    animal: doc,
                    animalBirthday: birthday,
                    flashMessage: flashMessage,
                    flashMessage1: flashMessage1,
                    isUpdate: true,
                    isUserLogged: isUserLogged(req, res),
                    op_submenu: setOpSubmenu(req, res),
                    selectedMenu: setPropertyTrue(selectedMenu, "operations")
                });
            }
        });
    }
    else{
        res.require("/");
    }
});

router.get('/delete/:id', (req, res) => {
    Animal.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/animals');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

function insertRecord(req, res){
    var animalAlreadyExists = false;
    Animal.find((err, docs) => {
        for(var i = 0; i < docs.length; i++){
            if(docs[i].name === req.body.name){
                req.flash('addAnimalMessage', 'Já existe um animal com este nome.');
                animalAlreadyExists = true;
            }
        }
        var today = new Date((new Date()).toString().substring(0,15));
        var date = new Date((new Date(req.body.birthday)).toString().substring(0,15));
        if(date > today || today.getFullYear() - date.getFullYear() >= 20){
            req.flash('addDateMessage', 'Data inválida.');
        }
        if(!animalAlreadyExists && date <= today){
            var animal = new Animal();
            animal.photoLink = req.body.photoLink;
            animal.name = req.body.name;
            animal.birthday = req.body.birthday;
            animal.gender = req.body.gender;
            animal.vaccinated = req.body.vaccinated;
            animal.dog = req.body.dog;
            animal.sterilized = req.body.sterilized;
            animal.state = "Disponível";
            animal.save((err, doc) => {
                if(!err){
                    let newMovementData = {
                        user_id: "1",//Responsável do albergue
                        animal_id: doc._id,
                        date: new Date(),
                        isIn: true,
                        isComplete: true
                    };
                    const Movement = mongoDBConfig.collections[3].model;
                    Movement.insertMovement(newMovementData, function (data) {
                        if (data !== null) {
                            res.redirect('/animals');
                        } else {
                            res.status(400).send(false);
                        }
                    });
                }
                else{
                    if(err.name === 'ValidationError'){
                        handleValidationError(err, req.body);
                        res.render("animal/addOrEdit", {
                            viewTitle : "Adicionar Animal",
                            animal: req.body
                        });
                    }
                    else{
                        console.log('Error during record insertion : ' + err);
                    }
                }
            });
        }
        else{
            res.redirect("/animals/add");
        }
    });
}

function handleValidationError(err, body){
    for(field in err.errors){
        switch(err.errors[field].path){
            case 'name':
                body['name'] = err.errors[field].message;
                break;
            
            default : break;
        }
    }
}

function updateRecord(req, res){
    var sameNameCounter = 0;
    var animalAlreadyExists = false;
    Animal.find((err, docs) => {
        for(var i = 0; i < docs.length; i++){
            if(docs[i].name === req.body.name){
                sameNameCounter++;
            }
        }
        Animal.findById(req.body._id, (err, doc) => {
            if(!err){
                if(doc.name !== req.body.name && sameNameCounter === 1){
                    req.flash('addAnimalMessage', 'Já existe um animal com este nome.');
                    animalAlreadyExists = true;
                }
                var today = new Date((new Date()).toString().substring(0,15));
                var date = new Date((new Date(req.body.birthday)).toString().substring(0,15));
                if(date > today || today.getFullYear() - date.getFullYear() >= 20){
                    req.flash('addDateMessage', 'Data inválida.');
                }
                if(!animalAlreadyExists && 
                    date <= today &&
                    today.getFullYear() - date.getFullYear() < 20){
                    Animal.findOneAndUpdate({ _id : req.body._id }, req.body, {new: true}, (err, doc) => {
                        if(!err){
                            res.redirect('/animals');
                        }
                        else{
                            if(err.name == 'ValidationError'){
                                handleValidationError(err, req.body);
                                res.render("animal/addOrEdit", {
                                    viewTitle: "Atualizar "+ req.body.name,
                                    animal: req.body
                                });
                            }
                            else{
                                console.log('Error during record update : ' + err);
                            }
                        }
                    });
                }
                else{
                    res.redirect("/animals/update/" + req.body._id);
                }
            }
        });
    });
}

function setPropertyTrue(object, prop) {
    for (let property in object) {
        if (object.hasOwnProperty(property)) {
            object[property] = (property === prop);
        }
    }
    return object;
}

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
            return removeObjectFromArray(op_submenu, "Utilizador");;
    }
}

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

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

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
module.exports = router;