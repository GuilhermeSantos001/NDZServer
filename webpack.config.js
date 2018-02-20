/**
 *   <NDZServer it is a program for creating a safe community and innovative>
 *   NDZServer Copyright (C) 2018 GuilhermeSantos001, Inc. <https://github.com/GuilhermeSantos001/NDZServer>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://github.com/GuilhermeSantos001/NDZServer/blob/master/LICENSE>
 *
 *   To enter in contact with the developer <luizgp120@hotmail.com>
 */

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