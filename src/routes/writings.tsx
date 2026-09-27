import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect, useRef } from "react"

export const Route = createFileRoute("/writings")({
  component: Writings,
})

const defaultArchive = {
  id: "WRT.01",
  title: "ΣΗΜΕΙΩΣΕΙΣ ΕΠΙ ΤΗΣ ΕΙΚΟΝΑΣ",
  content: "Πρώτες σκέψεις γύρω από την αρχειακή αποτύπωση και το κινηματογραφικό βλέμμα.",
  author: "Folkography Admin",
  date: "2026-06-01",
}

function Writings() {
  const [items, setItems] = useState<any[]>([defaultArchive])

  useEffect(() => {
    const saved = localStorage.getItem("folkography_writings")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          const validItems = parsed.filter(item => item && typeof item === 'object' && item.title)
          if (validItems.length > 0) {
            setItems(validItems)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const [activeItem, setActiveItem] = useState<any | null>(null)

  // Υπολογισμός index για τα βέλη πλοήγησης και τα swipes
  const currentIndex = activeItem ? items.findIndex(i => i.id === activeItem.id) : -1
  const hasNext = currentIndex >= 0 && currentIndex < items.length - 1
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
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && hasNext) {
      setActiveItem(items[currentIndex + 1])
    } else if (isRightSwipe && hasPrev) {
      setActiveItem(items[currentIndex - 1])
    }
    
    // Reset values
    touchStartX.current = null
    touchEndX.current = null
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        aside, header, nav, .sidebar, .project-topbar { display: none !important; }
        
        .module-mainframe {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--night, #000); color: var(--cream);
          font-family: "Courier New", Courier, monospace; padding: 5rem 6rem;
          overflow-y: auto; overflow-x: hidden; z-index: 10;
        }

        .preservation-bg {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('https://i.postimg.cc/t4F1LDWh/anthony-room.jpg');
          background-size: cover; background-position: center; background-repeat: no-repeat;
          filter: grayscale(100%) invert(100%) sepia(100%) hue-rotate(180deg) saturate(400%) contrast(1.4);
          opacity: 0.25; z-index: 0; pointer-events: none;
        }

        .top-nav {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 3rem; position: relative; z-index: 2;
          border-bottom: 1px solid rgba(255, 230, 160, 0.2); padding-bottom: 1.5rem;
        }
        
        .sys-tag { font-size: 0.85rem; opacity: 0.7; letter-spacing: 2px; color: var(--rose); }
        .back-nav { font-size: 1rem; font-weight: bold; text-decoration: none; color: var(--cream); opacity: 0.7; letter-spacing: 2px; transition: all 0.3s; display: flex; align-items: center; gap: 0.5rem; }
        .back-nav:hover { opacity: 1; color: var(--rose); transform: translateX(-5px); }
        
        .box-container { position: relative; z-index: 2; max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        
        .card-row {
          background: rgba(0, 0, 0, 0.75); border: 1px solid rgba(255, 230, 160, 0.15);
          padding: 1.8rem 2rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.3s ease;
          backdrop-filter: blur(4px);
        }
        .card-row:hover { border-color: var(--rose); background: rgba(20, 15, 15, 0.9); transform: translateX(5px); }
        .card-title { font-size: 1.1rem; margin: 0 0 0.4rem 0; letter-spacing: 2px; color: var(--cream); }
        
        .reader-pane {
          background: rgba(0, 0, 0, 0.9); border: 1px solid var(--rose);
          padding: 3rem; display: flex; flex-direction: column; gap: 2rem;
          backdrop-filter: blur(6px);
        }
        .reader-header { border-bottom: 1px solid rgba(206, 104, 117, 0.3); padding-bottom: 1rem; }
        .reader-title { font-size: 1.4rem; letter-spacing: 2px; margin: 0 0 0.5rem 0; color: var(--cream); }
        .reader-meta { font-size: 0.85rem; color: var(--rose); letter-spacing: 1px; }
        .reader-text { font-size: 1rem; line-height: 1.8; opacity: 0.9; white-space: pre-wrap; }
        
        .return-btn { font-size: 0.8rem; opacity: 0.6; cursor: pointer; margin-bottom: 1rem; letter-spacing: 2px; display: inline-block; transition: all 0.3s; }
        .return-btn:hover { opacity: 1; color: var(--rose); }

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
          position: fixed; top: 0; right: 0; bottom: 0; width: 180px;
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

        @keyframes archiveFadeIn {
          0% { opacity: 0; transform: translateY(20px); filter: blur(4px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .box-container { animation: archiveFadeIn 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards; }

        @media (max-width: 768px) {
          .module-mainframe { padding: 1.5rem 1rem !important; }
          .top-nav { flex-direction: row; gap: 1rem; align-items: center; padding-bottom: 1rem; margin-bottom: 1.5rem; }
          .sys-tag { display: none; } /* Κρύβουμε το tag στα κινητά για χώρο */
          .back-nav { font-size: 1.1rem; }
          
          .card-row { flex-direction: column; align-items: flex-start; gap: 1rem; padding: 1.5rem; }
          .reader-pane { padding: 1.5rem; gap: 1.5rem; }
          .reader-title { font-size: 1.1rem; line-height: 1.4; }
          .side-index-wrapper { display: none; }
          
          .doc-navigation { opacity: 0.4; border-top-style: dashed; }
          .doc-navigation::after { content: '← SWIPE →'; position: absolute; left: 50%; transform: translateX(-50%); font-size: 0.7rem; letter-spacing: 3px; color: var(--rose); opacity: 0.5; margin-top: 5px; }
        }
      `}} />

      <main className="module-mainframe">
        <div className="preservation-bg"></div>

        <div className="side-index-wrapper">
          <div className="side-index">
            <div style={{ fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--rose)', marginBottom: '0.5rem' }}>// ΕΥΡΕΤΗΡΙΟ</div>
            {items.map((doc: any) => (
              <div 
                key={doc.id} 
                className={`side-index-item ${activeItem?.id === doc.id ? 'active' : ''}`}
                onClick={() => setActiveItem(doc)}
              >
                {doc.title}
              </div>
            ))}
          </div>
        </div>

        <div className="top-nav">
          <Link to="/" className="back-nav"><span>←</span> <span>BACK</span></Link>
          <div className="sys-tag">ΓΡΑΦΤΑ</div>
        </div>

        <div className="box-container">
          {!activeItem ? (
            <>
              {items.map((doc: any) => (
                <div key={doc.id} className="card-row" onClick={() => setActiveItem(doc)}>
                  <div>
                    <h2 className="card-title">{doc.title}</h2>
                    <span style={{ fontSize: '0.75rem', opacity: 0.5 }}>Δημιουργός: {doc.author}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--rose)', letterSpacing: '1px' }}>[ ΠΡΟΣΒΑΣΗ ]</div>
                </div>
              ))}
            </>
          ) : (
            <div 
              className="reader-pane"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div>
                <span className="return-btn" onClick={() => setActiveItem(null)}>
                  ← [ΕΠΙΣΤΡΟΦΗ ΣΤΟΝ ΚΑΤΑΛΟΓΟ]
                </span>
                <div className="reader-header" style={{ marginTop: '0.5rem' }}>
                  <h1 className="reader-title">{activeItem.title}</h1>
                  <span className="reader-meta">ΣΥΓΓΡΑΦΕΑΣ: {activeItem.author} | ΗΜΕΡΟΜΗΝΙΑ: {activeItem.date}</span>
                </div>
              </div>

              <div className="reader-text">
                <p>{activeItem.content}</p>
              </div>

              <div className="doc-navigation">
                {hasPrev ? (
                  <span className="nav-arrow" onClick={() => setActiveItem(items[currentIndex - 1])}>
                    ← PREV
                  </span>
                ) : <div />}
                
                {hasNext ? (
                  <span className="nav-arrow" onClick={() => setActiveItem(items[currentIndex + 1])}>
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