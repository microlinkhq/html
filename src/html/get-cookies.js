'use strict'

const { MemoryCookieStore, CookieJar } = require('tough-cookie')

const cookieJar = new CookieJar(new MemoryCookieStore())

cookieJar.setCookieSync(
  'wp_gdpr=1|1; Domain=.washingtonpost.com; Path=/;',
  'https://www.washingtonpost.com'
)

module.exports = url => cookieJar.getCookieStringSync(url)
