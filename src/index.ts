import { igApi as IgApi, getSessionId as getIgSessionId } from "insta-fetcher"
import axios from "axios"
import { getChannelInfo } from "yt-channel-info"
import { BrowserContext } from "playwright-core"

export type Options =
  | {
      type: "instagram"
      username: string
      auth: {
        username: string
        password: string
      }
    }
  | {
      type: "youtube"
      /** Channel ID or channel URL (https://www.youtube.com/c/CHANNEL_ID) */
      channel: string
    }
  | {
      type: "tiktok"
      username: string
    }
  | {
      /** Will use Chrome to render the Twitter profile */
      type: "twitter"
      username: string
      /**
       * A playwright chromium browser context
       * @example
       * ```js
       * import { getBrowserContext, destroyBrowser } from "follower-count"
       * await getFollowerCount({
       *   type: "twitter",
       *   username: "cristiano",
       *   browserContext: getBrowserContext({ chromiumPath: "/path/to/chromium" }),
       * })
       * await destroyBrowser()
       * ```
       */
      browserContext: BrowserContext
    }

const USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36`

const getYoutubeChannelId = (channel: string) => {
  if (channel.startsWith("https:")) {
    return channel.replace("https://www.youtube.com/c/", "").split("/")[0]
  }
  return channel
}

export const getFollowerCount = async (options: Options): Promise<number> => {
  if (options.type === "instagram") {
    return getInstagramFollowerCount(options.username, options.auth)
  }

  if (options.type === "youtube") {
    return getYoutubeFollowerCount(options.channel)
  }

  if (options.type === "tiktok") {
    return getTikTokFollowerCount(options.username)
  }

  if (options.type === "twitter") {
    return getTwitterFollowerCount(options.username, options.browserContext)
  }

  throw new Error(`Unknown type: ${(options as any).type}`)
}

export async function getInstagramFollowerCount(
  username: string,
  auth: { username: string; password: string },
) {
  const sessionId = await getIgSessionId(auth.username, auth.password)
  const ig = new IgApi(sessionId)
  const user = await ig.fetchUser(username)
  return user.followers
}

export async function getYoutubeFollowerCount(channel: string) {
  const info = await getChannelInfo({
    channelId: getYoutubeChannelId(channel),
  })
  // Not sure why subscriberCount might be a float
  return Math.floor(info.subscriberCount)
}

export async function getTikTokFollowerCount(username: string) {
  const { data } = await axios(`https://www.tiktok.com/@${username}`, {
    responseType: "text",
    headers: {
      // TikTok requires a user-agent, otherwise it will return an empty string
      "user-agent": USER_AGENT,
    },
  })

  const m = /"authorStats":{"followerCount":(\d+),/.exec(data)

  return m ? parseInt(m[1]) : 0
}

export async function getTwitterFollowerCount(
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

export * from "./browser"
