var express = require('express');

/**
 */
exports = module.exports = function(verifyHandler, challengeHandler, registerHandler) {
  var router = new express.Router();
  router.post('/', verifyHandler);
  router.post('/challenge', challengeHandler);
  
  //router.post('/', verifyHandler);
  //router.post('/registration', registerHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/login/public-key';
exports['@require'] = [
  './handlers/verify',
  './handlers/challenge'
  
  //'./handlers/register',
  //'./handlers/verify'
];
