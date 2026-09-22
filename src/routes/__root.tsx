import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

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
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

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
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Folkography" },
      { name: "description", content: "notes on cinema, music, image, and everything in-between." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "stylesheet", href: "/kpunk-folkography.css" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
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

  // Audio States
  const [isMuted, setIsMuted] = useState(false);
  const [isAudioHovered, setIsAudioHovered] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cursor States
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isCursorHovering, setIsCursorHovering] = useState(false);
  const [isCursorVisible, setIsCursorVisible] = useState(false);

  /* ================= AUDIO LOGIC ================= */
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

  /* ================= CURSOR LOGIC ================= */
  useEffect(() => {
    let currentHoverState = false;

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Έλεγχος: Είμαστε στο Intro interface (.void-root) ?
      const isIntro = !!(target && target.closest('.void-root'));

      if (isIntro) {
        // Αν είμαστε στο intro, επαναφέρουμε τον κανονικό κέρσορα
        document.body.classList.remove('enable-custom-cursor');
        setIsCursorVisible(false);
        return; 
      } else {
        // Αν μπήκαμε στο κυρίως site, ενεργοποιούμε τον Goth κέρσορα
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
      
      {/* CURSOR CSS */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Ο custom κέρσορας κρύβει τον default ΜΟΝΟ όταν το class 'enable-custom-cursor' είναι ενεργό (δηλαδή εκτός intro) */
        body.enable-custom-cursor * { cursor: none !important; }
        
        .custom-cursor-container { position: fixed; top: 0; left: 0; pointer-events: none; z-index: 9999999; will-change: transform; }
        
        /* O Σταυρός μίκρυνε (scale: 0.75) με transform-origin για να χτυπάει ακριβώς στο κέντρο */
        .cursor-cross { 
          position: absolute; width: 32px; height: 32px; 
          transform: translate(-16px, -14px) scale(0.75); 
          transform-origin: 16px 14px; 
        }
        
        .cursor-knife { position: absolute; width: 32px; height: 32px; transform: translate(-2px, -30px); }
        .blood-drop {
          position: absolute; top: 30px; left: 2px; width: 2px; height: 3px; background-color: #aa0000;
          border-left: 1px solid #ff4d4d; border-bottom: 1px solid #4a0000; animation: blood-drip 1.3s infinite cubic-bezier(0.4, 0, 1, 1);
        }
        @keyframes blood-drip { 0% { transform: translateY(0); opacity: 1; } 70% { transform: translateY(20px); opacity: 0.9; } 100% { transform: translateY(30px); opacity: 0; } }
      `}} />

      {/* CUSTOM CURSOR RENDER */}
      {isCursorVisible && (
        <div ref={cursorRef} className="custom-cursor-container">
          {!isCursorHovering ? (
            <div className="cursor-cross">
              <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges" style={{ filter: 'drop-shadow(2px 3px 0px rgba(0,0,0,0.9))' }}>
                <rect x="14" y="2" width="4" height="28" fill="#1a1a1a" />
                <rect x="4" y="12" width="24" height="4" fill="#1a1a1a" />
                <rect x="12" y="0" width="8" height="4" fill="#1a1a1a" />
                <rect x="12" y="28" width="8" height="4" fill="#1a1a1a" />
                <rect x="0" y="10" width="4" height="8" fill="#1a1a1a" />
                <rect x="28" y="10" width="4" height="8" fill="#1a1a1a" />
                <rect x="15" y="3" width="2" height="26" fill="#a3a3a3" />
                <rect x="5" y="13" width="22" height="2" fill="#a3a3a3" />
                <rect x="13" y="1" width="6" height="2" fill="#c0c0c0" />
                <rect x="13" y="29" width="6" height="2" fill="#808080" />
                <rect x="1" y="11" width="2" height="4" fill="#c0c0c0" />
                <rect x="29" y="11" width="2" height="4" fill="#808080" />
                <rect x="15" y="3" width="1" height="26" fill="#e5e5e5" />
                <rect x="5" y="13" width="22" height="1" fill="#e5e5e5" />
                <rect x="13" y="11" width="6" height="6" fill="#1a1a1a" />
                <rect x="14" y="12" width="4" height="4" fill="#4a0000" />
                <rect x="15" y="13" width="2" height="2" fill="#b30000" />
                <rect x="15" y="13" width="1" height="1" fill="#ff4d4d" />
              </svg>
            </div>
          ) : (
            <div className="cursor-knife">
              <svg width="32" height="32" viewBox="0 0 32 32" shapeRendering="crispEdges" style={{ filter: 'drop-shadow(2px 2px 0px rgba(0,0,0,0.8))' }}>
                <path d="M28,2 L32,6 L22,16 L18,12 Z" fill="#1a1a1a"/>
                <path d="M28,4 L30,6 L22,14 L20,12 Z" fill="#4a3018"/>
                <rect x="25" y="8" width="2" height="2" fill="#808080"/> 
                <rect x="22" y="11" width="2" height="2" fill="#808080"/> 
                <path d="M14,10 L20,16 L18,18 L12,12 Z" fill="#1a1a1a"/>
                <path d="M15,11 L19,15 L18,16 L14,12 Z" fill="#555"/>
                <path d="M15,14 L17,16 L4,29 L1,27 Z" fill="#1a1a1a"/> 
                <path d="M14,14 L16,16 L3,29 L1,27 Z" fill="#b3b3b3"/> 
                <path d="M13,14 L15,16 L2,29 L1,27 Z" fill="#ffffff"/> 
                <path d="M1,27 L5,26 L4,29 L1,30 Z" fill="#660000"/>
                <path d="M2,28 L4,27 L3,29 L1,30 Z" fill="#b30000"/>
                <rect x="2" y="29" width="1" height="1" fill="#ff3333"/> 
              </svg>
              <div className="blood-drop" />
              <div className="blood-drop" style={{ animationDelay: '0.6s', left: '4px', top: '28px', opacity: 0.8 }} />
            </div>
          )}
        </div>
      )}

      <div className="project-screen">
        <aside className="project-sidebar">
          <div>
            <Link to="/" className="sidebar-logo">
              FOLKOGRAPHY
            </Link>

            <p className="sidebar-intro">
              notes on cinema, music,
              <br />
              image, and everything
              <br />
              in-between.
            </p>

            <nav className="sidebar-nav" aria-label="Main navigation">
              <Link to="/" activeProps={{ className: "is-active" }} activeOptions={{ exact: true }}>
                / Home
              </Link>
              <Link to="/projects" activeProps={{ className: "is-active" }}>
                / Projects
              </Link>
              <span>Notebook</span>
              <span>About</span>
              <span>Contact</span>
            </nav>
          </div>

          <footer className="sidebar-footer">
            <p>© 2026 Folkography</p>
            <p>Built as a digital notebook.</p>
          </footer>
        </aside>

        <Outlet />

        {/* ΚΟΥΜΠΙ ΗΧΟΥ (ΜΟΝΟ ΠΑΝΩ ΑΡΙΣΤΕΡΑ) */}
        <button 
          onClick={toggleMute}
          onMouseEnter={() => setIsAudioHovered(true)}
          onMouseLeave={() => setIsAudioHovered(false)}
          title={isMuted ? "Ενεργοποίηση Ήχου" : "Σίγαση"}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '2rem',
            background: 'var(--night, #000)',
            border: '1px solid rgba(255, 230, 160, 0.3)',
            color: isMuted ? 'rgba(255, 230, 160, 0.4)' : 'var(--cream)',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '0.8rem',
            letterSpacing: '2px',
            padding: isAudioHovered ? '0.6rem 1.2rem' : '0.6rem',
            cursor: 'pointer',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            transition: 'all 0.3s ease',
          }}
        >
          {isAudioHovered ? (
            isMuted ? '[ AUDIO // MUTED ]' : '[ AUDIO // ON ]'
          ) : (
            isMuted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
            )
          )}
        </button>
      </div>
    </QueryClientProvider>
  );
}