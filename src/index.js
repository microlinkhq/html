'use strict'

const beautyError = require('beauty-error')
const uaString = require('ua-string')
const prettyMs = require('pretty-ms')
const getHTML = require('html-get')
const help = require('./help')

const { isProduction, HEADERS } = require('./constants')
const cookies = require('./cookies')

const html = async (req, res, { prerender }) => {
  try {
    const targetUrl = req.params['0']
    if (!targetUrl) return res.success(help)

    const { html, url, stats } = await getHTML(targetUrl, {
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

    return res
      .set({
        'Content-Type': 'text/plain',
        'x-url': url,
        'x-mode': stats.mode,
        'x-time': stats.timing,
        'x-time-pretty': prettyMs(stats.timing)
      })
      .send(html)
  } catch (err) {
    if (!isProduction) console.log(beautyError(err))
    return res.error()
  }
}

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
  app.get('/prerender/*', async (req, res) => html(req, res, { prerender: true }))
  app.get('/fetch/*', async (req, res) => html(req, res, { prerender: false }))
  app.get('/*', async (req, res) => html(req, res, { prerender: 'auto' }))

  return app
}
