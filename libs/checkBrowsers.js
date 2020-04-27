const browserslist = require('browserslist'); // 配置browserslist 消除浏览器跟node端差异
const chalk = require('chalk');
const os = require('os');
const pkgUp = require('pkg-up'); // 查找最近的pkg
const fs = require('fs');
const {
  appPath
} = require('../config/paths')

const defaultBrowsers = {
  production: ['>0.2%', 'not dead', 'not op_mini all'],
  development: [
    'last 1 chrome version',
    'last 1 firefox version',
    'last 1 safari version',
  ],
};

function checkBrowsers() {
  const current = browserslist.loadConfig({ path: appPath });
  if (current != null) {
    return Promise.resolve(current);
  }

  return new Promise(function(resolve, reject) {
    pkgUp()
    .then(filePath => {
      if (filePath == null) {
        return Promise.reject();
      }
      const pkg = JSON.parse(fs.readFileSync(filePath));
      pkg['browserslist'] = defaultBrowsers;

      fs.writeFileSync(filePath, JSON.stringify(pkg, null, 2) + os.EOL);

      console.log();
      console.log(
        `${chalk.green('Set target browsers:')} ${chalk.cyan(
          defaultBrowsers.join(', ')
        )}`
      );
      console.log();
    })
    .catch(() => {
      resolve(true)
    })
  })
}

module.exports = { defaultBrowsers, checkBrowsers };