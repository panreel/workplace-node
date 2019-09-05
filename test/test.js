
const chai = require('chai'),
      chai_promised = require('chai-as-promised'),
      crypto = require('crypto');

chai.use(chai_promised);      

const should = chai.should(),
      expect = chai.expect,
      assert = chai.assert;

const wp = require('./../workplace-node')

let _bad_access_token = 'EXPIRED',
    _expired_access_token = crypto.randomBytes(64).toString('hex'),
    _test_workplace_access_token = 'ACCESS_TOKEN'

describe('Workplace API', function() {
  
    describe('Token management', function() {
        it('Should set an access token when a valid token is passed', () => {
            assert.isTrue(wp.setAccessToken(_test_workplace_access_token))
        })
        it('Should reject a token when a null value is passed', () => {
            assert.isFalse(wp.setAccessToken(null));
        })
        it('Should reject a token when an empty string is passed', () => {
            assert.isFalse(wp.setAccessToken(""));
        })
        it('Should reject a token when a number is passed', () => {
        assert.isFalse(wp.setAccessToken(101));
        })
        it('Should reject a token when no value is passed', () => {
        assert.isFalse(wp.setAccessToken());
        })
  });

  describe('Get Community', function() {

    let tests = [
      {token: null, tokenType: "null", success: false, httpCode: 401},
      {token: "", tokenType: "empty string", success: false, httpCode: 401},
      {token: 111, tokenType: "number", success: false, httpCode: 401},
      {token: _bad_access_token, tokenType: "wrongly formatted", success: false, httpCode: 401},
      {token: _expired_access_token, tokenType: "non-valid OAuth", success: false, httpCode: 401}
    ]
    
    tests.forEach(test => {
      it('Should be ' + (test.success? 'successful if ' : 'rejected if ') + test.tokenType + ' token is passed', () => {
        wp.setAccessToken(test.token);
        let s = expect(wp.get.community()).to.eventually.be;
        s = test.success? s.be.fulfilled : s.be.rejected;
        s.and.has.property('httpCode', test.httpCode);
        return s;
      })
    })

    /*it('Should obtain a community object when access token is valid', function() {
      wp.setAccessToken(_test_workplace_access_token);
      return expect(wp.get.community()).to.eventually.have.property('id')
    });*/
  });

  /*describe('Get Groups', function() {
    it('Should obtain list of groups when access token is valid', function() {
      return expect(wp.get.groups.all()).to.eventually.have.property('data').that.is.an('array')
    });
  });

  describe('Get Members', function() {
    it('Should obtain list of members when access token is valid', function() {
      return expect(wp.get.members()).to.eventually.have.property('data').that.is.an('array')
    });
  });*/

});