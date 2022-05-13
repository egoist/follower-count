import { test, expect } from "vitest"
import { getFollowerCount } from "../src"

test("youtube channel id", async () => {
  const count = await getFollowerCount({
    type: "youtube",
    channel: "UCq72e16zV6HGkDZmTzn-mDg",
  })

  console.log(count)
  expect(count).toBeGreaterThan(0)
})

test("youtube channel url", async () => {
  const count = await getFollowerCount({
    type: "youtube",
    channel: "https://www.youtube.com/channel/UCshily63dXlJL0J4A7ZMJ3Q",
  })

  console.log(count)
  expect(count).toBeGreaterThan(0)
  expect(Number.isInteger(count)).toBe(true)
})

test("youtube channel url without www", async () => {
  const count = await getFollowerCount({
    type: "youtube",
    channel: "https://youtube.com/channel/UC-py03XrXqLq197c6kMYI_A",
  })

  console.log(count)
  expect(count).toBeGreaterThan(0)
  expect(Number.isInteger(count)).toBe(true)
})
