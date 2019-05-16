'use strict'

const isUrl = require('is-url-http')
const uaString = require('ua-string')
const getHTML = require('html-get')

const { HEADERS } = require('./constants')
const cookies = require('./cookies')

module.exports = async (req, { prerender }) => {
  try {
    const targetUrl = req.params['0']

    if (!targetUrl) return { showHelp: true }
    if (!isUrl(targetUrl)) return { url: targetUrl, invalidUrl: true }

    return getHTML(targetUrl, {
      prerender,
      gotOptions: {
        headers: {
          ...HEADERS,
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
