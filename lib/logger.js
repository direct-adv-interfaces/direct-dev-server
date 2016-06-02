var chalk = require('chalk'),
    util = require('util');

function initLogger(color) {
    return function() {
        var args = [].slice.apply(arguments),
            msg = util.format.apply(util, args);

        console.log(color.call(chalk, msg));
    };
}

module.exports = {
    info: initLogger(chalk.white),
    hint: initLogger(chalk.gray),
    error: initLogger(chalk.red)
};
