const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const isProd = process.env.NODE_ENV === 'production';
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  target: isProd ? 'browserslist' : 'web',
  entry: ['@babel/polyfill', path.resolve(__dirname, './src/ts/index.ts')],
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: isProd ? 'bundle.[contenthash].js' : 'bundle.js',
    clean: true,
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
    }),
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, './src/assets'), to: path.resolve(__dirname, './dist/assets') }],
    }),
    new MiniCssExtractPlugin({
      filename: isProd ? 'style.[contenthash].css' : 'style.css',
    }),
    new ESLintPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset',
        generator: {
          filename: 'assets/static/[hash][ext][query]',
        },
      },
      {
        test: /\.css$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['airbnb'],
          },
        },
      },
    ],
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    compress: true,
    port: 9000,
  },
  devtool: isProd ? false : 'source-map',
};
