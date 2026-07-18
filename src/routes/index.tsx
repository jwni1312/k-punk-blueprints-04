import { createFileRoute, Link } from "@tanstack/react-router";
import { posts } from "@/lib/posts";

export const Route = createFileRoute("/")({
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
});

function Index() {
  return (
    <main className="index">
      <h1 className="index-mark">folkography</h1>
      <p className="index-whisper">
        <em>einmal ist keinmal</em> — read one at a time.
      </p>
      <ol className="index-list">
        {posts.map((p) => (
          <li key={p.slug}>
            <Link to="/$slug" params={{ slug: p.slug }}>
              {p.title}
            </Link>
            <time>{p.date}</time>
          </li>
        ))}
      </ol>
    </main>
  );
}
