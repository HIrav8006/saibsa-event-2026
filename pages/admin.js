import { useEffect } from "react"

export default function Admin() {
  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user !== "youradminemail@gmail.com") {
      window.location.href = "/"
    }
  }, [])

  return (
    <div style={{ padding: 40 }}>
      <h2>Admin Dashboard</h2>
      <p>Here you can add sessions, edit capacity, post announcements.</p>
    </div>
  )
}
