const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const mode = process.env.NODE_ENV || "development";

function resolve(dir) {
  return path.join(__dirname, ".", dir);
}

module.exports = (env) => {
  const BUILD_ENV = env.BUILD_ENV;
  const prod = BUILD_ENV === "production";

  console.log(process.env.NODE_ENV);
  console.log(env.BUILD_ENV);
  console.log(prod);

  return {
    entry: "./src/index.js",
    resolve: {
      extensions: [".js"],
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "bundle.js",
      publicPath: "/",
      chunkFilename: "bundle.[id].js",
    },
    module: {
      rules: [
        {
          test: /\.(m?js)$/,
          use: ["babel-loader"],
          include: [resolve("src")],
        },
        {
          test: /\.(png|jpg|gif|jpeg)$/,
          use: [
            {
              loader: "url-loader",
              loader: "file-loader",
              options: {
                esModule: false,
                name: "img/[name].[ext]",
                limit: 10240,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: [
            /**
             * MiniCssExtractPlugin doesn't support HMR.
             * For developing, use 'style-loader' instead.
             * */
            prod ? MiniCssExtractPlugin.loader : "style-loader",
            "css-loader",
          ],
        },
      ],
    },
    mode,
    plugins: [
      new MiniCssExtractPlugin({
        filename: "bundle.css",
      }),
      new webpack.DefinePlugin({
        "process.env": {
          BUILD_ENV: "'" + BUILD_ENV + "'",
        },
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "src/index.html",
        inject: "head",
      }),
    ],
    devtool: prod ? false : "source-map",
    devServer: {
      historyApiFallback: true,
    },
  };
};
