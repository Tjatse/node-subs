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
var pres1 = {
  _   : _.template('hello, <%= LOGNAME %>!'),
  __  : __.template('hello, <%= LOGNAME %>!'),
  subs: Subs('hello, ${ LOGNAME }!')
};
(new Benchmark.Suite)
  .add('lodash', function(){
    pres1._(process.env);
  })
  .add('underscore', function(){
    pres1.__(process.env);
  })
  .add('node-subs', function(){
    pres1.subs(process.env);
  })
  .on('cycle', cycle)
  .on('complete', complete)
  .run();

console.log('>>', 'filter(1):');
var pres2 = {
  _   : _.template('hello, <%= LOGNAME.toUpperCase() %>!'),
  __  : __.template('hello, <%= LOGNAME.toUpperCase() %>!'),
  subs: Subs('hello, ${ LOGNAME | upper }!')
};
(new Benchmark.Suite)
  .add('lodash', function(){
    pres2._(process.env);
  })
  .add('underscore', function(){
    pres2.__(process.env);
  })
  .add('node-subs', function(){
    pres2.subs(process.env);
  })
  .on('cycle', cycle)
  .on('complete', complete)
  .run();

console.log('>>', 'filter(4):');
var pres3 = {
  _   : _.template('hello, <%= LOGNAME.toUpperCase().toLowerCase().substr(0, 3).replace("t", "T") %>!'),
  __  : __.template('hello, <%= LOGNAME.toUpperCase().toLowerCase().substr(0, 3).replace("t", "T") %>!'),
  subs: Subs('hello, ${ LOGNAME | upper | lower | substr(0, 3) | replace("t", "T") }!')
};

(new Benchmark.Suite)
  .add('lodash', function(){
    pres3._(process.env);
  })
  .add('underscore', function(){
    pres3.__(process.env);
  })
  .add('node-subs', function(){
    pres3.subs(process.env);
  })
  .on('cycle', cycle)
  .on('complete', complete)
  .run();

var pres4 = {
  _   : _.template('hello, <%= LOGNAME.toUpperCase().toLowerCase().substr(0, 3).replace("t", "T") %>, lang <%= LANG.toUpperCase().toLowerCase().substr(0, 3).replace("-", "") %>!'),
  __  : __.template('hello, <%= LOGNAME.toUpperCase().toLowerCase().substr(0, 3).replace("t", "T") %>, lang <%= LANG.toUpperCase().toLowerCase().substr(0, 3).replace("-", "") %>!'),
  subs: Subs('hello, ${ LOGNAME | upper | lower | substr(0, 3) | replace("t", "T") }, lang ${ LANG | upper | lower | substr(0, 3) | replace("-", "") }!')
};
console.log(pres4.subs(process.env));
(new Benchmark.Suite)
  .add('lodash', function(){
    pres4._(process.env);
  })
  .add('underscore', function(){
    pres4.__(process.env);
  })
  .add('node-subs', function(){
    pres4.subs(process.env);
  })
  .on('cycle', cycle)
  .on('complete', complete)
  .run();