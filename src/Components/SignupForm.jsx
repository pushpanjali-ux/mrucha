
import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import signupBg from "../assets/signupBg.webp"
import { useState } from "react"

export default function SignupForm() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !username || !password) {
      setError("All fields are required")
      return
    }

    // (Optional) store mock data
    localStorage.setItem("mruchaUser", JSON.stringify({ email, username }))

    // ✅ Redirect to homepage
    navigate("/")
  }

  return (
    <div
      className="w-screen h-screen flex items-center justify-center relative bg-cover bg-center "
      style={{ backgroundImage: `url(${signupBg})`, }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 z-50"
      >
        <ArrowLeft className="w-12 h-12 text-[#4B1216] opacity-70 hover:opacity-100" />
      </button>

      <form
        onSubmit={handleSubmit}
        className="w-[400px] rounded-lg p-6 shadow-lg space-y-4 absolute right-20"
      >
        <h2 className="text-2xl font-asul font-bold text-blush text-center">MRUCHA MODE: ON</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-[#B35959] p-2  outline-none font-garamond bg-cream placeholder:text-blackish "
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-[#B35959] p-2  outline-none font-garamond bg-cream placeholder:text-blackish "
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-[#B35959] p-2 outline-none font-garamond bg-cream placeholder:text-blackish  "
        />

        {error && (
          <p className="text-cream font-garamond text-sm">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-blush/80 text-mrucha font-asul font-bold py-3 rounded-tr-3xl rounded-bl-3xl hover:bg-blush transition"
        >
          SIGN UP
        </button>
      </form>
    </div>
  )
}
