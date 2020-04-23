var crossSpawn = require('cross-spawn');

module.exports = (configs) => {
  const result = spawn.sync(
    'node',
    nodeArgs
      .concat(require.resolve('../scripts/' + script))
      .concat(args.slice(scriptIndex + 1)),
    { stdio: 'inherit' }
  );
  console.log(configs)
}