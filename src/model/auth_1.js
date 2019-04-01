let express = require('express');
let fs = require('fs');

let app = express();

let dbCurrent = getUsersFromDB();

const auth = {

    // ALTERAR default example
    getUnauthorizedResponse: function (req) {
        //APAGAR
        console.log('getUnauthorizedResponse');
        // DEFAULT example
        return req.auth
            ? ('Credentials ' + req.auth.user + ':' + req.auth.password + ' rejected')
            : 'No credentials provided'
    },
    myAuthorizer: function (username, password) {

        getUsersFromDB();
        for (let key in dbCurrent) {
            if (dbCurrent.hasOwnProperty(key)
                && dbCurrent[key].email === username // email
                && dbCurrent[key].password === password) {

                    //APAGAR
                console.log('TRUE');
                
                return true;
            }
        }
        return false;
    }
}

function getUsersFromDB() {
    const data = fs.readFileSync(__dirname + '/db/db_temp.json');
    return JSON.parse(data);
}



module.exports = auth;