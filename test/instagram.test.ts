import { test, expect } from "vitest"
import { getFollowerCount, getIgSessionId, isAxiosError } from "../src"

const IG_USER = import.meta.env.VITE_IG_USER
const IG_PASSWORD = import.meta.env.VITE_IG_PASSWORD

test("instagram", async () => {
  const sessionId = await getIgSessionId(IG_USER, IG_PASSWORD)
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
    const sessionId = await getIgSessionId(IG_USER, IG_PASSWORD)
    await getFollowerCount({
      type: "instagram",
      username: "hello_xx88aa",
      sessionId,
    })
    expect.fail()
  } catch (error: any) {
    if (isAxiosError(error)) {
      expect(error.response?.status).toBe(404)
    } else {
      expect.fail()
    }
  }
})
