let fs = require('fs');

let dbCurrent = getUsersFromDB();


//////////////////////////////
const auth = {
    validateUser: function (email, password) {
        getUsersFromDB();
        for (let key in dbCurrent) {
            if (dbCurrent.hasOwnProperty(key)
                && dbCurrent[key].email === email
                && dbCurrent[key].password === password) {

                //apagar
                console.log('TRUE');

                return true;
            }
        }
        return false;
    }
}

// SUBSTITUIR JSON por MONGO
function getUsersFromDB() {
    const data = fs.readFileSync(__dirname + '/db/db_temp.json');
    return JSON.parse(data);
}


module.exports = auth;