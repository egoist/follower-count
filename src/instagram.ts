// Modified from:
// MIT Licensed: https://github.com/Gimenz/insta-fetcher

import { fetchEnhanced } from "./fetch"

const config = {
  /** Instagram Base URL */
  instagram_base_url: "https://www.instagram.com",
  accept_language: "en-US,en",
  mobile: `Mozilla/5.0 (Linux; Android 10; SM-A102U Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/80.0.3987.99 Mobile Safari/537.36 Instagram 167.0.0.24.120 Android (29/10; 320dpi; 720x1402; samsung; SM-A102U; a10e; exynos7884B; en_US; 256966589)`,
}

const buildHeaders = ({
  userAgent = config.mobile,
  sessionId,
}: {
  userAgent?: string
  sessionId?: string
}) => {
  const headers: Record<string, string> = {
    "cache-control": "no-cache",
    "user-agent": userAgent,
    cookie: `sessionid=${sessionId};`,
    "accept-language": config.accept_language,
    "Accept-Encoding": "gzip, deflate, br",
    pragma: "no-cache",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
  }
  if (!sessionId) {
    delete headers.cookie
  }
  return headers
}

const getCsrfToken = async (): Promise<string> => {
  const requestHeaders = buildHeaders({})

  const res = await fetchEnhanced("https://www.instagram.com/accounts/login/", {
    method: "GET",
    headers: requestHeaders,
  })
  const setCookieHeader = res.headers.get("set-cookie")
  const csrfToken: string =
    setCookieHeader?.match(/csrftoken=(.*?);/)?.[1] || ""
  return csrfToken
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
  const genHeaders: Record<string, string> = {
    "X-CSRFToken": csrfToken,
    "user-agent": config.mobile,
    "cache-Control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    referer: "https://www.instagram.com/accounts/login/?source=auth_switcher",
    authority: "www.instagram.com",
    origin: "https://www.instagram.com",
    "accept-language": config.accept_language,
    "sec-fetch-site": "same-origin",
    "sec-fetch-mode": "cors",
    "sec-fetch-dest": "empty",
    "x-ig-app-id": "936619743392459",
    "x-ig-www-claim": "hmac.AR3W0DThY2Mu5Fag4sW5u3RhaR3qhFD_5wvYbOJOD9qaPjIf",
    "x-instagram-ajax": "1",
    "x-requested-with": "XMLHttpRequest",
    Cookie: "csrftoken=" + csrfToken + ";",
  }

  const res = await fetchEnhanced(
    "https://www.instagram.com/accounts/login/ajax/",
    {
      method: "POST",
      body: `username=${username}&enc_password=#PWD_INSTAGRAM_BROWSER:0:${Date.now()}:${password}&queryParams=%7B%22source%22%3A%22auth_switcher%22%7D&optIntoOneTap=false`,
      headers: genHeaders,
    },
  )

  const { authenticated } = (await res.json()) as any
  if (authenticated) {
    let session_id: string =
      res.headers.get("set-cookie")?.match(/sessionid=(.*?);/)?.[1] || ""
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
  const res = await fetchEnhanced(
    `${config.instagram_base_url}/${username}/?__a=1`,
    {
      headers: buildHeaders({ userAgent: config.mobile, sessionId }),
    },
  )
  const data = (await res.json()) as any
  return data.graphql?.user?.edge_followed_by?.count || 0
}
