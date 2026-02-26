// FULL SAIBSA IB EVENT MANAGEMENT WEBSITE
// Next.js + Firebase (Auth + Firestore) + Google Sheets Backend
// 100% Spark Plan Compatible

import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyAwRDKHCSqzdltqIzi5win8D7BEqmdHFVg",
  authDomain: "saibsa-event-2026.firebaseapp.com",
  projectId: "saibsa-event-2026",
  messagingSenderId: "521327539639",
  appId: "1:521327539639:web:12adf3dc13abae9cd9a432",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 🔁 PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE
const SHEET_API = "PASTE_YOUR_WEB_APP_URL_HERE";

export default function Home() {
  const [user, setUser] = useState(null);
  const [step, setStep] = useState("register");
  const [formData, setFormData] = useState({});
  const [sessions, setSessions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [team, setTeam] = useState([]);
  const [page, setPage] = useState("dashboard");

  // ================= FETCH SHEET DATA =================
  useEffect(() => {
    if (!SHEET_API.includes("http")) return;

    fetch(SHEET_API + "?type=sessions")
      .then((res) => res.json())
      .then((data) => setSessions(data));

    fetch(SHEET_API + "?type=announcements")
      .then((res) => res.json())
      .then((data) => setAnnouncements(data));

    fetch(SHEET_API + "?type=team")
      .then((res) => res.json())
      .then((data) => setTeam(data));
  }, []);

  // ================= REGISTRATION =================
  const handleRegister = async (e) => {
    e.preventDefault();

    await sendSignInLinkToEmail(auth, formData.email, {
      url: window.location.href,
      handleCodeInApp: true,
    });

    localStorage.setItem("emailForSignIn", formData.email);
    setStep("checkEmail");
  };

  const completeSignIn = async () => {
    const email = localStorage.getItem("emailForSignIn");
    const result = await signInWithEmailLink(
      auth,
      email,
      window.location.href
    );

    await setDoc(doc(db, "users", result.user.uid), {
      ...formData,
      uid: result.user.uid,
    });

    setUser(result.user);
  };

  const registerSession = async (session) => {
    if (session.registered >= session.limit) return;

    await fetch(SHEET_API, {
      method: "POST",
      body: JSON.stringify({
        type: "registerSession",
        sessionId: session.id,
        userId: user.uid,
      }),
    });

    alert("Registered successfully!");
    window.location.reload();
  };

  // ================= LOGIN UI =================
  if (!user) {
    return (
      <div style={styles.center}>
        <div style={styles.card}>
          {step === "register" && (
            <form onSubmit={handleRegister}>
              <h2>SAIBSA Registration</h2>
              <input placeholder="Full Name" required onChange={(e)=>setFormData({...formData,name:e.target.value})}/>
              <input type="email" placeholder="Email" required onChange={(e)=>setFormData({...formData,email:e.target.value})}/>
              <input placeholder="School / Organisation" required onChange={(e)=>setFormData({...formData,school:e.target.value})}/>
              <input placeholder="Phone" required onChange={(e)=>setFormData({...formData,phone:e.target.value})}/>
              <select required onChange={(e)=>setFormData({...formData,category:e.target.value})}>
                <option value="">Select Category</option>
                <option>PYP</option>
                <option>MYP</option>
                <option>DP</option>
                <option>Leadership</option>
              </select>
              <button type="submit">Send Login Link</button>
            </form>
          )}

          {step === "checkEmail" && (
            <div>
              <p>Check your email for the login link.</p>
              <button onClick={completeSignIn}>I Clicked the Link</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= MAIN WEBSITE =================
  return (
    <div style={{padding:20}}>
      <nav style={styles.nav}>
        <button onClick={()=>setPage("dashboard")}>Dashboard</button>
        <button onClick={()=>setPage("sessions")}>Sessions</button>
        <button onClick={()=>setPage("announcements")}>Announcements</button>
        <button onClick={()=>setPage("team")}>Team</button>
        <button onClick={()=>setPage("profile")}>Profile</button>
      </nav>

      {page === "dashboard" && (
        <div>
          <img src="https://via.placeholder.com/1200x400" style={{width:"100%"}} />
          <h2>Event Overview</h2>
          <p>Welcome to the SAIBSA IB Conference 2026.</p>
        </div>
      )}

      {page === "sessions" && sessions.map((s)=>(
        <div key={s.id} style={styles.card}>
          <h3>{s.title}</h3>
          <p>Speaker: {s.speaker}</p>
          <p>Venue: {s.venue}</p>
          <p>{s.registered}/{s.limit} Registered</p>
          <button disabled={s.registered>=s.limit} onClick={()=>registerSession(s)}>Register</button>
        </div>
      ))}

      {page === "announcements" && announcements.map((a,i)=>(
        <div key={i} style={styles.card}>
          <h3>{a.title}</h3>
          <p>{a.message}</p>
        </div>
      ))}

      {page === "team" && team.map((m,i)=>(
        <div key={i} style={styles.card}>
          <img src={m.photo} width="100" />
          <h3>{m.name}</h3>
        </div>
      ))}

      {page === "profile" && (
        <div style={styles.card}>
          <p><b>Name:</b> {formData.name}</p>
          <p><b>Email:</b> {formData.email}</p>
          <p><b>Category:</b> {formData.category}</p>
          <button onClick={()=>signOut(auth)}>Logout</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  center:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",background:"#f5f5f5"},
  card:{background:"white",padding:20,margin:10,borderRadius:10,boxShadow:"0 2px 10px rgba(0,0,0,0.1)"},
  nav:{display:"flex",gap:10,marginBottom:20}
};
