exports = module.exports = function() {
  var Strategy = require('passport-webauthentication');
  
  return new Strategy(function(_, cb) {
    
    console.log('SK VERIFY CALLBACK');
  });
};

exports['@implements'] = 'http://i.bixbyjs.org/http/auth/Scheme';
exports['@scheme'] = 'x-www-webauthn';
exports['@require'] = [
];
