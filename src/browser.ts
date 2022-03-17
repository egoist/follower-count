import { Browser, BrowserContext, devices, chromium } from "playwright-core"
import { findChrome } from "./find-chrome"

let browser: Browser | undefined
let context: BrowserContext | undefined

export const getBrowserContext = async ({
  chromiumPath,
}: {
  chromiumPath?: string
} = {}) => {
  if (context) return context

  browser = await chromium.launch({
    args: ["--no-sandbox"],
    executablePath: chromiumPath || findChrome(),
  })
  context = await browser.newContext({
    ...devices["iPhone 12"],
  })

  return context
}

export const destroyBrowser = async () => {
  if (browser && context) {
    await context.close()
    await browser.close()
    browser = undefined
    context = undefined
  }
}
