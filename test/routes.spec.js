process.env.NODE_ENV = 'test';

var chai = require('chai');
var should = chai.should();
var chaiHttp = require('chai-http');
var server = require('../');

chai.use(chaiHttp);

describe('API Routes', function() {

});

describe('GET /api/polls', function() {
  it('should return the poll', function(done) {
    chai.request(server)
    .get('/api/polls')
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json; // jshint ignore:line
    res.body.should.be.a('array');
    done();
    });
  });
});

describe('POST /api/polls', function() {
  it('should create a new poll', function(done) {
    let poll = {question:'What is for dinner', answers: ['beef', 'chicken', 'tofu']}
    chai.request(server)
    .post('/api/polls')
    .end(function(err, res) {
    res.should.have.status(200);
    res.should.be.json;
    res.body.should.be.a('array');
    done();
    });
  });
});
