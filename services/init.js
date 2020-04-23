// const app = require('express');
// const webpack = require('webpack');
// const webpackDevMiddleware = require('webpack-dev-middleware');
// const webpackHotMiddleware = require('webpack-hot-middleware');

// const config = require('../config/webpack.config.dev');

// const { version } = require('../package.json');

// module.exports = (configs) => {
//   console.log('config ---------------->', configs)
//   const complier = webpack(config);

//   //这样启动的时候顺便把webpack启用了
//   app.use(webpackDevMiddleware(complier));

//   app.use(webpackHotMiddleware(complier, {
//     log: (info) => console.log(info),
//     heartbeat: 1000
//   }))

//   app.listen(3001)  
// }