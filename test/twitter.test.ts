import { test, expect } from "vitest"
import { getBrowserContext, getFollowerCount, destroyBrowser } from "../src"

test("twitter", async () => {
  const [countByBrowser, countByApi] = await Promise.all([
    getFollowerCount({
      type: "twitter",
      username: "cristiano",
      browserContext: await getBrowserContext(),
    }),
    getFollowerCount({
      type: "twitter",
      username: "cristiano",
    }),
  ])

  await destroyBrowser()

  console.log(countByBrowser, countByApi)
  expect(countByBrowser).toBeGreaterThan(0)
  expect(countByApi).toBeGreaterThan(0)
})
