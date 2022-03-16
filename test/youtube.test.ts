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
    channel: "https://www.youtube.com/c/UCq72e16zV6HGkDZmTzn-mDg",
  })

  console.log(count)
  expect(count).toBeGreaterThan(0)
})
