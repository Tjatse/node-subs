var util = require('util');

module.exports = Subs;

/**
 * Literal substitution.
 * @param {String} text
 * @param {Object} data
 * @param {Object} options
 * @returns {*}
 * @constructor
 */
function Subs(text, data, options){
  // Extend options by default.
  options = util._extend({
    interpolate: /\$\{([^\{\}]+)\}/g,
    filters    : {}
  }, options || {});

  // Bind default filters.
  util._extend(options.filters, _subsFilters);

  var isString = typeof text == 'string';
  // Indicates whether th text could be substituted.
  if (isString && !options.interpolate.test(text)) {
    return text;
  }

  // Make it chainable if necessary.
  SubsChainable(options.filters);

  var fn = _wrappedText(options, text);
  if (!data) {
    // Wrap it as a function if no data is passed in.
    return fn;
  }

  return fn(data);
};

/**
 * Wrap substituted template.
 * @param {Object} options
 * @param {String} text
 * @returns {string|XML|void}
 * @private
 */
function _wrappedText(options, text){
  var fn = 'var words="";', offset = 0;

  text.replace(options.interpolate, function(match, content, position){
    // Split variable name and filters.
    var ctx = content.split('|').map(function(c){
      return c.trim();
    });
    // If there has no impaction, return it.
    if (ctx.length == 0) {
      offset = position + match.length;
      return;
    }

    var _offset = position - offset;
    if (_offset > 0) {
      fn += 'words+="' + text.substr(offset, _offset) + '";';
    }
    offset = position + match.length;

    var key = ctx.shift();

    if (!ctx.length > 0) {
      fn += 'words+=data["' + key + '"];';
    } else {
      var methods = ctx.join('.');
      methods.slice(-1) != ')' && (methods += '()');
      fn += 'words+=sf(data["' + key + '"]).' + methods + '.value;';
    }
  });

  (offset < text.length - 1) && (fn += 'words+="' + text.substr(offset) + '";');

  return new Function('sf', 'data', fn + 'return words;').bind(null, SubsFilter);
};

/**
 * Extend the filters by customized.
 * @param {Function} fn filter that be provided with a name.
 */
Subs.extend = function(fn){
  if (typeof fn != 'function' || !fn.name) {
    return;
  }
  _subsFilters[fn.name] = fn;
};

/**
 * Default filters.
 * @private
 */
var _subsFilters = {
  /**
   * Backslash-escapes specific characters, like `'`, `"` and `\`.
   * @example
   *    ${ VAR1 | esc }
   * @returns {string}
   */
  esc       : function(){
    return this.value.replace(/([\\\'\"])/g, '\\$1');
  },
  /**
   * Upper-cases the first letter of the variable value and lowercase the rest.
   * @example
   *    ${ VAR1 | capitalize }
   * @returns {string}
   */
  capitalize: function(){
    var l = this.value.length;
    if (l > 0) {
      return this.value[0].toUpperCase() + (l > 1 ? this.value.substr(1).toLowerCase() : '');
    }
  },
  /**
   * Converts the variable value to uppercase letters
   * @example
   *    ${ VAR1 | upper }
   * @returns {string}
   */
  upper     : function(){
    return this.value.toUpperCase();
  },
  /**
   * Converts the variable value to lowercase letters.
   * @example
   *    ${ VAR1 | lower }
   * @returns {string}
   */
  lower     : function(){
    return this.value.toLowerCase();
  },
  /**
   * If the variable is `null`, `undefined` or `""` (empty), the default value will be used.
   * @example
   *    ${ VAR1 | def('var1_value') }
   * @param {String} text the default text.
   * @returns {*}
   */
  def       : function(text){
    return this.value.length == 0 ? text : this.value;
  },
  /**
   * Returns a new string with the matched search pattern replaced by the given replacement string,
   * uses JavaScript's built-in `String.replace()` method.
   * @examples
   *    ${ VAR1 | replace('abc', 'def') }
   *    ${ VAR1 | replace('-\\\\w+$', '') }
   *    ${ VAR1 | replace('-\\\\w+$', '', 'ig') }
   * @param {String} re
   * @param {String} text
   * @param {String} flags
   * @returns {string}
   */
  replace   : function(re, text, flags){
    return this.value.replace(new RegExp(re, flags || 'g'), text)
  },
  /**
   * Returns the substring of variable value, uses JavaScript's built-in `String.substr()` method.
   * @examples
   *    ${ VAR1 | substr(3, 5) }
   *    ${ VAR1 | substr(7) }
   * @returns {*|string}
   */
  substr    : function(){
    return String.prototype.substr.apply(this.value, arguments);
  }
};

/**
 * Filters of substitutions.
 * @param {String} val
 * @returns {SubsFilter}
 * @constructor
 */
function SubsFilter(val){
  if (!(this instanceof SubsFilter)) {
    return new SubsFilter(val);
  }
  // store value.
  this.value = val;
};

/**
 * Make it chainable.
 * @param {Object} fts filters.
 * @constructor
 */
function SubsChainable(fts){
  var filters = {};
  // Skips defined.
  for (var k in fts) {
    (typeof SubsFilter.prototype[k] == 'undefined') && (filters[k] = fts[k]);
  }
  // Returns if no new filter.
  if (Object.keys(filters).length == 0) {
    return;
  }

  /**
   * In order to make the function / object in a chained mode.
   * @param {Boolean} store
   * @returns {{}}
   */
  function wrapProtos(store){
    var ps = {};
    Object.keys(filters).forEach(function(key){
      ps[key] = {
        get: function(){
          return build(this.value, (store ? this._filters : []).concat(key));
        }
      };
    });
    return ps;
  }

  // __proto__
  var proto = Object.defineProperties(function P(){
  }, wrapProtos(true));

  /**
   * Build chain.
   * @param {String} val
   * @param {Array} _filters
   * @returns {Function}
   */
  function build(val, _filters){
    var builder = function(){
      return applyFilter.apply(builder, arguments);
    };

    builder.value = val;
    builder._filters = _filters;
    builder.__proto__ = proto;
    return builder;
  }

  /**
   * Apply filter.
   * @returns {applyFilter}
   */
  function applyFilter(){
    for(var i = 0; i < this._filters.length; i++){
      this.value = filters[this._filters[i]].apply(this, arguments);
    }
    this._filters = [];
    return this;
  }

  // Bind filters to SubsFilter and finally make them chainable.
  Object.defineProperties(SubsFilter.prototype, wrapProtos());
};
