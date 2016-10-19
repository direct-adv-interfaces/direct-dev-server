module.exports = {
    baseUrl: 'test.bundles',
    bundles: 'bundles',
    levels: ['desktop.blocks'],
    enbArgs: ['--dir', '.'],
    defaultTarget: '?.test.js',
    targets: {
        '?.js': ['js'],
        '?.test.js': ['test.js']
    }
};
