'use strict'

const debug = require('debug-logfmt')('html-microservice:html')
const { parseUri: parseProxyUri } = require('luminati-tunnel')
const createBrowserless = require('browserless')
const prependHttp = require('prepend-http')
const uaString = require('ua-string')
const isUrl = require('is-url-http')
const getHTML = require('html-get')

const { NODE_ENV = 'development' } = process.env

const isProduction = NODE_ENV === 'production'

const puppeteer = isProduction ? require('puppeteer-core') : require('puppeteer')

const puppeteerDevices = isProduction
  ? require('puppeteer-core/DeviceDescriptors')
  : require('puppeteer/DeviceDescriptors')

const getBrowserless = createBrowserless({ puppeteer, puppeteerDevices })

const { HEADERS } = require('./constants')
const cookies = require('./cookies')

module.exports = async req => {
  try {
    const { url, prerender, lang = 'en-us' } = req.query
    if (!url) return { showHelp: true }
    const targetUrl = prependHttp(url)
    if (!isUrl(targetUrl)) return { url: targetUrl, invalidUrl: true }

    const agent = req.query.proxy ? parseProxyUri(req.query.proxy) : undefined
    debug('agent', agent)

    return getHTML(targetUrl, {
      getBrowserless,
      prerender,
      gotOptions: {
        headers: {
          ...HEADERS,
          agent,
          'user-agent': uaString,
          'accept-language': lang,
          cookie: cookies.toString(targetUrl)
        }
      },
      puppeteerOpts: {
        headers: HEADERS,
        userAgent: uaString,
        cookies: cookies.toObject(targetUrl)
      }
    })
  } catch (err) {
    return { err }
  }
}
