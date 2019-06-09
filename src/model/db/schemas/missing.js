module.exports = {
    missing_id: {
        type: "number",
        min: 1,
        unique: true,
        required: true,
        index: true
    },
    user_id: {
        type: "number",
        min: 1,
        required: true
    },
    animalName: {
        type: "string",
        required: true
    },
    chipNumber: {
        type: "number",
        min: 0,
        max: 999999999999999,
        unique: true
    },
    place: {
        type: "string",
        required: true
    },
    species: {
        type: String,
        required: true,
        enum: ["Dog", "Cat"]
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female"],
    },
    size: {
        type: String,
        enum: ["Small", "Medium", "Large"]
    },
    missingDate: {
        type: "date",
        required: true
    }
}