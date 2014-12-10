node-subs [![NPM version](https://badge.fury.io/js/node-subs.svg)](http://badge.fury.io/js/node-subs) [![Build Status](https://travis-ci.org/Tjatse/node-subs.svg?branch=master)](https://travis-ci.org/Tjatse/node-subs)
=========

Tiny elegant, chainable, fastest literal substitution.

# Installation

```
$ npm install node-subs
```

# Usage

```javascript
var subs = require('node-subs');
subs([TEXT], [DATA], [OPTIONS]);
```

- **TEXT**
The template string.

- **DATA**
The data to be bound (Object).

- **OPTIONS**
It's optional and including:

  - **interpolate**
    The `interpolate` delimiter (RegExp), `/\$\{([^\{\}]+)\}/g` by default, it could be any others like `/\{\{([^\{\}]+)\}\}/g`.

  - **filters**
    The customized filters, see [Filters](#filters).

**Note:** see complete examples from `test` directory.

# Basic

```javascript
var r = subs('Hi, ${ name }, I am ${ whoami }', {
  name: 'peter',
  whoami: 'tjatse'
});

// r: Hi, peter, I am tjatse
```

# Pre-compile

Pre-compile will improve the performance a lot.

```javascript
var subs = Subs('Hi, ${ name | capitalize }, I am ${ whoami | upper | substr(0, 2) }');

var a = subs({
  name  : 'peter',
  whoami: 'tjatse'
});

// a: Hi, Peter, I am TJ

var b = subs({
  name  : 'KRIS',
  whoami: 'Tjatse'
});

// b: Hi, Kris, I am TJ
```

# Filters

The variable value can be modified by filters, and filters can be chained together, e.g.:

```javascript
var r = Subs('Hi, ${ name | capitalize }, I am ${ whoami | upper | substr(0, 1) }', {
  name  : 'peter',
  whoami: 'tjatse'
});

// r: Hi, Peter, I am T
```

The default filters including:

- **esc**
Backslash-escapes specific characters, like `'`, `"` and `\`, e.g. `${ VAR1 | esc }`.

- **upper**
Converts the variable value to uppercase letters, e.g. `${ VAR1 | upper }`.

- **lower**
Converts the variable value to lowercase letters, e.g. `${ VAR1 | lower }`.

- **capitalize**
Upper-cases the first letter of the variable value and lowercase the rest, e.g. `${ VAR1 | capitalize }`.

- **def**
If the variable is `null`, `undefined` or `""` (empty), the default value will be used, e.g. `${ VAR1 | def('var1_value') }`.

- **substr**
Returns the substring of variable value, uses JavaScript's built-in `String.substr()` method, e.g. `${ VAR1 | substr(3, 5) }` or `${ VAR1 | substr(7) }`.

- **replace**
Returns a new string with the matched search pattern replaced by the given replacement string, uses JavaScript's built-in `String.replace()` method, e.g. `${ VAR1 | replace('abc', 'def') }`, `${ VAR1 | replace('-\\\\w+$', '') }` or `${ VAR1 | replace('-\\\\w+$', '', 'ig') }`

## Custom Filter

If a custom filter once be defined, it could be used every where.

```javascript
// Uses `extend` to custom filter, the name must exists.
Subs.extend(function first(){
  // Just returns the value you wanna it be.
  return this.value.slice(0, 1);
});

// Defines multi filters.
Subs.extend([
  function filter1(){
    // ...
  },
  function filter2(){
    // ...
  }
])

// Or, define a filter in the options.
var r = Subs('hello, {{ name | capitalize | upper }}', {
  name: 'Joe'
}, {
  filters    : {
    first: function(){
      return this.value.slice(0, 1);
    }
  }
});
```

# Benchmark

## Normal

```
$ node benchmark/subs.js
```

```
>> plain text:
   lodash x 9,051 ops/sec ±1.84% (89 runs sampled)
   underscore x 14,426 ops/sec ±1.02% (95 runs sampled)
   node-subs x 46,001 ops/sec ±2.06% (90 runs sampled)
-- Fastest is node-subs

>> filter(1):
   lodash x 9,136 ops/sec ±1.27% (91 runs sampled)
   underscore x 14,526 ops/sec ±0.40% (98 runs sampled)
   node-subs x 40,187 ops/sec ±2.24% (91 runs sampled)
-- Fastest is node-subs

>> filter(3):
   lodash x 8,596 ops/sec ±1.51% (86 runs sampled)
   underscore x 14,456 ops/sec ±0.54% (97 runs sampled)
   node-subs x 35,504 ops/sec ±2.28% (88 runs sampled)
-- Fastest is node-subs

>> replacement(2) filter(3):
   lodash x 7,400 ops/sec ±1.50% (90 runs sampled)
   underscore x 14,146 ops/sec ±0.61% (99 runs sampled)
   node-subs x 25,755 ops/sec ±3.36% (83 runs sampled)
-- Fastest is node-subs
```

## Pre-compile

```
$ node benchmark/subs-pre.js
```

```
>> plain text:
   lodash x 327,698 ops/sec ±1.56% (98 runs sampled)
   underscore x 311,268 ops/sec ±2.00% (89 runs sampled)
   node-subs x 1,345,140 ops/sec ±0.98% (98 runs sampled)
-- Fastest is node-subs

>> filter(1):
   lodash x 331,773 ops/sec ±1.35% (97 runs sampled)
   underscore x 309,751 ops/sec ±0.67% (99 runs sampled)
   node-subs x 1,074,065 ops/sec ±0.54% (97 runs sampled)
-- Fastest is node-subs

>> filter(4):
   lodash x 287,453 ops/sec ±0.90% (95 runs sampled)
   underscore x 267,372 ops/sec ±1.62% (94 runs sampled)
   node-subs x 300,067 ops/sec ±0.52% (100 runs sampled)
-- Fastest is node-subs

>> replacement(2) filter(4):
   lodash x 178,596 ops/sec ±1.49% (98 runs sampled)
   underscore x 173,804 ops/sec ±0.38% (99 runs sampled)
   node-subs x 176,771 ops/sec ±0.34% (99 runs sampled)
-- Fastest is node-subs
```

`node-subs` is fastest!

# Test

```
$ npm test
```