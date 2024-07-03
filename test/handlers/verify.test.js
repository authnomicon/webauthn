/* global describe, it, expect */

var expect = require('chai').expect;
var chai = require('chai');
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../com/handlers/verify');
var base64url = require('base64url');


describe('handlers/verify', function() {
  
  it('should create handler', function() {
    var bodyParserSpy = sinon.spy();
    var factory = $require('../../com/handlers/verify', {
      'body-parser': { json: bodyParserSpy },
    });
    
    var scheme = new Object();
    var authenticator = new Object();
    authenticator.authenticate = sinon.spy();
    var handler = factory(scheme, authenticator);
    
    expect(handler).to.be.an('array');
    expect(bodyParserSpy).to.be.calledOnce;
    expect(bodyParserSpy).to.be.calledBefore(authenticator.authenticate);
    expect(authenticator.authenticate).to.be.calledOnce;
    expect(authenticator.authenticate).to.be.calledWith(scheme);
  });
  
  describe('handler', function() {
    
    var mockAuthenticator = new Object();
    mockAuthenticator.authenticate = function(name, options) {
      return function(req, res, next) {
        req.user = { id: '248289761001', displayName: 'Jane Doe' };
        next();
      };
    };
    
    
    it('should redirect', function(done) {
      var handler = factory(undefined, mockAuthenticator);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.method = 'POST';
          req.body = {
            id: '...',
            response: {
              clientDataJSON: '...',
              authenticatorData: '...',
              signature: '...'
            }
          };
        })
        .finish(function() {
          expect(this.req.user).to.deep.equal({
            id: '248289761001',
            displayName: 'Jane Doe'
          });
          
          expect(this.statusCode).to.equal(200);
          expect(this.getHeader('Content-Type')).to.equal('application/json');
          expect(this.body).to.deep.equal({
            ok: true,
            location: '/'
          });
          done();
        })
        .listen();
    }); // should redirect
    
  }); // handler
  
});
