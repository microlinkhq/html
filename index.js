'use strict'

const serve = require('micro')
const entry = require('./src')

function registerShutdown (fn) {
  let run = false

  const wrapper = () => {
    if (!run) {
      run = true
      fn()
    }
  }

  process.on('SIGINT', wrapper)
  process.on('SIGTERM', wrapper)
  process.on('exit', wrapper)
}

function startEndpoint (module, endpoint) {
  const server = serve(module)

  server.on('error', err => {
    console.error('microlink-html:', err.stack)
    process.exit(1)
  })

  server.listen(...endpoint, () => {
    const details = server.address()
    registerShutdown(server.close)
    console.log(`microlink-html: Accepting connections on ${details.address}:${details.port}`)
  })
}

async function start () {
  startEndpoint(entry, [process.env.PORT || 3000, '0.0.0.0'])
  registerShutdown(() => console.log('microlink-html: Gracefully shutting down. Please wait...'))
}

start()
