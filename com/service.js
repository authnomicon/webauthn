/**
 */
exports = module.exports = function(challengeHandler, registerHandler, verifyHandler) {
  var express = require('express');
  
  var router = new express.Router();
  router.post('/challenge', challengeHandler);
  
  //router.post('/', verifyHandler);
  //router.post('/registration', registerHandler);
  
  return router;
};

exports['@implements'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/login/public-key';
exports['@require'] = [
  './handlers/challenge'
  
  //'./handlers/register',
  //'./handlers/verify'
];
