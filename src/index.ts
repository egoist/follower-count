import { igApi as IgApi, getSessionId as getIgSessionId } from "insta-fetcher"
import axios from "axios"
import { getChannelInfo } from "yt-channel-info"
import pptr from "puppeteer"

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
    const sessionId = await getIgSessionId(
      options.auth.username,
      options.auth.password,
    )
    const ig = new IgApi(sessionId)
    const user = await ig.fetchUserV2(options.username)
    return user.edge_followed_by.count
  }

  if (options.type === "youtube") {
    const info = await getChannelInfo({
      channelId: getYoutubeChannelId(options.channel),
    })
    return info.subscriberCount
  }

  if (options.type === "tiktok") {
    return getTikTokFollowerCount(options.username)
  }

  if (options.type === "twitter") {
    return getTwitterFollowerCount(options.username)
  }

  throw new Error(`Unknown type: ${(options as any).type}`)
}

async function getTikTokFollowerCount(username: string) {
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

async function getTwitterFollowerCount(username: string) {
  const htmlSelector = `a[href$="/followers"]`
  const browser = await pptr.launch({
    args: ["--no-sandbox"],
  })
  const page = await browser.newPage()
  await page.goto(`https://twitter.com/${username}`)
  await page.waitForSelector(htmlSelector)
  const text = await page.evaluate(
    (selector) => {
      const text = document.querySelector(selector)!.textContent || ""
      return text.split(" ")[0]
    },
    [htmlSelector],
  )

  const lastChar = text[text.length - 1].toLowerCase()

  const times = lastChar === "m" ? 1000000 : lastChar === "k" ? 1000 : 1
  const count = Number(text.replace(/[^.\d]+/g, "")) * times

  await page.close()
  await browser.close()

  return count
}
