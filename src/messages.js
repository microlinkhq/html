'use strict'

const pkg = require('../package.json')

const help = () => ({
  data: {
    '/': 'Show this help',
    '/:url': 'Get HTML using `auto` mode.',
    '/prerender/:url': 'Get HTML using `prerender` mode.',
    '/fetch/:url': 'Get HTML `fetch` mode.'
  },
  more: pkg.homepage,
  message: pkg.description
})

const invalidUrl = url => ({
  data: {
    url: `The URL \`${url}\` is not valid. Ensure it has protocol (http or https) and hostname.`
  },
  message: 'The request has been not processed. See the errors above to know why.',
  more: pkg.homepage
})

module.exports = { help, invalidUrl }
