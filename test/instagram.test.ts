import { test, expect } from "vitest"
import { getFollowerCount, getIgSessionId } from "../src"

test("instagram", async () => {
  const sessionId = await getIgSessionId(
    "dummy_ig_user_egoist",
    import.meta.env.VITE_IG_PASSWORD,
  )
  const count = await getFollowerCount({
    type: "instagram",
    username: "hello",
    sessionId,
  })

  console.log(count)
  expect(count).toBeGreaterThan(0)
})

test("instagram user not found", async () => {
  try {
    const sessionId = await getIgSessionId(
      "dummy_ig_user_egoist",
      import.meta.env.VITE_IG_PASSWORD,
    )
    await getFollowerCount({
      type: "instagram",
      username: "hello_xx88aa",
      sessionId,
    })
  } catch (error: any) {
    expect(error.message).toContain("user not found")
  }
})
