var base64url = require('base64url');
var uuid = require('uuid').v4;
var merge = require('utils-merge');

exports = module.exports = function(store) {
  
  // TODO: validate body
  
  function challenge(req, res, next) {
    var type = req.body.type || 'webauthn.get';
    
    if (type == 'webauthn.get') {
      store.challenge(req, function(err, challenge) {
        if (err) { return next(err); }
        res.json({ challenge: base64url.encode(challenge) });
      });
    } else if (type == 'webauthn.create') {
      var handle = Buffer.alloc(16);
      handle = uuid({}, handle);
      
      var data = {}
      merge(data, req.body);
      data.handle = handle.toString('base64');
      delete data.type;
      
      store.challenge(req, { user: data }, function(err, challenge) {
        if (err) { return next(err); }
        
        var user = {
          id: base64url.encode(handle)
        };
        if (req.body.username) { user.name = req.body.username; }
        if (!user.name && req.body.email) {
          user.name = req.body.email;
        }
        if (req.body.name) { user.displayName = req.body.name; }
        if (!user.displayName && req.body.given_name) {
          user.displayName = req.body.given_name;
          if (req.body.family_name) {
            user.displayName += (' ' + req.body.family_name);
          }
        }
        res.json({ user: user, challenge: base64url.encode(challenge) });
      });
    }
    
    // TODO: invalid type error
  }
  
  // TODO: JSON error handler
  
  
  return [
    require('multer')().none(),
    challenge
  ];
};

exports['@require'] = [
  'module:passport-fido2-webauthn.ChallengeStore'
];
