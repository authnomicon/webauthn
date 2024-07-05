var SessionChallengeStore = require('passport-fido2-webauthn').SessionChallengeStore;

exports = module.exports = function() {
  // TODO: replace this with a state-based store for URL checking
  return new SessionChallengeStore();
};

exports['@singleton'] = true;
exports['@implements'] = 'module:passport-fido2-webauthn.ChallengeStore';
