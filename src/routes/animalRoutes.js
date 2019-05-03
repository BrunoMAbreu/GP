const express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Animal = mongoose.model('animals');
var Handlebars = require('handlebars');

Handlebars.registerHelper('ifBoolCond', function(param, options) {
    if(param === true) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

Handlebars.registerHelper('ifGenderCond', function(param, options) {
    if(param === "Male") {
      return options.fn(this);
    }
    return options.inverse(this);
  });

router.get('/', (req, res) => {
    res.render("animal/animals", {
        viewTitle : "Index Animais"
    });
});

router.get('/assOrEdit', (req, res) => {
    res.render("animal/addOrEdit", {
        viewTitle : "Adicionar Animal"
    });
});

router.get('/details/:id', (req, res) => {
    Animal.findById(req.params.id, (err, doc) => {
        if(!err){
            res.render("animal/details", {
                viewTitle: doc.nome,
                animal: doc
            });
        }
    });
});

router.post('/', (req, res) => {
    if(req.body._id == null || req.body._id == '')
        insertRecord(req, res);
    else
        updateRecord(req, res);
});

router.get('/list', (req, res) => {
    Animal.find((err, docs) => {
        if(!err){
            res.render("animal/list", {
                list: docs
            });
        }
        else{
            console.log("Error in retrieving employee list : " + err);
        }
    });
});

router.get('/update/:id', (req, res) => {
    Animal.findById(req.params.id, (err, doc) => {
        if(!err){
            var monthFormat = "";
            var dayFormat = "";
            if((doc.birthday.getMonth() + 1) >= 10)
                monthFormat = (doc.birthday.getMonth() + 1);
            else
                monthFormat = "0" + (doc.birthday.getMonth() + 1);

            if((doc.birthday.getDate() + 1) >= 10)
                dayFormat = (doc.birthday.getDate() + 1);
            else
                dayFormat = "0" + (doc.birthday.getDate() + 1);

            var birthday = doc.birthday.getFullYear() + "-"  + monthFormat + "-" + dayFormat;
            res.render("animal/addOrEdit", {
                viewTitle: "Atualizar " + doc.name,
                animal: doc,
                animalBirthday: birthday
            });
        }
        
    });
});

router.get('/delete/:id', (req, res) => {
    Animal.findByIdAndRemove(req.params.id, (err, doc) => {
        if (!err) {
            res.redirect('/animal/list');
        }
        else { console.log('Error in employee delete :' + err); }
    });
});

function insertRecord(req, res){
    var animal = new Animal();
    animal.name = req.body.name;
    animal.birthday = req.body.birthday;
    animal.gender = req.body.gender;
    animal.vaccinated = req.body.vaccinated;
    animal.dog = req.body.dog;
    animal.sterilized = req.body.sterilized;
    animal.save((err, doc) => {
        if(!err)
            res.redirect('animal/list');
        else{
            
            if(err.name === 'ValidationError'){
                handleValidationError(err, req.body);
                res.render("animal/addOrEdit", {
                    viewTitle : "Adicionar Animal",
                    animal: req.body
                });
            }
            console.log('Error during record insertion : ' + err);
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
    Animal.findOneAndUpdate({ _id : req.body._id }, req.body, {new: true}, (err, doc) => {
        if(!err){
            res.redirect('animal/list');
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

module.exports = router;