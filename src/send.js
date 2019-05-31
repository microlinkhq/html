'use strict'

const beautyError = require('beauty-error')
const prettyMs = require('pretty-ms')
const pretty = require('pretty')

const { isProduction } = require('./constants')
const messages = require('./messages')

const sendJSON = (res, status, json) => res[status](json)

const sendError = (res, { err }) => {
  if (err) {
    if (!isProduction) console.log(beautyError(err))
    return sendJSON(res, 'error')
  }
}

const sendHtml = (res, { html, url, stats }) => {
  return res
    .set({
      'Content-Type': 'text/plain',
      'x-url': url,
      'x-mode': stats.mode,
      'x-time': stats.timing,
      'x-time-pretty': prettyMs(stats.timing)
    })
    .send(pretty(html, { ocd: true }))
}

module.exports = (res, { err, invalidUrl, showHelp, html, url, stats }) => {
  if (err) return sendError(res, { err })
  if (showHelp) return sendJSON(res, 'success', messages.help())
  if (invalidUrl) return sendJSON(res, 'fail', messages.invalidUrl(url))
  return sendHtml(res, { html, url, stats })
}
