exports = module.exports = function(IoC, AuthenticatorData) {
  var attestation = require('../../lib/webauthn/attestation');
  
  return Promise.resolve({})
    .then(function(registry) {
      var components = IoC.components('http://i.authnomicon.org/fido2/webauthn/AttestationFormat');
      return Promise.all(components.map(function(comp) { return comp.create(); } ))
        .then(function(formats) {
          formats.forEach(function(format, i) {
            var type = components[i].a['@type'];
            logger.info('Loaded attestation format: ' + type);
            registry[type] = format
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

exports['@implements'] = 'http://i.authnomicon.org/fido2/webauthn/Attestation';
exports['@require'] = [
  '!container',
  'http://i.authnomicon.org/fido2/webauthn/AuthenticatorData'
];
