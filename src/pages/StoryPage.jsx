import { useState, useRef } from "react"
import { Link } from "react-router-dom"
import Logo from "../assets/mrucha-logo.svg"
import bgImage from "../assets/storyBg.webp"
import overlayImage from "../assets/overlayImage.webp"

import ShinyText from "../Components/ShinyText"


const videoList = [
  {
    src: "/videos/filtered1.mp4",
    style: "top-[1%] right-[1%]",
  },
  {
    src: "/videos/filtered2.mp4",
    style: "bottom-[1%] right-[1%]",
  },
  {
    src: "/videos/filtered3.mp4",
    style: "top-[35%] right-[35%]",
  },
  {
    src: "/videos/filtered4.mp4",
    style: "bottom-[5%] right-[25%]",
  },
]


const messages = [
  "Started with a lip gloss and a little too much confidence.",
  "Mrunal said: “If they won’t make it for us, we’ll make it louder.”",
  "High pigment, low drama — ‘cause soft girls can hit hard too.",
  "Mrucha’s not a phase. She’s the main act, honey.",
]






export default function StoryPage() {
  const [textExpanded, setTextExpanded] = useState(false)
  const videoRefs = useRef([])

  const handleClick = () => {
    setTextExpanded((prev) => !prev)
  }

  const playOnly = (indexToPlay) => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return
      if (idx === indexToPlay) {
        video.play().catch(() => {})
      } else {
        video.pause()
        video.currentTime = 0
      }
    })
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">


  {textExpanded && (
    <div
      className="absolute inset-0 z-30 bg-cover bg-center opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ backgroundImage: `url(${overlayImage})` }}
    />
  )}



      {/* Center Toggle Text */}
      <div
        className="absolute z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blush/90 hover:text-mrucha font-garamond font-bold cursor-pointer select-none text-4xl md:text-6xl transition-all duration-300 ease-in-out"
        onClick={handleClick}
        onMouseEnter={() => setTextExpanded(true)}
        onMouseLeave={() => setTextExpanded(false)}
      >
        {textExpanded ? "MRUNAL PANCHAL" : "MRUNAL"}
      </div>

      {/* Left Side */}
      <div className="absolute inset-0 bg-[#4B1216] clip-left z-10 flex flex-col justify-between p-8 text-white">
        <Link to="/" className="w-48 h-auto py-2 px-1">
          <img src={Logo} alt="Mrucha Logo" className="w-full object-contain" />
        </Link>


<ShinyText
  messages={messages}
  duration={2000}
  className="absolute top-[15%] left-[0%] text-[#FFEDDB] font-semibold tracking-wide break-words w-1/2 text-xl z-30 font-garamond italic font-extralight text-[32px] md:text-[28px] leading-tight"
/>




        <div className="flex-grow flex items-center justify-center" />
      </div>

      {/* Right Side with Videos */}
      <div
        className="absolute inset-0 bg-[#100B08] clip-right z-20 text-white bg-cover bg-left"
        style={{ backgroundImage: `url(${bgImage})` }}
      >




        {videoList.map((vid, index) => (
  <video
    key={index}
    ref={(el) => (videoRefs.current[index] = el)}
    src={vid.src}
    muted={false}
    playsInline
    controls={false}
    onEnded={() => {
      const video = videoRefs.current[index]
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    }}
    className={`absolute ${vid.style} w-[90vw] max-w-[400px] aspect-[3/4] object-cover cursor-pointer transition-transform duration-300 mix-blend-darken`}
    onClick={() => playOnly(index)}
    onMouseEnter={() => playOnly(index)}
  />
))}

      </div>
    </div>
  )
}










































