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
      publishedAt,
      "imageUrl": mainImage.asset->url,
      "imageAlt": mainImage.alt
    }
  `)
}
export async function getProjects() {
  return sanityClient.fetch(`
    *[_type == "project"] | order(year desc) {
      title,
      "slug": slug.current,
      year,
      client,
      tags,
      "imageUrl": coverImage.asset->url,
      "imageAlt": coverImage.alt
    }
  `)
}
