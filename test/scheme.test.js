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
  
  describe('Strategy', function() {
    
    describe('verify', function() {
      
      it('should authenticate user with registered key', function(done) {
        var store = new Object();
        var keys = new Object();
        keys.find = sinon.stub().yieldsAsync(null, { publicKey: '-----BEGIN PUBLIC KEY-----' }, { id: '248289761001' });
        var directory = new Object();
        directory.read = sinon.stub().yieldsAsync(null, { id: '248289761001', username: 'alexm' });
      
        var StrategySpy = sinon.spy(Strategy);
        var factory = $require('../com/scheme', {
          'passport-fido2-webauthn': { Strategy: StrategySpy }
        });
        
        var scheme = factory(store, keys, directory);
      
        var verify = StrategySpy.args[0][1];
        verify('BA44712732CE', Buffer.from([21, 31, 105]), { userPresent: true, userVerified: false }, function(err, user, key, info) {
          if (err) { return done(err); }
          
          expect(keys.find).to.have.been.calledOnceWith('BA44712732CE');
          expect(directory.read).to.have.been.calledOnceWith('248289761001');
          expect(user).to.deep.equal({
            id: '248289761001',
            username: 'alexm'
          });
          expect(key).to.equal('-----BEGIN PUBLIC KEY-----');
          expect(info).to.be.undefined;
          done();
        });
      }); // should authenticate user with registered key
    
    }); // verify
    
    describe('register', function() {
      
    }); // register
    
  }); // Strategy
  
});
