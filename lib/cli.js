'use strict'

var program = require('commander'),
    start = require('./start');

// parse args
program
    .arguments('<bundle>')
      .action(function (bundle) {
          if (!bundle) {
              throw new Error('Required parameter "bundle" is missed');
          } else {
              this.bundle = bundle;
          }
      })
    .option('-p, --port [port]', 'web server port defaulting to 3000', parseInt)
    .parse(process.argv);

// go!
start(program.bundle, program.port || 3000);
