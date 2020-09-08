/**
 */
exports = module.exports = function(registerHandler, verifyHandler) {
  var express = require('express');
  
  var router = new express.Router();
  router.post('/', verifyHandler);
  router.post('/registration', registerHandler);
  
  return router;
};

exports['@provides'] = 'http://i.bixbyjs.org/http/Service';
exports['@path'] = '/webauthn';
exports['@require'] = [
  './handlers/register',
  './handlers/verify'
];
