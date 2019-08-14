'use strict'

const dispatch = require('micro-route/dispatch')
const { send } = require('micro')

const html = require('./middlewares')

const decorate = opts => (req, res, { params = {}, query = {} } = {}) => {
  req.params = params
  req.query = query
  return html(req, res, opts)
}

module.exports = dispatch()
  .dispatch('/prerender/*', 'GET', decorate({ prerender: true }))
  .dispatch('/fetch/*', 'GET', decorate({ prerender: false }))
  .dispatch('/*', 'GET', decorate({ prerender: 'auto' }))
  .otherwise((req, res) => send(res, 403, null))
