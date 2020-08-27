exports = module.exports = function() {
  
  
  return {
    parse: function(attStmt) {
      console.log('PARSE FIDO-U2F');
      console.log(attStmt);
    }
  };
};

exports['@implements'] = 'http://i.authnomicon.org/webauthn/AttestationStatementFormat';
exports['@type'] = 'fido-u2f';
