const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const socketConfig = require('./config');
const addBaseConfig = require('./webpack-base.config');
const {
    HotModuleReplacementPlugin
} = require('webpack');


const configs = addBaseConfig({
    mode: 'development',
    output: {
        filename: 'client/src/[name].js'
    },

    module: {
        rules: [{
                test: /\.css/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets'
                    }
                }]
            }
        ]
    },
    plugins: [
        new HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'React Video Caller - Emmanuel Ayodele',
            filename: 'index.html',
            template: 'client/public/index.html'
        })
    ],
    devServer: {
        inline: false,
        compress: true,
        port: 9000,
        proxy: {
            '/bridge/': `http://localhost:${socketConfig.PORT}`
        },
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        }
    }
});

module.exports = configs;