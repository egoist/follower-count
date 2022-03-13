declare interface ImportMeta {
  env: {
    VITE_IG_PASSWORD: string
  }
}

declare module "yt-channel-info" {
  export function getChannelInfo(opts: { channelId: string }): Promise<{
    subscriberCount: number
  }>
}
