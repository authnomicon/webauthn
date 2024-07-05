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
      
      it('should register user and key', function(done) {
        var store = new Object();
        var keys = new Object();
        keys.add = sinon.stub().yieldsAsync(null, { publicKey: '-----BEGIN PUBLIC KEY-----' });
        var directory = new Object();
        directory.create = sinon.stub().yieldsAsync(null, { id: '248289761001', username: 'alexm' });
      
        var StrategySpy = sinon.spy(Strategy);
        var factory = $require('../com/scheme', {
          'passport-fido2-webauthn': { Strategy: StrategySpy }
        });
        
        var scheme = factory(store, keys, directory);
      
      
        var user = {
          handle: '7ypGnMPYQn2UnzE7Z+Dsgw==',
          username: 'alexm',
          displayName: 'Alex Müller'
        }
      
        var register = StrategySpy.args[0][2];
        register(user, 'BA44712732CE', '-----BEGIN PUBLIC KEY-----', { userPresent: true, userVerified: false }, 0, [ 'internal' ], function(err, user, info) {
          if (err) { return done(err); }
          
          
          expect(directory.create).to.have.been.calledOnceWith({
            handle: Buffer.from([0xef, 0x2a, 0x46, 0x9c, 0xc3, 0xd8, 0x42, 0x7d, 0x94, 0x9f, 0x31, 0x3b, 0x67, 0xe0, 0xec, 0x83]),
            username: 'alexm',
            displayName: 'Alex Müller'
          });
          expect(keys.add).to.have.been.calledOnceWith({
            id: 'BA44712732CE',
            publicKey: '-----BEGIN PUBLIC KEY-----',
            signCount: 0,
            backupEligible: undefined,
            backedUp: undefined,
            transports: [ 'internal' ]
          }, {
            id: '248289761001',
            username: 'alexm'
          });
          expect(user).to.deep.equal({
            id: '248289761001',
            username: 'alexm'
          });
          expect(info).to.be.undefined;
          done();
        });
      }); // should register user and key
      
    }); // register
    
  }); // Strategy
  
});
