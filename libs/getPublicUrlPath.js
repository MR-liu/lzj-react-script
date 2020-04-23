'use strict';

const { URL } = require('url');

/**
 * @description 用于返回publicPath 在开发环境返回localhost 生产环境使用public
 * @param {*} isEnvDevelopment 是否是开发环境
 * @param {*} homePage public主页
 * @param {*} PublicUrl 主页
 * @example getPublicUrlPath(true, 'https://www.lzj.com', 'index') 返回
            URL {
              href: 'http://0.0.0.0/index',
              origin: 'http://0.0.0.0',
              protocol: 'http:',
              username: '',
              password: '',
              host: '0.0.0.0',
              hostname: '0.0.0.0',
              port: '',
              pathname: '/index',
              search: '',
              searchParams: URLSearchParams {},
              hash: ''
            }
 * @example getPublicUrlPath(false, 'https://www.lzj.com', 'index')
            URL {
              href: 'https://www.lzj.com/index',
              origin: 'https://www.lzj.com',
              protocol: 'https:',
              username: '',
              password: '',
              host: 'www.lzj.com',
              hostname: 'www.lzj.com',
              port: '',
              pathname: '/index',
              search: '',
              searchParams: URLSearchParams {},
              hash: ''
            }
 */
function getPublicUrlPath(isEnvDevelopment, homePage, PublicUrl = 'public') {
  let baseUrlPath = '';

  if (!isEnvDevelopment && homePage) {
    homePage = `${homePage.startsWith('http') ? '' : 'http://'}${homePage}${homePage.endsWith('/') ? '' : '/'}`

    baseUrlPath = homePage
  } else {
    baseUrlPath = 'http://127.0.0.1/'
  }


  return new URL(PublicUrl, baseUrlPath);
}

module.exports = getPublicUrlPath;