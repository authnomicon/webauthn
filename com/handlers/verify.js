/**
 * Public key authentication handler.
 */
exports = module.exports = function(scheme, authenticator) {
  
  
  function foo(req, res, next) {
    console.log('VERIFY IT!');
    console.log(req.headers);
    console.log(req.body);
    next();
  }
  
  function go(req, res, next) {
    console.log('AUTHED!');
    console.log(req.user);
  }
  
  function goErr(err, req, res, next) {
    console.log('AUTHED ERR!');
    console.log(err);
    console.log(req.session.messages);
  }
  
  
  return [
    require('body-parser').json(),
    foo,
    authenticator.authenticate(scheme, { 
      failureMessage: true,
      failWithError: true
    }),
    go,
    goErr
  ];
};

exports['@require'] = [
  '../scheme',
  'module:passport.Authenticator'
];
