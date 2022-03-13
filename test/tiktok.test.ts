import { test, expect } from "vitest"
import { getFollowerCount } from "../src"

test("tiktok", async () => {
  const count = await getFollowerCount({
    type: "tiktok",
    username: "cristiano.ronaldo_._",
  })

  console.log(count)
  expect(count).toBeGreaterThan(0)
})
