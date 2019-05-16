'use strict'

const cacheableResponse = require('cacheable-response')

const { CACHE_TTL, isProduction } = require('./constants')
const html = require('./html')
const send = require('./send')

const ssrCache = cacheableResponse({
  ttl: CACHE_TTL,
  get: async ({ req, res, ...props }) => ({ data: await html(req, props) }),
  send: ({ res, data }) => send(res, data)
})

module.exports = async (app, express) => {
  app
    .use(require('helmet')())
    .use(require('morgan')(isProduction ? 'combined' : 'dev', { immediate: true }))
    .use(require('compression')())
    .use(require('cors')())
    .use(require('jsendp')())
    .use(express.static('static'))
    .disable('x-powered-by')

  app.get('/robots.txt', (req, res) => res.status(204).send())
  app.get('/favicon.ico', (req, res) => res.status(204).send())
  app.get('/prerender/*', async (req, res) => ssrCache({ req, res, prerender: true }))
  app.get('/fetch/*', async (req, res) => ssrCache({ req, res, prerender: false }))
  app.get('/*', async (req, res) => ssrCache({ req, res, prerender: 'auto' }))

  return app
}
