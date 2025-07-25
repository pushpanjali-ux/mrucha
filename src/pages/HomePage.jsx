import React, { useRef, useState } from "react"
import { Link } from "react-router-dom"
import MruchaLogo from "../assets/mrucha-logo.svg"
import SignupIcon from "../assets/signup-icon.svg"
import { Volume2, VolumeX, X } from "lucide-react"
import { useEffect } from "react"

export default function HomePage() {
  const videoRef = useRef(null)
  const [isMuted, setIsMuted] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleMute = () => {
    const video = videoRef.current
    if (video) {
      video.muted = !video.muted
      setIsMuted(video.muted)
    }
  }

  const handleVideoClick = () => {
    setIsFullscreen(true)
  }

  const exitFullscreen = () => {
    setIsFullscreen(false)
  }


const animatedTextRef = useRef(null)
  useEffect(() => {
    const el = animatedTextRef.current
    if (!el) return

    const text = "Soft Feels"
    el.innerHTML = ""

   Array.from(text).forEach((char, i) => {
  const span = document.createElement("span")
  span.textContent = char === " " ? "\u00A0" : char // preserve space
      span.style.display = "inline-block"
      span.style.transform = "translateY(100%)"
      span.style.opacity = "0"
      span.style.animation = "fadeUpText 0.6s forwards"
      span.style.animationDelay = `${i * 0.06}s`
      el.appendChild(span)
    })
  }, [])






  return (
    <div className="w-screen h-screen overflow-hidden bg-mrucha text-cream relative"
    
    >
      <div className={`flex h-full transition-all duration-700 ${isFullscreen ? "fixed inset-0 z-50 bg-black" : "w-[200vw]"}`}>










        {/* LEFT PANEL - 35% */}
        {!isFullscreen && (
          <div className="w-[35vw] h-full bg-mrucha relative flex flex-col justify-between p-6"   
   
          >
            {/* Logo */}
            <Link to="/" className="block">
              <img src={MruchaLogo} alt="Mrucha Logo" className="w-48 h-auto py-4 px-2" />
            </Link>





            {/* Bold Looks / Soft Feels */}
            <div>
              <h1 className="font-asul font-bold text-xl md:text-2xl">BOLD LOOKS</h1>
              <h2 
              ref={animatedTextRef}
              className="font-garamond italic font-extralight text-[56px] md:text-[72px] tracking-[-0.02em] leading-[1]">
                Soft Feels
              </h2>
            </div>
          </div>
        )}

        {/* RIGHT PANEL */}
        <div className={`${isFullscreen ? "w-full h-full" : "w-[65vw] h-full"} bg-blackish relative`}>
          {/* Signup icon */}
          {!isFullscreen && (
            <Link to="/signup" className="absolute top-6 right-6 z-10">
              <img
                src={SignupIcon}
                alt="Sign up"
                loading="lazy"
                className="w-16 h-16 opacity-80 hover:opacity-100 transition"
              />
            </Link>
          )}

          {/* Story Link */}
          {!isFullscreen && (
            <Link
              to="/story"
              className="absolute top-20 right-6 text-blush/50 font-garamond italic font-extralight text-[48px] tracking-[-0.08em] hover:text-blush transition"
            >
              story’s behind
            </Link>
          )}

          {/* Hero Video */}
          <video
            ref={videoRef}
            src="/videos/hero-video.mp4"
  
            loop
            playsInline
            muted={!isMuted}
            preload="none"
            onClick={handleVideoClick}
onMouseEnter={() => videoRef.current?.play()}
  onMouseLeave={() => videoRef.current?.pause()}

            className={`object-cover cursor-pointer transition-all duration-700 ${
              isFullscreen ? "w-screen h-screen" : "w-[100vw] h-[81vh] absolute bottom-0 right-0"
            }`}
          />

          {/* Mute toggle */}
          <button
            onClick={toggleMute}
            className="absolute bottom-4 right-6 text-blush/70 hover:text-blush z-20"
          >
            {isMuted ? (
              <VolumeX className="w-8 h-8" />
            ) : (
              <Volume2 className="w-8 h-8" />
            )}
          </button>

          {/* Fullscreen Close Button */}
          {isFullscreen && (
            <button
              onClick={exitFullscreen}
              className="absolute top-4 left-4 text-blush/80 hover:text-blush z-20"
            >
              <X className="w-10 h-10" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
