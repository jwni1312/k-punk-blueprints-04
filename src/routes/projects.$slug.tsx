import { PortableText } from "@portabletext/react"
import { createFileRoute, Link, notFound } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { sanityClient } from "@/lib/sanity"

const getProjectBySlug = createServerFn({ method: "GET" })
  .validator((data: { slug: string }) => data)
  .handler(async ({ data }) => {
    return sanityClient.fetch(
      `*[_type == "project" && slug.current == $slug][0] {
        title,
        "slug": slug.current,
        year,
        client,
        tags,
        externalLink,
        "imageUrl": coverImage.asset->url,
        "imageAlt": coverImage.alt,
        description,
        "gallery": gallery[]{ "url": asset->url, "alt": alt }
      }`,
      { slug: data.slug }
    )
  })

export const Route = createFileRoute("/projects/$slug")({
  loader: async ({ params }) => {
    const project = await getProjectBySlug({ data: { slug: params.slug } })
    if (!project) throw notFound()
    return { project }
  },
  head: ({ loaderData }) => ({
    meta: [{ title: `${loaderData?.project.title ?? "Project"} — Folkography` }],
  }),
  notFoundComponent: () => (
    <main className="project-main">
      <p className="sidebar-intro">entry not found in archives.</p>
      <Link to="/projects" style={{ color: "var(--rose)", textDecoration: "underline" }}>
        ← return to projects
      </Link>
    </main>
  ),
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const { project } = Route.useLoaderData()

  return (
    <main className="project-main">
      <header className="project-topbar">
        <nav aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/projects">Projects</Link>
          <span>/</span>
          <span>{project.slug}</span>
        </nav>
        <span className="project-search">[archived]</span>
      </header>

      {project.imageUrl ? (
        <div className="project-hero">
          <img src={project.imageUrl} alt={project.imageAlt ?? project.title} loading="lazy" />
        </div>
      ) : null}

      <div className="project-content-grid">
        <div className="project-writing">
          <div className="project-title-block">
            <h1>{project.title}</h1>
            <span className="project-title-mark">■</span>
          </div>

          <div className="project-body">
            {project.description ? (
              <PortableText value={project.description} />
            ) : (
              <p>No documentation filed for this entry.</p>
            )}
          </div>

          {project.externalLink ? (
            <div className="project-external-link">
              <a href={project.externalLink} target="_blank" rel="noreferrer">
                external archive ↗
              </a>
            </div>
          ) : null}

          <div className="project-navigation">
            <Link to="/projects">← back to projects</Link>
            <Link to="/">index ↗</Link>
          </div>
        </div>

        <aside className="project-information">
          {project.year ? (
            <div className="information-row">
              <span>Year</span>
              <p>{project.year}</p>
            </div>
          ) : null}

          {project.client ? (
            <div className="information-row">
              <span>Subject / Client</span>
              <p>{project.client}</p>
            </div>
          ) : null}

          {project.tags && project.tags.length > 0 ? (
            <div className="information-row">
              <span>Categories</span>
              <p>{project.tags.join(" / ")}</p>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  )
}