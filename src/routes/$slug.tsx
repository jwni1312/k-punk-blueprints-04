import { PortableText } from "@portabletext/react"
import {
  createFileRoute,
  Link,
  notFound,
} from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { sanityClient } from "@/lib/sanity"

type SanityPost = {
  title: string
  slug: string
  publishedAt?: string
  body?: any[]
}

const getPostBySlug = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    return sanityClient.fetch<SanityPost | null>(
      `
        *[_type == "post" && slug.current == $slug][0]{
          title,
          "slug": slug.current,
          publishedAt,
          body
        }
      `,
      { slug: data.slug },
    )
  })

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug({
      data: { slug: params.slug },
    })

    if (!post) {
      throw notFound()
    }

    return { post }
  },

  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.post.title ?? "Post not found",
      },
      {
        name: "description",
        content: loaderData?.post.title ?? "",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "/kpunk-folkography.css",
      },
    ],
  }),

  notFoundComponent: () => (
    <main className="post">
      <p>not here.</p>
      <Link to="/">← return</Link>
    </main>
  ),

  component: PostPage,
})

function PostPage() {
  const { post } = Route.useLoaderData()

  return (
    <main className="post">
      <Link to="/">← return</Link>

      <article>
        <header>
          <h1>{post.title}</h1>

          {post.publishedAt ? (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString()}
            </time>
          ) : null}
        </header>

        <div className="post-body">
          <PortableText value={post.body ?? []} />
        </div>
      </article>
    </main>
  )
}