const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require("compression-webpack-plugin");


const ProjectDIR = path.resolve(__dirname, '../') + '/';
const SourceDIR = ProjectDIR + 'src/';
const BuildDIR = ProjectDIR + './build/';

module.exports = {
  entry: {
    script: SourceDIR + '_redux/index.ts',
    app: SourceDIR + 'root.ts',
  },
  mode: 'production',
  // optimization: {
  //   minimize: true,
  // },
  devtool: 'source-map',
  externals: {},
  output: {
    publicPath: '/',
    path: path.resolve(BuildDIR),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
          },
        },
        include: [path.resolve(SourceDIR)],
      },
      {
        test: /\.less$/i,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              svgo: false,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: ['node_modules', SourceDIR],
    alias: { src: SourceDIR },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  },

  target: 'web',
  context: __dirname,
  performance: {
    hints: false,
    // maxAssetSize: 500000,
    // maxEntrypointSize: 500000,
  },
  stats: 'errors-only',

  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.resolve(ProjectDIR, './public/index.html'),
      scriptLoading: 'blocking',
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: '../tsconfig.json',
      },
    }),
    new CleanWebpackPlugin(),
    new CompressionPlugin(),
  ],
};
