import { test, expect } from "vitest"
import { getBrowserContext, getFollowerCount, destroyBrowser } from "../src"

test("twitter", async () => {
  const count = await getFollowerCount({
    type: "twitter",
    username: "cristiano",
    browserContext: await getBrowserContext(),
  })

  await destroyBrowser()

  console.log(count)
  expect(count).toBeGreaterThan(0)
})
