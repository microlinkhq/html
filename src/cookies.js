'use strict'

const { MemoryCookieStore, CookieJar } = require('tough-cookie')
const { getDomain } = require('tldts')

const cookieJar = new CookieJar(new MemoryCookieStore())

cookieJar.setCookieSync(
  'wp_gdpr=1|1; Domain=.washingtonpost.com; Path=/;',
  'https://www.washingtonpost.com'
)

const serializeCookie = (url, cookies) => {
  if (!cookies) return

  const domain = `.${getDomain(url)}`

  return cookies.split('; ').reduce((acc, str) => {
    const [name, value] = str.split('=')
    const cookie = {
      name,
      value,
      domain,
      url,
      path: '/'
    }

    return [...acc, cookie]
  }, [])
}

const toString = url => {
  return cookieJar.getCookieStringSync(url)
}

const toObject = url => {
  return serializeCookie(url, cookieJar.getCookieStringSync(url))
}

module.exports = { toString, toObject }
