exports = module.exports = function() {
  var webauthn = require('passport-webauthentication').webauthn;
  
  return webauthn.AuthenticatorData;
};

exports['@singleton'] = true;
exports['@implements'] = 'http://i.authnomicon.org/webauthn/AuthenticatorData';
exports['@require'] = [];
