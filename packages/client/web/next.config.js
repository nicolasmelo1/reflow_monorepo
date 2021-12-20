const path = require('path')

module.exports = {
    reactStrictMode: true,
    env: {
        APP: 'web'
    },
    webpack: (config, { defaultLoaders }) => { 
        config.resolve = {
            ...config.resolve,
            alias: {
                ...config.resolve.alias,
                '@react-native-community/async-storage': 'react-native-web/dist/exports/AsyncStorage/index.js',
                '@fortawesome/react-native-fontawesome': '@fortawesome/react-fontawesome',
                './dynamicImport.mobile': './dynamicImport.web',
                "react-native": path.join(__dirname, 'node_modules', 'react-native-web'),
            },
            modules: [
                ...config.resolve.modules,
                path.resolve(__dirname, 'node_modules'),
            ],
            symlinks: false,
        }

        config.module.rules.push({
            use: defaultLoaders.babel,
            include: [path.resolve(__dirname, '..', 'shared')]
        })
        
        return config
    },
}
