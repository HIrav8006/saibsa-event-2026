'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { initializeApp } from 'firebase/app'
import { getAuth, sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyAwRDKHCSqzdltqIzi5win8D7BEqmdHFVg",
  authDomain: "saibsa-event-2026.firebaseapp.com",
  projectId: "saibsa-event-2026",
  messagingSenderId: "521327539639",
  appId: "1:521327539639:web:12adf3dc13abae9cd9a432"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function Home() {
  const [user, setUser] = useState(null)
  const [page, setPage] = useState('dashboard')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    school: '',
    phone: '',
    category: ''
  })

  useEffect(() => {
    if (isSignInWithEmailLink(auth, window.location.href)) {
      let email = window.localStorage.getItem('emailForSignIn')
      if (!email) email = window.prompt('Confirm your email')
      signInWithEmailLink(auth, email, window.location.href)
        .then((result) => {
          window.localStorage.removeItem('emailForSignIn')
          setUser(result.user)
        })
    }
  }, [])

  const sendOTP = async () => {
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true
    }
    await sendSignInLinkToEmail(auth, formData.email, actionCodeSettings)
    window.localStorage.setItem('emailForSignIn', formData.email)
    alert('OTP sent to email!')
  }

  const logout = async () => {
    await signOut(auth)
    setUser(null)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-10 w-full max-w-lg text-white">
          <h1 className="text-3xl font-bold mb-6 text-center tracking-wide">SAIBSA 2026 Registration</h1>
          <div className="space-y-4">
            <input placeholder="Full Name" className="w-full p-3 rounded-xl bg-white/20 placeholder-white/70 focus:outline-none" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            <input placeholder="Email" className="w-full p-3 rounded-xl bg-white/20 placeholder-white/70 focus:outline-none" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <input placeholder="School / Organisation" className="w-full p-3 rounded-xl bg-white/20 placeholder-white/70 focus:outline-none" onChange={(e) => setFormData({ ...formData, school: e.target.value })} />
            <input placeholder="Phone" className="w-full p-3 rounded-xl bg-white/20 placeholder-white/70 focus:outline-none" onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <select className="w-full p-3 rounded-xl bg-white/20 text-white focus:outline-none" onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
              <option value="">Select Category</option>
              <option value="PYP">PYP</option>
              <option value="MYP">MYP</option>
              <option value="DP">DP</option>
              <option value="Leadership">Leadership</option>
            </select>
            <button onClick={sendOTP} className="w-full py-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl font-semibold hover:scale-105 transition-transform">
              Send OTP
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  const NavButton = ({ name }) => (
    <button onClick={() => setPage(name)} className={`px-4 py-2 rounded-xl transition ${page === name ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}>
      {name.charAt(0).toUpperCase() + name.slice(1)}
    </button>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <nav className="flex flex-wrap gap-3 justify-center p-6 border-b border-white/10">
        <NavButton name="dashboard" />
        <NavButton name="sessions" />
        <NavButton name="announcements" />
        <NavButton name="team" />
        <NavButton name="profile" />
      </nav>

      <div className="p-8 max-w-6xl mx-auto">
        {page === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-3xl overflow-hidden shadow-2xl mb-8">
              <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b" className="w-full h-72 object-cover" />
            </div>
            <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-xl border border-white/20">
              <h2 className="text-2xl font-bold mb-4">Event Overview</h2>
              <p className="text-white/80 leading-relaxed">
                Welcome to SAIBSA 2026. Explore sessions, connect with IB educators,
                and experience collaborative leadership across PYP, MYP, DP, and Leadership strands.
              </p>
            </div>
          </motion.div>
        )}

        {page === 'sessions' && (
          <div className="grid md:grid-cols-2 gap-6">
            {[1,2,3,4].map((s) => (
              <motion.div key={s} whileHover={{ scale: 1.03 }} className="bg-white/10 p-6 rounded-3xl backdrop-blur-xl border border-white/20 shadow-xl">
                <h3 className="text-xl font-semibold mb-2">Session {s}</h3>
                <p className="text-white/70">Speaker: TBD</p>
                <p className="text-white/70">Venue: Main Hall</p>
                <button className="mt-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl">
                  Register
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {page === 'announcements' && (
          <div className="space-y-4">
            <div className="bg-yellow-500/20 border border-yellow-400/40 p-5 rounded-2xl">
              Opening ceremony begins at 9:00 AM in the Auditorium.
            </div>
          </div>
        )}

        {page === 'team' && (
          <div className="grid md:grid-cols-3 gap-6">
            {["Chair", "Coordinator", "Tech Lead"].map((role) => (
              <div key={role} className="bg-white/10 p-6 rounded-3xl text-center backdrop-blur-xl">
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4"></div>
                <h3 className="font-semibold">{role}</h3>
              </div>
            ))}
          </div>
        )}

        {page === 'profile' && (
          <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-xl max-w-md mx-auto text-center">
            <div className="w-28 h-28 bg-white/20 rounded-full mx-auto mb-4"></div>
            <p className="mb-6">Logged in as {user.email}</p>
            <button onClick={logout} className="px-6 py-2 bg-red-500 rounded-xl">Logout</button>
          </div>
        )}
      </div>
    </div>
  )
}
