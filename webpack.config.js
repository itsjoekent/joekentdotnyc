const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const postcss = {
  loader: 'postcss-loader',
  options: {
    plugins: function() {
      return [
        require('autoprefixer')({
          browsers: ['last 4 versions', 'Firefox ESR', 'Opera 12.1'],
        }),

        require('css-mqpacker')()
      ];
    }
  }
};

const config = {
  entry: './app.js',
  output: {
    filename: './dist/app.js',
  },
  module: {
    loaders: [
      { test: /\.(png|jpe?g|eot|gif|woff2?|svg|ttf)$/, use: ['url-loader'] },
      { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.scss$/, use: ExtractTextPlugin.extract(['css-loader', postcss, 'sass-loader']) }
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: './dist/style.css',
      allChunks: true,
    }),
  ],
  devtool: '',
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      drop_console: true,
      drop_debugger: true,
      dead_code: true,
    }
  }));
} else {
  config.devtool = '#cheap-module-source-map';
}

module.exports = config;
