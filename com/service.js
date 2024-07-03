var express = require('express');

/**
 */
exports = module.exports = function(challengeHandler, verifyHandler, registerHandler) {
  var router = new express.Router();
  router.post('/challenge', challengeHandler);
  router.post('/', verifyHandler);
  
  //router.post('/', verifyHandler);
  //router.post('/registration', registerHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/login/public-key';
exports['@require'] = [
  './handlers/challenge',
  './handlers/verify'
  
  //'./handlers/register',
  //'./handlers/verify'
];
