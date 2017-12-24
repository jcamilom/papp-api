process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : sales', () => {

    beforeEach(() => {
        return knex.migrate.rollback()
            .then(() => { return knex.migrate.latest(); })
            .then(() => { return knex.seed.run(); });
    });

    afterEach(() => {
        return knex.migrate.rollback();
    });

    describe('GET /api/v1/sales', () => {
        it('should return all sales', (done) => {
            chai.request(server)
                .get('/api/v1/sales')
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
                    // key-value pair of {"data": [3 sale objects]}
                    res.body.data.length.should.eql(3);
                    // the first object in the data array should
                    // have the right keys
                    res.body.data[0].should.include.keys(
                        'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor'
                    );
                    done();
                });
        });
    });

    describe('GET /api/v1/sales/:id', () => {
        it('should respond with a single sale', (done) => {
            chai.request(server)
                .get('/api/v1/sales/1')
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
                    // key-value pair of data {"data": 1 sale object}
                    res.body.data[0].should.include.keys(
                        'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor'
                    );
                    done();
                });
        });
        it('should throw an error if the sale does not exist', (done) => {
            chai.request(server)
                .get('/api/v1/sales/9999999')
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
                    // key-value pair of {"message": "That sale does not exist."}
                    res.body.message.should.eql('That sale does not exist.');
                    done();
                });
        });
    });

    describe('POST /api/v1/sales', () => {
        it('should return the "simple" sale that was added', (done) => {
            chai.request(server)
                .post('/api/v1/sales')
                .send({
                    value: 12350,
                    paid: true,
                    paidValue: 12350
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
                    // key-value pair of {"data": 1 sale object}
                    res.body.data[0].should.include.keys(
                        'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor'
                    );
                    // ensure the sale's debtor key has null value
                    const saleObject = res.body.data[0];
                    should.equal(saleObject.debtor, null);
                    done();
                });
        });
        it('should return the "debtor" sale that was added', (done) => {
            chai.request(server)
                .post('/api/v1/sales')
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
                    // key-value pair of {"data": 1 sale object}
                    res.body.data[0].should.include.keys(
                        'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor'
                    );
                    // ensure the sale's debtor key has not null value
                    const saleObject = res.body.data[0];
                    saleObject.debtor.should.not.equal(null);
                    done();
                });
        });
        it('should throw an error if the payload is malformed', (done) => {
            chai.request(server)
                .post('/api/v1/sales')
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

    describe('PUT /api/v1/sales', () => {
        it('should return the sale that was updated', (done) => {
            knex('sales')
                .select('*')
                .then((sales) => {
                    const saleObject = sales[0];
                    chai.request(server)
                        .put(`/api/v1/sales/${saleObject.id}`)
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
                            // key-value pair of {"data": 1 sale object}
                            res.body.data[0].should.include.all.keys(
                                'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor'
                            );
                            // ensure the sale's updatedAt key has not null value
                            const newSaleObject = res.body.data[0];
                            newSaleObject.updatedAt.should.not.eql(null);
                            // ensure the sale was in fact updated
                            newSaleObject.paidValue.should.not.eql(saleObject.paidValue);
                            done();
                        });
                });
        });
        it('should throw an error if the sale does not exist', (done) => {
            chai.request(server)
                .put('/api/v1/sales/9999999')
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
                    // key-value pair of {"message": "That sale does not exist."}
                    res.body.message.should.eql('That sale does not exist.');
                    done();
                });
        });        
    });

    describe('DELETE /api/v1/sales/:id', () => {
        it('should return the sale that was deleted', (done) => {
            knex('sales')
                .select('*')
                .then((sales) => {
                    const saleObject = sales[0];
                    const lengthBeforeDelete = sales.length;
                    chai.request(server)
                        .delete(`/api/v1/sales/${saleObject.id}`)
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
                            // key-value pair of {"data": 1 sale object}
                            res.body.data[0].should.include.all.keys(
                                'id', 'createdAt', 'updatedAt', 'value', 'paid', 'paidValue', 'debtor'
                            );
                            // ensure the sale was in fact deleted
                            knex('sales').select('*')
                                .then((updatedSales) => {
                                    updatedSales.length.should.eql(lengthBeforeDelete - 1);
                                    done();
                                });
                        });
                });
        });
        it('should throw an error if the sale does not exist', (done) => {
            chai.request(server)
                .delete('/api/v1/sales/9999999')
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
                    // key-value pair of {"message": "That sale does not exist."}
                    res.body.message.should.eql('That sale does not exist.');
                    done();
                });
        });
    });
   


});
