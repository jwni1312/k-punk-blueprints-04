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
  const [activeTab, setActiveTab] = useState<"soundscapes" | "oralHistory" | "writings" | "philosophy" | "contact">("soundscapes")

  // 1. ΗΧΟΤΟΠΙΑ
  const [soundArchives, setSoundArchives] = useState(() => {
    const saved = localStorage.getItem("folkography_sound_archives")
    if (saved) return JSON.parse(saved)
    return [
      {
        id: "ARCHIVE.SND.01",
        title: "ΝΥΧΤΕΡΙΝΗ_ΒΡΟΧΗ_ΣΕ_ΤΣΙΓΚΟ",
        duration: "04:20:15",
        location: "Αθήνα, Κέντρο",
        description: "Καταγραφή βροχόπτωσης...",
        audioUrl: "/01 Addis.mp3",
        author: "System Admin",
        date: "2026-06-01",
      },
    ]
  })

  // 2. ΠΡΟΦΟΡΙΚΗ ΙΣΤΟΡΙΑ
  const [oralHistories, setOralHistories] = useState(() => {
    const saved = localStorage.getItem("folkography_oral_history")
    if (saved) return JSON.parse(saved)
    return [
      {
        id: "ORAL.HST.01",
        title: "ΜΑΡΤΥΡΙΑ // ΣΥΛΛΟΓΗ 01",
        description: "«Η μνήμη δεν είναι απλώς αυτό που έμεινε πίσω...»",
        audioUrl: "/01 Addis.mp3",
        author: "Αρχείο Μνήμης",
        date: "2026-06-05",
      },
    ]
  })

  // 3. ΓΡΑΠΤΑ (folkography_writings)
  const [writings, setWritings] = useState(() => {
    const saved = localStorage.getItem("folkography_writings")
    if (saved) return JSON.parse(saved)
    return [
      {
        id: "DOC.01",
        title: "ΣΗΜΕΙΩΣΕΙΣ ΓΙΑ ΤΟΝ ΚΙΝΗΜΑΤΟΓΡΑΦΟ",
        content: "Αρχειακές σκέψεις γύρω από την εικόνα.",
        author: "Folkography Admin",
        date: "2026-06-01",
      },
    ]
  })

  // 4. ΦΙΛΟΣΟΦΙΑ (folkography_philosophy - ΑΠΟΛΥΤΑ ΞΕΧΩΡΙΣΤΟ)
  const [philosophy, setPhilosophy] = useState(() => {
    const saved = localStorage.getItem("folkography_philosophy")
    if (saved) return JSON.parse(saved)
    return [
      {
        id: "PHIL.01",
        title: "Ο ΠΕΙΡΑΣΜΟΣ ΤΟΥ ΠΕΙΡΑΣΜΟΥ",
        content: "Ανάλυση γύρω από τις Τέσσερις Ταλμουδικές Μελέτες...",
        author: "Ε. Λ.",
        date: "2026-06-10",
      },
    ]
  })

  // 5. CONTACT
  const [contactInfo, setContactInfo] = useState(() => {
    const saved = localStorage.getItem("folkography_contact")
    if (saved) return JSON.parse(saved)
    return {
      email: "contact@folkography.archiv",
      location: "Athina / Hellas",
      note: "Direct transmission channels open.",
    }
  })

  const [title, setTitle] = useState("")
  const [extraField1, setExtraField1] = useState("")
  const [extraField2, setExtraField2] = useState("")
  const [content, setContent] = useState("")
  const [author, setAuthor] = useState("")

  const [contactEmail, setContactEmail] = useState(contactInfo.email)
  const [contactLocation, setContactLocation] = useState(contactInfo.location)
  const [contactNote, setContactNote] = useState(contactInfo.note)

  // Συγχρονισμός με LocalStorage ανά κατηγορία
  useEffect(() => {
    localStorage.setItem("folkography_sound_archives", JSON.stringify(soundArchives))
  }, [soundArchives])

  useEffect(() => {
    localStorage.setItem("folkography_oral_history", JSON.stringify(oralHistories))
  }, [oralHistories])

  useEffect(() => {
    localStorage.setItem("folkography_writings", JSON.stringify(writings))
  }, [writings])

  useEffect(() => {
    localStorage.setItem("folkography_philosophy", JSON.stringify(philosophy))
  }, [philosophy])

  useEffect(() => {
    localStorage.setItem("folkography_contact", JSON.stringify(contactInfo))
  }, [contactInfo])

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
        id: `ARCHIVE.SND.0${soundArchives.length + 1}`,
        title: title.toUpperCase(),
        duration: extraField1 || "00:00:00",
        location: extraField2 || "ΑΓΝΩΣΤΗ ΤΟΠΟΘΕΣΙΑ",
        description: content || "Χωρίς περιγραφή.",
        audioUrl: "/01 Addis.mp3",
        author: finalAuthor,
        date: currentDate,
      }
      setSoundArchives([...soundArchives, newItem])
    } else if (activeTab === "oralHistory") {
      const newItem = {
        id: `ORAL.HST.0${oralHistories.length + 1}`,
        title: title.toUpperCase(),
        description: content || "Χωρίς περιγραφή μνήμης.",
        audioUrl: "/01 Addis.mp3",
        author: finalAuthor,
        date: currentDate,
      }
      setOralHistories([...oralHistories, newItem])
    } else if (activeTab === "writings") {
      const newItem = {
        id: `DOC.0${writings.length + 1}`,
        title: title.toUpperCase(),
        content: content || "Κενό κειμένου.",
        author: finalAuthor,
        date: currentDate,
      }
      setWritings([...writings, newItem])
    } else if (activeTab === "philosophy") {
      const newItem = {
        id: `PHIL.0${philosophy.length + 1}`,
        title: title.toUpperCase(),
        content: content || "Κενό κειμένου.",
        author: finalAuthor,
        date: currentDate,
      }
      setPhilosophy([...philosophy, newItem])
    }

    setTitle("")
    setExtraField1("")
    setExtraField2("")
    setContent("")
    setAuthor("")
    alert("Η καταχώρηση προστέθηκε επιτυχώς στη σωστή ενότητα!")
  }

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault()
    setContactInfo({ email: contactEmail, location: contactLocation, note: contactNote })
    alert("Τα στοιχεία επικοινωνίας ενημερώθηκαν!")
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
        .admin-mainframe {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-color: var(--night, #000); color: var(--cream);
          font-family: "Courier New", Courier, monospace; padding: 4rem 6rem;
          overflow-y: auto; z-index: 100;
        }
        .top-nav-bar {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 2rem; border-bottom: 1px solid rgba(255, 230, 160, 0.2); padding-bottom: 1.5rem;
        }
        .sys-header { font-size: 0.85rem; opacity: 0.7; letter-spacing: 2px; color: var(--rose); }
        .back-nav { font-size: 0.85rem; text-decoration: none; color: var(--cream); opacity: 0.6; letter-spacing: 2px; }
        .back-nav:hover { opacity: 1; color: var(--rose); }
        .login-box {
          max-width: 450px; margin: 10vh auto; background: rgba(0, 0, 0, 0.9);
          border: 1px solid var(--rose); padding: 3rem; display: flex; flex-direction: column; gap: 1.5rem;
        }
        .login-input, .admin-input, .admin-textarea {
          background: transparent; border: 1px solid rgba(255, 230, 160, 0.3);
          color: var(--cream); padding: 0.8rem; font-family: "Courier New", Courier, monospace; font-size: 0.9rem; width: 100%; outline: none;
        }
        .login-input:focus, .admin-input:focus, .admin-textarea:focus { border-color: var(--rose); }
        .admin-btn {
          background: transparent; border: 1px solid var(--rose); color: var(--rose);
          padding: 0.8rem 1.5rem; font-family: "Courier New", Courier, monospace; letter-spacing: 2px; cursor: pointer; font-size: 0.85rem; transition: all 0.3s;
        }
        .admin-btn:hover { background: var(--rose); color: var(--night); }
        .admin-tabs { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .tab-btn {
          background: transparent; border: 1px solid rgba(255, 230, 160, 0.3); color: var(--cream);
          padding: 0.6rem 1.2rem; font-family: "Courier New", Courier, monospace; cursor: pointer; font-size: 0.8rem; letter-spacing: 1px;
        }
        .tab-btn.active { border-color: var(--rose); color: var(--rose); background: rgba(206, 104, 117, 0.1); }
        .admin-section {
          background: rgba(0, 0, 0, 0.7); border: 1px solid rgba(255, 230, 160, 0.15);
          padding: 2rem; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 1rem;
        }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .item-row { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-bottom: 1px solid rgba(255, 230, 160, 0.1); }
      `}} />

      <main className="admin-mainframe">
        <div className="top-nav-bar">
          <div className="sys-header">[SYSTEM_ADMIN_CONSOLE] : SECURE EDITING SUITE</div>
          <Link to="/" className="back-nav">[ ESC / RETURN_TO_CORE ]</Link>
        </div>

        {!isAuthenticated ? (
          <form onSubmit={handleLogin} className="login-box">
            <h2 style={{ fontSize: '1.1rem', letterSpacing: '2px', color: 'var(--rose)', margin: 0 }}>
              [ ENTER SECURITY CLEARANCE ]
            </h2>
            <input 
              type="password"
              placeholder="ENTER PASSCODE..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="login-input"
              autoFocus
            />
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
            </div>

            {activeTab === "contact" ? (
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
                  <h3 style={{ fontSize: '1rem', letterSpacing: '2px', color: 'var(--rose)', margin: 0 }}>
                    + ΠΡΟΣΘΗΚΗ ΝΕΑΣ ΚΑΤΑΧΩΡΗΣΗΣ ({activeTab.toUpperCase()})
                  </h3>
                  
                  <div className="form-grid">
                    <input type="text" placeholder="ΤΙΤΛΟΣ ΑΡΧΕΙΟΥ" value={title} onChange={(e) => setTitle(e.target.value)} className="admin-input" required />
                    <input type="text" placeholder="ΟΝΟΜΑ ΣΥΓΓΡΑΦΕΑ" value={author} onChange={(e) => setAuthor(e.target.value)} className="admin-input" />
                  </div>

                  {activeTab === "soundscapes" && (
                    <div className="form-grid">
                      <input type="text" placeholder="ΔΙΑΡΚΕΙΑ (π.χ. 04:20:15)" value={extraField1} onChange={(e) => setExtraField1(e.target.value)} className="admin-input" />
                      <input type="text" placeholder="ΤΟΠΟΘΕΣΙΑ" value={extraField2} onChange={(e) => setExtraField2(e.target.value)} className="admin-input" />
                    </div>
                  )}

                  <textarea placeholder="ΚΕΙΜΕΝΟ / ΠΕΡΙΓΡΑΦΗ..." value={content} onChange={(e) => setContent(e.target.value)} className="admin-textarea" rows={4} />

                  <button type="submit" className="admin-btn" style={{ alignSelf: 'flex-start' }}>[ ΑΠΟΘΗΚΕΥΣΗ ΣΤΟ ΣΥΣΤΗΜΑ ]</button>
                </form>

                <div className="admin-section">
                  <h3 style={{ fontSize: '1rem', letterSpacing: '2px', margin: 0 }}>// ΥΠΑΡΧΟΝΤΑ ΑΡΧΕΙΑ ({activeTab.toUpperCase()})</h3>
                  
                  {activeTab === "soundscapes" && soundArchives.map((item: any) => (
                    <div key={item.id} className="item-row">
                      <div><strong>{item.title}</strong><div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.date}</div></div>
                      <button onClick={() => handleDelete(item.id, "soundscapes")} className="admin-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>[ ΔΙΑΓΡΑΦΗ ]</button>
                    </div>
                  ))}

                  {activeTab === "oralHistory" && oralHistories.map((item: any) => (
                    <div key={item.id} className="item-row">
                      <div><strong>{item.title}</strong><div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.date}</div></div>
                      <button onClick={() => handleDelete(item.id, "oralHistory")} className="admin-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>[ ΔΙΑΓΡΑΦΗ ]</button>
                    </div>
                  ))}

                  {activeTab === "writings" && writings.map((item: any) => (
                    <div key={item.id} className="item-row">
                      <div><strong>{item.title}</strong><div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.date}</div></div>
                      <button onClick={() => handleDelete(item.id, "writings")} className="admin-btn" style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}>[ ΔΙΑΓΡΑΦΗ ]</button>
                    </div>
                  ))}

                  {activeTab === "philosophy" && philosophy.map((item: any) => (
                    <div key={item.id} className="item-row">
                      <div><strong>{item.title}</strong><div style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.date}</div></div>
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