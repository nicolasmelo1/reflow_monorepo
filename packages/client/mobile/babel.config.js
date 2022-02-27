module.exports = function(api) {
    api.cache(true)
    // Reference: https://docs.expo.dev/guides/environment-variables/#using-babel-to-replace-variables
    return {
    	presets: ['babel-preset-expo'],
        plugins: [
            '@babel/plugin-transform-flow-strip-types', 
            ['@babel/plugin-proposal-private-methods', {loose:true}]
        ]
  	}
}
