const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin'); // 用terser-webpack-plugin替换掉uglifyjs-webpack-plugin解决uglifyjs不支持es6语法问题
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const safePostCssParser = require('postcss-safe-parser');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ManifestPlugin = require('webpack-manifest-plugin');

const postcssNormalize = require('postcss-normalize');

const path = require('path')
// const modules = require('./modules');

const getClientEnvironment = require('../config/env');
const getCSSModuleLocalIdent = require('../libs/getCSSModuleLocalIdent');
const {
  pkg,
  appPath,
  publicUrlPath,
  appIndexJs,
  appBuild,
  appSrc,
  appHtml
} = require('./paths')

const { href } = publicUrlPath
const { pathname } = publicUrlPath;

const isEnvProduction = process.env.NODE_ENV === 'production'
const isEnvDevelopment = process.env.NODE_ENV === 'development'
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false'; // 在docker下配置显示source-map

const getStyleLoaders = (cssOptions, preProcessor) => {
  // console
  const loaders = [
    isEnvDevelopment && require.resolve('style-loader'),
    isEnvProduction &&
    {
      loader: MiniCssExtractPlugin.loader,
      // css is located in `static/css`, use '../../' to locate index.html folder
      // in production `paths.publicUrlOrPath` can be a relative path
      options: 
        href.startsWith('.')
        ? { publicPath: '../../' }
        : {},
      options: {
        esModule: true,
      },
    },
    {
      loader: require.resolve('css-loader'),
      options: cssOptions,
    },
    {
      loader: require.resolve('postcss-loader'),
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
          postcssNormalize(),
        ],
        sourceMap: isEnvProduction && shouldUseSourceMap,
      },
    },
  ].filter(Boolean);
  if (preProcessor) {
    loaders.push(
      {
        loader: require.resolve('resolve-url-loader'),
        options: {
          sourceMap: isEnvProduction && shouldUseSourceMap,
        },
      },
      {
        loader: require.resolve(preProcessor),
        options: {
          sourceMap: true,
        },
      }
    );
  }

  return loaders;
};

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
      publicPath: isEnvDevelopment ? undefined: appBuild,
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
    // devServer: {
    //   hot: true,
    //   hotOnly: true,
    // },
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
    // resolve: {
    //   modules: ['node_modules', appNodeModules].concat(
    //     modules.additionalModulePaths || []
    //   ),
    // }
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } }, // 禁用require。请确保它不是标准语言功能。
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              include: appSrc,
              loader: require.resolve('babel-loader'),
              options: {
                // customize: require.resolve(
                //   '../'
                // ),
                babelrc: false,
                configFile: false,
                presets: [require.resolve('babel-preset-react-app')],
                // cacheIdentifier: getCacheIdentifier(
                //   isEnvProduction
                //     ? 'production'
                //     : isEnvDevelopment && 'development',
                //   [
                //     'babel-plugin-named-asset-import',
                //     'babel-preset-react-app',
                //     // 'react-dev-utils',
                //     // 'react-scripts',
                //   ]
                // ),
                plugins: [
                  [
                    require.resolve('babel-plugin-named-asset-import'),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent:
                            '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                        },
                      },
                    },
                  ],
                ],
                // This is a feature of `babel-loader` for webpack (not Babel itself).
                // It enables caching results in ./node_modules/.cache/babel-loader/
                // directory for faster rebuilds.
                cacheDirectory: true,
                // See #6846 for context on why cacheCompression is disabled
                cacheCompression: false,
                compact: isEnvProduction,
              },
            },
            {
              test: /\.css$/,
              exclude: /\.module\.css$/,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction && shouldUseSourceMap,
              }),
              sideEffects: true,
            },
            {
              test: /\.module\.css$/,
              use: getStyleLoaders({
                importLoaders: 1,
                sourceMap: isEnvProduction && shouldUseSourceMap,
                modules: {
                  getLocalIdent: getCSSModuleLocalIdent,
                },
              }),
            },
            {
              test: /\.(scss|sass)$/,
              exclude: /\.module\.(scss|sass)$/,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                },
                'sass-loader'
              ),
              sideEffects: true,
            },
            {
              test: /\.module\.(scss|sass)$/,
              use: getStyleLoaders(
                {
                  importLoaders: 3,
                  sourceMap: isEnvProduction && shouldUseSourceMap,
                  modules: {
                    getLocalIdent: getCSSModuleLocalIdent,
                  },
                },
                'sass-loader'
              ),
            },
            {
              loader: require.resolve('file-loader'),
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ]
        }
        
      ]
    },
    plugins: [
      new HtmlWebpackPlugin(
        Object.assign(
          {},
          {
            inject: true,
            template: appHtml,
          },
          isEnvProduction
            ? {
                minify: {
                  removeComments: true,
                  collapseWhitespace: true,
                  removeRedundantAttributes: true,
                  useShortDoctype: true,
                  removeEmptyAttributes: true,
                  removeStyleLinkTypeAttributes: true,
                  keepClosingSlash: true,
                  minifyJS: true,
                  minifyCSS: true,
                  minifyURLs: true,
                },
              }
            : undefined
        )
      ),
      isEnvProduction &&
        new CleanWebpackPlugin(),
      isEnvProduction &&
        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        new ManifestPlugin({
          fileName: 'asset-manifest.json',
          // publicPath: paths.publicUrlOrPath,
          generate: (seed, files, entrypoints) => {
            const manifestFiles = files.reduce((manifest, file) => {
              manifest[file.name] = file.path;
              return manifest;
            }, seed);
            const entrypointFiles = entrypoints.main.filter(
              fileName => !fileName.endsWith('.map')
            );
  
            return {
              files: manifestFiles,
              entrypoints: entrypointFiles,
            };
          },
        }),
      // isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ].filter(Boolean),
    node: {
      module: 'empty',
      dgram: 'empty',
      dns: 'mock',
      fs: 'empty',
      http2: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
    performance: {
      hints:'warning',
      //入口起点的最大体积
      maxEntrypointSize: 4000000,
      //生成文件的最大体积
      maxAssetSize: 1000000,
      //只给出 js 文件的性能提示
      assetFilter: function(assetFilename) {
        return assetFilename.endsWith('.js');
      }
    }
  }
}

const config  = commonConfig()

module.exports = config;
