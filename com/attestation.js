exports = module.exports = function(IoC, AuthenticatorData) {
  var attestation = require('../lib/attestation');
  
  return Promise.resolve({})
    .then(function(registry) {
      var components = IoC.components('http://i.authnomicon.org/webauthn/AttestationStatementFormat');
      return Promise.all(components.map(function(comp) { return comp.create(); } ))
        .then(function(formats) {
          formats.forEach(function(format, i) {
            var identifier = components[i].a['@identifier'];
            logger.info('Loaded attestation statement format: ' + identifier);
            registry[identifier] = format
          });
          
          return registry;
        });
    })
    .then(function(registry) {
      return {
        parse: function(buffer, parseAuthData, parseAttStmt) {
          var ao = attestation.parse(buffer);
          if (parseAuthData) {
            ao.authData = AuthenticatorData.parse(ao.authData);
          }
          
          return ao;
        }
      };
    });
};

exports['@implements'] = 'http://i.authnomicon.org/webauthn/Attestation';
exports['@require'] = [
  '!container',
  'http://i.authnomicon.org/webauthn/AuthenticatorData'
];
