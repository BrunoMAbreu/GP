
const UserType = Object.freeze({
    VOLUNTEER: "volunteer",
    EMPLOYEE: "employee",
    ADMINISTRATOR: "administrator"
});

module.exports = class User {
    constructor(name, email, password, userType, birthDate) {

        // validar pelo menos UserType e birthdate
        this.userID = User.incrementID();
        this.name = name;
        this.email = email;
        this.password = password;
        this.userType = userType;
        this.birthDate = birthDate;
    }
    static incrementID() {
        return this.latestID = (!this.latestID) ? 1 : ++this.latestID;
    }
}


