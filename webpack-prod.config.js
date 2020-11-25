const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const addBaseConfig = require('./webpack-base.config');

const configs = addBaseConfig({
    mode: 'production',
    output: {
        filename: 'client/src/[name].min.js'
    },

    module: {
        rules: [{
                test: /\.css/,
                use: [
                    MiniCssExtractPlugin,
                    'css-loader'
                ]
            },
            {
                test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[name].[ext]',
                        outputPath: 'assets',
                        publicPath: '/dist/assets'
                    }
                }]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'client/src/[name].min.css'
        }),
        new HtmlWebpackPlugin({
            title: 'React Video Caller - Emmanuel Ayodele',
            filename: path.join(__dirname, 'index.html'),
            template: 'client/src/index.html'
        })
    ],
    optimization: {
        minimizer:[
            new TerserPlugin({
                parallel: true,
                terserOptions: {ecma: 6}
            })
        ]
    }

});

module.exports = configs;