import { test, expect } from "vitest"
import { getFollowerCount } from "../src"

process.env.FOLLOWER_COUNT_NO_SANDBOX = 'true'

test("twitter", async () => {
  const count = await getFollowerCount({
    type: "twitter",
    username: "cristiano",
  })

  console.log(count)
  expect(count).toBeGreaterThan(0)
})
