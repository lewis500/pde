var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: './app/index.js'
  ,
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'app')
    }, {
      test: /\.scss$/,
      loaders: ["style", "css", "sass"]
    }, {
      test: /\.css$/,
      loaders: ["style", "css"]
    }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss', '.css', '.json']
  }
};
