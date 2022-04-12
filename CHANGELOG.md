## Unreleased

No unreleased changes.

## 0.2.3

- twitter: Now you don't need headless chrome to fetch the follower count, it uses the twitter follow button api if a `browserContext` is not provided.

## 0.2.2

- fix: properly get youtube channel id

## 0.2.1

- Ensure the follower count of `youtube` is an integer

## 0.2.0

- twitter: allow to pass a playwright browser context instead of chromium executable path.

  ```js
  // before:
  await getFollowerCount({
    type: "twitter",
    username: "cristiano",
    chromiumPath: "/path/to/chromium",
  })

  // after:
  import { getBrowserContext, destroyBrowser } from "follower-count"
  await getFollowerCount({
    type: "twitter",
    username: "cristiano",
    browserContext: getBrowserContext({ chromiumPath: "/path/to/chromium" }),
  })
  await destroyBrowser()
  ```

## 0.1.3

- twitter: Allow to pass a custom path to Chromium executable, by default it looks for the Chrome/Chromium executable on your system, but if you're using this on AWS lambda or Google Cloud Functions, you can use this with `chrome-aws-lambda`.

## 0.1.2

- Accept a URL as youtube channel:
  ```js
  getFollowerCount({
    type: "youtube",
    channel: "https://www.youtube.com/c/CHANNEL_ID",
  })
  ```

## 0.1.1

- fix(twitter): disable Chrome sandbox by default.
- fix(twitter): wait for selector to appear.

## 0.1.0

- update readme
- tweaks
- tweaks
- Initial commit
