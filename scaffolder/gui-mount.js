const clear = require('clear');
const chalk = require('chalk');
const figlet = require('figlet');

const { pkg } = require('../config/paths')
const { name } = pkg

clear();
console.log(
  chalk.yellow(
    figlet.textSync(name, { horizontalLayout: 'full' })
  )
);