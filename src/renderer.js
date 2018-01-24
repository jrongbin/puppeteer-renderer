'use strict'

const puppeteer = require('puppeteer')

class Renderer {
  constructor(browser) {
    this.browser = browser
  }

  async createPage(url, { timeout, waitUntil }) {
    let gotoOptions = {
      timeout: Number(timeout) || 30 * 1000,
      waitUntil: waitUntil || 'networkidle2',
    }

    const page = await this.browser.newPage()
    await page.goto(url, gotoOptions)
    return page
  }

  async render(url, options) {
    let page = null
    try {
      const { timeout, waitUntil } = options
      page = await this.createPage(url, { timeout, waitUntil })
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
      const { timeout, waitUntil, options } = params
      page = await this.createPage(url, { timeout, waitUntil })
      const buffer = await page.pdf(JSON.parse(options))
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
      const { timeout, waitUntil, options } = params
      page = await this.createPage(url, { timeout, waitUntil })

      const buffer = await page.screenshot(JSON.parse(options))
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
}

async function create() {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] })
  return new Renderer(browser)
}

module.exports = create
