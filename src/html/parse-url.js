'use strict'

const { URL } = require('url')
const mem = require('mem')

module.exports = mem(url => {
  try {
    return new URL(url)
  } catch (_) {
    return {}
  }
})
