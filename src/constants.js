'use strict'

const isProduction = process.env.NODE_ENV === 'production'

const HEADERS = {
  connection: 'keep-alive',
  'accept-encoding': 'gzip, deflate',
  'accept-language': 'en-us',
  'cache-control': 'no-cache',
  'upgrade-insecure-requests': '1',
  accept: '*/*',
  pragma: 'no-cache'
}

module.exports = { HEADERS, isProduction }
