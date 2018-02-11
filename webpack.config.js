const path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        translation: './src/translation.js'
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: '[name].js',
        publicPath: '/build/'
    },
    resolve: {
        modules: [path.resolve(__dirname, '/src/'), 'node_modules/'],
        extensions: ['*', '.js']
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        inline: true
    },
    module: {
        loaders: [
            {
                test: /(\.js|\*)$/,
                loader: 'babel-loader',
                exclude: '/node_modules/',
                query: {
                    presets: [
                        ["env"]
                    ]
                }
            }
        ]
    }
}