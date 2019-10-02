'use strict'

const createBrowserless = require('browserless')
const chromium = require('chrome-aws-lambda')

const { isLambda, TIMEOUT, HEADLESS } = require('../constants')

const puppeteer = isLambda ? require('puppeteer-core') : require('puppeteer')

const puppeteerDevices = isLambda
  ? require('puppeteer-core/DeviceDescriptors')
  : require('puppeteer/DeviceDescriptors')

const puppeteerOptions = async () => ({
  args: chromium.args,
  defaultViewport: chromium.defaultViewport,
  executablePath: await chromium.executablePath,
  headless: HEADLESS,
  timeout: TIMEOUT,
  userDataDir: '/dev/null',
  puppeteer,
  puppeteerDevices
})

const browserless = createBrowserless(puppeteerOptions())

module.exports = () => browserless
