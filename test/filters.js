var Subs   = require('../'),
    chai   = require('chai'),
    expect = chai.expect,
    should = chai.should();

describe('filter usage', function(){

  describe('def', function(){
    it('should returns the default value if variable does not exist', function(){
      var r = Subs('hi, ${ name | def("eva") }', {
        name1: 'tjatse'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, eva');
    })
  });

  describe('esc', function(){
    it('should backslash-escapes specific characters', function(){
      var r = Subs('hi, ${ name | esc }', {
        name: 'O\'Neal'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, O\\\'Neal');
    })
  });

  describe('upper', function(){
    it('should converts the variable value to uppercase letters', function(){
      var r = Subs('hi, ${ name | upper }', {
        name: 'tjatse'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, TJATSE');
    })
  });

  describe('lower', function(){
    it('should converts the variable value to lowercase letters', function(){
      var r = Subs('hi, ${ name | lower }', {
        name: 'TJATSE'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, tjatse');
    })
  });

  describe('capitalize', function(){
    it('should upper-cases the first letter of the variable value and lowercase the rest', function(){
      var r = Subs('hi, ${ name | capitalize }', {
        name: 'TJATSE'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, Tjatse');
    })
  });

  describe('substr', function(){
    it('should returns the substring of variable value', function(){
      var r = Subs('hi, ${ name | substr(0, 2) }', {
        name: 'Tjatse'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, Tj');
    })
  });

  describe('replace(String)', function(){
    it('should returns a new string with the matched search pattern replaced by the given replacement string', function(){
      var r = Subs('hi, ${ name | replace("Chinese", "China") }', {
        name: 'Chinese'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, China');
    })
  });

  describe('replace(RegExp)', function(){
    it('should returns a new string with the matched search pattern replaced by the given replacement string', function(){
      var r = Subs('hi, ${ name | replace("^\\w+-", "", "ig") }', {
        name: 'China-Beijing'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, Beijing');
    })
  });

  describe('chainable', function(){
    it('should works fine', function(){
      var r = Subs('hi, ${ name | def("China-Beijing") | upper | lower | capitalize | substr(3) | replace("^\\w+-", "", "ig") }', {

      });
      expect(r).is.an('string');
      expect(r).eqls('hi, beijing');
    })
  });

  describe('custom (extend)', function(){
    before(function(){
      Subs.extend(function upperFirst(){
        return this.value.split(' ').map(function(v){
          var l = v.length;
          if (l > 0) {
            return v[0].toUpperCase() + (l > 1 ? v.substr(1).toLowerCase() : '');
          }
        }).join(' ');
      })
    });

    it('should works fine', function(){
      var r = Subs('hi, ${ name | upperFirst }', {
        name: 'jimmy brandon'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, Jimmy Brandon');
    });

    it('and should be used again', function(){
      var r = Subs('hi, ${ name | upperFirst }', {
        name: 'tony misky'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, Tony Misky');
    });
  });

  describe('custom (option)', function(){
    it('should works fine', function(){
      var r = Subs('hi, ${ name | first }', {
        name: 'Tjatse'
      }, {
        filters: {
          first: function(){
            return this.value.slice(0, 1);
          }
        }
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, T');
    });

    it('and should be used again', function(){
      var r = Subs('hi, ${ name | first }', {
        name: 'Michael'
      });
      expect(r).is.an('string');
      expect(r).eqls('hi, M');
    });
  });

});