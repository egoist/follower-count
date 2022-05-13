import { test, expect } from "vitest"
import { getFollowerCount, isFetchError } from "../src"

test("tiktok", async () => {
  const count = await getFollowerCount({
    type: "tiktok",
    username: "ronaldo",
  })

  console.log(count)
  expect(count).toBeGreaterThan(0)
})

test("tiktok user not found", async () => {
  try {
    await getFollowerCount({
      type: "tiktok",
      username: "ronaldo_not_exists",
    })
    expect.fail()
  } catch (error) {
    if (isFetchError(error)) {
      expect(error.response.status).toBe(404)
    } else {
      expect.fail()
    }
  }
})
