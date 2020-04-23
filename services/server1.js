// const express              = require('express');
// const webpack              = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');
// const chalk                = require('chalk');
// const timeout              = require('connect-timeout');

// const files                = require('../lib/files');
// const absolutepath         = files.getAbsolutepath();

// const devconfig            = require('../config/webpack.config.dev');
// const { version }          = require('../package.json');
// const getProxyMiddlewares  = require('../proxy/getProxyMiddlewares');
// const typeOf               = require('../lib/typeOf');

// const app                  = express();

// // 超时时间
// const TIME_OUT             = 30 * 1e3;

// /**
//  * @description server
//  * @param configs 为注入配置项
//  */
module.exports = (configs) => {
  console.log(configs)
//   const { config = 'webpack.config.js', proxyConfig = 'proxy.config.js', port, publicPath } = configs;

//   const havePersonalizedCustomization = files.directoryExists(`${absolutepath}/${config}`);
//   const haveproxyConfig = files.directoryExists(`${absolutepath}/${proxyConfig}`);
  
//   let personalizedCustomization = {};
//   let proxy = {};

//   // 检测自定义配置
//   if (!havePersonalizedCustomization) {
//     console.info('未找到个性化配置，启用默认配置。');
//   } else {
//     personalizedCustomization = require(`${absolutepath}/${config}`);
//   }

//   // 检测自定义配置
//   if (!haveproxyConfig) {
//     console.info('未找到个性化配置，启用默认配置。');
//   } else {
//     proxy = require(`${absolutepath}/${proxyConfig}`);
//   }

  

//   const { defaultRedirect, before } = personalizedCustomization

//   const serverOptions = {
//     quiet: false,
//     noInfo: true,
//     publicPath: publicPath || '',
//     headers: { 'Access-Control-Allow-Origin': '*' },
//     stats: { colors: true },
//   };

//   const serverconfig = devconfig({
//     personalizedCustomization,
//     version,
//     port,
//     absolutepath,
//     before, // 钩子
//   })

//   if (proxy && 'object' === typeOf(proxy) && Object.keys(proxy).length) {
//     // console.log(chalk.green('启用代理 ------->', proxy, getProxyMiddlewares, getProxyMiddlewares(proxy)))
//     app.use(getProxyMiddlewares(proxy))
//   }

//   const complier = webpack(serverconfig);

//   app.use(webpackDevMiddleware(complier, serverOptions));

//   app.use(webpackHotMiddleware(complier, {
//     log: (info) => console.log(info),
//     heartbeat: 1000
//   }))

//   // 设置超时 返回超时响应
//   app.use(timeout(TIME_OUT));


//   if (defaultRedirect) {
//     app.get('/', (req, res) => res.redirect(defaultRedirect));
//   }
  
//   app.listen(port, (err) => {
//     if (err) {
//       console.error(chalk.red(err));
//     } else {
//       console.info(chalk.green('==> 🚧  glove server listening on port %s', port));
//     }
//   });
}