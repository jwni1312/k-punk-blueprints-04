import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useNavigate,
  useLocation,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <main className="project-main">
      <p className="sidebar-intro">404 / entry not found in archives.</p>
      <Link to="/" style={{ color: "var(--rose)", textDecoration: "underline" }}>
        ← return to index
      </Link>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <main className="project-main">
      <p className="sidebar-intro">An error occurred accessing the archives.</p>
      <button
        onClick={() => {
          router.invalidate();
          reset();
        }}
        style={{ color: "var(--rose)", textDecoration: "underline", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", padding: 0 }}
      >
        Try again
      </button>
      <span style={{ margin: "0 10px", color: "var(--cream-muted)" }}>/</span>
      <Link to="/" style={{ color: "var(--rose)", textDecoration: "underline" }}>
        Go home
      </Link>
    </main>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" },
      { title: "TINAFTO" },
      { name: "description", content: "TINAFTO digital space." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "/kpunk-folkography.css" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preload", as: "image", href: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Garden_of_earthly_delights.jpg/1920px-The_Garden_of_earthly_delights.jpg" },
      { rel: "preload", as: "image", href: "https://i.postimg.cc/QtyVSZ34/grandma.jpg" }
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body style={{ background: "var(--night)", color: "var(--cream)" }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const navigate = useNavigate();
  const location = useLocation(); // Διαβάζει το τρέχον URL

  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const cursorRef = useRef<HTMLDivElement>(null);
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio('https://www.dropbox.com/scl/fi/tj22a4t89jddj5ipuqadc/01-Addis.mp3?rlkey=9ezr7ao6nkrhogezblz93cer5&st=91vuun0m&raw=1');
    }
    
    const bgAudio = audioRef.current;
    const maxVolume = 0.4;
    const fadeDuration = 3; 

    const startAudio = () => {
      if (bgAudio.paused) {
        bgAudio.volume = 0;
        bgAudio.play().catch(() => {});
      }
      document.removeEventListener('pointerdown', startAudio);
      document.removeEventListener('keydown', handleFirstKey);
    };

    const handleFirstKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return;
      startAudio();
    };

    document.addEventListener('pointerdown', startAudio);
    document.addEventListener('keydown', handleFirstKey);

    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        navigate({ to: '/' });
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);

    const handleTimeUpdate = () => {
      if (isNaN(bgAudio.duration)) return;
      const currentTime = bgAudio.currentTime;
      const duration = bgAudio.duration;

      if (currentTime < fadeDuration) {
        bgAudio.volume = Math.min(maxVolume, maxVolume * (currentTime / fadeDuration));
      } else if (currentTime > duration - fadeDuration) {
        bgAudio.volume = Math.max(0, maxVolume * ((duration - currentTime) / fadeDuration));
      } else {
        bgAudio.volume = maxVolume;
      }
    };

    bgAudio.addEventListener('timeupdate', handleTimeUpdate);

    const handleEnded = () => {
      bgAudio.currentTime = 0;
      bgAudio.play().catch(() => {});
    };
    
    bgAudio.addEventListener('ended', handleEnded);

    return () => {
      document.removeEventListener('pointerdown', startAudio);
      document.removeEventListener('keydown', handleFirstKey);
      window.removeEventListener('keydown', handleGlobalKeyDown);
      bgAudio.removeEventListener('timeupdate', handleTimeUpdate);
      bgAudio.removeEventListener('ended', handleEnded);
    };
  }, [navigate]);

  useEffect(() => {
    let currentHoverState = false;

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isIntro = !!(target && target.closest('.void-root'));

      if (isIntro) {
        document.body.classList.remove('enable-custom-cursor');
        setIsCursorVisible(false);
        return; 
      } else {
        document.body.classList.add('enable-custom-cursor');
        setIsCursorVisible(true);
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      
      if (target && target.closest) {
        const isClickable = !!(
          target.closest('a, button, input, textarea, .tinafto-monolith, .dir-node, .phil-row, .card-row, .deck-btn, .pixel-envelope, .close-btn, .retro-submit') || 
          window.getComputedStyle(target).cursor === 'pointer'
        );
        
        if (isClickable !== currentHoverState) {
          currentHoverState = isClickable;
          setIsCursorHovering(isClickable);
        }
      }
    };

    const handleMouseLeave = () => {
      setIsCursorVisible(false);
      document.body.classList.remove('enable-custom-cursor');
    };

    window.addEventListener('mousemove', updateCursor, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <style dangerouslySetInnerHTML={{ __html: `
        body.enable-custom-cursor * { cursor: none !important; }
        .custom-cursor-container { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999999; will-change: transform; }
        .cursor-cross { position: absolute; width: 32px; height: 32px; transform: translate(-16px, -14px) scale(0.75); transform-origin: 16px 14px; }
        .cursor-knife { position: absolute; width: 32px; height: 32px; transform: translate(-2px, -30px); }
        .blood-drop { position: absolute; top: 30px; left: 2px; width: 2px; height: 3px; background-color: #aa0000; border-left: 1px solid #ff4d4d; border-bottom: 1px solid #4a0000; animation: blood-drip 1.3s infinite cubic-bezier(0.4, 0, 1, 1); }
        @keyframes blood-drip { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(20px); opacity: 0.9; } 100% { transform: translateY(30px); opacity: 0; } }

        .audio-global-btn {
          position: fixed;
          top: 2rem;
          left: 2rem;
          background: var(--night, #000);
          border: 1px solid rgba(255, 230, 160, 0.3);
          color: var(--cream);
          padding: 0.7rem;
          cursor: pointer;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border-radius: 4px;
        }

        /* ΝΕΟ: CSS ΓΙΑ TO PAGE TRANSITION */
        .page-transition-wrapper {
          animation: pageFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        @keyframes pageFadeIn {
          0% { opacity: 0; filter: blur(10px); }
          100% { opacity: 1; filter: blur(0); }
        }

        @media (max-width: 768px) {
          .custom-cursor-container { display: none !important; }
          body.enable-custom-cursor * { cursor: auto !important; }

          .audio-global-btn {
            top: auto !important;
            bottom: 1.5rem !important;
            right: 1.5rem !important;
            left: auto !important;
            padding: 0.6rem !important;
            background: rgba(0, 0, 0, 0.8) !important;
            border-color: rgba(206, 104, 117, 0.4) !important;
          }

          .project-screen {
            display: flex;
            flex-direction: column !important;
          }

          .project-sidebar {
            width: 100% !important;
            position: relative !important;
            height: auto !important;
            border-bottom: 1px solid rgba(255, 230, 160, 0.2) !important;
            padding: 1.5rem 1rem !important;
            text-align: center;
          }

          .sidebar-logo {
            font-size: 1.6rem !important;
            margin-bottom: 1rem !important;
          }

          .sidebar-nav {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: center !important;
            gap: 0.8rem 1.2rem !important;
          }

          .sidebar-nav a {
            font-size: 0.8rem !important;
            letter-spacing: 1px !important;
          }
        }
      `}} />

      {isCursorVisible && (
        <div ref={cursorRef} className="custom-cursor-container">
          {!isCursorHovering ? (
            <div className="cursor-cross">
              <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
                <rect x="14" y="2" width="4" height="28" fill="#1a1a1a" />
                <rect x="4" y="12" width="24" height="4" fill="#1a1a1a" />
                <rect x="15" y="3" width="2" height="26" fill="#a3a3a3" />
                <rect x="5" y="13" width="22" height="2" fill="#a3a3a3" />
                <rect x="14" y="12" width="4" height="4" fill="#4a0000" />
              </svg>
            </div>
          ) : (
            <div className="cursor-knife">
              <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges">
                <path d="M28,2 L32,6 L22,16 L18,12 Z" fill="#1a1a1a"/>
                <path d="M15,14 L17,16 L4,29 L1,27 Z" fill="#1a1a1a"/> 
                <path d="M14,14 L16,16 L3,29 L1,27 Z" fill="#b3b3b3"/> 
                <rect x="2" y="29" width="1" height="1" fill="#ff3333"/> 
              </svg>
              <div className="blood-drop" />
            </div>
          )}
        </div>
      )}

      <div className="project-screen">
        <aside className="project-sidebar">
          <div>
            <Link to="/" className="sidebar-logo" style={{ color: 'var(--rose, #ff4d4d)' }}>
              TINAFTO
            </Link>

            <nav className="sidebar-nav" aria-label="Main navigation">
              <Link to="/writings" activeProps={{ className: "is-active" }}>ΓΡΑΦΤΑ</Link>
              <Link to="/philosophy" activeProps={{ className: "is-active" }}>ΦΙΛΟΣΟΦΙΑ</Link>
              <Link to="/oral-history" activeProps={{ className: "is-active" }}>ΠΡΟΦΟΡΙΚΗ ΙΣΤΟΡΙΑ</Link>
              <Link to="/echotopias" activeProps={{ className: "is-active" }}>ΗΧΟΤΟΠΙΑ</Link>
              <Link to="/contact" activeProps={{ className: "is-active" }}>CONTACT</Link>
            </nav>
          </div>
        </aside>

        {/* ΝΕΟ: Εφαρμογή του animation με βάση το URL */}
        <div key={location.pathname} className="page-transition-wrapper">
          <Outlet />
        </div>

        <button 
          className="audio-global-btn"
          onClick={toggleMute}
          title={isMuted ? "Ενεργοποίηση Ήχου" : "Σίγαση"}
        >
          {isMuted ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          )}
        </button>
      </div>
    </QueryClientProvider>
  );
}