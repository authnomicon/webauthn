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
  
});
