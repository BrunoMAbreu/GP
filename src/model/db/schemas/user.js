module.exports = {
    id: {
        type: "number",
        min: 1,
        unique: true,
        required: true
    },
    name: {
        type: "string",
        trim: true,
        required: true
    },
    email: {
        type: "string",
        trim: true,
        unique: true,
        required: true
    },
    password: {
        type: "string",
        minLength: 8
    },
    phone: {
        type: "string",
        trim: true,
        required: true
    },
    profile: {
        type: "string",
        enum: [
            "voluntary",
            "worker"
        ],
        required: true
    },
    birthDate: {
        type: "date",
        required: true
    },
    registerDate: {
        type: "date",
        required: true
    },
    isLogged: {
        type: "boolean",
        default: true,
        required: true
    }
}