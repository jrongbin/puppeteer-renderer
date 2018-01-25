'use strict'

const puppeteer = require('puppeteer')
const _ = require('lodash')

class Renderer {
  constructor(browser) {
    this.browser = browser
  }

  async createPage(url, { timeout, waitUntil, viewport, userAgent }) {
    let gotoOptions = {
      timeout: Number(timeout) || 30 * 1000,
      waitUntil: waitUntil || 'networkidle2',
    }

    const page = await this.browser.newPage()

    if (viewport) {
      page.setViewport(JSON.parse(viewport))
    }

    if (userAgent) {
      page.setUserAgent(userAgent)
    }

    await page.goto(url, gotoOptions)
    return page
  }

  async render(url, options) {
    let page = null
    try {
      page = await this.createPage(url, { ...options })
      const html = await page.content()
      return html
    } finally {
      if (page) {
        await page.close()
      }
    }
  }

  async pdf(url, params) {
    let page = null
    try {
      page = await this.createPage(url, { ...params })

      const buffer = await page.pdf(this.permitOptions(params.options))
      return buffer
    } finally {
      if (page) {
        await page.close()
      }
    }
  }

  async screenshot(url, params) {
    let page = null
    try {
      page = await this.createPage(url, { ...params })

      const buffer = await page.screenshot(this.permitOptions(params.options))
      return buffer
    } finally {
      if (page) {
        await page.close()
      }
    }
  }

  async close() {
    await this.browser.close()
  }

  permitOptions(options) {
    if (options) {
      return _.omit(JSON.parse(options), ['path'])
    } else {
      return {}
    }
  }
}

async function create() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  return new Renderer(browser)
}

module.exports = create
