'use strict';
console.log("running mongo.movements.tests.js")

const { ObjectId } = require('mongodb');
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

module.exports = function (userCollection, animalCollection, movementCollection) {
    describe("Mongo 'movements' collection", function () {
        this.timeout(20000);
        let newUser = null;
        let newAnimal = null;
        let newMovement = null;
        let newUserId = null;
        let newAnimalId = null;
        let newMovementId = null;

        let userModel = null;
        let Animal = null;
        let movementModel = null;
        let testInsertMovement = null;

        before(function (done) {
            userModel = userCollection.model;
            Animal = animalCollection.model;
            movementModel = movementCollection.model;

            newMovement = {
                user_id: newUserId,
                animal_id: newAnimalId,
                isIn: false,
                isComplete: false,
                date: new Date()
            };

            newUser = {
                name: "Xana Xanax",
                email: "xyz@x",
                password: "a",
                phone: "1234654651",
                birthDate: new Date()
            };
            newAnimal = new Animal();
            newAnimal.photoLink = "https://2.bp.blogspot.com/_LDF9z4ZzZHo/TQAJ32ILP7I/AAAAAAAAAJI/_izkqRoi0bQ/s1600/1600DOG_11019.jpg";
            newAnimal.name = "tigre";
            newAnimal.birthday = new Date();
            newAnimal.gender = "Male";
            newAnimal.vaccinated = false;
            newAnimal.dog = true;
            newAnimal.sterilized = false;
            newAnimal.state = "Adotado";

            userModel.insertUser(newUser.name, newUser.email, newUser.password, newUser.phone, newUser.birthDate, function (err, result) {
                if (err) done(err);
                newUserId = result.user_id;
                newMovement.user_id = newUserId;
                newAnimal.save(function (err, res) {
                    if (err) done(err);
                    newAnimalId = res._id;
                    newMovement.animal_id = newAnimalId;
                    done()
                });
            });

            // Aux function
            testInsertMovement = function (result, callback) {
                result.user_id.should.equal(newUserId.toString());
                result.animal_id.toString().should.equal(newAnimalId.toString());
                result.date.getUTCFullYear().should.equal(newUser.birthDate.getUTCFullYear());
                result.date.getUTCMonth().should.equal(newUser.birthDate.getUTCMonth());
                result.date.getUTCDate().should.equal(newUser.birthDate.getUTCDate());
                callback();
            };
        });
        after(function (done) {
            movementModel.findByIdAndRemove(newMovementId, function (err, result) {
                done();
            })
        });

        it('Insert movement in DB', function (done) {
            movementModel.insertMovement(newMovement, function (result) {
                testInsertMovement(result, done);
            });
        });
/*
        it('Update adoption in DB', function (done) {

            adoptionModel.getAdoption({ user_id: newUserId }, function (err, result) {
                if (err) {
                    done(err);
                }
                newAdoptionId = result[0]._id;
                const newAdoptionData = { _id: newAdoptionId, animal_id: 42 };
                adoptionModel.updateAdoption(newAdoptionData, function (err, res) {
                    if (err) done(err);
                    res.animal_id.should.equal(newAdoptionData.animal_id.toString());
                    done();
                });
            });
        });
        it('Delete adoption from DB', function (done) {
            let newAdoption = {
                user_id: 1,
                animal_id: 1,
                adoptionDate: new Date()
            }
            adoptionModel.insertAdoption(newAdoption, function (result) {
                adoptionModel.getAdoption({ user_id: 1 }, function (err, result) {
                    newAdoptionId = result[0].adoption_id;
                    adoptionModel.deleteAdoption(newAdoptionId, function (data) {
                        done();
                    })
                })
            });
        })*/
    });
}
