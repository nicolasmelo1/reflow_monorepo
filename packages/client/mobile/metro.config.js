const path = require('path')
const fs = require('fs')

module.exports = {
    resolver: {
        extraNodeModules: new Proxy({}, {
            get: (target, name) => {
                const defaultPath = path.join(process.cwd(), 'node_modules', name)
                return fs.existsSync(defaultPath) ? defaultPath : path.join(process.cwd(), '..', '..', 'shared', 'node_modules', name)
            },
        })
    },
    projectRoot: path.resolve(__dirname),
    watchFolders: [
        path.resolve(__dirname, '../../shared'),
        path.resolve(__dirname, '../shared'),
    ],
    transformer: {
        getTransformOptions: async () => ({
            transform: {
                experimentalImportSupport: false,
                inlineRequires: false
            }
        })
    }
}