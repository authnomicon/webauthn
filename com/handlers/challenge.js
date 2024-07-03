var base64url = require('base64url');
var uuid = require('uuid').v4;

exports = module.exports = function(store) {
  
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
      var ctx = {
        user: {
          id: handle
        }
      };
      
      
      if (req.body.username) { ctx.user.name = req.body.username; }
      if (!ctx.user.name && req.body.email) {
        ctx.user.name = req.body.email;
      }
      
      if (req.body.name) { ctx.user.displayName = req.body.name; }
      if (!ctx.user.displayName && req.body.given_name) {
        ctx.user.displayName = req.body.given_name;
        if (req.body.family_name) {
          ctx.user.displayName += (' ' + req.body.family_name);
        }
      }
      
      
      store.challenge(req, ctx, function(err, challenge) {
        if (err) { return next(err); }
        var user = {
          id: base64url.encode(ctx.user.id),
          name: ctx.user.name,
          displayName: ctx.user.displayName
        };
        res.json({ user: user, challenge: base64url.encode(challenge) });
      });
    }
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
