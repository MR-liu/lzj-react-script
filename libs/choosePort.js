const detect = require('detect-port-alt');
const chalk = require('chalk');

function choosePort(defaultPort) {
  return detect(defaultPort)
  .then(_port => {
    return new Promise(resolve => {
      if (defaultPort == _port) {
        return resolve(defaultPort);
      } else {
        console.log(chalk.cyan('address already in use, try use port at ' + _port))
        return resolve(_port);
      }
    })
  }, err => 
    console.log(err)
  )
  .catch(err => {
    console.log(err);
  });
}

module.exports = {
  choosePort,
};
