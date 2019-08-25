'use strict'

const pkg = require('../package.json')

const help = () => ({
  query: {
    url: 'Target URL for getting HTML [required].',
    prerender: 'Enable `prerender` mode [default=auto].',
    lang: "Setup the preferred language for fetching the content [default='en-us']."
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
