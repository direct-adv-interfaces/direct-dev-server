'use strict'

var program = require('commander'),
    start = require('./start');

// parse args
program
    .option('-b, --bundle [bundle]', 'bundle name (required)')
    .option('-p, --port [port]', 'web server port (3000 by default)', parseInt)
    .option('-h, --host [host]', 'web server host (localhost by default)')
    .option('-d, --display-host [dhost]', 'display host')
    .option('-t, --target [target]', 'default target')
    .parse(process.argv);

if (!program.bundle) {
    throw new Error('Required parameter "bundle" is missed');
}

// go!
start(
    program.bundle,
    program.port || 3000,
    program.host || 'localhost',
    program.displayHost,
    program.target
);
