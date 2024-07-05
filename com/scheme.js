var Strategy = require('passport-fido2-webauthn').Strategy;

exports = module.exports = function(store, keys, directory) {
  
  return new Strategy({ store: store },
    function verify(id, userHandle, flags, cb) {
      console.log('WEBAUTHN VERIFY CALLBACK');
      console.log(id);
      console.log(userHandle);
      console.log(flags)
      
      keys.find(id, function(err, key, user) {
        console.log('FOUND KEY: ');
        console.log(err);
        console.log(key);
        console.log(user);
        
        if (err) { return cb(err); }
        if (!key) { return cb(null, false, { message: 'Invalid key. '}); }
        
        directory.read(user.id, function(err, user) {
          if (err) { return cb(err); }
          if (!user) { return cb(null, false, { message: 'Invalid key. '}); }
          
          console.log('READ USER');
          console.log(user)
          
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
      console.log('WEBAUTHN REGISTER CALLBACK');
      console.log(user);
      console.log(id);
      console.log(publicKey);
      console.log(flags);
      console.log(signCount);
      
      var key = {
        id: id,
        publicKey: publicKey
      }
      
      var u = {
        handle: user.id,
        name: { givenName: 'Alice' } // TODO: user properties from user
      }
      
      directory.create(u, function(err, user) {
        console.log('CREATED USER: ');
        console.log(err);
        console.log(key)
        console.log(user);
      
        keys.add(key, user, function(err, key) {
          console.log('CREATED KEY: ');
          console.log(err);
          console.log(key);
        
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
