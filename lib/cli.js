'use strict'

var program = require('commander'),
    start = require('./start');

// parse args
program
    .option('-b, --bundle [bundle]', 'bundle name (required)')
    .option('-p, --port [port]', 'web server port defaulting to 3000', parseInt)
    .parse(process.argv);

if (!program.bundle) {
    throw new Error('Required parameter "bundle" is missed');
}

// go!
start(program.bundle, program.port || 3000);
