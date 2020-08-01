/* eslint no-undef: 0 */

const path = require("path");

module.exports = {
    mode: "development",
    entry: "./source/index.js",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
};