'use strict';

process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const HOST = process.env.HOST || '127.0.0.1';

const fs = require('fs');
const chalk = require('chalk');
const clear = require('clear');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const webpackConfig = require('../config/webpack.config') 
const createDevServerConfig = require('../config/webpack.config.devserver');
const { checkBrowsers } = require('../libs/checkBrowsers');
const { choosePort } = require('../libs/choosePort')

// 启用环境变量
require('../config/env');

process.on('unhandledRejection', err => {
  throw err;
});

module.exports = (configs) => {
  const {
    port
  } = configs;
  checkBrowsers().then(() => {
    // 端口嗅探
    return choosePort(port)
  }).then((_port) => {
    const compiler = webpack(webpackConfig);

    const serverConfig = createDevServerConfig(
      {},
      ''
    );

    const devServer = new WebpackDevServer(compiler, serverConfig);

    devServer.listen(_port, HOST, err => {
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
  })

  
}