'use strict';
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection', err => {
  throw err;
});

require('../config/env');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config') 

module.exports = (configs) => {
  const compiler = webpack(webpackConfig);
  compiler.run();
}