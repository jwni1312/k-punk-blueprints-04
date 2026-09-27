import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useRef, useEffect } from "react"

export const Route = createFileRoute("/oral-history")({
  component: OralHistory,
})

interface ArchiveItem {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  author: string;
  date: string;
}

function OralHistory() {
  const [oralHistories, setOralHistories] = useState<ArchiveItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("folkography_oral_history")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validItems = parsed.filter(item => item && typeof item === 'object' && item.title)
          if (validItems.length > 0) {
            setOralHistories(validItems)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.src = ""
        audioRef.current = null
      }
    }
  }, [])

  const currentItem = oralHistories[currentIndex] || oralHistories[0] || null
  const hasNext = currentIndex < oralHistories.length - 1
  const hasPrev = currentIndex > 0

  const changeIndex = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= oralHistories.length) return;
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentIndex(newIndex)
  }

  const handlePlayToggle = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentItem.audioUrl || "/01 Addis.mp3")
      // Κλείνει σωστά το Play button όταν τελειώσει το ηχητικό
      audioRef.current.addEventListener('ended', () => {
        setIsPlaying(false)
      })
    }

    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().catch(() => {})
      setIsPlaying(true)
    }
  }

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 5)
    }
  }

  // --- SWIPE GESTURE LOGIC ---
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)
  const minSwipeDistance = 50

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && hasNext) {
      changeIndex(currentIndex + 1)
    } else if (isRightSwipe && hasPrev) {
      changeIndex(currentIndex - 1)
    }
    
    // Reset values
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        aside, header, nav, .sidebar, .project-topbar { display: none !important; }
        
        .oral-mainframe {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--night, #000); color: var(--cream);
          font-family: "Courier New", Courier, monospace; padding: 5rem 6rem;
          overflow-y: auto; overflow-x: hidden; z-index: 10;
        }

        .preservation-bg {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('https://i.postimg.cc/QtyVSZ34/grandma.jpg');
          background-size: cover; background-position: center; background-repeat: no-repeat;
          filter: grayscale(100%) contrast(160%) sepia(20%) brightness(0.35) blur(8px);
          opacity: 0.35; z-index: 0; pointer-events: none;
        }

        .top-nav-bar {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 3rem; position: relative; z-index: 2;
          border-bottom: 1px solid rgba(255, 230, 160, 0.2); padding-bottom: 1.5rem;
        }
        .sys-header { font-size: 0.85rem; opacity: 0.7; letter-spacing: 2px; color: var(--rose); }
        .back-nav { font-size: 1rem; font-weight: bold; text-decoration: none; color: var(--cream); opacity: 0.7; letter-spacing: 2px; transition: all 0.3s; display: flex; align-items: center; gap: 0.5rem; }
        .back-nav:hover { opacity: 1; color: var(--rose); transform: translateX(-5px); }
        
        .oral-container {
          position: relative; z-index: 2; max-width: 800px; margin: 0 auto;
          display: flex; flex-direction: column; gap: 2rem; background: rgba(0, 0, 0, 0.85);
          border: 1px solid rgba(255, 230, 160, 0.2); padding: 3rem;
          backdrop-filter: blur(6px);
        }
        .oral-title { font-size: 1.4rem; letter-spacing: 2px; margin: 0 0 0.5rem 0; color: var(--cream); }
        .oral-subtitle { font-size: 0.85rem; color: var(--rose); letter-spacing: 1px; }
        .oral-text { font-size: 1rem; line-height: 1.8; opacity: 0.9; }
        
        .player-deck {
          display: flex; gap: 1rem; margin-top: 1.5rem; align-items: center; flex-wrap: wrap;
          border-top: 1px solid rgba(255, 230, 160, 0.15); padding-top: 1.5rem;
        }
        .deck-btn {
          background: transparent; border: 1px solid var(--cream); color: var(--cream);
          padding: 0.7rem 1.3rem; font-family: "Courier New", Courier, monospace; letter-spacing: 2px; cursor: pointer; font-size: 0.85rem; text-decoration: none;
          transition: all 0.3s;
        }
        .deck-btn:hover { background: var(--cream); color: var(--night); }
        .deck-btn.primary { border-color: var(--rose); color: var(--rose); }
        .deck-btn.primary:hover { background: var(--rose); color: var(--night); }

        .doc-navigation {
          display: flex; justify-content: space-between; position: relative;
          border-top: 1px solid rgba(206, 104, 117, 0.3);
          padding-top: 1.5rem; margin-top: 1.5rem;
        }
        .nav-arrow {
          font-size: 0.85rem; letter-spacing: 2px; color: var(--cream);
          opacity: 0.6; cursor: pointer; transition: all 0.3s;
        }
        .nav-arrow:hover { opacity: 1; color: var(--rose); }

        .side-index-wrapper {
          position: fixed; top: 0; right: 0; bottom: 0; width: 220px;
          z-index: 100; display: flex; align-items: center; justify-content: flex-end; padding-right: 2rem;
        }
        .side-index {
          display: flex; flex-direction: column; gap: 0.8rem; opacity: 0;
          transition: opacity 0.4s ease, transform 0.4s ease; transform: translateX(10px);
          align-items: flex-end; text-align: right;
        }
        .side-index-wrapper:hover .side-index { opacity: 1; transform: translateX(0); }
        .side-index-item {
          font-size: 0.75rem; color: var(--cream); opacity: 0.5; cursor: pointer; transition: all 0.2s;
        }
        .side-index-item:hover, .side-index-item.active { opacity: 1; color: var(--rose); }

        @keyframes archiveFadeIn { 0% { opacity: 0; transform: translateY(20px); filter: blur(4px); } 100% { opacity: 1; transform: translateY(0); filter: blur(0); } }
        .oral-container { animation: archiveFadeIn 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

        @media (max-width: 768px) {
          .oral-mainframe { padding: 1.5rem 1rem !important; }
          .top-nav-bar { flex-direction: row; gap: 1rem; align-items: center; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .sys-header { display: none; }
          .back-nav { font-size: 1.1rem; }
          .oral-container { padding: 1.5rem; gap: 1.5rem; }
          .oral-title { font-size: 1.1rem; line-height: 1.4; }
          .player-deck { flex-direction: column; align-items: stretch; gap: 0.8rem; }
          .deck-btn { text-align: center; width: 100%; box-sizing: border-box; padding: 1rem; }
          .side-index-wrapper { display: none; }
          
          .doc-navigation { opacity: 0.4; border-top-style: dashed; }
          .doc-navigation::after { content: '← SWIPE →'; position: absolute; left: 50%; transform: translateX(-50%); font-size: 0.7rem; letter-spacing: 3px; color: var(--rose); opacity: 0.5; margin-top: 5px; }
        }
      `}} />

      <main className="oral-mainframe">
        <div className="preservation-bg"></div>

        <div className="side-index-wrapper">
          <div className="side-index">
            <div style={{ fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--rose)', marginBottom: '0.5rem' }}>// ΕΥΡΕΤΗΡΙΟ</div>
            {oralHistories.map((archive: any, index: number) => (
              <div 
                key={archive?.id || index} 
                className={`side-index-item ${currentIndex === index ? 'active' : ''}`}
                onClick={() => changeIndex(index)}
              >
                {archive?.title || "ΑΝΩΝΥΜΟ ΑΡΧΕΙΟ"}
              </div>
            ))}
          </div>
        </div>

        <div className="top-nav-bar">
          <Link to="/" className="back-nav"><span>←</span> <span>BACK</span></Link>
          <div className="sys-header">ΑΡΧΕΙΟ ΠΡΟΦΟΡΙΚΗΣ ΙΣΤΟΡΙΑΣ</div>
        </div>

        <div 
          className="oral-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div>
            <h1 className="oral-title">{currentItem?.title}</h1>
            <span className="oral-subtitle">
              Ημ/νία: {currentItem?.date || "—"}
            </span>
          </div>

          <div className="oral-text">
            <p>{currentItem?.description}</p>
          </div>

          <div className="player-deck">
            <button className="deck-btn primary" onClick={handlePlayToggle}>
              {isPlaying ? '[ ◼ PAUSE ]' : '[ ▶ PLAY ]'}
            </button>
            <button className="deck-btn" onClick={handleRewind}>[ ↺ REWIND -5S ]</button>
            <a href={currentItem?.audioUrl || "/01 Addis.mp3"} download className="deck-btn">[ EXTRACT DATA ]</a>
          </div>

          <div className="doc-navigation">
            {hasPrev ? (
              <span className="nav-arrow" onClick={() => changeIndex(currentIndex - 1)}>
                ← PREV
              </span>
            ) : <div />}
            
            {hasNext ? (
              <span className="nav-arrow" onClick={() => changeIndex(currentIndex + 1)}>
                NEXT →
              </span>
            ) : <div />}
          </div>

        </div>
      </main>
    </>
  )
}