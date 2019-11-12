'use strict'

const { toLower, pickBy, mapKeys } = require('lodash')
const headerCase = require('header-case')
const uaString = require('ua-string')
const mem = require('mem')

const getCookies = require('./get-cookies')
const parseUrl = require('./parse-url')

const normalizeHeaders = headers => mapKeys(headers, (value, key) => toLower(headerCase(key)))

module.exports = mem(
  (url, headers) => {
    return pickBy({
      'user-agent': uaString,
      'accept-language': 'en-us',
      connection: 'keep-alive',
      // TODO: Brotli (br) support requires Node.js 11.7.0 or later.
      'accept-encoding': 'gzip, deflate',
      'cache-control': 'no-cache',
      'upgrade-insecure-requests': '1',
      accept: '*/*',
      pragma: 'no-cache',
      origin: parseUrl(url).origin,
      cookie: getCookies(url),
      ...normalizeHeaders(headers)
    })
  },
  {
    cacheKey: JSON.sttringify
  }
)
