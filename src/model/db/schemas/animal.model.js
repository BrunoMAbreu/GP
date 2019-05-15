const mongoose = require('mongoose');

var animalSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    birthday:{
        type: Date,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    vaccinated:{
        type: Boolean,
        required: true
    },
    dog:{
        type: Boolean,
        required: true
    },
    sterilized:{
        type: Boolean,
        required: true
    },
    photoLink:{
        type: String,
        required: true
    }
});

mongoose.model('animals', animalSchema);