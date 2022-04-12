import { test, expect } from "vitest"
import { getYoutubeChannelId } from "../src/utils"

test("getYoutubeChannelId", () => {
  expect(getYoutubeChannelId("https://www.youtube.com/c/CHANNEL_ID")).toBe(
    "CHANNEL_ID",
  )
  expect(getYoutubeChannelId("https://www.youtube.com/user/CHANNEL_ID")).toBe(
    "CHANNEL_ID",
  )
  expect(getYoutubeChannelId("https://www.youtube.com/CHANNEL_ID")).toBe(
    "CHANNEL_ID",
  )
  expect(getYoutubeChannelId("CHANNEL_ID")).toBe("CHANNEL_ID")
})
