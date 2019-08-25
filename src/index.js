'use strict'

const dispatch = require('micro-route/dispatch')
const { send } = require('micro')

const html = require('./middlewares')

const decorate = (req, res, { params = {}, query = {} } = {}) => {
  req.params = params
  req.query = query
  return html(req, res)
}

module.exports = dispatch()
  .dispatch('/*', 'GET', decorate)
  .otherwise((req, res) => send(res, 403, null))
