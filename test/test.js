
const chai = require('chai'),
      chai_promised = require('chai-as-promised');

chai.use(chai_promised);      

const should = chai.should(),
      expect = chai.expect,
      assert = chai.assert;

const wp = require('./../workplace-node')

let _test_workplace_access_token = 'ACCESS_TOKEN'

describe('Workplace API', function() {
  
    describe('Token management', function() {
        it('Should set an access token when a valid token is passed', function() {
            assert.isTrue(wp.setAccessToken(_test_workplace_access_token))
        })
        it('Should reject a token when a null value is passed', function() {
            assert.isFalse(wp.setAccessToken(null));
        })
        it('Should reject a token when an empty string is passed', function() {
            assert.isFalse(wp.setAccessToken(""));
        })
        it('Should reject a token when a number is passed', function() {
        assert.isFalse(wp.setAccessToken(101));
        })
        it('Should reject a token when no value is passed', function() {
        assert.isFalse(wp.setAccessToken());
        })
  });

  describe('Get Community', function() {
    it('Should obtain a community object when access token is valid', function() {
      return expect(wp.get.community()).to.eventually.have.property('id')
    });
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