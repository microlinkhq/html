'use strict'

const beautyError = require('beauty-error')
const HTTPStatus = require('http-status')
const { send } = require('micro')
const pretty = require('pretty')

const { isProduction } = require('./constants')
const messages = require('./messages')

const createSend = (status, code) => async (res, props) => send(res, code, { ...props, status })

const sendError = createSend('error', HTTPStatus.INTERNAL_SERVER_ERROR)

const sendSuccess = createSend('success', HTTPStatus.OK)
const sendFail = createSend('fail', HTTPStatus.BAD_REQUEST)

const sendHtml = (res, { html, url, stats }) => {
  res.setHeader('content-type', 'text/plain')
  res.setHeader('x-url', url)
  res.setHeader('x-fetch-mode', stats.mode)
  res.setHeader('x-fetch-time', `${stats.timing}ms`)
  send(res, HTTPStatus.OK, pretty(html, { ocd: true }))
}

module.exports = (res, { err, invalidUrl, showHelp, html, url, stats }) => {
  if (err) {
    if (!isProduction) console.log(beautyError(err))
    return sendError(res, { more: err.message || err })
  }

  if (showHelp) return sendSuccess(res, messages.help())
  if (invalidUrl) return sendFail(res, messages.invalidUrl(url))
  return sendHtml(res, { html, url, stats })
}
