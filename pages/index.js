"use client"

import { useState, useEffect } from "react"

const API_URL =
  "https://script.google.com/macros/s/AKfycbzz6A2fpCBdMDgY0eSTiWtykNGUyZvAqe8GK_Xkr9ZMApEvmHUtM6PyKjY4QpXkTVUv/exec"

export default function Home() {
  const [page, setPage] = useState("dashboard")
  const [sessions, setSessions] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [profilePic, setProfilePic] = useState(null)

  useEffect(() => {
    fetch(API_URL + "?type=sessions")
      .then(res => res.json())
      .then(data => setSessions(data))

    fetch(API_URL + "?type=announcements")
      .then(res => res.json())
      .then(data => setAnnouncements(data))
  }, [])

  const registerSession = async (id) => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "registerSession", id }),
    })
    alert("Registered successfully!")
    window.location.reload()
  }

  return (
    <div style={styles.container}>
      {/* NAVBAR */}
      <div style={styles.navbar}>
        <h2>SAIBSA 2026</h2>
        <div>
          <button onClick={() => setPage("dashboard")}>Dashboard</button>
          <button onClick={() => setPage("sessions")}>Sessions</button>
          <button onClick={() => setPage("announcements")}>Announcements</button>
          <button onClick={() => setPage("team")}>Team</button>
          <button onClick={() => setPage("profile")}>Profile</button>
        </div>
      </div>

      {/* DASHBOARD */}
      {page === "dashboard" && (
        <div style={styles.page}>
          <img
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7"
            style={styles.banner}
          />
          <h1>Welcome to SAIBSA 2026</h1>
          <p>
            An inspiring IB leadership and collaboration event bringing together
            PYP, MYP, DP and educational leaders.
          </p>
        </div>
      )}

      {/* SESSIONS */}
      {page === "sessions" && (
        <div style={styles.grid}>
          {sessions.map((session, index) => {
            const percent =
              (session.registered / session.capacity) * 100

            return (
              <div key={index} style={styles.card}>
                <h3>{session.title}</h3>
                <p>Speaker: {session.speaker}</p>
                <p>Venue: {session.venue}</p>

                <div style={styles.progressBar}>
                  <div
                    style={{
                      ...styles.progressFill,
                      width: percent + "%",
                    }}
                  />
                </div>

                <p>
                  {session.registered}/{session.capacity} Registered
                </p>

                <button
                  onClick={() => registerSession(session.id)}
                  disabled={session.registered >= session.capacity}
                  style={styles.registerBtn}
                >
                  Register
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* ANNOUNCEMENTS */}
      {page === "announcements" && (
        <div style={styles.page}>
          <h2>Latest Announcements</h2>
          {announcements.map((a, i) => (
            <div key={i} style={styles.announcement}>
              {a.message}
            </div>
          ))}
        </div>
      )}

      {/* TEAM */}
      {page === "team" && (
        <div style={styles.page}>
          <h2>Organising Team</h2>
          <p>Team data can be connected to Google Sheets next.</p>
        </div>
      )}

      {/* PROFILE */}
      {page === "profile" && (
        <div style={styles.page}>
          <h2>Your Profile</h2>
          <input
            type="file"
            onChange={(e) =>
              setProfilePic(URL.createObjectURL(e.target.files[0]))
            }
          />
          {profilePic && (
            <img src={profilePic} style={styles.profileImg} />
          )}
          <button onClick={() => alert("Logged out")}>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    fontFamily: "Arial",
    background: "#f4f6f9",
    minHeight: "100vh",
  },
  navbar: {
    background: "#111827",
    color: "white",
    padding: "15px",
    display: "flex",
    justifyContent: "space-between",
  },
  page: {
    padding: "40px",
  },
  banner: {
    width: "100%",
    borderRadius: "12px",
    marginBottom: "20px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
    gap: "20px",
    padding: "40px",
  },
  card: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  progressBar: {
    background: "#e5e7eb",
    height: "8px",
    borderRadius: "10px",
    marginTop: "10px",
  },
  progressFill: {
    background: "#3b82f6",
    height: "8px",
    borderRadius: "10px",
  },
  registerBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    background: "#111827",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  announcement: {
    background: "white",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  profileImg: {
    marginTop: "20px",
    width: "120px",
    borderRadius: "50%",
  },
}
