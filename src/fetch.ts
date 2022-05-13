import fetch, { Response, RequestInfo, RequestInit } from "node-fetch"

export class FetchError extends Error {
  response: Response

  constructor(response: Response) {
    super(response.statusText)
    this.response = response
  }
}

export const fetchEnhanced = async (url: RequestInfo, init?: RequestInit) => {
  return fetch(url, init).then((res) => {
    if (!res.ok) throw new FetchError(res)
    return res
  })
}

export const isFetchError = (error: any): error is FetchError => {
  return error instanceof FetchError
}
