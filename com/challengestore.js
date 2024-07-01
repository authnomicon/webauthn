var SessionChallengeStore = require('passport-fido2-webauthn').SessionChallengeStore;

exports = module.exports = function() {
  return new SessionChallengeStore();
};

exports['@singleton'] = true;
exports['@implements'] = 'module:passport-fido2-webauthn.ChallengeStore';
