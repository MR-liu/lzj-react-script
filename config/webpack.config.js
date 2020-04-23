process.env.NODE_ENV = 'development' // production development
process.env.PUBLIC_URL = 'public'
process.env.HOME_PAGE = 'http://www.lzj.com'
process.env.GENERATE_SOURCEMAP = true

const TerserPlugin = require('terser-webpack-plugin'); // 用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');

const path = require('path')
const modules = require('./modules');

const getClientEnvironment = require('../libs/env')
const {
  pkg,
  publicUrlPath,
  appIndexJs,
  appBuild,
  appSrc
} = require('./paths')
const { href } = publicUrlPath

const { pathname } = publicUrlPath;

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = process.env.NODE_ENV === 'development'
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'; // 在docker下配置显示source-map

const commonConfig = () => {
  return {
    mode: process.env.NODE_ENV || 'production',
    bail: process.env.NODE_ENV === 'production',
    devtool: isEnvProduction // 可以通过修改生产环境下的配置来显示source-map
        ? shouldUseSourceMap
          ? 'source-map'
          : false
        : isEnvDevelopment && 'cheap-module-source-map',
    entry: [
      appIndexJs
    ].filter(Boolean),
    output: {
      path: isEnvProduction ? appBuild : undefined,
      pathinfo: isEnvDevelopment,
      filename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].js'
        : isEnvDevelopment && 'static/js/bundle.js',
      futureEmitAssets: true, // webpack4中暂时替代webpack 5的发射(emitting)逻辑 升级到webpack5之后可以挪掉这个
      chunkFilename: isEnvProduction
        ? 'static/js/[name].[contenthash:8].chunk.js'
        : isEnvDevelopment && 'static/js/[name].chunk.js',
      publicPath: pathname,
      devtoolModuleFilenameTemplate: isEnvProduction // 行到行map模式用一个简单的 sourcecMap , 在这个sourceMap 中每行生成的文件映射到同一行的源文件
        ? info =>
            path
              .relative(appSrc, info.absoluteResourcePath)
              .replace(/\\/g, '/')
        : isEnvDevelopment &&
          (info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/')),
      jsonpFunction: `webpackJsonp${pkg.name}`, // webpack4中手动指定
      globalObject: 'this', // 用于配置运行时的全局对象引用
    },
    optimization: { // 只在生产环境下运行
      minimize: isEnvProduction, // 压缩js代码
      minimizer: [
        new TerserPlugin({ // 新的压缩工具
          terserOptions: {
            parse: {
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              comparisons: false,
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            keep_classnames: isEnvProduction,
            keep_fnames: isEnvProduction,
            output: {
              ecma: 5,
              comments: false,
              ascii_only: true,
            },
          },
          sourceMap: shouldUseSourceMap,
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessor: require('cssnano'), // 引入cssnano配置压缩选项
          cssProcessorOptions: {
            parser: safePostCssParser,
            map: shouldUseSourceMap
              ? {
                  inline: false,
                  annotation: true,
                }
              : false,
          },
          cssProcessorPluginOptions: {
            preset: ['default', { minifyFontValues: { removeQuotes: false } }],
          },
        }),
      ],
      splitChunks: { // 提取被重复引入的文件，单独生成一个或多个文件，这样避免在多入口重复打包文件
        chunks: 'all',
        name: false,
      },
      runtimeChunk: { // 优化持久化缓存的, 作用是将包含chunks映射关系的list单独从app.js里提取出来，因为每一个chunk的id基本都是基于内容hash出来的，所以你每次改动都会影响它，如果不把它提取出来的话，等于app.js每次都会改变，缓存就失效了。
        name: entrypoint => `runtime-${entrypoint.name}`,
      },
    },
    resolve: {
      modules: ['node_modules', appNodeModules].concat(
        modules.additionalModulePaths || []
      ),
    }
  }
}

const config  = commonConfig()

module.exports = config;
