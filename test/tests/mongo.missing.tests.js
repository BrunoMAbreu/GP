'use strict';
console.log("running mongo.missing.tests.js")

//const mongoDBConfig = require("../../src/model/db/mongoConfig").mongoDBConfig;
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

module.exports = function (missingCollection) {
    describe("Mongo 'missing' collection", function () {
        this.timeout(10000);
        let newMissing = null;
        let missingModel = null;
        let testInsertMissing = null;

        before(function (done) {
            missingModel = missingCollection.model;
            newMissing = {
                user_id: 1,
                animalName: "Açafrão",
                chipNumber: 123456789,
                photoLink: "http://abc.com",
                place: {name:"Maçã", lat: 11.1, lon:-2},
                notes: "ele morde",
                species: "Dog",
                gender: "Male",
                size: "Large",
                missingDate: new Date()
            };
            // Aux function
            testInsertMissing = function (result, callback) {
                result.animalName.should.equal(newMissing.animalName);
                result.photoLink.should.equal(newMissing.photoLink);
                result.place.name.should.equal(newMissing.place.name);
                result.place.lat.should.equal(newMissing.place.lat);
                result.place.lon.should.equal(newMissing.place.lon);
                result.notes.should.equal(newMissing.notes);
                result.species.should.equal(newMissing.species);
                result.gender.should.equal(newMissing.gender);
                result.size.should.equal(newMissing.size);
                result.missingDate.getUTCFullYear().should.equal(newMissing.missingDate.getUTCFullYear());
                result.missingDate.getUTCMonth().should.equal(newMissing.missingDate.getUTCMonth());
                result.missingDate.getUTCDate().should.equal(newMissing.missingDate.getUTCDate());
                callback();
            };
            done();
        });
        beforeEach(function (done) {
            let other = {
                photoLink: newMissing.photoLink,
                notes: newMissing.notes,
                size: newMissing.size
            }
            missingModel.insertMissing(newMissing.user_id, newMissing.animalName, newMissing.place, newMissing.species, newMissing.gender, newMissing.missingDate, other, function (err, result) {
                if (err) done(err);
                done();
            });
        });
        afterEach(function (done) {
            missingModel.findOneAndDelete({ animalName: newMissing.animalName }, function (err, result) {
                if (err) done(err);
                done();
            });
        });
        it('Insert missing in DB', function (done) {
            missingModel.getMissing({animalName: newMissing.animalName}, function (err, result) {
                if (err) {
                    done(err);
                }
                testInsertMissing(result[0], done);
            })
        })
        it('Update missing in DB', function (done) {
            missingModel.getMissing({animalName: newMissing.animalName}, function (err, result) {
                if (err) {
                    done(err);
                }
                const newMissingData = { missing_id: result[0].missing_id, species: "Cat" };
                missingModel.updateMissing(newMissingData, function (err, res) {
                    if (err) done(err);
                    res.species.should.equal(newMissingData.species);
                    done();
                });
            });
        });
        it('Delete missing from DB', function (done) {
            let newerMissing = {
                user_id: 1,
                animalName: "Cardomomo",
                chipNumber: 1111111111,
                photoLink: "http://abcd.com",
                place: {name:"Reineta", lat: -11.1, lon:2},
                notes: "só ladra",
                species: "Cat",
                gender: "Male",
                size: "Medium",
                missingDate: new Date()
            };
            missingModel.insertMissing(newerMissing.user_id, newerMissing.animalName, newerMissing.place, newerMissing.species, newerMissing.gender, newerMissing.missingDate, null, function (err, result) {
                if (err) done(err);
                missingModel.deleteMissing(result.missing_id, function (data) {
                    missingModel.getMissing({animalName: newerMissing.animalName}, function (err, result) {
                        if(err) done(err);
                        should.not.exist(err);
                        result.should.be.an("array");
                        result.should.have.lengthOf(0);
                        done();
                    });
                });
            });
        });
    })
}
