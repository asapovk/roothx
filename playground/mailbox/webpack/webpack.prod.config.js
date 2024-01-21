const baseConfig = require('./webpack.base.config');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = Object.assign(baseConfig, {
  //mode: 'production',
  devtool: 'source-map',
  plugins: [
    ...baseConfig.plugins,
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[hash].css',
    }),
  ],
});
