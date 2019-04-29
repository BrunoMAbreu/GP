const mongoose = require('mongoose');

var animalSchema = new mongoose.Schema({
    name:{
        type: String,
        required: 'This field is required'
    },
    birthday:{
        type: Date
    },
    gender:{
        type: String
    },
    vaccinated:{
        type: Boolean
    },
    dog:{
        type: Boolean
    },
    sterilized:{
        type: Boolean
    }
});

mongoose.model('animals', animalSchema);