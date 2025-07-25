import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { slugify } from "../utils/slugify"
import { useNavigate } from "react-router-dom"
import lushInkImg from "../assets/lushInk.webp"
import cloudKissImg from "../assets/cloudKiss.webp"
import plushPoutImg from "../assets/plushPout.webp"
import tote from "../assets/tote.webp"
import pouch from "../assets/pouch.webp"


const products = [
  {
    title: "Lush Ink Marker",
    price: "₹389",
    subtitle: "Ink Your Lips in Bold Luxury!",
    image: lushInkImg,
    description:
      "{A rich pigment lip marker with a weightless finish. Perfect for bold, luxurious lips that last all day.}",
  },
  {
    title: "Cloud Kiss",
    price: "₹749",
    subtitle: "A Blush as Light as Air!",
    image: cloudKissImg,
    description:
      "{Feather-light blush that melts into your skin, giving you the softest airbrushed flush ever.}",
  },
  {
    title: "Plush Pout",
    price: "₹699",
    subtitle: "Plush and Powerful.",
    image: plushPoutImg,
    description:
      "{Creamy satin lipstick that glides like silk. Plush finish, powerful color payoff.}",
  },
  {
    title: "Tote-ally Rad",
    price: "₹699",
    subtitle: "Carry Mrucha in Style.",
    image: tote,
    description:
      "{Minimalist tote bag that’s bold yet soft — just like our beauty philosophy.}",
  },
  {
    title: "Girl Dinner Kit",
    price: "₹649",
    subtitle: "Zip Your Blush World.",
    image: pouch,
    description:
      "{A soft blushy pouch to store your beauty essentials. Compact, classy, totally Mrucha.}",
  },
]

export default function ProductPage() {



const navigate = useNavigate()




  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const current = products[index]
  const previous = index > 0 ? products[index - 1] : null

  const paginate = (dir) => {
    const newIndex = index + dir
    if (newIndex >= 0 && newIndex < products.length) {
      setDirection(dir)
      setIndex(newIndex)
    } else if (dir === 1) {
      setDirection(dir)
      setIndex(0)
    }
  }

  const handleDragEnd = (_, info) => {
    const swipe = info.offset.x
    if (swipe < -80) paginate(1)
    else if (swipe > 80) paginate(-1)
  }

  useEffect(() => {
    const interval = setInterval(() => paginate(1), 5000)
    return () => clearInterval(interval)
  }, [index])

  return (
    <div className="relative w-full h-screen overflow-hidden font-sans">
      {/* Left Section with Slant */}
      <div className="absolute inset-0  bg-blush clip-left z-10 flex px-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4 }}
            className="space-y-4 text-[#FFEDDB] max-w-md"
          >
            <h1 className="text-7xl font-asul text-blackish tracking-tight pt-10">{current.title}</h1>
            <h2 className="text-2xl font-garamond font-semibold text-blackish italic text-[#FFDACC]">{current.subtitle}</h2>
            <p className="text-sm font-asul text-light text-blackish opacity-80">{current.description}</p>
            <p className="mt-6 text-2xl font-garamond font-semibold text-stroke">{current.price}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right Section with Slant */}
      <div className="absolute inset-0  h-full bg-mrucha clip-right z-0 flex items-end justify-end p-8">
        <div className="relative w-[40vw] h-[50vh] flex items-end justify-end  overflow-visible">
          {/* Previous Thumbnail */}
          <AnimatePresence>
            {previous && (
              <motion.img
                key={previous.image}
                src={previous.image}
                alt=""
                loading="lazy"
                className="absolute left-0 top-1/2 w-24 h-16 object-cover rounded-tl-xl shadow-md transform -translate-y-1/2 contrast-75"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: -120 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </AnimatePresence>

          {/* Swipeable Current Product */}
          <AnimatePresence custom={direction} >
            <motion.img
              key={current.image}
              src={current.image}
              alt=""
              drag="x"
              loading="lazy"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ duration: 0.5 }}
              className="w-[100%] h-[80%] object-cover rounded-br-3xl shadow-2xl z-10 cursor-grab active:cursor-grabbing absolute right-[-40]"
            />

            <button
  onClick={() => navigate(`/product/${slugify(current.title)}`)}
  className="absolute bottom-25 z-20 bg-blush font-asul text-blackish px-4 py-2 rounded-2xl shadow hover:mrucha transition"
>
  Try Me, Babe
</button>


          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
