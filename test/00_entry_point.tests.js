'use strict';
console.log("running 00_entry.point.js");

require("../app.js");

describe("", function () {
    this.timeout(10000);
    before(function (done) {
        setTimeout(function () {
            done();
        }, 6000);
    });
    it('', function (done) {
        done();
    });
});