/* global describe, it, expect */

var expect = require('chai').expect;
var chai = require('chai');
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../com/handlers/challenge');


describe('handlers/challenge', function() {
  
  it('should create handler', function() {
    var bodyParserSpy = sinon.spy();
    var factory = $require('../../com/handlers/challenge', {
      'body-parser': { json: bodyParserSpy },
    });
    
    var store = new Object();
    var handler = factory(store);
    
    expect(handler).to.be.an('array');
    expect(bodyParserSpy).to.be.calledOnce;
  });
  
  describe('handler', function() {
    
    it('should generate challenge', function(done) {
      var store = new Object();
      store.challenge = sinon.stub().yieldsAsync(null, Buffer.from([21, 31, 105]))


      var handler = factory(store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.method = 'POST';
        })
        .finish(function() {
          expect(store.challenge).to.have.been.calledOnceWith(this.req);
          
          expect(this.statusCode).to.equal(200);
          expect(this.getHeader('Content-Type')).to.equal('application/json');
          expect(this.body).to.deep.equal({
            challenge: 'FR9p'
          })
          done();
        })
        .listen();
    });
    
  });
  
});
