'use strict';
console.log("running 00_entry.point.js");


require("../app.js");

describe("", function () {
    this.timeout(15000);
    const mongoDBConfig = require("../src/model/db/mongoConfig").mongoDBConfig;
    //const mongoose = require("mongoose");
    before(function (done) {
        setTimeout(function () {
            let httpTests = require("./tests/http.tests");
            let mongoUserTests = require("./tests/mongo.users.tests")(mongoDBConfig.collections[0]);
            let mongoAnimalsTests = require("./tests/mongo.animals.tests")(mongoDBConfig.collections[1]);
            //mongoDBConfig.mongoose.disconnect();
            done();
        }, 6000);
        //setTimeout(function () {
            //mongoDBConfig.connection.close();
            //mongoDBConfig.mongoose.disconnect();
            //done();
        //}, 20000);
    });
    it('', function (done) {
        done();
    });
});