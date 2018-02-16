const path = require('path');

module.exports = {
    context: __dirname,
    entry: {
        requestLogin: './src/requestLogin.js',
        requestTopic: './src/requestTopic.js'
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