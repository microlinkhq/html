'use strict'

const { parseUri: parseProxyUri } = require('luminati-tunnel')
const prependHttp = require('prepend-http')
const isUrl = require('is-url-http')
const getHTML = require('html-get')
const { noop } = require('lodash')

const getBrowserless = require('./get-browserless')
const getHeaders = require('./get-headers')

module.exports = async req => {
  try {
    const { url, proxy, prerender, ..._headers } = req.query

    if (!url) return { showHelp: true }
    const targetUrl = prependHttp(url)
    if (!isUrl(targetUrl)) return { url: targetUrl, invalidUrl: true }

    // TODO: move this inside `html-get`
    const headers = getHeaders(url, _headers)
    const agent = proxy ? parseProxyUri(req.query.proxy) : undefined

    // TODO: refactor `html-get` to just unify headers
    const gotOptions = { ...headers, agent }
    const puppeteerOpts = { headers }

    return getHTML(targetUrl, {
      getBrowserless: prerender !== false ? getBrowserless : noop,
      prerender,
      gotOptions,
      puppeteerOpts
    })
  } catch (err) {
    return { err }
  }
}
