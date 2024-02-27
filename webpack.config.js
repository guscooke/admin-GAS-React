const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("@effortlessmotion/html-webpack-inline-source-plugin");
const FileManagerPlugin = require('filemanager-webpack-plugin');

module.exports = {
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build"),
        publicPath: '',
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: "body",
            template: path.join(__dirname, "public", "index.html"),
            inlineSource: '.(js|css)$',
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new FileManagerPlugin({
            events: {
                onEnd: {
                    copy: [
                        { source: path.join(__dirname, "build", "index.html"), destination: path.join(__dirname, "apps-script", "index.html") },
                    ],
                }
            }
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, "build"),
        },
        port: 3000,
    },
    module: {
        // exclude node_modules
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader"],
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            }
        ],
    },
    // pass all js files through Babel
    resolve: {
        extensions: ["*", ".js", ".jsx"],
    }
};