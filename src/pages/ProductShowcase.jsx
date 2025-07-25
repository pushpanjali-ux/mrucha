import { useParams } from "react-router-dom"
import { products } from "../data/products"
import Masonry from "../Components/Masonry" // this is the custom one we made earlier

export default function ProductShowcase() {
  const { slug } = useParams()
  const product = products.find((p) => p.slug === slug)

  if (!product) {
    return (
      <div className="w-screen h-screen flex items-center justify-center text-xl font-semibold text-red-500">
        Product not found.
      </div>
    )
  }

  return (
    <div className="w-screen h-screen flex overflow-hidden bg-white">
      {/* Left – Rotated Title */}
      <div className="w-[80px] bg-blush flex items-center justify-center shadow-md">
        <h1 className="text-blackish text-2xl font-asul italic  font-bold rotate-[-90deg] whitespace-nowrap">
          {product.title}
        </h1>
      </div>

      {/* Right – Masonry Gallery */}
      <div className="flex-1 overflow-y-scroll bg-cream/40 p-6 sm:p-10">
        <Masonry columns={3} gap={20}>
          {product.gallery.map((img, i) => (
            <img
              key={i}
              src={`/images/${product.slug}/${img}`}
              alt={`${product.title} ${i + 1}`}
              loading="lazy"
              className="w-full rounded-tr-[6vw] rounded-bl-[6vw] shadow-md object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          ))}
        </Masonry>
      </div>
    </div>
  )
}

