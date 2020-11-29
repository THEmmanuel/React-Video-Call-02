const HtmlWebpackPlugin = require('html-webpack-plugin');
const socketConfig = require('../config');
const addBaseConfig = require('./webpack-base.config');
const {
    HotModuleReplacementPlugin
} = require('webpack');


const configs = addBaseConfig({
    target: 'web',
    mode: 'development',
    output: {
        filename: 'src/[name].js'
    },

    module: {
        rules: [
            //Rules for global styling.
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /\.module\.css$/
            },
            //Rules for CSS modules
            {
                test: /\.(css|scss)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: {
                                localIdentName: "[name]__[local]___[hash:base64:5]",
                            },
                        }
                    }
                ],
                include: /\.module\.css$/
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: 'assets/[name].[ext]',
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
            template: 'src/index.html'
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