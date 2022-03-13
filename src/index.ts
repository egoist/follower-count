export type Options = {
  type: "instagram" | "twitter" | "tiktok" | "youtube"
  account: string
}

export const getFollowerCount = async (options: Options): Promise<number> => {}
