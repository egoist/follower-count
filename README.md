**💛 You can help the author become a full-time open-source maintainer by [sponsoring him on GitHub](https://github.com/sponsors/egoist).**

---

# follower-count

[![npm version](https://badgen.net/npm/v/follower-count)](https://npm.im/follower-count) [![npm downloads](https://badgen.net/npm/dm/follower-count)](https://npm.im/follower-count)

## Install

```bash
npm i follower-count
```

## Example

```ts
import { getFollowerCount } from "follower-count"

await getFollowerCount({
  type: "instagram",
  username: "cristiano",
  auth: {
    username: "username",
    password: "password",
  },
})

await getFollowerCount({
  type: "twitter",
  username: "cristiano",
})
```

## Documentation

https://paka.dev/npm/follower-count

## Sponsors

[![sponsors](https://sponsors-images.egoist.sh/sponsors.svg)](https://github.com/sponsors/egoist)

## License

MIT &copy; [EGOIST](https://github.com/sponsors/egoist)
