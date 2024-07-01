/* global describe, it */

var expect = require('chai').expect;


describe('@authnomicon/signup', function() {
  
  describe('package.json', function() {
    var json = require('../package.json');
    
    it('should have assembly metadata', function() {
      expect(json.assembly.namespace).to.equal('org.authnomicon/webauthn');
      expect(json.assembly.components).to.deep.equal([
        'attestation',
        'authenticatordata',
        'challengestore',
        'service',
        'scheme'
      ]);
    });
  });
  
  it('should throw if required', function() {
    expect(function() {
      var pkg = require('..');
    }).to.throw(Error).with.property('code', 'MODULE_NOT_FOUND');
  });
  
});
