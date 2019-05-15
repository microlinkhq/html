'use strict'

const uaString = require('ua-string')
const prettyMs = require('pretty-ms')
const getHTML = require('html-get')
const help = require('./help')

const isProduction = process.env.NODE_ENV === 'production'

const gotOptions = { headers: { accept: '*/*', 'user-agent': uaString } }
const puppeteerOpts = { userAgent: uaString }

const html = async (req, res, { prerender }) => {
  const targetUrl = req.params['0']
  if (!targetUrl) return res.success(help)

  const { html, url, stats } = await getHTML(targetUrl, {
    prerender,
    gotOptions,
    puppeteerOpts
  })

  return res
    .set({
      'Content-Type': 'text/plain',
      'x-url': url,
      'x-mode': stats.mode,
      'x-time': stats.timing,
      'x-time-pretty': prettyMs(stats.timing)
    })
    .send(html)
}

module.exports = async (app, express) => {
  app
    .use(require('helmet')())
    .use(require('compression')())
    .use(require('cors')())
    .use(require('jsendp')())
    .use(require('morgan')(isProduction ? 'combined' : 'dev'))
    .use(express.static('static'))
    .disable('x-powered-by')

  app.get('/robots.txt', (req, res) => res.status(204).send())
  app.get('/favicon.txt', (req, res) => res.status(204).send())
  app.get('/prerender/*', async (req, res) =>
    html(req, res, { prerender: true })
  )
  app.get('/fetch/*', async (req, res) => html(req, res, { prerender: false }))
  app.get('/*', async (req, res) => html(req, res, { prerender: 'auto' }))

  return app
}
