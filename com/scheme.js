var Strategy = require('passport-fido2-webauthn').Strategy;

exports = module.exports = function(store, keys, directory) {
  
  return new Strategy({ store: store },
    function verify(id, userHandle, flags, cb) {
      keys.find(id, function(err, key, user) {
        if (err) { return cb(err); }
        if (!key) { return cb(null, false, { message: 'Invalid key. '}); }
        
        directory.read(user.id, function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false, { message: 'Invalid key. '}); }
          
          // TODO: how should userHandle be checked?
          //if (Buffer.compare(row.handle, userHandle) != 0) {
          //if (userHandle && Buffer.compare(row.handle, userHandle) != 0) {
          //  return cb(null, false, { message: 'Invalid key. '});
          //}
          return cb(null, user, key.publicKey);
        });
      });
    },
    function register(user, id, publicKey, flags, signCount, transports, cb) {
      user.handle = Buffer.from(user.handle, 'base64');
      
      directory.create(user, function(err, user) {
        if (err) { return cb(err); }
      
        var key = {
          id: id,
          publicKey: publicKey,
          signCount: signCount,
          backupEligible: flags.backupEligible,
          backedUp: flags.backedUp,
          transports: transports
        };
        keys.add(key, user, function(err, key) {
          if (err) { return cb(err); }
          return cb(null, user);
        });
      });
    }
  );
};

exports['@require'] = [
  'module:passport-fido2-webauthn.ChallengeStore',
  'module:@authnomicon/credentials.PublicKeyStore',
  'module:@authnomicon/core.Directory'
];
