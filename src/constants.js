'use strict'

const TWENTY_MIN_MS = 1000 * 60 * 20

const HEADERS = {
  connection: 'keep-alive',
  'accept-encoding': 'gzip, deflate',
  'accept-language': 'en-us',
  'cache-control': 'no-cache',
  'upgrade-insecure-requests': '1',
  accept: '*/*',
  pragma: 'no-cache'
}

module.exports = {
  HEADERS,
  CACHE_TTL: process.env.CACHE_TTL || TWENTY_MIN_MS,
  isProduction: process.env.NODE_ENV === 'production'
}
