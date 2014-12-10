var Subs   = require('../'),
    chai   = require('chai'),
    expect = chai.expect,
    should = chai.should();

describe('basic usage', function(){

  describe('when substituting with invalid text', function(){
    it('should substitutes nothing', function(){
      var r = Subs('hi, ${ name', {
        name: 'tjatse'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, ${ name');
    })
  });

  describe('when substituting without filter(1)', function(){
    it('should works fine', function(){
      var r = Subs('hi, ${ name }', {
        name: 'tjatse'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, tjatse');
    })
  });

  describe('when substituting without filter(2)', function(){
    it('should works fine', function(){
      var r = Subs('hi, ${ name }, I am ${ whoami }', {
        name  : 'eva',
        whoami: 'tjatse'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, eva, I am tjatse');
    })
  });

});