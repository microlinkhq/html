'use strict'

const pkg = require('../package.json')

const help = () => ({
  query: {
    url: 'Target URL for getting HTML [required].',
    prerender: 'Enable `prerender` mode [default=auto].',
    proxy: 'Use the proxy URI provided during the request',
    '...headers': 'Any other query param will be attached as extra HTTP header.'
  },
  more: pkg.homepage,
  message: pkg.description
})

const invalidUrl = url => ({
  data: {
    url: `The URL \`${url}\` is not valid. Ensure it has protocol, hostname and is reachable.`
  },
  message: 'The request has been not processed. See the errors above to know why.',
  more: pkg.homepage
})

module.exports = { help, invalidUrl }
