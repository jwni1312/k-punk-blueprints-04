import { createFileRoute, Link } from "@tanstack/react-router"
import { useState, useEffect, useRef } from "react"


export const Route = createFileRoute("/contact")({
  component: Contact,
})

function Contact() {
  const [isOpen, setIsOpen] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // States για τα πεδία της φόρμας
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [linkVal, setLinkVal] = useState("")
  const [message, setMessage] = useState("")
  const [fileName, setFileName] = useState("")

  useEffect(() => {
    audioRef.current = new Audio("/wheeesh.mp3")
    audioRef.current.volume = 0.6
    audioRef.current.play().catch((err) => console.log("Autoplay policy blocked the sound", err))

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newMessage = {
      id: `MSG.${Date.now()}`,
      name,
      subject,
      link: linkVal,
      message,
      attachment: fileName,
      date: new Date().toLocaleString("el-GR")
    }

    // Αποθήκευση στα Εισερχόμενα (Inbox) του Admin
    const existing = localStorage.getItem("folkography_inbox")
    const parsedInbox = existing ? JSON.parse(existing) : []
    localStorage.setItem("folkography_inbox", JSON.stringify([newMessage, ...parsedInbox]))

    alert("ΤΟ ΜΗΝΥΜΑ ΑΠΕΣΤΑΛΗ ΕΠΙΤΥΧΩΣ ΣΤΟ ΑΡΧΕΙΟ.")
    setIsOpen(false) 
    
    // Καθαρισμός φόρμας
    setName("")
    setSubject("")
    setLinkVal("")
    setMessage("")
    setFileName("")
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        aside, header, nav, .sidebar, .project-topbar { display: none !important; }
        
        .contact-mainframe {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-image: url('/pixel-bliss.jpg');
          background-size: cover; 
          background-position: center; 
          background-repeat: no-repeat;
          image-rendering: pixelated;
          font-family: "Courier New", Courier, monospace;
          overflow: hidden; 
          z-index: 10;
          display: flex; 
          flex-direction: column;
        }

        .top-nav {
          display: flex; justify-content: space-between; align-items: center;
          padding: 2rem 4rem; position: relative; z-index: 12;
          background: rgba(0, 0, 0, 0.5); border-bottom: 2px solid #000;
        }
        
        .sys-tag { font-size: 0.85rem; letter-spacing: 2px; color: #FFF; text-shadow: 1px 1px 0 #000; }
        .back-link { font-size: 0.85rem; text-decoration: none; color: #FFF; letter-spacing: 2px; text-shadow: 1px 1px 0 #000; }
        .back-link:hover { color: #FFD700; }

        @keyframes flyIn {
          0% { transform: scale(0) translateY(300px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }

        @keyframes openFolder {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(3); opacity: 0; pointer-events: none; }
        }

        @keyframes revealForm {
          0% { transform: scale(0.8) translateY(50px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        .center-stage {
          flex: 1; display: flex; justify-content: center; align-items: center;
          position: relative; z-index: 11;
        }

        .pixel-envelope {
          width: 160px; height: 110px;
          background-color: #EAD99D;
          border: 4px solid #000;
          position: relative;
          cursor: pointer;
          animation: flyIn 0.8s cubic-bezier(0.25, 1, 0.5, 1) forwards, float 2s ease-in-out infinite 0.8s;
          box-shadow: 10px 10px 0px rgba(0,0,0,0.3);
        }

        .pixel-envelope.opening { animation: openFolder 0.5s ease-out forwards; }

        .envelope-flap {
          position: absolute; top: 0; left: 0;
          border-left: 76px solid transparent; border-right: 76px solid transparent; border-top: 55px solid #C4A661; z-index: 2;
        }
        
        .envelope-body {
          position: absolute; bottom: 0; left: 0; width: 100%; height: 100%;
          border-left: 76px solid #D6B97A; border-right: 76px solid #D6B97A; border-bottom: 55px solid #F4E6B4; box-sizing: border-box; z-index: 1;
        }

        .click-hint {
          position: absolute; bottom: -40px; left: 50%; transform: translateX(-50%);
          color: #FFF; text-shadow: 2px 2px 0 #000; font-weight: bold; white-space: nowrap; pointer-events: none;
        }

        .retro-form-window {
          background-color: #C0C0C0; border: 2px solid #FFF; border-right-color: #000; border-bottom-color: #000;
          padding: 3px; width: 450px; box-shadow: 5px 5px 0px rgba(0,0,0,0.5);
          animation: revealForm 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .window-header {
          background-color: #000080; color: #FFF; padding: 5px 10px; font-weight: bold;
          display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;
        }

        .close-btn {
          background: #C0C0C0; border: 2px solid #FFF; border-right-color: #000; border-bottom-color: #000;
          color: #000; font-weight: bold; width: 24px; height: 24px;
          display: flex; justify-content: center; align-items: center; cursor: pointer; font-family: Arial, sans-serif;
        }
        .close-btn:active { border: 2px solid #000; border-right-color: #FFF; border-bottom-color: #FFF; }

        .form-content { padding: 10px 20px 20px; display: flex; flex-direction: column; gap: 12px; }

        .retro-input, .retro-textarea {
          background: #FFF; border: 2px solid #000; border-right-color: #FFF; border-bottom-color: #FFF;
          padding: 6px; font-family: "Courier New", Courier, monospace; width: 100%; box-sizing: border-box; font-size: 0.9rem; color: #000; outline: none;
        }
        .retro-label { color: #000; font-weight: bold; font-size: 0.9rem; margin-bottom: 2px; display: block; }

        /* Το κουμπί επισύναψης με τον συνδετήρα */
        .retro-attach-container { display: flex; align-items: center; gap: 10px; margin-top: 5px; }
        .retro-attach-btn {
          background: #C0C0C0; border: 2px solid #FFF; border-right-color: #000; border-bottom-color: #000;
          padding: 4px 10px; cursor: pointer; color: #000; font-weight: bold; font-size: 0.85rem; display: inline-block;
        }
        .retro-attach-btn:active { border: 2px solid #000; border-right-color: #FFF; border-bottom-color: #FFF; }
        .attached-filename { font-size: 0.8rem; color: #000; font-style: italic; max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        .retro-submit {
          background: #C0C0C0; border: 2px solid #FFF; border-right-color: #000; border-bottom-color: #000;
          padding: 8px 20px; font-weight: bold; font-family: "Courier New", Courier, monospace;
          cursor: pointer; align-self: flex-end; margin-top: 10px; color: #000;
        }
        .retro-submit:active { border: 2px solid #000; border-right-color: #FFF; border-bottom-color: #FFF; }
      `}} />

      <main className="contact-mainframe">
        <div className="top-nav">
          <div className="sys-tag">[NEW_MESSAGE_RECEIVED]</div>
          <Link to="/" className="back-link">[ ESC / RETURN_TO_CORE ]</Link>
        </div>

        <div className="center-stage">
          {!isOpen ? (
            <div className="pixel-envelope" onClick={() => setIsOpen(true)}>
              <div className="envelope-flap"></div>
              <div className="envelope-body"></div>
              <div className="click-hint">CLICK TO OPEN</div>
            </div>
          ) : (
            <div className="retro-form-window">
              <div className="window-header">
                <span>New_Message.exe</span>
                <button className="close-btn" onClick={() => setIsOpen(false)}>X</button>
              </div>
              
              <form className="form-content" onSubmit={handleFormSubmit}>
                <div>
                  <label className="retro-label">Name:</label>
                  <input type="text" className="retro-input" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                
                <div>
                  <label className="retro-label">Subject:</label>
                  <input type="text" className="retro-input" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                </div>
                
                <div>
                  <label className="retro-label">Link (Optional):</label>
                  <input type="url" className="retro-input" placeholder="https://" value={linkVal} onChange={(e) => setLinkVal(e.target.value)} />
                </div>
                
                <div>
                  <label className="retro-label">Message:</label>
                  <textarea className="retro-textarea" rows={4} value={message} onChange={(e) => setMessage(e.target.value)} required></textarea>
                </div>

                <div className="retro-attach-container">
                  <label className="retro-attach-btn">
                    📎 Attach File
                    <input type="file" style={{ display: "none" }} onChange={handleFileChange} />
                  </label>
                  {fileName && <span className="attached-filename">{fileName}</span>}
                </div>
                
                <button type="submit" className="retro-submit">Send</button>
              </form>
            </div>
          )}
        </div>
      </main>
    </>
  )
}