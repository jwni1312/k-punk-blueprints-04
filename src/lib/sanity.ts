import { createClient } from "@sanity/client"

export const sanityClient = createClient({
  projectId: "1ak7b3kb",
  dataset: "production",
  apiVersion: "2026-01-01",
  useCdn: false,
})

export async function getPosts() {
  return sanityClient.fetch(`
    *[_type == "post"] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      publishedAt
    }
  `)
}
