'use strict'

const { promisify } = require('util')

const cacheableResponse = require('cacheable-response')
const helmet = promisify(require('helmet')())

const { CACHE_TTL } = require('./constants')
const html = require('./html')
const send = require('./send')

const applyMiddleware = (service, middlewares = []) =>
  middlewares
    .filter(Boolean)
    .reverse()
    .reduce((fn, nextMiddleware) => nextMiddleware(fn), service)

const fromExpress = fn => handler => (req, res, ...rest) => {
  const next = () => handler(req, res, ...rest)
  return fn(req, res, next)
}

const ssrCache = cacheableResponse({
  ttl: CACHE_TTL,
  get: async ({ req, res, ...props }) => ({ data: await html(req, props) }),
  send: ({ res, data }) => send(res, data)
})

const fromCache = (req, res, opts) => ssrCache({ req, res, ...opts })

const middlewares = [fromExpress(helmet)]

module.exports = applyMiddleware(fromCache, middlewares)
