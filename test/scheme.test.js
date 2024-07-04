/* global describe, it, expect */

var $require = require('proxyquire');
var expect = require('chai').expect;
var sinon = require('sinon');
var factory = require('../com/scheme');
var Strategy = require('passport-fido2-webauthn');


describe('scheme', function() {
  
  it('should be annotated', function() {
    expect(factory['@singleton']).to.be.undefined;
    expect(factory['@implements']).to.be.undefined;
  });
  
  it('should construct Strategy', function() {
    var StrategySpy = sinon.spy(Strategy);
    var factory = $require('../com/scheme', {
      'passport-fido2-webauthn': { Strategy: StrategySpy }
    });
    
    var store = new Object();
    var scheme = factory(store);
    
    expect(StrategySpy).to.have.been.calledOnce;
    expect(StrategySpy).to.have.been.calledWithNew;
    expect(StrategySpy).to.have.been.calledWith({ store: store });
    expect(scheme).to.be.an.instanceOf(Strategy);
  });
  
});
