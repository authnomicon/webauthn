var base64url = require('base64url');

exports = module.exports = function(store) {
  
  function challenge(req, res, next) {
    console.log('CHALLENGE...');
    
    
    store.challenge(req, function(err, challenge) {
      console.log(err);
      console.log(challenge)
      
      if (err) { return next(err); }
      res.json({ challenge: base64url.encode(challenge) });
    });
  }
  
  // TODO: JSON error handler
  
  
  return [
    challenge
  ];
};

exports['@require'] = [
  'module:passport-fido2-webauthn.ChallengeStore'
];
