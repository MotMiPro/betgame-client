const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const mainFiles = `index.[name].[contenthash].js`;
const chunkFiles = `index.[name].[contenthash].chunk.js`;

module.exports = {
  entry: path.join(__dirname, "src", "index.js"),
  output: {
    path: path.join(__dirname, "build"),
    filename: mainFiles,
    chunkFilename: chunkFiles,
    publicPath: "/",
    environment: {
      dynamicImport: false,
    },
  },
  mode: process.env.NODE_ENV || "development",
  resolve: {
    modules: ["node_modules", path.resolve(__dirname, "src")],
    extensions: [".js", ".json", ".jsx", ".css"],
    alias: {
      "~": path.resolve(__dirname, "src"),
    },
  },
  devServer: {
    contentBase: path.join(__dirname, "src"),
    inline: true,
    port: 3009,
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
    disableHostCheck: true,
  },
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  optimization: {
    splitChunks: {
      minSize: 10000,
      maxSize: 250000,
    },
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|jpeg|png|gif|mp3|wav|svg)$/,
        use: ["file-loader"],
      },
      { test: /\.less$/, use: ["style-loader", "css-loader", "less-loader"] },
      {
        test: /\.(js|jsx|tsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      favicon: "./src/assets/images/icon-logo.png",
    }),
    new Dotenv(),
  ],
};
