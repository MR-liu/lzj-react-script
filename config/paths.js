const path = require('path');
const fs = require('fs');

const getPublicUrlPath = require('../libs/getPublicUrlPath')

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);


const pkg = require(resolveApp('package.json'));
const { homepage, publicUrl } = pkg;

const publicUrlPath = getPublicUrlPath(
  process.env.NODE_ENV === 'development',
  process.env.HOME_PAGE || homepage,
  process.env.PUBLIC_URL || publicUrl
);

const moduleFileExtensions = [
  'web.mjs',
  'mjs',
  'web.js',
  'js',
  'web.ts',
  'ts',
  'web.tsx',
  'tsx',
  'json',
  'web.jsx',
  'jsx',
];

//匹配类型
const resolveModule = (resolveFn, filePath) => {
  const extension = moduleFileExtensions.find(extension => {
    return fs.existsSync(resolveFn(`${filePath}.${extension}`))
  });

  if (extension) {
    return resolveFn(`${filePath}.${extension}`);
  }

  return resolveFn(`${filePath}.js`);
};

module.exports = {
  publicUrlPath,
  pkg,
  appPath: resolveApp('./'),
  appIndexJs: resolveModule(resolveApp, 'src/index'),
  appBuild: resolveApp('build'),
  appSrc: resolveApp('src'),
  appNodeModules: resolveApp('node_modules'),
  appHtml: resolveApp('public/index.html'),
}
