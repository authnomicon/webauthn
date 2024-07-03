/**
 * Public key authentication handler.
 */
exports = module.exports = function(scheme, authenticator) {
  
  function resume(req, res, next) {
    // TODO: figure out how to do redirects here from JSON responses with state
    next();
  }
  
  function redirect(req, res, next) {
    console.log('AUTHED!');
    console.log(req.user);
    
    // TODO: figure out how to do redirects here from JSON responses with state
    
    res.json({ ok: true, location: '/' });
  }
  
  // TODO: error handler
  
  function errorHandler(err, req, res, next) {
    console.log('AUTHED ERR!');
    console.log(err);
    console.log(req.session.messages);
  }
  
  
  return [
    require('body-parser').json(),
    authenticator.authenticate(scheme, { 
      failureMessage: true,
      failWithError: true
    }),
    resume,
    redirect,
    errorHandler
  ];
};

exports['@require'] = [
  '../scheme',
  'module:passport.Authenticator'
];
