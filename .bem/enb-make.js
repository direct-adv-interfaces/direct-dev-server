module.exports = function(config) {

    config.node('bundles/index', function(nodeConfig) {
        nodeConfig.addTechs(
            [
                [require('enb-bem-techs/techs/levels'), { levels: ['desktop.blocks'] }],
                [require('enb/techs/file-provider'), { target: '?.bemdecl.js' }],
                require('enb-bem-techs/techs/deps'),
                require('enb-bem-techs/techs/files'),
                [require('enb-js/techs/browser-js'), { target: '?.test.js', sourceSuffixes: ['test.js'] }],
                [require('enb-js/techs/browser-js'), { target: '?.js', sourceSuffixes: ['js'] }]
            ]);

        //nodeConfig.addTargets(['?.test.js']);
    });
};
