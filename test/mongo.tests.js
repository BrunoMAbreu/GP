'use strict';
console.log("running mongo.js")

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();


describe("Mongo 'users' collection", function () {
    this.timeout(5000);
    let mongoDBConfig = null;
    let newUser = null;
    let userModel = null;
    let testInsertUser = null;

    before(function (done) {
        mongoDBConfig = require("../src/model/db/mongoConfig").mongoDBConfig;
        userModel = mongoDBConfig.collections[0].model;
        newUser = {
            name: "Xana Xanax",
            email: "x@x",
            password: "a",
            phone: "1234654651",
            birthDate: new Date()
        };
        // Aux function
        testInsertUser = function (result) {
            result.username.should.equal(newUser.name);
            result.email.should.equal(newUser.email);
            result.password.should.be.a("string");
            result.phone.should.equal(newUser.phone);
            result.birthDate.getUTCFullYear().should.equal(newUser.birthDate.getUTCFullYear());
            result.birthDate.getUTCMonth().should.equal(newUser.birthDate.getUTCMonth());
            result.birthDate.getUTCDate().should.equal(newUser.birthDate.getUTCDate());
            result.profile.should.equal("voluntário");
        }
        done();
    });
    beforeEach(function (done) {
        // insert user in db
        userModel.insertUser(newUser.name, newUser.email, newUser.password, newUser.phone, newUser.birthDate, function (result) {
            done();
        });
    });
    afterEach(function (done) {
        // delete user from db
        userModel.getUserByEmail(newUser.email, function (err, result) {
            if (err) {
                done(error);
            }
            if (result) {
                userModel.deleteUser(result._id, function (data) {
                    done();
                });
            } else {
                done();
            }
        });
    });

    it('Insert user in DB', function (done) {
        userModel.getUserByEmail(newUser.email, function (err, result) {
            if (err) {
                done(error);
            }
            testInsertUser(result);
            done();
        })
    })
    it('Update user in DB', function (done) {
        userModel.getUserByEmail(newUser.email, function (err, result) {
            if (err) {
                done(error);
            }
            const newUserData = { _id: result._id, username: "Ana" }
            userModel.updateUser(newUserData, function (res) {
                res.username.should.equal(newUserData.username);
                done();
            });
        });
    });
    it('Delete user from DB', function (done) {
        userModel.getUserByEmail(newUser.email, function (err, result) {
            if (err) {
                done(error);
            }
            userModel.deleteUser(result._id, function (data) {
                userModel.getUserByEmail(newUser.email, function (err, result) {
                    should.not.exist(err);
                    should.not.exist(result);
                    done();
                });
            });
        })
    })
});