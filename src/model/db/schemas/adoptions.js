module.exports = {
    adoptions_id: {
        type: "number",
        min: 1,
        unique: true,
        required: true,
        index: true
    },
    user_id: {
        type: "number",
        min: 1,
        unique: true,
        required: true,
        index: true
    },
    animal_id: {
        type: "string",
        min: 1,
        unique: true,
        required: true,
        index: true
    },
    adoptionDate: {
        type: "date",
        required: true,
        default: new Date()
    }
}