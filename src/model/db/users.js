

//const MongoDBConnected = require("../../../app").db;
const User = require('../user');

const CollectionName = "Users"
let currentUser = [];

class Users{

    insertUser(name, email, password, userType, birthDate) {
        
        const user = new User(name, email, password, userType, birthDate);
        currentUser.push(user);

        MongoDBConnected.then(() => {
            const user = {
                id: user.id,
                name: name,
                email: email,
                password: password,
                userType: birthDate ///// formatar correctamente na classe
            };
            const collection = Connection.collection(CollectionName);
            collection.insertOne(user, (err, result) => {
                if(err) throw err;
                console.log("Insertion of user " + user.name + " successful");
            });
        });
    }

}

let users1 = new Users();
users1.insertUser("hugo", "asdsa", "asda", "VOLUNTEER", 1231);