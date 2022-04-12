import axios from "axios"
import { BrowserContext } from "playwright-core"

export async function getTwitterFollowerCountWithEmbedApi(
  username: string,
): Promise<number> {
  return axios
    .get(
      `https://cdn.syndication.twimg.com/widgets/followbutton/info.json?screen_names=${username}&v=${Date.now()}`,
    )
    .then((res) => {
      if (res.data.length === 0) {
        throw new Error(`twitter user "${username}" does not exist`)
      }
      return res.data[0].followers_count
    })
}

export async function getTwitterFollowerCountWithBrowser(
  username: string,
  browserContext: BrowserContext,
) {
  const htmlSelector = `a[href$="/followers"]`
  const page = await browserContext.newPage()
  await page.goto(`https://twitter.com/${username}`)
  await page.waitForSelector(htmlSelector)
  const text = await page.evaluate((selector) => {
    const text = document.querySelector(selector)!.textContent || ""
    return text.split(" ")[0]
  }, htmlSelector)

  const lastChar = text[text.length - 1].toLowerCase()

  const times = lastChar === "m" ? 1000000 : lastChar === "k" ? 1000 : 1
  const count = Number(text.replace(/[^.\d]+/g, "")) * times

  await page.close()

  return count
}
