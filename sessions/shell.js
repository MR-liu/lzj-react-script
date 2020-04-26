
const yargs = require('yargs');
const { version } = require('../package.json');

const limits = ['server', 'build', 'init'];

const argv = require('yargs')
  .version(version)
  .command('server [config]', '开发模式', (yargs) => {
    yargs
      .positional('port', {
        describe: 'port to bind on',
        type: 'string',
        default: 8080
      })
  }, (argv) => {
    require('../services/server')(argv);
  })
  .command('build [config]', '生产模式', (yargs) => {
    yargs
      .positional('port', {
        describe: 'port to bind on',
        type: 'string',
        default: 8080
      })
  }, (argv) => {
    require('../services/build')(argv);
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .argv

function checkCommands(yargs, argv, numRequired) {
  if (argv._.length < numRequired || !limits.includes(argv._[0])) {
    yargs.showHelp();
  }
}

checkCommands(yargs, argv, 1);