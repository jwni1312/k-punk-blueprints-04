import { useState, useEffect, useRef } from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { createServerFn } from "@tanstack/react-start"
import { getPosts, sanityClient } from "@/lib/sanity"

const getHomepage = createServerFn({ method: "GET" }).handler(async () => {
  const [homepage, sanityPosts] = await Promise.all([
    sanityClient.fetch<{ siteTitle?: string; subtitle?: string } | null>(`
      *[_type == "homepage"][0]{ siteTitle, subtitle }
    `),
    getPosts(),
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
  
  const velocity = useRef({ dx: 1.5, dy: 1.5 })
  
  const btnRef = useRef<HTMLButtonElement>(null)
  const shroudRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (skipIntro) return;

    let timeoutId: NodeJS.Timeout
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!?<>"

    const handleMouseMove = (e: MouseEvent) => {
      if (shroudRef.current && !isCaught) {
        shroudRef.current.style.background = `radial-gradient(circle 90px at ${e.clientX}px ${e.clientY}px, transparent 0%, rgba(0,0,0,0.95) 60%, #000 100%)`
      }

      if (isCaught) return

      let randomStr = ""
      for (let i = 0; i < 7; i++) {
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
      }, 150)
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      clearTimeout(timeoutId)
    }
  }, [isCaught, skipIntro])

  useEffect(() => {
    if (skipIntro || isCaught) return;

    let currentX = Math.max(0, window.innerWidth - 300);
    let currentY = 50;
    let animationFrameId: number;

    const updatePosition = () => {
      if (!btnRef.current) {
        animationFrameId = requestAnimationFrame(updatePosition);
        return;
      }

      const btnWidth = 260;
      const btnHeight = 65;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      currentX += velocity.current.dx;
      currentY += velocity.current.dy;

      if (currentX <= 0) {
        velocity.current.dx = Math.abs(velocity.current.dx);
        currentX = 0;
      } else if (currentX + btnWidth >= screenWidth) {
        velocity.current.dx = -Math.abs(velocity.current.dx);
        currentX = Math.max(0, screenWidth - btnWidth);
      }

      if (currentY <= 0) {
        velocity.current.dy = Math.abs(velocity.current.dy);
        currentY = 0;
      } else if (currentY + btnHeight >= screenHeight) {
        velocity.current.dy = -Math.abs(velocity.current.dy);
        currentY = Math.max(0, screenHeight - btnHeight);
      }

      btnRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

      animationFrameId = requestAnimationFrame(updatePosition);
    }

    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isCaught, skipIntro])

  const handleCatch = () => {
    setIsCaught(true)
    if (btnRef.current) {
      btnRef.current.innerText = "TINAFTO"
      btnRef.current.style.transform = ""
    }
  }

  const handleEnterSite = () => {
    setIsEntered(true)
    hasVisited = true; 
  }

  const handleTinaftoTripleClick = (e: React.MouseEvent) => {
    if (e.detail === 3) {
      navigate({ to: '/admin' })
    }
  }

  const joyceSegment = "My soul is a little hidden thing... I am a jealous, lonely, dissatisfied, proud man. I want you to be mine, mine... I want to be surrounded by your life, to hear your voice, to feel you. O my love, my own soul... I can never be enough yours. I want to be surrounded by your breath... I take you to me... There is no past, no future... only this moment. You have me completely in your power. I would like to be a wandering voice... "
  const fullPoem = Array(35).fill(joyceSegment).join(" ")
  const waveText = Array(1200).fill("tinafto ").join("")

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        aside, header, nav, .sidebar, .project-topbar {
          display: none !important;
        }

        .void-root {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--night, #000);
          z-index: 999999;
          cursor: none;
          overflow: hidden;
          transition: opacity 2s ease;
        }
        .void-root.entered { opacity: 0; pointer-events: none; }
        .joyce-canvas { position: absolute; inset: 0; padding: 4rem; color: #ffe6a0; font-family: "Courier New", Courier, monospace; font-size: 1.4rem; line-height: 1.8; text-align: justify; z-index: 1; }
        .flicker { animation: bulb-flicker 4s infinite; }
        @keyframes bulb-flicker { 0%, 100% { opacity: 1; } 3% { opacity: 0.4; } 6% { opacity: 1; } 7% { opacity: 0.4; } 8% { opacity: 1; } 9% { opacity: 1; } 10% { opacity: 0.1; } 11% { opacity: 1; } 50% { opacity: 1; } 51% { opacity: 0.6; } 52% { opacity: 1; } }
        
        .darkness-shroud { position: absolute; inset: 0; z-index: 2; pointer-events: none; transition: background 1.5s ease; background: #000; }
        
        .wave-container { position: absolute; top: -150vh; left: 0; width: 100vw; height: 300vh; display: flex; flex-wrap: wrap; align-content: flex-start; color: var(--rose); font-family: "Courier New", Courier, monospace; font-size: 2.5rem; font-weight: bold; line-height: 1; text-transform: uppercase; word-break: break-all; pointer-events: none; z-index: 3; }
        .wave-container.crash { animation: wave-fall 10s cubic-bezier(0.4, 0, 0.2, 1) forwards; }
        @keyframes wave-fall { 0% { top: -150vh; opacity: 1; } 70% { opacity: 1; } 100% { top: 100vh; opacity: 0; } }
        
        .haunted-btn { top: 0; left: 0; position: absolute; width: 260px; height: 65px; display: flex; align-items: center; justify-content: center; background: #000; color: #ff0000; border: 1px solid #ff0000; box-shadow: 0 0 15px rgba(255, 0, 0, 0.4); font-family: "Courier New", Courier, monospace; font-size: 1.5rem; font-weight: bold; letter-spacing: 6px; z-index: 4; cursor: crosshair; will-change: transform; }
        
        .haunted-btn.caught { 
          left: 50% !important; 
          top: 50% !important; 
          transform: translate(-50%, -50%) !important; 
          background: var(--night); 
          color: var(--cream); 
          border-color: var(--rose); 
          box-shadow: none; 
          cursor: pointer; 
          transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); 
        }

        .archive-mainframe {
          position: fixed;
          top: 0; left: 0;
          width: 100vw; height: 100vh;
          background-color: var(--night);
          color: var(--cream);
          font-family: "Courier New", Courier, monospace; 
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .bosch-background {
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/The_Garden_of_earthly_delights.jpg/1920px-The_Garden_of_earthly_delights.jpg');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: grayscale(100%) invert(100%) sepia(100%) hue-rotate(180deg) saturate(400%) contrast(1.4);
          opacity: 0.25; 
          z-index: 0;
          pointer-events: none;
        }

        .content-layer {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
        }

        .compass-container {
          position: relative;
          width: 60vw;
          max-width: 700px;
          height: 60vh;
          max-height: 600px;
          border: 1px solid rgba(255, 230, 160, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tinafto-monolith {
          position: relative;
          font-size: 3.5rem; 
          font-weight: bold; 
          letter-spacing: 0.4em;
          margin: 0;
          margin-right: -0.4em;
          color: var(--rose); 
          opacity: 0.9; 
          font-family: "Courier New", Courier, monospace;
          text-shadow: 0px 4px 15px rgba(206, 104, 117, 0.4); 
          user-select: none;
          z-index: 2;
          cursor: pointer;
        }

        .dir-node {
          position: absolute;
          text-decoration: none;
          color: var(--rose);
          font-weight: normal; 
          letter-spacing: 4px;
          font-size: 1.2rem;
          background: var(--night);
          padding: 0 1rem;
          transition: all 0.3s ease;
          text-shadow: 0px 2px 10px rgba(0,0,0,0.9);
          text-transform: uppercase;
        }

        .dir-node:hover {
          color: var(--cream);
          text-shadow: 0px 0px 8px var(--rose);
          transform: scale(1.05); 
        }

        .node-top {
          top: 0;
          left: 50%;
          transform: translate(-50%, -50%);
        }
        .node-top:hover { transform: translate(-50%, -50%) scale(1.05); }

        .node-bottom {
          bottom: 0;
          left: 50%;
          transform: translate(-50%, 50%);
        }
        .node-bottom:hover { transform: translate(-50%, 50%) scale(1.05); }

        .node-right {
          right: 0;
          top: 50%;
          transform: translate(50%, -50%) rotate(90deg);
        }
        .node-right:hover { transform: translate(50%, -50%) rotate(90deg) scale(1.05); }

        .node-left {
          left: 0;
          top: 50%;
          transform: translate(-50%, -50%) rotate(-90deg);
        }
        .node-left:hover { transform: translate(-50%, -50%) rotate(-90deg) scale(1.05); }

        .contact-corner {
          position: absolute;
          bottom: 2rem;
          right: 2rem;
          font-family: "Courier New", Courier, monospace;
          z-index: 1;
        }
        
        .contact-corner a {
          color: var(--cream);
          opacity: 0.5;
          text-decoration: none;
          font-size: 0.9rem;
          letter-spacing: 1px;
          transition: all 0.2s;
          text-shadow: 0px 2px 8px rgba(0,0,0,0.8);
        }
        
        .contact-corner a:hover {
          opacity: 1;
          color: var(--rose);
        }
      `}} />

      <main className="archive-mainframe">
        
        <div className="bosch-background"></div>

        <div className="content-layer">
          
          <div className="compass-container">
            {/* Triplo klik edw sto TINAFTO anigei to kryfo admin panel */}
            <h1 
              className="tinafto-monolith"
              onClick={handleTinaftoTripleClick}
              title=""
            >
              TINAFTO
            </h1>

            <Link to="/writings" className="dir-node node-top">
              ΓΡΑΦΤΑ
            </Link>

            <Link to="/philosophy" className="dir-node node-right">
              ΕΛΛΕΙΠΗΣ ΦΙΛΟΣΟΦΙΑ
            </Link>

            <Link to="/oral-history" className="dir-node node-bottom">
              ΑΡΧΕΙΟ ΠΡΟΦΟΡΙΚΗΣ ΙΣΤΟΡΙΑΣ
            </Link>

            <Link to="/echotopias" className="dir-node node-left">
              ΗΧΟΤΟΠΙΑ
            </Link>
          </div>

        </div>

        <div className="contact-corner">
          <Link to="/contact">CONTACT</Link>
        </div>

      </main>

      {!skipIntro && (
        <div className={`void-root ${isEntered ? "entered" : ""}`}>
          
          <div className={`joyce-canvas ${!isCaught ? "flicker" : ""}`} style={{ opacity: isCaught ? 0 : 1 }}>
            {fullPoem}
          </div>

          <div 
            ref={shroudRef}
            className="darkness-shroud"
            style={isCaught ? { background: 'var(--night)' } : {}}
          />

          {isCaught && (
            <div className="wave-container crash">
              {waveText}
            </div>
          )}

          <button
            ref={btnRef}
            className={`haunted-btn ${isCaught ? "caught" : ""}`}
            onClick={!isCaught ? handleCatch : handleEnterSite}
          >
            {!isCaught ? "TINAFT0" : "TINAFTO"}
          </button>

        </div>
      )}
    </>
  )
}