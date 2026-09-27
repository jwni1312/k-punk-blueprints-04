import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useRef, useEffect } from "react"

export const Route = createFileRoute("/echotopias")({
  component: Echotopias,
})

interface EchotopiaItem {
  id: string;
  title: string;
  duration: string;
  location: string;
  description: string;
  audioUrl: string;
  author: string;
  date: string;
}
 
function Echotopias() {
  const [soundArchives, setSoundArchives] = useState<EchotopiaItem[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("folkography_sound_archives")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validItems = parsed.filter(item => item && typeof item === 'object' && item.title)
          if (validItems.length > 0) {
            setSoundArchives(validItems)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const [selectedArchive, setSelectedArchive] = useState<EchotopiaItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  const changeArchive = (archive: EchotopiaItem | null) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsPlaying(false);
    setSelectedArchive(archive);
  }

  const handlePlayToggle = (url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(url)
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

  const currentIndex = selectedArchive ? soundArchives.findIndex((a) => a.id === selectedArchive.id) : -1
  const hasNext = currentIndex >= 0 && currentIndex < soundArchives.length - 1
  const hasPrev = currentIndex > 0

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
    if (!touchStartX.current || !touchEndX.current || !selectedArchive) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && hasNext) {
      changeArchive(soundArchives[currentIndex + 1])
    } else if (isRightSwipe && hasPrev) {
      changeArchive(soundArchives[currentIndex - 1])
    }
    
    // Reset values
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        aside, header, nav, .sidebar, .project-topbar { display: none !important; }

        .sound-mainframe {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--night, #000); color: var(--cream);
          font-family: "Courier New", Courier, monospace; padding: 5rem 6rem;
          overflow-y: auto; overflow-x: hidden; z-index: 10;
        }

        .preservation-bg {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('https://i.ibb.co/3yNh62qC/patousa.jpg');
          background-size: cover; background-position: center; background-repeat: no-repeat;
          filter: grayscale(100%) contrast(140%) sepia(30%) hue-rotate(15deg) brightness(0.6);
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

        .sound-container { position: relative; z-index: 2; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }

        .sound-item {
          background: rgba(0, 0, 0, 0.65); border: 1px solid rgba(255, 230, 160, 0.15);
          padding: 1.8rem 2rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.3s ease; backdrop-filter: blur(4px);
        }
        .sound-item:hover { border-color: var(--rose); background: rgba(20, 15, 15, 0.85); transform: translateX(5px); }
        .sound-info h2 { font-size: 1.1rem; margin: 0 0 0.4rem 0; letter-spacing: 2px; color: var(--cream); }
        .sound-duration { font-size: 0.85rem; color: var(--rose); letter-spacing: 2px; opacity: 0.9; }

        .detail-view {
          background: rgba(0, 0, 0, 0.85); border: 1px solid var(--rose);
          padding: 3rem; display: flex; flex-direction: column; gap: 2rem; backdrop-filter: blur(6px);
        }
        .detail-header { border-bottom: 1px solid rgba(206, 104, 117, 0.3); padding-bottom: 1rem; }
        .detail-title { font-size: 1.4rem; letter-spacing: 2px; margin: 0 0 0.5rem 0; color: var(--cream); }
        .detail-location { font-size: 0.85rem; color: var(--rose); letter-spacing: 1px; }
        .detail-description { font-size: 1rem; line-height: 1.8; opacity: 0.9; }

        .player-actions { display: flex; gap: 1.2rem; margin-top: 1rem; align-items: center; flex-wrap: wrap; }
        .action-btn {
          background: transparent; border: 1px solid var(--cream); color: var(--cream); padding: 0.7rem 1.3rem;
          font-family: "Courier New", Courier, monospace; letter-spacing: 2px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s; text-decoration: none; display: inline-block; text-align: center;
        }
        .action-btn:hover { background: var(--cream); color: var(--night); }
        .action-btn.primary { border-color: var(--rose); color: var(--rose); }
        .action-btn.primary:hover { background: var(--rose); color: var(--night); }

        .back-to-list { font-size: 0.8rem; opacity: 0.6; cursor: pointer; margin-bottom: 1rem; letter-spacing: 2px; display: inline-block; transition: all 0.3s; }
        .back-to-list:hover { opacity: 1; color: var(--rose); }

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
        .sound-container { animation: archiveFadeIn 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

        @media (max-width: 768px) {
          .sound-mainframe { padding: 1.5rem 1rem !important; }
          .top-nav-bar { flex-direction: row; gap: 1rem; align-items: center; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .sys-header { display: none; }
          .back-nav { font-size: 1.1rem; }
          
          .sound-item { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1.5rem; }
          .detail-view { padding: 1.5rem; gap: 1.5rem; }
          .detail-title { font-size: 1.1rem; line-height: 1.4; }
          .player-actions { flex-direction: column; align-items: stretch; gap: 0.8rem; }
          .action-btn { text-align: center; width: 100%; box-sizing: border-box; padding: 1rem; }
          .side-index-wrapper { display: none; }
          
          .doc-navigation { opacity: 0.4; border-top-style: dashed; }
          .doc-navigation::after { content: '← SWIPE →'; position: absolute; left: 50%; transform: translateX(-50%); font-size: 0.7rem; letter-spacing: 3px; color: var(--rose); opacity: 0.5; margin-top: 5px; }
        }
      `}} />

      <main className="sound-mainframe">
        <div className="preservation-bg"></div>

        <div className="side-index-wrapper">
          <div className="side-index">
            <div style={{ fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--rose)', marginBottom: '0.5rem' }}>// ΕΥΡΕΤΗΡΙΟ</div>
            {soundArchives.map((archive: EchotopiaItem) => (
              <div 
                key={archive.id} 
                className={`side-index-item ${selectedArchive?.id === archive.id ? 'active' : ''}`}
                onClick={() => changeArchive(archive)}
              >
                {archive.title}
              </div>
            ))}
          </div>
        </div>

        <div className="top-nav-bar">
          <Link to="/" className="back-nav"><span>←</span> <span>BACK</span></Link>
          <div className="sys-header">ΗΧΟΤΟΠΙΑ</div>
        </div>

        <div className="sound-container">
          {!selectedArchive ? (
            <>
              {soundArchives.map((archive: EchotopiaItem) => (
                <div 
                  key={archive.id} 
                  className="sound-item"
                  onClick={() => changeArchive(archive)}
                >
                  <div className="sound-info">
                    <h2>{archive.title}</h2>
                  </div>
                  <div className="sound-duration">
                    [ ΔΙΑΡΚΕΙΑ: {archive.duration || "00:00:00"} ]
                  </div>
                </div>
              ))}
            </>
          ) : (
             <div 
              className="detail-view"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div>
                <span className="back-to-list" onClick={() => changeArchive(null)}>
                  ← [ΕΠΙΣΤΡΟΦΗ ΣΤΑ ΗΧΟΤΟΠΙΑ]
                </span>
                <div className="detail-header" style={{ marginTop: '0.5rem' }}>
                  <h1 className="detail-title">{selectedArchive.title}</h1>
                  <span className="detail-location">
                    ΤΟΠΟΘΕΣΙΑ: {selectedArchive.location || "ΑΓΝΩΣΤΗ"}
                  </span>
                </div>
              </div>

              <div className="detail-description">
                <p>{selectedArchive.description}</p>
              </div>

              <div style={{ fontSize: '0.85rem', opacity: 0.6, letterSpacing: '1px' }}>
                ΔΙΑΡΚΕΙΑ ΡΟΗΣ: {selectedArchive.duration || "00:00:00"}
              </div>

              <div className="player-actions">
                <button 
                  className="action-btn primary"
                  onClick={() => handlePlayToggle(selectedArchive.audioUrl || "/background-music.mp3")}
                >
                  {isPlaying ? '[ ◼ STOP ]' : '[ ▶ PLAY ]'}
                </button>

                <a 
                  href={selectedArchive.audioUrl || "/background-music.mp3"} 
                  download 
                  className="action-btn"
                >
                  [ DOWNLOAD .MP3 ]
                </a>
              </div>

              <div className="doc-navigation">
                {hasPrev ? (
                  <span className="nav-arrow" onClick={() => changeArchive(soundArchives[currentIndex - 1])}>
                    ← PREV
                  </span>
                ) : <div />}
                
                {hasNext ? (
                  <span className="nav-arrow" onClick={() => changeArchive(soundArchives[currentIndex + 1])}>
                    NEXT →
                  </span>
                ) : <div />}
              </div>

            </div>
          )}
        </div>
      </main>
    </>
  )
}