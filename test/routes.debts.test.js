process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : debts', () => {

    beforeEach(() => {
        return knex.migrate.rollback()
            .then(() => { return knex.migrate.latest(); })
            .then(() => { return knex.seed.run(); });
    });

    afterEach(() => {
        return knex.migrate.rollback();
    });

    describe('GET /api/v1/debts', () => {
        it('should return all debts', (done) => {
            chai.request(server)
                .get('/api/v1/debts')
                .end((err, res) => {
                    // there should be no errors
                    //should.not.exist(err);
                    // there should be a 200 status code
                    res.status.should.equal(200);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "success"}
                    res.body.status.should.eql('success');
                    // the JSON response body should have a
                    // key-value pair of {"data": [3 debt objects]}
                    res.body.data.length.should.eql(3);
                    // the first object in the data array should
                    // have the right keys
                    res.body.data[0].should.include.keys(
                        'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor', 'saleId'
                    );
                    done();
                });
        });
    });

    describe('GET /api/v1/debts/:id', () => {
        it('should respond with a single debt', (done) => {
            chai.request(server)
                .get('/api/v1/debts/1')
                .end((err, res) => {
                    // there should be no errors
                    should.not.exist(err);
                    // there should be a 200 status code
                    res.status.should.equal(200);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON responde body should have a
                    // key-value pair of {"status": "success"}
                    res.body.status.should.eql('success');
                    // the JSON response body should have a
                    // key-value pair of data {"data": 1 debt object}
                    res.body.data[0].should.include.keys(
                        'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor', 'saleId'
                    );
                    done();
                });
        });
        it('should throw an error if the debt does not exist', (done) => {
            chai.request(server)
                .get('/api/v1/debts/9999999')
                .end((err, res) => {
                    // there should an error
                    should.exist(err);
                    // there should be a 404 status code
                    res.status.should.equal(404);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "error"}
                    res.body.status.should.eql('error');
                    // the JSON response body should have a
                    // key-value pair of {"message": "That debt does not exist."}
                    res.body.message.should.eql('That debt does not exist.');
                    done();
                });
        });
    });

    describe('POST /api/v1/debts', () => {
        it('should return the "debtor" debt that was added', (done) => {
            chai.request(server)
                .post('/api/v1/debts')
                .send({
                    value: 9000,
                    paid: false,
                    paidValue: 1500,
                    debtor: "Rogelio"
                })
                .end((err, res) => {
                    // there should be no errors
                    should.not.exist(err);
                    // there should be a 201 status code
                    // (indicating that something was "created")
                    res.status.should.equal(201);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "success"}
                    res.body.status.should.eql('success');
                    // the JSON response body should have a
                    // key-value pair of {"data": 1 debt object}
                    res.body.data[0].should.include.keys(
                        'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor', 'saleId'
                    );
                    // ensure the debt's debtor key has not null value
                    const debtObject = res.body.data[0];
                    debtObject.debtor.should.not.equal(null);
                    done();
                });
        });
        it('should throw an error if the payload is malformed', (done) => {
            chai.request(server)
                .post('/api/v1/debts')
                .send({
                    value: 3500
                })
                .end((err, res) => {
                    // there should an error
                    should.exist(err);
                    // there should be a 400 status code
                    res.status.should.equal(400);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "error"}
                    res.body.status.should.eql('error');
                    // the JSON response body should have a message key
                    should.exist(res.body.message);
                    done();
                });
        });
    });

    describe('PUT /api/v1/debts', () => {
        it('should return the debt that was updated', (done) => {
            knex('debts')
                .select('*')
                .then((debts) => {
                    const debtObject = debts[0];
                    chai.request(server)
                        .put(`/api/v1/debts/${debtObject.id}`)
                        .send({
                            paidValue: 6500,
                        })
                        .end((err, res) => {
                            // there should be no errors
                            should.not.exist(err);
                            // there should be a 200 status code
                            res.status.should.equal(200);
                            // the response should be JSON
                            res.type.should.equal('application/json');
                            // the JSON response body should have a
                            // key-value pair of {"status": "success"}
                            res.body.status.should.eql('success');
                            // the JSON response body should have a
                            // key-value pair of {"data": 1 debt object}
                            res.body.data[0].should.include.all.keys(
                                'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor', 'saleId'
                            );
                            // ensure the debt's updatedAt key has not null value
                            const newDebtObject = res.body.data[0];
                            newDebtObject.updatedAt.should.not.eql(null);
                            // ensure the debt was in fact updated
                            newDebtObject.paidValue.should.not.eql(debtObject.paidValue);
                            done();
                        });
                });
        });
        it('should throw an error if the debt does not exist', (done) => {
            chai.request(server)
                .put('/api/v1/debts/9999999')
                .send({
                    paidValue: 1900
                })
                .end((err, res) => {
                    // there should an error
                    should.exist(err);
                    // there should be a 404 status code
                    res.status.should.equal(404);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "error"}
                    res.body.status.should.eql('error');
                    // the JSON response body should have a
                    // key-value pair of {"message": "That debt does not exist."}
                    res.body.message.should.eql('That debt does not exist.');
                    done();
                });
        });        
    });

    describe('DELETE /api/v1/debts/:id', () => {
        it('should return the debt that was deleted', (done) => {
            knex('debts')
                .select('*')
                .then((debts) => {
                    const debtObject = debts[0];
                    const lengthBeforeDelete = debts.length;
                    chai.request(server)
                        .delete(`/api/v1/debts/${debtObject.id}`)
                        .end((err, res) => {
                            // there should be no errors
                            should.not.exist(err);
                            // there should be a 200 status code
                            res.status.should.equal(200);
                            // the response should be JSON
                            res.type.should.equal('application/json');
                            // the JSON response body should have a
                            // key-value pair of {"status": "success"}
                            res.body.status.should.eql('success');
                            // the JSON response body should have a
                            // key-value pair of {"data": 1 debt object}
                            res.body.data[0].should.include.all.keys(
                                'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor', 'saleId'
                            );
                            // ensure the debt was in fact deleted
                            knex('debts').select('*')
                                .then((updatedDebts) => {
                                    updatedDebts.length.should.eql(lengthBeforeDelete - 1);
                                    done();
                                });
                        });
                });
        });
        it('should throw an error if the debt does not exist', (done) => {
            chai.request(server)
                .delete('/api/v1/debts/9999999')
                .end((err, res) => {
                    // there should an error
                    should.exist(err);
                    // there should be a 404 status code
                    res.status.should.equal(404);
                    // the response should be JSON
                    res.type.should.equal('application/json');
                    // the JSON response body should have a
                    // key-value pair of {"status": "error"}
                    res.body.status.should.eql('error');
                    // the JSON response body should have a
                    // key-value pair of {"message": "That debt does not exist."}
                    res.body.message.should.eql('That debt does not exist.');
                    done();
                });
        });
    });
   


});
