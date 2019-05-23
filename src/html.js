'use strict'

const debug = require('debug-logfmt')('html-microservice:html')
const isUrl = require('is-url-http')
const uaString = require('ua-string')
const getHTML = require('html-get')

const { HEADERS } = require('./constants')
const cookies = require('./cookies')
const { parseUri: parseProxyUri } = require('luminati-tunnel')

module.exports = async (req, { prerender }) => {
  try {
    const targetUrl = req.params['0']

    if (!targetUrl) return { showHelp: true }
    if (!isUrl(targetUrl)) return { url: targetUrl, invalidUrl: true }

    const agent = req.query.proxy ? parseProxyUri(req.query.proxy) : undefined
    debug('agent', agent)

    return getHTML(targetUrl, {
      prerender,
      gotOptions: {
        headers: {
          ...HEADERS,
          agent,
          'user-agent': uaString,
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
