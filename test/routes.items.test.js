process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server/index');
const knex = require('../src/server/db/connection');

describe('routes : items', () => {

    beforeEach(() => {
        return knex.migrate.rollback()
            .then(() => {
                return knex.migrate.latest();
            })
            .then(() => {
                return knex.seed.run();
            });
    });

    afterEach(() => {
        return knex.migrate.rollback();
    });

    describe('GET /api/v1/items', () => {
        it('should return all items', (done) => {
            chai.request(server)
                .get('/api/v1/items')
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
                    // key-value pair of {"data": [3 item objects]}
                    res.body.data.length.should.eql(3);
                    // the first object in the data array should
                    // have the right keys
                    res.body.data[0].should.include.keys(
                        'id', 'name', 'price', 'nAvailable'
                    );
                    done();
                });
        });
    });

    describe('GET /api/v1/items/:id', () => {
        it('should respond with a single item', (done) => {
            chai.request(server)
                .get('/api/v1/items/1')
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
                    // key-value pair of {"data": 1 item object}
                    res.body.data[0].should.include.keys(
                        'id', 'name', 'price', 'nAvailable'
                    );
                    done();
                });
        });
        it('should throw an error if the item does not exist', (done) => {
            chai.request(server)
                .get('/api/v1/items/9999999')
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
                    // key-value pair of {"message": "That item does not exist."}
                    res.body.message.should.eql('That item does not exist.');
                    done();
                });
        });        
    });
    
    describe('POST /api/v1/items', () => {
        it('should return the item that was added', (done) => {
            chai.request(server)
                .post('/api/v1/items')
                .send({
                    name: 'Sacapuntas',
                    price: 800,
                    nAvailable: 12
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
                    // key-value pair of {"data": 1 item object}
                    res.body.data[0].should.include.keys(
                        'id', 'name', 'price', 'nAvailable'
                    );
                    done();
                });
        });
        it('should throw an error if the payload is malformed', (done) => {
            chai.request(server)
                .post('/api/v1/items')
                .send({
                    name: 'Borrador'
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
        })
    });

    describe('PUT /api/v1/items', () => {
        it('should return the item that was updated', (done) => {
            knex('items')
                .select('*')
                .then((item) => {
                    const itemObject = item[0];
                    chai.request(server)
                        .put(`/api/v1/items/${itemObject.id}`)
                        .send({
                            price: 1500
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
                            // key-value pair of {"data": 1 item object}
                            res.body.data[0].should.include.keys(
                                'id', 'name', 'price', 'nAvailable'
                            );
                            // ensure the item was in fact updated
                            const newItemObject = res.body.data[0];
                            newItemObject.price.should.not.eql(itemObject.price);
                            done();
                        });
                });
        });
        it('should throw an error if the item does not exist', (done) => {
            chai.request(server)
                .put('/api/v1/items/9999999')
                .send({
                    price: 1700
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
                    // key-value pair of {"message": "That item does not exist."}
                    res.body.message.should.eql('That item does not exist.');
                    done();
                });
        });
        
    });   

});
