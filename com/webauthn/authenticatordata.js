exports = module.exports = function() {
  return require('../../lib/webauthn/authenticatordata');
};

exports['@implements'] = 'http://i.authnomicon.org/fido2/webauthn/AuthenticatorData';
exports['@require'] = [];
