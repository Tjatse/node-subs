var Subs   = require('../'),
    chai   = require('chai'),
    expect = chai.expect,
    should = chai.should();

describe('custom interpolate', function(){

  describe('when uses /\{\{([^\{\}]+)\}\}/g', function(){
    it('should works fine', function(){
      var r = Subs('hi, {{ name | capitalize }}', {
        name: 'tjatse'
      }, {
        interpolate: /\{\{([^\{\}]+)\}\}/g
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, Tjatse');
    })
  });
});