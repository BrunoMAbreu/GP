'use strict';
console.log("running 00_entry.point.js");


require("../app.js");

describe("", function () {
    this.timeout(10000);
    const mongoDBConfig = require("../src/model/db/mongoConfig").mongoDBConfig;
    before(function (done) {
        setTimeout(function () {
            let httpTests = require("./tests/http.tests");
            let mongoUserTests = require("./tests/mongo.users.tests")(mongoDBConfig.collections[0]);
            let mongoAnimalsTests = require("./tests/mongo.animals.tests")(mongoDBConfig.collections[1]);
            done();
        }, 8000);
    });
    it('', function (done) {
        done();
    });
});