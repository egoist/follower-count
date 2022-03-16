## Unreleased

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
