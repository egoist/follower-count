// Modified from:
// MIT Licensed: https://github.com/Gimenz/insta-fetcher

import axios, { AxiosRequestHeaders, AxiosResponse } from "axios"

const config = {
  /** Instagram Base URL */
  instagram_base_url: "https://www.instagram.com",
  instagram_base_z4: "https://z-p4.www.instagram.com",
  /** Instagram Api Stories */
  instagram_stories_url: "https://i.instagram.com/api/v1/feed/user",
  /** Instagram Api Fetch User Data */
  instagram_user_url: "https://i.instagram.com/api/v1/users",
  /** Instagram API Search User */
  instagram_search_url:
    "https://www.instagram.com/web/search/topsearch/?query=",
  /** Instagram GraphQL query */
  instagram_graphql: "https://www.instagram.com/graphql/query/",
  /** Android User-Agent */
  android:
    "Instagram 10.8.0 Android (18/4.3; 320dpi; 720x1280; Xiaomi; HM 1SW; armani; qcom; en_US)",
  /** Desktop User-Agent */
  desktop:
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
  /** iPhone User-Agent */
  iPhone:
    "Instagram 123.0.0.21.114 (iPhone; CPU iPhone OS 11_4 like Mac OS X; en_US; en-US; scale=2.00; 750x1334) AppleWebKit/605.1.15",
}

const buildHeaders = ({
  userAgent = config.android,
  sessionId,
}: {
  userAgent: string
  sessionId: string
}) => {
  return {
    "cache-control": "no-cache",
    "user-agent": userAgent,
    cookie: `sessionid=${sessionId};`,
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7,pt;q=0.6,ru;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
    pragma: "no-cache",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
  }
}

const getCsrfToken = async (): Promise<string> => {
  try {
    const { headers } = await axios({
      method: "GET",
      url: "https://www.instagram.com/accounts/login/",
    })
    let csrfToken: string =
      headers["set-cookie"]
        ?.find((x) => x.match(/csrftoken=(.*?);/)?.[1])
        ?.match(/csrftoken=(.*?);/)?.[1] || ""
    return csrfToken
  } catch (error) {
    throw error
  }
}

export const getIgSessionId = async (
  username: string,
  password: string,
): Promise<string> => {
  if (typeof username !== "string" || typeof password !== "string") {
    throw new TypeError(
      `Expected a string, got ${
        typeof username !== "string" ? typeof username : typeof password
      }`,
    )
  }

  const csrfToken = await getCsrfToken()
  const genHeaders: AxiosRequestHeaders = {
    "X-CSRFToken": csrfToken,
    "user-agent": config.desktop,
    "cache-Control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    referer: "https://www.instagram.com/accounts/login/?source=auth_switcher",
    authority: "www.instagram.com",
    origin: "https://www.instagram.com",
    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    "x-ig-app-id": "936619743392459",
    "x-ig-www-claim": "hmac.AR3W0DThY2Mu5Fag4sW5u3RhaR3qhFD_5wvYbOJOD9qaPjIf",
    "x-instagram-ajax": "1",
    "x-requested-with": "XMLHttpRequest",
    Cookie: "csrftoken=" + csrfToken + ";",
  }

  const { headers, data }: AxiosResponse = await axios({
    method: "POST",
    url: "https://www.instagram.com/accounts/login/ajax/",
    data: `username=${username}&enc_password=#PWD_INSTAGRAM_BROWSER:0:${Date.now()}:${password}&queryParams=%7B%22source%22%3A%22auth_switcher%22%7D&optIntoOneTap=false`,
    headers: genHeaders,
  })

  const { authenticated } = data
  if (authenticated) {
    let session_id: string =
      headers["set-cookie"]
        ?.find((x) => x.match(/sessionid=(.*?);/)?.[1])
        ?.match(/sessionid=(.*?);/)?.[1] || ""
    return session_id
  }

  throw new Error(
    "Username or password is incorrect. Please check and try again",
  )
}

export async function getIgFollowerCount(
  username: string,
  sessionId: string,
): Promise<number> {
  try {
    const { data } = await axios({
      url: `${config.instagram_base_url}/${username}/?__a=1`,
      headers: buildHeaders({ userAgent: config.android, sessionId }),
    })
    return data.graphql?.user?.edge_followed_by?.count || 0
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error(`user not found`)
      } else if (error.response?.status === 429) {
        throw new Error(`too many request`)
      }
    }
    throw error
  }
}
