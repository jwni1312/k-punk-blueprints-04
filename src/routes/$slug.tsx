import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getPost, posts } from "@/lib/posts";

export const Route = createFileRoute("/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [
          { title: "—" },
          { name: "robots", content: "noindex" },
        ],
        links: [{ rel: "stylesheet", href: "/kpunk-folkography.css" }],
      };
    return {
      meta: [
        { title: loaderData.post.title },
        { name: "description", content: loaderData.post.title },
      ],
      links: [{ rel: "stylesheet", href: "/kpunk-folkography.css" }],
    };
  },
  notFoundComponent: () => (
    <main className="solo">
      <p className="solo-back">
        <Link to="/">·</Link>
      </p>
      <article className="post">
        <p>not here.</p>
      </article>
    </main>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const Body = post.body;
  return (
    <main className="solo">
      <p className="solo-back">
        <Link to="/" aria-label="return">·</Link>
      </p>
      <article className="post">
        <header>
          <p className="meta">
            {post.date} · {post.dispatch}
          </p>
          <h2>{post.title}</h2>
        </header>
        <Body />
      </article>
    </main>
  );
}

// keep tree-shaking honest
void posts;
