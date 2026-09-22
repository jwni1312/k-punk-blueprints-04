import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect } from "react"

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
})

const CORRECT_PIN = "otanhmounamikros13"

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [inputKey, setInputKey] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<"soundscapes" | "oralHistory" | "writings" | "philosophy" | "contact" | "announcement" | "purgatory">("soundscapes")

  const [soundArchives, setSoundArchives] = useState(() => {
    const saved = localStorage.getItem("folkography_sound_archives")
    return saved ? JSON.parse(saved) : []
  })

  const [oralHistories, setOralHistories] = useState(() => {
    const saved = localStorage.getItem("folkography_oral_history")
    return saved ? JSON.parse(saved) : []
  })

  const [writings, setWritings] = useState(() => {
    const saved = localStorage.getItem("folkography_writings")
    return saved ? JSON.parse(saved) : []
  })

  const [philosophy, setPhilosophy] = useState(() => {
    const saved = localStorage.getItem("folkography_philosophy")
    return saved ? JSON.parse(saved) : []
  })

  const [contactInfo, setContactInfo] = useState(() => {
    const saved = localStorage.getItem("folkography_contact")
    return saved ? JSON.parse(saved) : { email: "", location: "", note: "" }
  })

  // --- BROADCAST (Επιδιόρθωση αποθήκευσης) ---
  const [announcementMsg, setAnnouncementMsg] = useState("")
  const [activeAnnouncement, setActiveAnnouncement] = useState(() => {
    const saved = localStorage.getItem("folkography_announcement")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) return parsed
      } catch (e) {
        console.error(e)
      }
    }
    return null
  })

  const [drafts, setDrafts] = useState(() => {
    const saved = localStorage.getItem("folkography_purgatory_drafts")
    return saved ? JSON.parse(saved) : []
  })

  const [title, setTitle] = useState("")
  const [extraField1, setExtraField1] = useState("")
  const [extraField2, setExtraField2] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")
  const [contactEmail, setContactEmail] = useState(contactInfo.email)
  const [contactLocation, setContactLocation] = useState(contactInfo.location)
  const [contactNote, setContactNote] = useState(contactInfo.note)

  useEffect(() => { localStorage.setItem("folkography_sound_archives", JSON.stringify(soundArchives)) }, [soundArchives])
  useEffect(() => { localStorage.setItem("folkography_oral_history", JSON.stringify(oralHistories)) }, [oralHistories])
  useEffect(() => { localStorage.setItem("folkography_writings", JSON.stringify(writings)) }, [writings])
  useEffect(() => { localStorage.setItem("folkography_philosophy", JSON.stringify(philosophy)) }, [philosophy])
  useEffect(() => { localStorage.setItem("folkography_contact", JSON.stringify(contactInfo)) }, [contactInfo])
  useEffect(() => { localStorage.setItem("folkography_purgatory_drafts", JSON.stringify(drafts)) }, [drafts])
  
  useEffect(() => {
    if (activeAnnouncement) {
      localStorage.setItem("folkography_announcement", JSON.stringify(activeAnnouncement))
    } else {
      localStorage.removeItem("folkography_announcement")
    }
  }, [activeAnnouncement])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputKey === CORRECT_PIN) {
      setIsAuthenticated(true)
      setErrorMsg("")
    } else {
      setErrorMsg("ACCESS DENIED // INVALID CLEARANCE KEY")
      setInputKey("")
    }
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    const currentDate = new Date().toISOString().split('T')[0]
    const finalAuthor = author.trim() ? author.trim() : "Folkography Admin"

    if (activeTab === "soundscapes") {
      const newItem = {
        id: `ARCHIVE.SND.0${soundArchives.length + 1}`, title: title.toUpperCase(),
        duration: extraField1 || "00:00:00", location: extraField2 || "ΑΓΝΩΣΤΗ ΤΟΠΟΘΕΣΙΑ",
        description: content || "Χωρίς περιγραφή.", audioUrl: "/01 Addis.mp3", author: finalAuthor, date: currentDate,
      }
      setSoundArchives([...soundArchives, newItem])
    } else if (activeTab === "oralHistory") {
      const newItem = {
        id: `ORAL.HST.0${oralHistories.length + 1}`, title: title.toUpperCase(),
        description: content || "Χωρίς περιγραφή μνήμης.", audioUrl: "/01 Addis.mp3", author: finalAuthor, date: currentDate,
      }
      setOralHistories([...oralHistories, newItem])
    } else if (activeTab === "writings") {
      const newItem = {
        id: `DOC.0${writings.length + 1}`, title: title.toUpperCase(), content: content || "Κενό κειμένου.", author: finalAuthor, date: currentDate,
      }
      setWritings([...writings, newItem])
    } else if (activeTab === "philosophy") {
      const newItem = {
        id: `PHIL.0${philosophy.length + 1}`, title: title.toUpperCase(), content: content || "Κενό κειμένου.", author: finalAuthor, date: currentDate,
      }
      setPhilosophy([...philosophy, newItem])
    }

    setTitle(""); setExtraField1(""); setExtraField2(""); setContent(""); setAuthor("")
    alert("Η καταχώρηση προστέθηκε επιτυχώς!")
  }

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()
    setContactInfo({ email: contactEmail, location: contactLocation, note: contactNote })
    alert("Τα στοιχεία επικοινωνίας ενημερώθηκαν!")
  }

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    if (!announcementMsg.trim()) return
    
    // Ορισμός 24ώρου
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000
    const newBroadcast = { message: announcementMsg.trim(), expiresAt }
    
    setActiveAnnouncement(newBroadcast)
    localStorage.setItem("folkography_announcement", JSON.stringify(newBroadcast))
    setAnnouncementMsg("")
    alert("ΕΚΠΟΜΠΗ ΕΝΕΡΓΗ. Το μήνυμα αποθηκεύτηκε και θα εμφανιστεί στην αρχική οθόνη.")
  }

  const handleClearBroadcast = () => { 
    setActiveAnnouncement(null)
    localStorage.removeItem("folkography_announcement")
  }

  const handleApproveDraft = (draft: any) => {
    const currentDate = new Date().toISOString().split('T')[0]

    if (draft.category === "writings") {
      const newItem = { id: `DOC.0${writings.length + 1}`, title: draft.title, content: draft.content, author: draft.author, date: currentDate }
      setWritings([...writings, newItem])
    } else if (draft.category === "philosophy") {
      const newItem = { id: `PHIL.0${philosophy.length + 1}`, title: draft.title, content: draft.content, author: draft.author, date: currentDate }
      setPhilosophy([...philosophy, newItem])
    } else if (draft.category === "oralHistory") {
      const newItem = { id: `ORAL.HST.0${oralHistories.length + 1}`, title: draft.title, description: draft.content, audioUrl: "/01 Addis.mp3", author: draft.author, date: currentDate }
      setOralHistories([...oralHistories, newItem])
    } else if (draft.category === "soundscapes") {
      const newItem = { id: `ARCHIVE.SND.0${soundArchives.length + 1}`, title: draft.title, duration: "00:00:00", location: "ΑΓΝΩΣΤΗ ΤΟΠΟΘΕΣΙΑ", description: draft.content, audioUrl: "/01 Addis.mp3", author: draft.author, date: currentDate }
      setSoundArchives([...soundArchives, newItem])
    }

    setDrafts(drafts.filter((d: any) => d.id !== draft.id))
    alert("Το αρχείο εγκρίθηκε και δημοσιεύτηκε επίσημα!")
  }

  const handleDeleteDraft = (id: string) => {
    if (confirm("Απόρριψη και οριστική διαγραφή αυτού του draft;")) {
      setDrafts(drafts.filter((d: any) => d.id !== id))
    }
  }

  const handleDelete = (id: string, type: string) => {
    if (confirm("Διαγραφή αυτού του αρχείου;")) {
      if (type === "soundscapes") setSoundArchives(soundArchives.filter((i: any) => i.id !== id))
      if (type === "oralHistory") setOralHistories(oralHistories.filter((i: any) => i.id !== id))
      if (type === "writings") setWritings(writings.filter((i: any) => i.id !== id))
      if (type === "philosophy") setPhilosophy(philosophy.filter((i: any) => i.id !== id))
    }
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        aside, header, nav, .sidebar, .project-topbar { display: none !important; }
        .admin-mainframe { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: var(--night, #000); color: var(--cream); font-family: "Courier New", Courier, monospace; padding: 4rem 6rem; overflow-y: auto; z-index: 100; }
        .top-nav-bar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 230, 160, 0.2); padding-bottom: 1.5rem; }
        .sys-header { font-size: 0.85rem; opacity: 0.7; letter-spacing: 2px; color: var(--rose); }
        .back-nav { font-size: 0.85rem; text-decoration: none; color: var(--cream); opacity: 0.6; letter-spacing: 2px; }
        .back-nav:hover { opacity: 1; color: var(--rose); }
        .login-box { max-width: 450px; margin: 10vh auto; background: rgba(0, 0, 0, 0.9); border: 1px solid var(--rose); padding: 3rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .input-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
        .login-input, .admin-input, .admin-textarea { background: transparent; border: 1px solid rgba(255, 230, 160, 0.3); color: var(--cream); padding: 0.8rem; padding-right: 2.5rem; font-family: "Courier New", Courier, monospace; font-size: 0.9rem; width: 100%; outline: none; }
        .login-input:focus, .admin-input:focus, .admin-textarea:focus { border-color: var(--rose); }
        .eye-btn { position: absolute; right: 10px; background: none; border: none; cursor: pointer; color: rgba(255, 230, 160, 0.4); display: flex; align-items: center; padding: 0; }
        .eye-btn:hover { color: var(--rose); }
        .admin-btn { background: transparent; border: 1px solid var(--rose); color: var(--rose); padding: 0.8rem 1.5rem; font-family: "Courier New", Courier, monospace; letter-spacing: 2px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s; }
        .admin-btn:hover { background: var(--rose); color: var(--night); }
        .admin-tabs { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .tab-btn { background: transparent; border: 1px solid rgba(255, 230, 160, 0.3); color: var(--cream); padding: 0.6rem 1.2rem; font-family: "Courier New", Courier, monospace; cursor: pointer; font-size: 0.8rem; letter-spacing: 1px; }
        .tab-btn.active { border-color: var(--rose); color: var(--rose); background: rgba(206, 104, 117, 0.1); }
        .admin-section { background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(255, 230, 160, 0.15); padding: 2rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .item-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid rgba(255, 230, 160, 0.1); }
      `}} />

      <main className="admin-mainframe">
        <div className="top-nav-bar">
          <div className="sys-header">[SYSTEM_ADMIN_CONSOLE] : MASTER SUITE</div>
          <Link to="/" className="back-nav">[ ESC / RETURN_TO_CORE ]</Link>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="login-box">
            <h2 style={{ fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--rose)', margin: 0 }}>[ ENTER SECURITY CLEARANCE ]</h2>
            <div className="input-wrapper">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="ENTER PASSCODE..." 
                value={inputKey} 
                onChange={(e) => setInputKey(e.target.value)} 
                className="login-input" 
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
            {errorMsg && <span style={{ fontSize: '0.75rem', color: 'var(--rose)' }}>{errorMsg}</span>}
            <button type="submit" className="admin-btn">[ AUTHORIZE ]</button>
          </form>
        ) : (
          <div>
            <div className="admin-tabs">
              <button className={`tab-btn ${activeTab === "soundscapes" ? "active" : ""}`} onClick={() => setActiveTab("soundscapes")}>// ΗΧΟΤΟΠΙΑ</button>
              <button className={`tab-btn ${activeTab === "oralHistory" ? "active" : ""}`} onClick={() => setActiveTab("oralHistory")}>// ΠΡΟΦ. ΙΣΤΟΡΙΑ</button>
              <button className={`tab-btn ${activeTab === "writings" ? "active" : ""}`} onClick={() => setActiveTab("writings")}>// ΓΡΑΦΤΑ</button>
              <button className={`tab-btn ${activeTab === "philosophy" ? "active" : ""}`} onClick={() => setActiveTab("philosophy")}>// ΦΙΛΟΣΟΦΙΑ</button>
              <button className={`tab-btn ${activeTab === "contact" ? "active" : ""}`} onClick={() => setActiveTab("contact")}>// CONTACT</button>
              <button className={`tab-btn ${activeTab === "announcement" ? "active" : ""}`} onClick={() => setActiveTab("announcement")} style={{ borderColor: 'var(--rose)' }}>// BROADCAST</button>
              <button className={`tab-btn ${activeTab === "purgatory" ? "active" : ""}`} onClick={() => setActiveTab("purgatory")} style={{ borderColor: '#888', color: drafts.length > 0 ? '#fff' : '#888' }}>
                // ΠΟΥΡΓΚΑΤΟΡΙΟ ({drafts.length})
              </button>
            </div>

            {activeTab === "purgatory" ? (
              <div className="admin-section">
                <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: '#fff', margin: 0 }}>// ΕΚΚΡΕΜΗ ΑΡΧΕΙΑ ΑΠΟ ΤΟ ΠΟΥΡΓΚΑΤΟΡΙΟ</h3>
                {drafts.length === 0 ? (
                  <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>Το Καθαρτήριο είναι κενό. Κανένα νέο υλικό σε αναμονή.</p>
                ) : (
                  drafts.map((draft: any) => (
                    <div key={draft.id} style={{ border: '1px solid #333', padding: '1.5rem', margin: '1rem 0', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--rose)', marginBottom: '0.55rem' }}>ΚΑΤΗΓΟΡΙΑ: [{draft.category.toUpperCase()}] // ΣΥΓΓΡΑΦΕΑΣ: {draft.author}</div>
                      <h4 style={{ fontSize: '1.1rem', margin: '0 0 0.5rem 0', color: '#fff' }}>{draft.title}</h4>
                      <p style={{ fontSize: '0.9rem', opacity: 0.8, whiteSpace: 'pre-wrap', marginBottom: '1.5rem' }}>{draft.content}</p>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => handleApproveDraft(draft)} className="admin-btn" style={{ borderColor: '#4ade80', color: '#4ade80', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>[ ΕΓΚΡΙΣΗ &amp; ΔΗΜΟΣΙΕΥΣΗ ]</button>
                        <button onClick={() => handleDeleteDraft(draft.id)} className="admin-btn" style={{ borderColor: '#ef4444', color: '#ef4444', padding: '0.4rem 1rem', fontSize: '0.8rem' }}>[ ΑΠΟΡΡΙΨΗ ]</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : activeTab === "announcement" ? (
              <div className="admin-section">
                <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: 'var(--rose)', margin: 0 }}>// DIVINE MESSAGE BROADCAST</h3>
                {activeAnnouncement ? (
                  <div style={{ padding: '1.5rem', border: '1px solid var(--rose)', background: 'rgba(255, 77, 77, 0.05)' }}>
                    <p style={{ margin: '0 0 1rem 0', color: 'var(--cream)' }}><strong>[ ΕΝΕΡΓΗ ΕΚΠΟΜΠΗ ]:</strong> {activeAnnouncement.message}</p>
                    <p style={{ fontSize: '0.85rem', opacity: 0.6, margin: '0 0 1.5rem 0' }}>ΛΗΞΗ: {new Date(activeAnnouncement.expiresAt).toLocaleString('el-GR')}</p>
                    <button onClick={handleClearBroadcast} className="admin-btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>[ ΣΙΓΑΣΗ / STOP ]</button>
                  </div>
                ) : (
                  <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <textarea placeholder="ΜΗΝΥΜΑ..." value={announcementMsg} onChange={(e) => setAnnouncementMsg(e.target.value)} className="admin-textarea" rows={4} required />
                    <button type="submit" className="admin-btn" style={{ alignSelf: 'flex-start' }}>[ ΕΝΑΡΞΗ ΕΚΠΟΜΠΗΣ 24H ]</button>
                  </form>
                )}
              </div>
            ) : activeTab === "contact" ? (
              <form onSubmit={handleSaveContact} className="admin-section">
                <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: 'var(--rose)', margin: 0 }}>// ΡΥΘΜΙΣΗ CONTACT</h3>
                <div className="form-grid">
                  <input type="text" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className="admin-input" required />
                  <input type="text" value={contactLocation} onChange={(e) => setContactLocation(e.target.value)} className="admin-input" />
                </div>
                <textarea value={contactNote} onChange={(e) => setContactNote(e.target.value)} className="admin-textarea" rows={3} />
                <button type="submit" className="admin-btn" style={{ alignSelf: 'flex-start' }}>[ ΑΠΟΘΗΚΕΥΣΗ ]</button>
              </form>
            ) : (
              <>
                <form onSubmit={handleAddItem} className="admin-section">
                  <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: 'var(--rose)', margin: 0 }}>+ ΠΡΟΣΘΗΚΗ ({activeTab.toUpperCase()})</h3>
                  <div className="form-grid">
                    <input type="text" placeholder="ΤΙΤΛΟΣ" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" required />
                    <input type="text" placeholder="ΣΥΓΓΡΑΦΕΑΣ" value={author} onChange={(e) => setAuthor(e.target.value)} className="admin-input" />
                  </div>
                  <textarea placeholder="ΚΕΙΜΕΝΟ..." value={content} onChange={(e) => setContent(e.target.value)} className="admin-textarea" rows={4} />
                  <button type="submit" className="admin-btn" style={{ alignSelf: 'flex-start' }}>[ ΑΠΟΘΗΚΕΥΣΗ ]</button>
                </form>

                <div className="admin-section">
                  <h3 style={{ fontSize: '1rem', letterSpacing: '2px', margin: 0 }}>// ΥΠΑΡΧΟΝΤΑ</h3>
                  {activeTab === "soundscapes" && soundArchives.map((item: any) => (
                    <div key={item.id} className="item-row">
                      <div><strong>{item.title}</strong></div>
                      <button onClick={() => handleDelete(item.id, "soundscapes")} className="admin-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>[ ΔΙΑΓΡΑΦΗ ]</button>
                    </div>
                  ))}
                  {activeTab === "oralHistory" && oralHistories.map((item: any) => (
                    <div key={item.id} className="item-row">
                      <div><strong>{item.title}</strong></div>
                      <button onClick={() => handleDelete(item.id, "oralHistory")} className="admin-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>[ ΔΙΑΓΡΑΦΗ ]</button>
                    </div>
                  ))}
                  {activeTab === "writings" && writings.map((item: any) => (
                    <div key={item.id} className="item-row">
                      <div><strong>{item.title}</strong></div>
                      <button onClick={() => handleDelete(item.id, "writings")} className="admin-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>[ ΔΙΑΓΡΑΦΗ ]</button>
                    </div>
                  ))}
                  {activeTab === "philosophy" && philosophy.map((item: any) => (
                    <div key={item.id} className="item-row">
                      <div><strong>{item.title}</strong></div>
                      <button onClick={() => handleDelete(item.id, "philosophy")} className="admin-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>[ ΔΙΑΓΡΑΦΗ ]</button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </>
  )
}