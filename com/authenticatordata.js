exports = module.exports = function() {
  return require('../lib/authenticatordata');
};

exports['@implements'] = 'http://i.authnomicon.org/webauthn/AuthenticatorData';
exports['@require'] = [];
