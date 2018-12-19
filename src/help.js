'use strict'

const pkg = require('../package.json')

module.exports = {
  data: {
    '/': 'Show this help',
    '/:url': 'Get HTML using `auto` mode.',
    '/prerender/:url': 'Get HTML using `prerender` mode.',
    '/fetch/:url': 'Get HTML `fetch` mode.'
  },
  more: pkg.homepage,
  message: pkg.description
}
