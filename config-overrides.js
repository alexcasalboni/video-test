const rewireYAML = require('react-app-rewire-yaml');
module.exports = function override(config, env) {
    /*config.module.rules.forEach((rule) => {
        rule.exclude = [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/, /\.ya?ml$/];
    })*/
    config = rewireYAML(config, env);
    return config;
}