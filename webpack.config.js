const path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        requestLS: './src/requestLS.js',
        requestLogin: './src/requestLogin.js'
    },
    output: {
        path: path.join(__dirname, "public/scripts"),
        filename: '[name].js',
        publicPath: '/public/scripts/'
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
    node: {
        http: true
    },
    module: {
        loaders: [{
            test: /(\.js|\*)$/,
            loader: 'babel-loader',
            exclude: '/node_modules/',
            query: {
                presets: [
                    ["env"]
                ]
            }
        }]
    }
}