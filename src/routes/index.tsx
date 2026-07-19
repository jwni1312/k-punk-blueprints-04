import { createFileRoute, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getPosts, sanityClient } from "@/lib/sanity"

const getHomepage = createServerFn({ method: "GET" }).handler(async () => {
  const [homepage, sanityPosts] = await Promise.all([
    sanityClient.fetch<{
      siteTitle?: string
      subtitle?: string
    } | null>(`
      *[_type == "homepage"][0]{
        siteTitle,
        subtitle
      }
    `),
    getPosts(),
  ])

  return {
    homepage,
    sanityPosts,
  }
})

export const Route = createFileRoute("/")({
  loader: () => getHomepage(),

  head: () => ({
    meta: [
      { title: "folkography" },
      {
        name: "description",
        content: "a notebook. philosophy, love, urban heritage.",
      },
    ],
    links: [{ rel: "stylesheet", href: "/kpunk-folkography.css" }],
  }),

  component: Index,
})

function Index() {
  const { homepage, sanityPosts } = Route.useLoaderData()

  return (
    <main className="index">
      <h1 className="index-mark">
        {homepage?.siteTitle ?? "folkography"}
      </h1>

      <p className="index-whisper">
        {homepage?.subtitle ?? "einmal ist keinmal — read one at a time."}
      </p>

      <ol className="index-list">
        {sanityPosts.map(
          (post: {
            slug: string
            title: string
            publishedAt?: string
          }) => (
            <li key={post.slug}>
              <Link to="/$slug" params={{ slug: post.slug }}>
                {post.title}
              </Link>

              <time>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString()
                  : ""}
              </time>
            </li>
          ),
        )}
      </ol>
    </main>
  )
}