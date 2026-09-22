import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/purgatorio")({
  component: Purgatorio,
})

const PASSCODE = "motherearthwillkillusall67"
const RIDDLE_ANSWERS = [
  "ναυάγιο των αγγέλων", 
  "ναυαγιο των αγγελων", 
  "ναυάγιο των αγγελων", 
  "ναυαγιο των αγγέλων"
]

function Purgatorio() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isRiddleMode, setIsRiddleMode] = useState(false)
  const [inputKey, setInputKey] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [showPassword, setShowPassword] = useState(false)

  // Φόρμα Υποβολής
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("writings")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")

  const [drafts, setDrafts] = useState(() => {
    const saved = localStorage.getItem("folkography_purgatory_drafts")
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem("folkography_purgatory_drafts", JSON.stringify(drafts))
  }, [drafts])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    const cleanInput = inputKey.trim()

    if (isRiddleMode) {
      const cleanAnswer = cleanInput.toLowerCase()
      const isCorrect = RIDDLE_ANSWERS.some(ans => ans === cleanAnswer)

      if (isCorrect) {
        setIsAuthenticated(true)
        setErrorMsg("")
      } else {
        // Στον γρίφο δεν δείχνουμε κόκκινο μήνυμα, απλά καθαρίζουμε το input
        setInputKey("")
      }
    } else {
      if (cleanInput === PASSCODE) {
        setIsAuthenticated(true)
        setErrorMsg("")
      } else {
        const newCount = wrongAttempts + 1
        setWrongAttempts(newCount)
        setInputKey("")

        if (newCount >= 3) {
          setIsRiddleMode(true)
          setErrorMsg("") // Καθαρίζουμε το error msg για να μείνει μόνο η λευκή ερώτηση
        } else {
          setErrorMsg(`ΛΑΘΟΣ ΚΩΔΙΚΟΣ. ΠΡΟΣΠΑΘΕΙΣ: ${newCount}/3`)
        }
      }
    }
  }

  const handleSubmitDraft = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !content) return

    const newDraft = {
      id: `DRAFT.${Date.now()}`,
      title: title.toUpperCase(),
      category,
      content,
      author: author.trim() ? author.trim() : "Ανώνυμος",
      date: new Date().toISOString().split('T')[0]
    }

    setDrafts([...drafts, newDraft])
    setTitle(""); setContent(""); setAuthor("")
    alert("ΤΟ ΚΕΙΜΕΝΟ ΣΤΑΛΘΗΚΕ ΣΤΟ ΠΟΥΡΓΚΑΤΟΡΙΟ. ΑΝΑΜΕΝΕΙ ΚΡΙΣΗ.")
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        aside, header, nav, .sidebar, .project-topbar { display: none !important; }
        .purgatory-mainframe { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: #080808; color: #a3a3a3; font-family: "Courier New", Courier, monospace; padding: 4rem 6rem; overflow-y: auto; z-index: 100; }
        .top-nav-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); padding-bottom: 1.5rem; }
        .sys-header { font-size: 0.85rem; opacity: 0.5; letter-spacing: 4px; color: #fff; }
        .back-nav { font-size: 0.85rem; text-decoration: none; color: #a3a3a3; opacity: 0.6; letter-spacing: 2px; }
        .back-nav:hover { opacity: 1; color: #fff; }
        .auth-box { max-width: 500px; margin: 15vh auto; background: rgba(0, 0, 0, 0.8); border: 1px solid #222; padding: 3rem; display: flex; flex-direction: column; gap: 1.5rem; text-align: center; }
        
        .input-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
        .auth-input, .draft-input, .draft-textarea, .draft-select { background: transparent; border: 1px solid #333; color: #ccc; padding: 0.8rem; padding-right: 2.5rem; font-family: "Courier New", Courier, monospace; font-size: 0.9rem; width: 100%; outline: none; }
        .auth-input:focus, .draft-input:focus, .draft-textarea:focus, .draft-select:focus { border-color: #777; }
        
        .eye-btn { position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: #666; display: flex; align-items: center; padding: 0; }
        .eye-btn:hover { color: #fff; }

        .auth-btn { background: transparent; border: 1px solid #444; color: #999; padding: 0.8rem 1.5rem; font-family: "Courier New", Courier, monospace; letter-spacing: 2px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s; }
        .auth-btn:hover { background: #1a1a1a; color: #fff; border-color: #fff; }
        .draft-section { background: rgba(0, 0, 0, 0.6); border: 1px solid #1a1a1a; padding: 3rem; max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
      `}} />

      <main className="purgatory-mainframe">
        <div className="top-nav-bar">
          <div className="sys-header">[ ΠΟΥΡΓΚΑΤΟΡΙΟ : ΑΙΘΟΥΣΑ ΑΝΑΜΟΝΗΣ ]</div>
          <Link to="/" className="back-nav">[ ΕΞΟΔΟΣ ]</Link>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="auth-box">
            {!isRiddleMode ? (
              <>
                <h2 style={{ fontSize: '0.9rem', letterSpacing: '4px', color: '#666', margin: 0 }}>ΕΛΕΓΧΟΣ ΠΡΟΣΒΑΣΗΣ</h2>
                <div className="input-wrapper">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="ΚΩΔΙΚΟΣ ΣΥΝΕΡΓΑΤΗ..." 
                    value={inputKey} 
                    onChange={(e) => setInputKey(e.target.value)} 
                    className="auth-input" 
                    autoFocus 
                  />
                  <button 
                    type="button" 
                    className="eye-btn"
                    onMouseDown={() => setShowPassword(true)}
                    onMouseUp={() => setShowPassword(false)}
                    onMouseLeave={() => setShowPassword(false)}
                    onTouchStart={() => setShowPassword(true)}
                    onTouchEnd={() => setShowPassword(false)}
                    title="Κράτησε πατημένο για εμφάνιση"
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
              </>
            ) : (
              <>
                <h2 style={{ fontSize: '1.1rem', letterSpacing: '1px', color: '#fff', margin: 0, fontStyle: 'italic', fontWeight: 'normal' }}>
                  Πόση ηρεμία χωράει στο θόρυβο;
                </h2>
                <input 
                  type="text" 
                  placeholder="Γράψε την απάντηση..." 
                  value={inputKey} 
                  onChange={(e) => setInputKey(e.target.value)} 
                  className="auth-input" 
                  autoFocus 
                />
              </>
            )}
            {/* Εμφανίζει σφάλμα ΜΟΝΟ αν δεν είμαστε σε riddle mode */}
            {!isRiddleMode && errorMsg && <span style={{ fontSize: '0.8rem', color: '#ff4d4d' }}>{errorMsg}</span>}
            <button type="submit" className="auth-btn">[ ΕΙΣΟΔΟΣ ]</button>
          </form>
        ) : (
          <div className="draft-section">
            <h3 style={{ fontSize: '1.2rem', letterSpacing: '2px', margin: 0, textAlign: 'center', color: '#fff' }}>ΚΑΤΑΘΕΣΗ ΥΛΙΚΟΥ</h3>
            <p style={{ fontSize: '0.85rem', textAlign: 'center', opacity: 0.5, marginBottom: '1rem' }}>
              Τα αρχεία που υποβάλλονται εδώ παραμένουν στο σκοτάδι μέχρι να κριθούν κατάλληλα.
            </p>
            <form onSubmit={handleSubmitDraft} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-grid">
                <input type="text" placeholder="ΤΙΤΛΟΣ" value={title} onChange={(e) => setTitle(e.target.value)} className="draft-input" required />
                <input type="text" placeholder="ΣΥΓΓΡΑΦΕΑΣ (Προαιρετικό)" value={author} onChange={(e) => setAuthor(e.target.value)} className="draft-input" />
              </div>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="draft-select">
                <option value="writings">ΓΡΑΦΤΑ</option>
                <option value="philosophy">ΦΙΛΟΣΟΦΙΑ</option>
                <option value="oralHistory">ΠΡΟΦΟΡΙΚΗ ΙΣΤΟΡΙΑ</option>
                <option value="soundscapes">ΗΧΟΤΟΠΙΑ</option>
              </select>
              <textarea placeholder="ΚΕΙΜΕΝΟ..." value={content} onChange={(e) => setContent(e.target.value)} className="draft-textarea" rows={8} required />
              <button type="submit" className="auth-btn" style={{ alignSelf: 'center', marginTop: '1rem' }}>[ ΥΠΟΒΟΛΗ ΣΤΟ ΠΟΥΡΓΚΑΤΟΡΙΟ ]</button>
            </form>
          </div>
        )}
      </main>
    </>
  )
}