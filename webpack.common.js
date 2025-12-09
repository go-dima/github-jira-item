var webpack = require("webpack"),
  path = require("path"),
  CopyWebpackPlugin = require("copy-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin");
MiniCssExtractPlugin = require("mini-css-extract-plugin");

require('dotenv').config();

var { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    eventPage: path.join(__dirname, "src/eventPage.ts"),
    contentScript: path.join(__dirname, "src/content.ts"),
    contentStyles: path.join(__dirname, "src/styles/content.css"),
    options: path.join(__dirname, "src/options.tsx"),
  },
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        exclude: [/node_modules/, /\.stories\.tsx?$/],
        test: /\.tsx?$/,
        use: "ts-loader",
      },
      {
        exclude: /node_modules/,
        test: /\.(css|scss)$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "assets/[name][ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css"],
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: false }),
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env.JIRA_URL': JSON.stringify(process.env.JIRA_URL)
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "src/manifest.json",
          to: path.join(__dirname, "dist"),
          force: true,
          transform: function (content, path) {
            // generates the manifest file using the package.json informations
            return Buffer.from(
              JSON.stringify({
                description: process.env.npm_package_description,
                version: process.env.npm_package_version,
                ...JSON.parse(content.toString()),
              })
            );
          },
        },
        {
          from: "assets",
          to: path.join(__dirname, "dist/assets"),
          force: true,
        },
        {
          from: "src/options.html",
          to: path.join(__dirname, "dist"),
          force: true,
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: "../[name].css",
    }),
  ],
};
