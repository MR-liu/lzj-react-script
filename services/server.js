'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const HOST = process.env.HOST || '0.0.0.0';

const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const paths = require('../config/paths');
const webpackConfig = require('../config/webpack.config') 

// 启用环境变量
require('../config/env');

module.exports = (configs) => {
  const {
    port
  } = configs;

  const compiler = webpack(webpackConfig);

  const devServer = new WebpackDevServer(compiler, {});

  devServer.listen(port, HOST, err => {
    // if (err) {
    //   return console.log(err);
    // }
    // if (isInteractive) {
    //   clearConsole();
    // }

    // // We used to support resolving modules according to `NODE_PATH`.
    // // This now has been deprecated in favor of jsconfig/tsconfig.json
    // // This lets you use absolute paths in imports inside large monorepos:
    // if (process.env.NODE_PATH) {
    //   console.log(
    //     chalk.yellow(
    //       'Setting NODE_PATH to resolve modules absolutely has been deprecated in favor of setting baseUrl in jsconfig.json (or tsconfig.json if you are using TypeScript) and will be removed in a future major release of create-react-app.'
    //     )
    //   );
    //   console.log();
    // }

    console.log(chalk.cyan('Starting the development server...\n'));
    // openBrowser(urls.localUrlForBrowser);
  });
}