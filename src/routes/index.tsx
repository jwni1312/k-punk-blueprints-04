import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "folkography — notes on love & urban heritage" },
      {
        name: "description",
        content:
          "A k-punk-inspired writing site on folkography, love, and urban heritage.",
      },
    ],
    links: [{ rel: "stylesheet", href: "/kpunk-folkography.css" }],
  }),
  component: Index,
});

function Index() {
  // Konami easter egg
  useEffect(() => {
    const seq = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      i = e.keyCode === seq[i] ? i + 1 : 0;
      if (i === seq.length) {
        document.body.classList.toggle("konami");
        i = 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="masthead">
        <h1>folkography</h1>
        <p className="tagline">folkography · love · urban heritage</p>
        <div className="ticker">
          <span>
            ▸ field notes from the tram stop ▸ a love letter to the wrong
            address ▸ concrete remembers ▸ overheard on the 27 bus ▸ the archive
            is a wound ▸ stay with the trouble ▸
          </span>
        </div>
      </header>

      <main className="wrap">
        <article className="post">
          <header>
            <p className="meta">17 · vii · 2026 — dispatch №004</p>
            <h2>
              <a href="#">Concrete remembers: a folkography of the ring road</a>
            </h2>
          </header>

          <p>
            There is a stretch of overpass on the eastern ring where the light
            hits the balustrade at 5:47pm and, for maybe ninety seconds, the
            whole city admits it was built by hand. I have been walking there
            for six years. I am still learning its grammar.
          </p>

          <p>
            Folkography, as I use the word, is not folklore and not photography
            — it is the practice of listening to place as if place had a
            <em> vernacular</em>. The buildings speak in dialect. The bus stops
            keep diaries.
          </p>

          <blockquote>
            The city is a text written by nobody in particular and read by
            everybody at once. — overheard, tram 4
          </blockquote>

          <h3>What the ring road knows</h3>

          <p>
            The ring road knows the name of every person who has waited for a
            bus that never came. It knows the difference between grief and
            traffic. It knows the exact weight of a shopping bag full of
            oranges.
          </p>

          <p>
            I walked it with M. in the winter. We didn't talk much. Love, at
            that point, was mostly a shared vocabulary for weather. She said:
            <em> everything ugly here is honest</em>. I wrote it down on the
            back of a receipt from a bakery that has since closed.
          </p>

          <p>
            The bakery is now a phone repair shop. The phone repair shop has a
            hand-painted sign in Cyrillic and Latin script, layered over an
            older sign in a language I cannot read but recognise as <em>ours</em>.
            This is what I mean by heritage. Not the plaque. The palimpsest.
          </p>

          <h3>Method (such as it is)</h3>

          <p>
            You walk. You write down what you hear. You do not correct the
            grammar of the city. You take photographs only of the things you
            cannot describe. You go back on a different day and check whether
            the place still agrees with you. Usually it doesn't.
          </p>

          <p>
            This paragraph is the seventh. Hover over it if you have a mouse.
            The city glitches when you look too closely. So do I. So does love.
            So does any archive worth keeping. The signal degrades. The signal
            was never clean to begin with. That's the point.
          </p>

          <hr />

          <p>
            I'll be posting field notes here weekly. Some will be short —
            single overheard sentences, a photograph of a doorway, the smell of
            a stairwell rendered into three lines. Others will be longer, like
            this one, and probably worse.
          </p>

          <p>
            Write to me. Tell me about your ring road. Tell me the name of the
            bakery that closed. Tell me who you loved there.
          </p>

          <div className="tags">
            <a href="#" className="tag-folk">
              folkography
            </a>
            <a href="#" className="tag-love">
              love
            </a>
            <a href="#" className="tag-urban">
              urban heritage
            </a>
            <a href="#" className="tag-folk">
              field notes
            </a>
          </div>
        </article>

        <aside className="sidebar">
          <h4>About</h4>
          <p>
            A notebook on <em>folkography</em> — the vernacular of place —
            written on foot, from the outskirts inward.
          </p>

          <h4>Recent</h4>
          <ul>
            <li>
              <a href="#">Concrete remembers</a>
              <time>17 · vii · 2026</time>
            </li>
            <li>
              <a href="#">A love letter to the wrong address</a>
              <time>03 · vii · 2026</time>
            </li>
            <li>
              <a href="#">Overheard on the 27</a>
              <time>21 · vi · 2026</time>
            </li>
            <li>
              <a href="#">The archive is a wound</a>
              <time>09 · vi · 2026</time>
            </li>
          </ul>

          <h4>Tags</h4>
          <ul>
            <li>
              <a href="#">folkography</a>
            </li>
            <li>
              <a href="#">love</a>
            </li>
            <li>
              <a href="#">urban heritage</a>
            </li>
            <li>
              <a href="#">field notes</a>
            </li>
            <li>
              <a href="#">palimpsest</a>
            </li>
          </ul>

          <h4>Colophon</h4>
          <p>
            Set in Iowan Old Style &amp; JetBrains Mono. Written in transit.
            Best read on the way somewhere.
          </p>
        </aside>
      </main>

      <footer className="colophon">
        © folkography — a notebook, not a monument. try ↑↑↓↓←→←→BA.
      </footer>
    </>
  );
}
