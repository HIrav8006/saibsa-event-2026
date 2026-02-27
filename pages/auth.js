export default async function handler(req, res) {
  const { action, email, otp } = JSON.parse(req.body)

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbzz6A2fpCBdMDgY0eSTiWtykNGUyZvAqe8GK_Xkr9ZMApEvmHUtM6PyKjY4QpXkTVUv/exec"

  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({ action, email, otp }),
  })

  const data = await response.json()
  res.status(200).json(data)
}
