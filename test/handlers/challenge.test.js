/* global describe, it, expect */

var expect = require('chai').expect;
var chai = require('chai');
var $require = require('proxyquire');
var sinon = require('sinon');
var factory = require('../../com/handlers/challenge');
var base64url = require('base64url');


describe('handlers/challenge', function() {
  
  it('should create handler', function() {
    var bodyParserSpy = sinon.spy();
    var factory = $require('../../com/handlers/challenge', {
      'multer': function() { return { none: bodyParserSpy } },
    });
    
    var store = new Object();
    var handler = factory(store);
    
    expect(handler).to.be.an('array');
    expect(bodyParserSpy).to.be.calledOnce;
  });
  
  describe('handler', function() {
    
    it('should generate challenge for authentication', function(done) {
      var store = new Object();
      store.challenge = sinon.stub().yieldsAsync(null, Buffer.from([21, 31, 105]))

      var handler = factory(store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.method = 'POST';
          req.body = {};
        })
        .finish(function() {
          expect(store.challenge).to.have.been.calledOnceWith(this.req);
          
          expect(this.statusCode).to.equal(200);
          expect(this.getHeader('Content-Type')).to.equal('application/json');
          expect(this.body).to.deep.equal({
            challenge: 'FR9p'
          })
          done();
        })
        .listen();
    });
    
    it('should generate challenge for registration', function(done) {
      var store = new Object();
      store.challenge = sinon.stub().yieldsAsync(null, Buffer.from([21, 31, 105]));
      
      var handler = factory(store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.method = 'POST';
          req.body = {
            type: 'webauthn.create',
            username: 'alexm',
            name: 'Alex Müller'
          }
        })
        .finish(function() {
          expect(store.challenge).to.have.been.calledOnceWith(this.req);
          var ctx = store.challenge.getCall(0).args[1];
          expect(ctx.user.id).to.be.an.instanceOf(Buffer);
          var handle = ctx.user.id;
          delete ctx.user.id;
          expect(ctx).to.deep.equal({
            user: {
              name: 'alexm',
              displayName: 'Alex Müller'
            }
          });
          
          expect(this.statusCode).to.equal(200);
          expect(this.getHeader('Content-Type')).to.equal('application/json');
          expect(this.body.challenge).to.equal('FR9p');
          var user = this.body.user;
          expect(user.id).to.be.a('string');
          expect(user.id).to.equal(base64url.encode(handle));
          delete user.id;
          expect(user).to.deep.equal({
            name: 'alexm',
            displayName: 'Alex Müller'
          });
          done();
        })
        .listen();
    }); // should generate challenge for registration
    
    it('should generate challenge for registration with email', function(done) {
      var store = new Object();
      store.challenge = sinon.stub().yieldsAsync(null, Buffer.from([21, 31, 105]));
      
      var handler = factory(store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.method = 'POST';
          req.body = {
            type: 'webauthn.create',
            name: 'Alex Müller',
            email: 'alex.mueller@example.com'
          }
        })
        .finish(function() {
          expect(store.challenge).to.have.been.calledOnceWith(this.req);
          var ctx = store.challenge.getCall(0).args[1];
          expect(ctx.user.id).to.be.an.instanceOf(Buffer);
          var handle = ctx.user.id;
          delete ctx.user.id;
          expect(ctx).to.deep.equal({
            user: {
              name: 'alex.mueller@example.com',
              displayName: 'Alex Müller'
            }
          });
          
          expect(this.statusCode).to.equal(200);
          expect(this.getHeader('Content-Type')).to.equal('application/json');
          expect(this.body.challenge).to.equal('FR9p');
          var user = this.body.user;
          expect(user.id).to.be.a('string');
          expect(user.id).to.equal(base64url.encode(handle));
          delete user.id;
          expect(user).to.deep.equal({
            name: 'alex.mueller@example.com',
            displayName: 'Alex Müller'
          });
          done();
        })
        .listen();
    }); // should generate challenge for registration with email
    
    it('should generate challenge for registration with username in preference to email', function(done) {
      var store = new Object();
      store.challenge = sinon.stub().yieldsAsync(null, Buffer.from([21, 31, 105]));
      
      var handler = factory(store);
      
      chai.express.use(handler)
        .request(function(req, res) {
          req.method = 'POST';
          req.body = {
            type: 'webauthn.create',
            username: 'alexm',
            name: 'Alex Müller',
            email: 'alex.mueller@example.com'
          }
        })
        .finish(function() {
          expect(store.challenge).to.have.been.calledOnceWith(this.req);
          var ctx = store.challenge.getCall(0).args[1];
          expect(ctx.user.id).to.be.an.instanceOf(Buffer);
          var handle = ctx.user.id;
          delete ctx.user.id;
          expect(ctx).to.deep.equal({
            user: {
              name: 'alexm',
              displayName: 'Alex Müller'
            }
          });
          
          expect(this.statusCode).to.equal(200);
          expect(this.getHeader('Content-Type')).to.equal('application/json');
          expect(this.body.challenge).to.equal('FR9p');
          var user = this.body.user;
          expect(user.id).to.be.a('string');
          expect(user.id).to.equal(base64url.encode(handle));
          delete user.id;
          expect(user).to.deep.equal({
            name: 'alexm',
            displayName: 'Alex Müller'
          });
          done();
        })
        .listen();
    }); // should generate challenge for registration with username in preference to email
    
  }); // handler
  
});
