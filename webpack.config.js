const path = require("path");

module.exports = {
    mode: "development",
    devtool: "source-map",
    entry: {
        "index": "./src/index.ts",
        "test": "./src/test.ts",
        "devtools": "./src/devtools.ts",
        "background": "./src/background.ts",
        "devtoolsUi": "./src/devtoolsUi.tsx",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
    },
};