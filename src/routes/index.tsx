import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "folkography — notes on love, place & philosophy" },
      {
        name: "description",
        content:
          "A writing site in the k-punk tradition: philosophy, folkography, love, urban heritage.",
      },
    ],
    links: [{ rel: "stylesheet", href: "/kpunk-folkography.css" }],
  }),
  component: Index,
});

function Index() {
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
        <h1>
          <a href="/">folkography</a>
        </h1>
        <p className="tagline">
          philosophy, love, and the vernacular of the city
        </p>
      </header>

      <div className="ticker">
        <span>
          ▸ the lightness is the weight ▸ concrete remembers ▸ a love letter to
          the wrong address ▸ the archive is a wound ▸ overheard on the 27 bus
          ▸ stay with the trouble ▸
        </span>
      </div>

      <main className="wrap">
        <article className="post">
          <header>
            <p className="meta">17 July 2026 · dispatch 004</p>
            <h2>
              <a href="#">The unbearable lightness of the ring road</a>
            </h2>
          </header>

          <p>
            Kundera's <em>lightness</em> is not a relief. It is the condition
            under which nothing recurs, and therefore nothing can be measured.
            What is only lived once, he says, might as well not have been lived
            at all — <em>einmal ist keinmal</em>. This is usually read as
            melancholic. I want to read it as a description of the city.
          </p>

          <p>
            The eastern ring road, where I have walked for six years, has the
            texture of a thing that never repeats. Every crossing is once. Every
            light at 5:47pm is once. And yet the ring road is <em>heavy</em>. It
            is heavy in the way only a place that refuses to become a symbol can
            be heavy: it insists on its own particulars, and its particulars
            resist thought.
          </p>

          <p>
            This is what I mean when I say <strong>folkography</strong>. Not
            folklore. Not photography. A discipline — if it can be called that —
            of attending to the vernacular of place with the seriousness one
            usually reserves for philosophy. The city has a grammar. The bus
            stops keep diaries. To read them is not sentimental; it is
            ontological.
          </p>

          <blockquote>
            The everyday is not what is closest to us. It is what is most
            difficult to reach.
            <cite>Blanchot, roughly</cite>
          </blockquote>

          <h3>i. lightness as method</h3>

          <p>
            Fisher's <em>k-punk</em> was, among other things, a demonstration
            that theory could be practised at the speed of a blog post — that
            philosophy did not require the monograph, only the interval between
            one train and the next. What I want to borrow is not the tone but
            the tempo. Short entries. Long thoughts. Cheap paper.
          </p>

          <p>
            Lightness, then, is not a lack of seriousness. It is a refusal of
            the monument. The ring road is the opposite of a monument. It has
            no plaque, no anniversary, no photograph on the tourist board's
            website. It is only there, and it will only be there once, even
            though I walk it every week.
          </p>

          <h3>ii. love, or: the second reading</h3>

          <p>
            I walked it with M. in the winter. Love, in the Kunderian sense, is
            the second reading of a place — the moment at which the once-only
            becomes doubled, becomes bearable, because someone else has now also
            been there, at that hour, in that light. Heritage works the same
            way. It is the city's second reading of itself.
          </p>

          <p>
            The bakery on the corner has become a phone repair shop. Its
            hand-painted sign is layered over an older sign in a language I
            cannot read but recognise as <em>ours</em>. This is not
            preservation. It is palimpsest. Preservation freezes; palimpsest
            reads. To care about urban heritage, I think, is to prefer the
            palimpsest.
          </p>

          <p>
            This paragraph is the seventh, and if the CSS is working correctly
            it should refuse to be read cleanly — a small demonstration that
            the thought and the surface are not separable. The signal degrades
            because the signal was never clean to begin with. That is not a
            bug. That is the object of study.
          </p>

          <h3>iii. a programme, tentatively</h3>

          <p>
            I will post here weekly. Some entries will be theoretical, some
            will be field notes, some will be love letters addressed to
            buildings that no longer exist. I do not intend to distinguish them
            too carefully. Philosophy done from a bus stop is still philosophy.
            It is only the chairs that are missing.
          </p>

          <hr />

          <p>
            Write to me. Tell me about your ring road. Tell me the name of the
            bakery that closed, and who you loved there, and whether the light
            at 5:47pm still holds.
          </p>

          <div className="notes">
            <ol>
              <li>
                Milan Kundera, <em>The Unbearable Lightness of Being</em>
                (1984). The <em>einmal ist keinmal</em> passage is in the
                opening pages.
              </li>
              <li>
                Mark Fisher, <em>k-punk</em> (blog, 2003–2016); collected as
                <em> k-punk: The Collected and Unpublished Writings</em>
                (Repeater, 2018).
              </li>
              <li>
                Maurice Blanchot on the everyday — the line is a paraphrase;
                the essay is <em>Everyday Speech</em> (1959).
              </li>
            </ol>
          </div>

          <div className="tags">
            <a href="#" className="tag-folk">folkography</a>
            <a href="#" className="tag-love">love</a>
            <a href="#" className="tag-urban">urban heritage</a>
            <a href="#">philosophy</a>
            <a href="#">kundera</a>
          </div>
        </article>

        <aside className="sidebar">
          <div>
            <h4>About</h4>
            <p>
              A notebook on folkography — philosophy done on foot, from the
              outskirts inward.
            </p>
          </div>

          <div>
            <h4>Recent</h4>
            <ul>
              <li>
                <a href="#">The unbearable lightness of the ring road</a>
                <time>17.vii.2026</time>
              </li>
              <li>
                <a href="#">A love letter to the wrong address</a>
                <time>03.vii.2026</time>
              </li>
              <li>
                <a href="#">Overheard on the 27</a>
                <time>21.vi.2026</time>
              </li>
              <li>
                <a href="#">The archive is a wound</a>
                <time>09.vi.2026</time>
              </li>
            </ul>
          </div>

          <div>
            <h4>Tags</h4>
            <ul>
              <li><a href="#">folkography</a></li>
              <li><a href="#">love</a></li>
              <li><a href="#">urban heritage</a></li>
              <li><a href="#">philosophy</a></li>
              <li><a href="#">palimpsest</a></li>
              <li><a href="#">kundera</a></li>
              <li><a href="#">fisher</a></li>
            </ul>
          </div>

          <div>
            <h4>Colophon</h4>
            <p>
              Set in Georgia &amp; system sans. Written in transit. Best read
              on the way somewhere.
            </p>
          </div>
        </aside>
      </main>

      <footer className="colophon">
        © folkography — a notebook, not a monument. // ↑↑↓↓←→←→BA
      </footer>
    </>
  );
}
