import { useState, useEffect, useRef } from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getPosts, sanityClient } from "@/lib/sanity"

const getHomepage = createServerFn({ method: "GET" }).handler(async () => {
  const [homepage, sanityPosts] = await Promise.all([
    sanityClient.fetch<{ siteTitle?: string; subtitle?: string } | null>(`
      *[_type == "homepage"][0]{ siteTitle, subtitle }
    `),
    getPosts()
  ])
  return { homepage, sanityPosts }
})

export const Route = createFileRoute("/")({
  loader: () => getHomepage(),
  head: () => ({
    meta: [{ title: "TINAFTO" }],
  }),
  component: Index,
})

let hasVisited = false;

function Index() {
  const { homepage } = Route.useLoaderData()
  const navigate = useNavigate()
  
  const [skipIntro] = useState(hasVisited)
  const [isCaught, setIsCaught] = useState(skipIntro)
  const [isEntered, setIsEntered] = useState(skipIntro) 
  
  const [showDivineMessage, setShowDivineMessage] = useState(false)
  const [divineMessageText, setDivineMessageText] = useState("")

  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authInput, setAuthInput] = useState("")
  const [authError, setAuthError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const velocity = useRef({ dx: 1.5, dy: 1.5 })
  const btnRef = useRef<HTMLButtonElement>(null)
  const shroudRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (skipIntro) return;

    let timeoutId: NodeJS.Timeout
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>"

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (shroudRef.current && !isCaught) {
        shroudRef.current.style.background = `radial-gradient(circle 90px at ${clientX}px ${clientY}px, transparent 0%, rgba(0,0,0,0.95) 60%, #000 100%)`
      }

      if (isCaught) return

      let randomStr = ""
      for (let i = 0; i < 5; i++) {
        randomStr += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      if (btnRef.current) {
        btnRef.current.innerText = randomStr
      }

      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        if (btnRef.current && !isCaught) {
          btnRef.current.innerText = "TINAFT0"
        }
      }, 200)
    }

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true })
    window.addEventListener("touchmove", onTouchMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("touchmove", onTouchMove)
      clearTimeout(timeoutId)
    }
  }, [isCaught, skipIntro])

  useEffect(() => {
    if (skipIntro || isCaught) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768;
    const btnWidth = isMobile ? 180 : 260;
    const btnHeight = isMobile ? 50 : 65;
    
    // Πιο αργή ταχύτητα στα κινητά για να πιάνεται ευκολότερα
    if (isMobile) {
      velocity.current = { dx: 1.0, dy: 1.0 };
    }

    let currentX = Math.max(10, Math.min(window.innerWidth - btnWidth - 20, 40));
    let currentY = 100;
    let animationFrameId: number;

    const updatePosition = () => {
      if (!btnRef.current) {
        animationFrameId = requestAnimationFrame(updatePosition);
        return;
      }

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      currentX += velocity.current.dx;
      currentY += velocity.current.dy;

      if (currentX <= 10) {
        velocity.current.dx = Math.abs(velocity.current.dx);
        currentX = 10;
      } else if (currentX + btnWidth >= screenWidth - 10) {
        velocity.current.dx = -Math.abs(velocity.current.dx);
        currentX = Math.max(10, screenWidth - btnWidth - 10);
      }

      if (currentY <= 40) {
        velocity.current.dy = Math.abs(velocity.current.dy);
        currentY = 40;
      } else if (currentY + btnHeight >= screenHeight - 40) {
        velocity.current.dy = -Math.abs(velocity.current.dy);
        currentY = Math.max(40, screenHeight - btnHeight - 40);
      }

      btnRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      animationFrameId = requestAnimationFrame(updatePosition);
    }

    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCaught, skipIntro])

  const triggerDivineAnnouncement = () => {
    const saved = localStorage.getItem("folkography_announcement")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          setDivineMessageText(parsed.message)
          setShowDivineMessage(true)
          setTimeout(() => {
            setShowDivineMessage(false)
          }, 5000)
        } else {
          localStorage.removeItem("folkography_announcement")
        }
      } catch (e) {
        console.error(e)
      }
    }
  }

  const handleCatch = (e?: React.TouchEvent | React.MouseEvent) => {
    if (e) e.preventDefault(); // Αποτροπή διπλού trigger στα κινητά
    setIsCaught(true)
    if (btnRef.current) {
      btnRef.current.innerText = "TINAFTO"
      btnRef.current.style.transform = ""
    }
    triggerDivineAnnouncement()
  }

  const handleEnterSite = () => {
    setIsEntered(true)
    hasVisited = true; 
  }

  const handleTinaftoTripleClick = (e: React.MouseEvent) => {
    if (e.detail === 3) {
      setShowAuthModal(true)
    }
  }

  const tapCount = useRef(0)
  const tapTimeout = useRef<NodeJS.Timeout | null>(null)
  const handleMobileTap = () => {
    tapCount.current += 1
    if (tapTimeout.current) clearTimeout(tapTimeout.current)
    if (tapCount.current === 3) {
      setShowAuthModal(true)
      tapCount.current = 0
    } else {
      tapTimeout.current = setTimeout(() => {
        tapCount.current = 0
      }, 500)
    }
  }

  const handleUnifiedAuth = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanKey = authInput.trim()

    if (cleanKey === "otanhmounamikros13") {
      navigate({ to: '/admin' })
    } else if (cleanKey === "motherearthwillkillusall67") {
      navigate({ to: '/purgatorio' })
    } else {
      setAuthError("INVALID CLEARANCE KEY")
      setAuthInput("")
    }
  }

  const joyceSegment = "My soul is a little hidden thing... I am a jealous, lonely, dissatisfied, proud man. I want you to be mine, mine... I want to be surrounded by your life, to hear your voice, to feel you. O my love, my own soul... I can never be enough yours. I want to be surrounded by your breath... I take you to me... There is no past, no future... only this moment. You have me completely in your power. I would like to be a wandering voice... "
  const fullPoem = Array(35).fill(joyceSegment).join(" ")
  const waveText = Array(1200).fill("tinafto ").join("")

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        aside, header, nav, .sidebar, .project-topbar { display: none !important; }
        
        .void-root { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--night, #000); z-index: 999999; cursor: none; overflow: hidden; transition: opacity 2s ease; }
        .void-root.entered { opacity: 0; pointer-events: none; }
        
        .joyce-canvas { position: absolute; inset: 0; padding: 4rem; color: #ffe6a0; font-family: "Courier New", Courier, monospace; font-size: 1.4rem; line-height: 1.8; text-align: justify; z-index: 1; }
        .flicker { animation: bulb-flicker 4s infinite; }
        @keyframes bulb-flicker { 0%, 100% { opacity: 1; } 3% { opacity: 0.4; } 6% { opacity: 1; } 7% { opacity: 0.4; } 8% { opacity: 1; } 9% { opacity: 1; } 10% { opacity: 0.1; } 11% { opacity: 1; } 50% { opacity: 1; } 51% { opacity: 0.6; } 52% { opacity: 1; } }
        
        .darkness-shroud { position: absolute; inset: 0; z-index: 2; pointer-events: none; transition: background 1.5s ease; background: #000; }
        
        .wave-container { position: absolute; top: -150vh; left: 0; width: 100vw; height: 300vh; display: flex; flex-wrap: wrap; align-content: flex-start; color: var(--rose); font-family: "Courier New", Courier, monospace; font-size: 2.5rem; font-weight: bold; line-height: 1; text-transform: uppercase; word-break: break-all; pointer-events: none; z-index: 3; }
        .wave-container.crash { animation: wave-fall 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes wave-fall { 0% { top: -150vh; opacity: 1; } 70% { opacity: 1; } 100% { top: 100vh; opacity: 0; } }
        
        .haunted-btn { top: 0; left: 0; position: absolute; width: 260px; height: 65px; display: flex; align-items: center; justify-content: center; background: #000; color: #ff0000; border: 1px solid #ff0000; box-shadow: 0 0 15px rgba(255, 0, 0, 0.4); font-family: "Courier New", Courier, monospace; font-size: 1.5rem; font-weight: bold; letter-spacing: 6px; z-index: 4; cursor: crosshair; will-change: transform; -webkit-tap-highlight-color: transparent; }
        .haunted-btn.caught { left: 50% !important; top: 50% !important; transform: translate(-50%, -50%) !important; background: var(--night); color: var(--cream); border-color: var(--rose); box-shadow: none; cursor: pointer; transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); }

        .archive-mainframe { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: var(--night); color: var(--cream); font-family: "Courier New", Courier, monospace; display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10; overflow: hidden; }
        .bosch-background { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Garden_of_earthly_delights.jpg/1920px-The_Garden_of_earthly_delights.jpg'); background-size: cover; background-position: center; background-repeat: no-repeat; filter: grayscale(100%) invert(100%) sepia(100%) hue-rotate(180deg) saturate(400%) contrast(1.4); opacity: 0.25; z-index: 0; pointer-events: none; }
        .content-layer { position: relative; z-index: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; }
        
        /* Desktop Compass Layout */
        .compass-container { position: relative; width: 60vw; max-width: 700px; height: 60vh; max-height: 600px; border: 1px solid rgba(255, 230, 160, 0.15); display: flex; align-items: center; justify-content: center; }
        .tinafto-monolith { position: relative; font-size: 3.5rem; font-weight: bold; letter-spacing: 0.4em; margin: 0; margin-right: -0.4em; color: var(--rose); opacity: 0.9; font-family: "Courier New", Courier, monospace; text-shadow: 0px 4px 15px rgba(206, 104, 117, 0.4); user-select: none; z-index: 2; cursor: pointer; }
        .dir-node { position: absolute; text-decoration: none; color: var(--rose); font-weight: normal; letter-spacing: 4px; font-size: 1.2rem; background: var(--night); padding: 0 1rem; transition: all 0.3s ease; text-shadow: 0px 2px 10px rgba(0,0,0,0.9); text-transform: uppercase; }
        .dir-node:hover { color: var(--cream); text-shadow: 0px 0px 8px var(--rose); transform: none; }
        
        .node-top { top: 0; left: 50%; transform: translate(-50%, -50%); }
        .node-bottom { bottom: 0; left: 50%; transform: translate(-50%, 50%); }
        .node-right { right: 0; top: 50%; transform: translate(50%, -50%) rotate(90deg); }
        .node-left { left: 0; top: 50%; transform: translate(-50%, -50%) rotate(-90deg); }
        
        .mobile-only { display: none; }
        .contact-corner { position: absolute; bottom: 2rem; right: 2rem; font-family: "Courier New", Courier, monospace; z-index: 1; }
        .contact-corner a { color: var(--cream); opacity: 0.5; text-decoration: none; font-size: 0.9rem; letter-spacing: 1px; transition: all 0.2s; }
        .contact-corner a:hover { opacity: 1; color: var(--rose); }

        /* Announcement Modal / Fullscreen */
        .divine-message-container { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background-color: rgba(0, 0, 0, 0.96); z-index: 9999999; pointer-events: none; padding: 2rem; }
        .divine-message-text { color: rgba(255, 255, 255, 0.95); font-family: "Courier New", Courier, monospace; font-size: 1.25rem; text-align: center; max-width: 800px; line-height: 1.6; animation: blurFadeInOut 5s ease-in-out forwards; text-shadow: 0 0 12px rgba(255,255,255,0.4); }
        @keyframes blurFadeInOut { 0% { opacity: 0; filter: blur(10px); transform: scale(0.95); } 15% { opacity: 1; filter: blur(0px); transform: scale(1); } 85% { opacity: 1; filter: blur(0px); transform: scale(1); } 100% { opacity: 0; filter: blur(10px); transform: scale(1.05); } }

        /* Auth Modal */
        .auth-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 99999999; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
        .auth-card { background: #000; border: 1px solid var(--rose); padding: 2.5rem; width: 100%; max-width: 380px; display: flex; flex-direction: column; gap: 1.5rem; text-align: center; }
        .input-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
        .auth-input { background: transparent; border: 1px solid rgba(255, 230, 160, 0.3); color: var(--cream); padding: 0.8rem; padding-right: 2.5rem; font-family: "Courier New", Courier, monospace; font-size: 0.9rem; width: 100%; outline: none; }
        .auth-input:focus { border-color: var(--rose); }
        .eye-btn { position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: rgba(255, 230, 160, 0.4); display: flex; align-items: center; padding: 0; }
        .eye-btn:hover { color: var(--rose); }
        .auth-submit-btn { background: transparent; border: 1px solid var(--rose); color: var(--rose); padding: 0.8rem; font-family: "Courier New", Courier, monospace; letter-spacing: 2px; cursor: pointer; font-size: 0.85rem; }
        .auth-submit-btn:hover { background: var(--rose); color: var(--night); }

        /* ================= MOBILE VIEWPORT OPTIMIZATIONS ================= */
        @media (max-width: 768px) {
          .joyce-canvas { padding: 1.5rem; font-size: 0.95rem; line-height: 1.6; }
          .haunted-btn { width: 180px; height: 50px; font-size: 1.1rem; letter-spacing: 3px; }
          .divine-message-text { font-size: 1.05rem; }

          /* Καθαρή Κατακόρυφη Στήλη */
          .compass-container {
            width: 85vw !important;
            height: auto !important;
            max-height: none !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 0 !important;
            padding: 3rem 1.5rem !important;
            border: 1px solid rgba(255, 230, 160, 0.15) !important;
            background: rgba(0, 0, 0, 0.75) !important;
            backdrop-filter: blur(5px);
          }

          .tinafto-monolith {
            font-size: 2.2rem !important;
            letter-spacing: 0.2em !important;
            margin-right: 0 !important;
            margin-bottom: 2rem !important;
          }

          /* Κατάργηση position absolute & rotate. Όλα σε λίστα. */
          .dir-node {
            position: static !important;
            transform: none !important;
            font-size: 1rem !important;
            letter-spacing: 2px !important;
            padding: 1rem 0 !important;
            width: 100% !important;
            text-align: center !important;
            background: transparent !important;
            border-bottom: 1px dashed rgba(206, 104, 117, 0.25);
          }
          .dir-node:last-child { border-bottom: none; }
          .dir-node:hover { transform: none !important; }

          /* Εμφάνιση του Contact μέσα στη στήλη, απόκρυψη του εξωτερικού */
          .mobile-only { display: block !important; }
          .contact-corner { display: none !important; }
        }
      `}} />

      <main className="archive-mainframe">
        <div className="bosch-background"></div>
        <div className="content-layer">
          <div className="compass-container">
            <h1 
              className="tinafto-monolith" 
              onClick={handleTinaftoTripleClick}
              onTouchStart={handleMobileTap}
              title=""
            >
              TINAFTO
            </h1>
            <Link to="/writings" className="dir-node node-top">ΓΡΑΦΤΑ</Link>
            <Link to="/philosophy" className="dir-node node-right">ΕΛΛΕΙΠΗΣ ΦΙΛΟΣΟΦΙΑ</Link>
            <Link to="/oral-history" className="dir-node node-bottom">ΑΡΧΕΙΟ ΠΡΟΦΟΡΙΚΗΣ ΙΣΤΟΡΙΑΣ</Link>
            <Link to="/echotopias" className="dir-node node-left">ΗΧΟΤΟΠΙΑ</Link>
            
            {/* Εμφανίζεται ΜΟΝΟ στα κινητά μέσα στο μενού */}
            <Link to="/contact" className="dir-node mobile-only">CONTACT</Link>
          </div>
        </div>

        {/* Εμφανίζεται ΜΟΝΟ στα desktop κάτω δεξιά */}
        <div className="contact-corner">
          <Link to="/contact">CONTACT</Link>
        </div>
      </main>

      {showAuthModal && (
        <div className="auth-overlay">
          <form onSubmit={handleUnifiedAuth} className="auth-card">
            <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: 'var(--rose)', margin: 0 }}>[ SYSTEM GATEWAY ]</h3>
            <div className="input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="ENTER CLEARANCE..." 
                value={authInput} 
                onChange={(e) => setAuthInput(e.target.value)} 
                className="auth-input" 
                autoFocus 
              />
              <button 
                type="button" 
                className="eye-btn"
                onMouseDown={() => setShowPassword(true)}
                onMouseUp={() => setShowPassword(false)}
                onTouchStart={() => setShowPassword(true)}
                onTouchEnd={() => setShowPassword(false)}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {showPassword ? (
                    <>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </>
                  ) : (
                    <>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </>
                  )}
                </svg>
              </button>
            </div>
            {authError && <span style={{ fontSize: '0.75rem', color: 'var(--rose)' }}>{authError}</span>}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="submit" className="auth-submit-btn" style={{ flex: 1 }}>[ ENTER ]</button>
              <button type="button" className="auth-submit-btn" style={{ flex: 1, borderColor: '#666', color: '#888' }} onClick={() => setShowAuthModal(false)}>[ CANCEL ]</button>
            </div>
          </form>
        </div>
      )}

      {!skipIntro && (
        <div className={`void-root ${isEntered ? "entered" : ""}`}>
          <div className={`joyce-canvas ${!isCaught ? "flicker" : ""}`} style={{ opacity: isCaught ? 0 : 1 }}>
            {fullPoem}
          </div>

          <div ref={shroudRef} className="darkness-shroud" style={isCaught ? { background: 'var(--night)' } : {}} />

          {isCaught && (
            <div className="wave-container crash">
              {waveText}
            </div>
          )}

          <button
            ref={btnRef}
            className={`haunted-btn ${isCaught ? "caught" : ""}`}
            onClick={!isCaught ? handleCatch : handleEnterSite}
            onTouchStart={!isCaught ? handleCatch : undefined}
          >
            {!isCaught ? "TINAFT0" : "TINAFTO"}
          </button>

          {showDivineMessage && (
            <div className="divine-message-container">
              <div className="divine-message-text">
                {divineMessageText}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}