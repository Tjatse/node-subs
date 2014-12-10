var _         = require('lodash'),
    __        = require('underscore'),
    Subs      = require('../'),
    Benchmark = require('benchmark').Benchmark;

function cycle(event){
  console.log('  ', String(event.target));
}
function complete(){
  console.log('--', 'Fastest is ' + this.filter('fastest').pluck('name'), '\n')
}
console.log('>>', 'plain text:');
(new Benchmark.Suite)
  .add('lodash', function(){
    _.template('hello, <%= LOGNAME %>!', process.env);
  })
  .add('underscore', function(){
    __.template('hello, <%= LOGNAME %>!', process.env);
  })
  .add('node-subs', function(){
    Subs('hello, ${ LOGNAME }!', process.env);
  })
  .on('cycle', cycle)
  .on('complete', complete)
  .run();

console.log('>>', 'filter(1):');
(new Benchmark.Suite)
  .add('lodash', function(){
    _.template('hello, <%= LOGNAME.toLowerCase() %>!', process.env);
  })
  .add('underscore', function(){
    __.template('hello, <%= LOGNAME.toLowerCase() %>!', process.env);
  })
  .add('node-subs', function(){
    Subs('hello, ${ LOGNAME | lower }!', process.env);
  })
  .on('cycle', cycle)
  .on('complete', complete)
  .run();

console.log('>>', 'filter(3):');
(new Benchmark.Suite)
  .add('lodash', function(){
    _.template('hello, <%= LOGNAME.toLowerCase().toUpperCase().substr(0, 4) %>!', process.env);
  })
  .add('underscore', function(){
    __.template('hello, <%= LOGNAME.toLowerCase().toUpperCase().substr(0, 4) %>!', process.env);
  })
  .add('node-subs', function(){
    Subs('hello, ${ LOGNAME | lower | upper | substr(0, 4) }!', process.env);
  })
  .on('cycle', cycle)
  .on('complete', complete)
  .run();

console.log('>>', 'replacement(2) filter(3):');
(new Benchmark.Suite)
  .add('lodash', function(){
    _.template('hello, <%= LOGNAME.toLowerCase().toUpperCase().substr(0, 4) %>, lang: <%= LANG.toLowerCase().toUpperCase().substr(0, 4) %>!', process.env);
  })
  .add('underscore', function(){
    __.template('hello, <%= LOGNAME.toLowerCase().toUpperCase().substr(0, 4) %>, lang: <%= LANG.toLowerCase().toUpperCase().substr(0, 4) %>!', process.env);
  })
  .add('node-subs', function(){
    Subs('hello, ${ LOGNAME | lower | upper | substr(0, 4) }, lang: ${ LANG | lower | upper | substr(0, 4) }!', process.env);
  })
  .on('cycle', cycle)
  .on('complete', complete)
  .run();
