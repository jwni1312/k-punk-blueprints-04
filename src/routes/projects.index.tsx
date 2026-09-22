import { createFileRoute, Link } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getProjects } from "@/lib/sanity"

type Project = {
  title: string
  slug: string
  year?: number
  client?: string
  tags?: string[]
  imageUrl?: string
  imageAlt?: string
}

const loadProjects = createServerFn({ method: "GET" }).handler(async () => {
  return getProjects()
})

export const Route = createFileRoute("/projects/")({
  loader: async () => loadProjects(),
  head: () => ({
    meta: [
      { title: "Projects — Folkography" },
      { name: "description", content: "Selected projects, films, notes, and ongoing work." },
    ],
  }),
  component: ProjectsIndexPage,
})

function ProjectsIndexPage() {
  const projects = Route.useLoaderData() as Project[]

  return (
    <section className="projects-index-main">
      <header className="project-topbar">
        <nav aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span>/</span>
          <span>Projects</span>
        </nav>
        <span className="project-search">Search ______</span>
      </header>

      <header className="projects-index-header">
        <p className="projects-index-kicker">selected work</p>
        <h1>Projects</h1>
        <p>
          Films, images, notes, unfinished thoughts,
          and other things that insist on remaining.
        </p>
      </header>

      <div className="projects-index-list">
        {projects.map((project, index) => (
          <article className="projects-index-entry" key={project.slug}>
            <span className="projects-index-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="projects-index-entry-main">
              {project.imageUrl ? (
                <Link
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="projects-index-image-link"
                >
                  <img
                    src={project.imageUrl}
                    alt={project.imageAlt ?? ""}
                    className="projects-index-image"
                  />
                </Link>
              ) : null}

              <div className="projects-index-text">
                <Link
                  to="/projects/$slug"
                  params={{ slug: project.slug }}
                  className="projects-index-title"
                >
                  {project.title}
                </Link>

                <p className="projects-index-meta">
                  {project.year ?? "undated"}
                  {project.client ? ` / ${project.client}` : ""}
                </p>

                {project.tags?.length ? (
                  <p className="projects-index-tags">
                    {project.tags.join(" / ")}
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}