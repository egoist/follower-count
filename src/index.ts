import { igApi as IgApi, getSessionId as getIgSessionId } from "insta-fetcher"
import axios from "axios"
import { getChannelInfo } from "yt-channel-info"
import { cleanup, request } from "taki"

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
      channel: string
    }
  | {
      type: "tiktok"
      username: string
    }
  | {
      type: "twitter"
      username: string
    }

const USER_AGENT = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36`

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
    const info = await getChannelInfo({ channelId: options.channel })
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
      "user-agent": USER_AGENT,
    },
  })

  const m = /"authorStats":{"followerCount":(\d+),/.exec(data)

  return m ? parseInt(m[1]) : 0
}

function stripHTMLTags(html: string) {
  return html.replace(/<[^>]*>/g, "")
}

async function getTwitterFollowerCount(username: string) {
  const html = await request({
    url: `https://twitter.com/${username}`,
    htmlSelector: `a[href$="/followers"]`,
  })
  const text = stripHTMLTags(html).split(" ")[0]
  const lastChar = text[text.length - 1].toLowerCase()

  const times = lastChar === "m" ? 1000000 : lastChar === "k" ? 1000 : 1
  const count = Number(text.replace(/[^.\d]+/g, "")) * times
  await cleanup()
  return count
}
