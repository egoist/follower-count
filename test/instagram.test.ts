import { test, expect } from "vitest"
import { getFollowerCount } from "../src"

test("instagram", async () => {
  const count = await getFollowerCount({
    type: "instagram",
    username: "rachel__0106",
    auth: {
      username: "dummy_ig_user_egoist",
      password: import.meta.env.VITE_IG_PASSWORD,
    },
  })

  console.log(count)
  expect(count).toBeGreaterThan(0)
})
