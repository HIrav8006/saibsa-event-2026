import { useState } from "react"

const API_URL = "/api/auth"

export default function Login() {
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState(1)

  const sendOTP = async () => {
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "sendOTP", email }),
    })
    setStep(2)
  }

  const verifyOTP = async () => {
    const res = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ action: "verifyOTP", email, otp }),
    })
    const data = await res.json()

    if (data.success) {
      localStorage.setItem("user", email)
      window.location.href = "/"
    } else {
      alert("Invalid OTP")
    }
  }

  return (
    <div style={{ padding: 50 }}>
      <h2>Login</h2>
      {step === 1 ? (
        <>
          <input
            placeholder="Enter email"
            onChange={e => setEmail(e.target.value)}
          />
          <button onClick={sendOTP}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            placeholder="Enter OTP"
            onChange={e => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify</button>
        </>
      )}
    </div>
  )
}
