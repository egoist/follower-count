import { test, expect } from "vitest"
import { getFollowerCount } from "../src"

test("youtube", async () => {
  const count = await getFollowerCount({
    type: "youtube",
    channel: "UCq72e16zV6HGkDZmTzn-mDg",
  })

  console.log(count)
  expect(typeof count).toBe("number")
})
