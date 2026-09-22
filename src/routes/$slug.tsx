import { PortableText } from "@portabletext/react"
import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { sanityClient } from "@/lib/sanity"

type SanityPost = {
  title: string
  slug: string
  publishedAt?: string
  imageUrl?: string
  imageAlt?: string
  body?: any[]
}

const getPostBySlug = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    return sanityClient.fetch<SanityPost | null>(
      `
        *[_type == "post" && slug.current == $slug][0] {
          title,
          "slug": slug.current,
          publishedAt,
          "imageUrl": mainImage.asset->url,
          "imageAlt": mainImage.alt,
          body
        }
      `,
      { slug: data.slug },
    )
  })

export const Route = createFileRoute("/$slug")({
  loader: async ({ params }) => {
    const post = await getPostBySlug({
      data: {
        slug: params.slug,
      },
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
    <div className="project-screen">
      <main className="project-main">
        <p className="sidebar-intro">entry not found in archives.</p>
        <Link to="/" style={{ color: "var(--rose)", textDecoration: "underline" }}>
          ← return to index
        </Link>
      </main>
    </div>
  ),

  component: PostPage,
})

function PostPage() {
  const { post } = Route.useLoaderData()

  return (
    // We removed the <div className="project-screen"> and <aside className="project-sidebar">
    // This <main> will now perfectly slot into the right side of your __root.tsx layout.
    <main className="project-main">
      <header className="project-topbar">
        <nav aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>{post.slug}</span>
        </nav>
        <span className="project-search">[archived]</span>
      </header>

      {post.imageUrl ? (
        <div className="project-hero">
          <img
            src={post.imageUrl}
            alt={post.imageAlt ?? ""}
            loading="lazy"
          />
        </div>
      ) : null}

      <div className="project-content-grid">
        <div className="project-writing">
          <div className="project-title-block">
            <h1>{post.title}</h1>
            <span className="project-title-mark">■</span>
          </div>

          <div className="project-body">
            {post.body ? (
              <PortableText value={post.body} />
            ) : (
              <p>No text filed for this entry.</p>
            )}
          </div>

          <div className="project-navigation">
            <Link to="/">← back to index</Link>
          </div>
        </div>

        <aside className="project-information">
          {post.publishedAt ? (
            <div className="information-row">
              <span>Published</span>
              <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  )
}