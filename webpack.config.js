const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    home: "./src/client/scripts/home.ts",
  },
  output: {
    filename: "[name].bundle.js",
    path: path.resolve("./public/dist/client/scripts/bundles"),
  },
  module: {
    rules: [
      { test: /\.ts$/, use: "ts-loader", exclude: /node_modules/ }
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  },
};
