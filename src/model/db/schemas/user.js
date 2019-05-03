module.exports = {
    user_id: {
        type: "number",
        min: 1,
        unique: true,
        required: true,
        index: true
    },
    username: {
        type: "string",
        trim: true,
        required: true
    },
    email: {
        type: "string",
        trim: true,
        unique: true,
        required: true,
        index: true
    },
    password: {
        type: "string",
        minLength: 8,
        required: true
    },
    phone: {
        type: "string",
        trim: true,
        required: true
    },
    profile: {
        type: "string",
        trim: true,
        enum: [
            "voluntário",
            "funcionário",
            "administrador"
        ],
<<<<<<< HEAD
        required: true
=======
        required: true,
        default: "voluntário"
>>>>>>> 7d4f99401dccb9db359773f734d9d732ce7e8721
    },
    birthDate: {
        type: "date",
        required: true
    },
    registerDate: {
        type: "date",
        required: true,
        default: new Date()
    },
    isLogged: {
        type: "boolean",
        default: true,
        required: true
    }
}