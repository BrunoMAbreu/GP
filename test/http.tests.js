'use strict';
console.log("running http.js")

const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const should = chai.should();

const url = "http://localhost:8080";

describe("HTTP server", function () {
    this.timeout(10000);
    it('Main page status 200: OK', function (done) {
        chai
            .request(url)
            .get("/")
            .end(function (error, response, body) {
                if (error) {
                    done(error);
                } else {
                    chai.expect(response.statusCode).to.equal(200);
                    done();
                }
            });
    });
    it('Login page status 200: OK', function (done) {
        chai
            .request(url)
            .get("/login")
            .end(function (error, response, body) {
                if (error) {
                    done(error);
                } else {
                    chai.expect(response.statusCode).to.equal(200);
                    done();
                }
            });
    });
    it('Register page status 200: OK', function (done) {
        chai
            .request(url)
            .get("/register")
            .end(function (error, response, body) {
                if (error) {
                    done(error);
                } else {
                    chai.expect(response.statusCode).to.equal(200);
                    done();
                }
            });
    });
    it('Animals list page status 200: OK', function (done) {
        chai
            .request(url)
            .get("/animals")
            .end(function (error, response, body) {
                if (error) {
                    done(error);
                } else {
                    chai.expect(response.statusCode).to.equal(200);
                    done();
                }
            });
    });
    it('Non-existing page status 404: Not Found', function (done) {
        chai
            .request(url)
            .get("/non-existing-page")
            .end(function (error, response, body) {
                if (error) {
                    done(error);
                } else {
                    chai.expect(response.statusCode).to.equal(404);
                    done();
                }
            });
    });
    it('It should fail gracefully, with a redirect', function (done) {
        const user = {
            email: "wrong",
            password: "wrong"
        }
        chai
            .request(url)
            .post('/login')
            .send(user)
            .end(function (error, response, body) {
                if (error) {
                    done(error);
                } else {
                    chai.expect(response.statusCode).to.equal(200);
                    done();
                }
            });
    });


});


/*


describe('/GET /employee/:id/edit?_id=a', () => {
    it('\'it should say the employee does not exist\'', (done) => {
        startServer((server) => {

            chai.request(server)
                .get('/employee/:id/edit?_id=a')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});

describe('/POST /employee/:id/delete?_id=a', () => {
    it('it should say the employee does not exist', (done) => {
        startServer((server) => {

            chai.request(server)
                .post('/employee/:id/delete?_id=a')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
describe('/POST /employee/:id/update?_id=a', () => {
    it('it should say the employee does not exist', (done) => {
        startServer((server) => {

            chai.request(server)
                .post('/employee/:id/update?_id=a')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});


describe('/POST /dsadkljasdklas', () => {
    it('it should say the route does not exist', (done) => {
        startServer((server) => {

            chai.request(server)
                .post('/dsadkljasdklas')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});
*/
