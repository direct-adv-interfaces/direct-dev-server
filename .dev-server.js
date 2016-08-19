module.exports = {
    remoteHost: 'ppcdev',
    bundles: 'bundles',
    levels: ['desktop.blocks'],
    defaultTarget: '?.test.js',
    targets: {
        '?.js': ['js'],
        '?.test.js': ['test.js']
    }
};
