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
  
});
