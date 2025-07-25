
import CircularGallery from "../Components/CircularGallery"

export default function Users() {

const galleryItems = [
  { image: "/images/users/user1.avif"},
  { image: "/iamges/users/user2.avif"},
  { image: "/images/users/user3.avif"},
  { image: "/images/users/user4.avif"},
  { image: "/images/users/user5.avif"},
  { image: "/images/users/user6.avif"},
  { image: "/images/users/user7.avif"},
  { image: "/images/users/user8.avif"},
    { image: "/images/users/user9.avif"},
]

  return (
    <>
   
    <div className="w-screen h-screen bg-blackish">

      <CircularGallery
        items={galleryItems}
        bend={2}
        scrollSpeed={0.75}
        borderRadius={0.02}
        textColor="#FCD6D6"
        font="bold 30px Cormorant Garamond"
      />
             <h1 className="font-asul text-center text-[48px] text-blush bg-blackish pb-2">Satisfaction? More Like Obsession. <span className="text-[16px] align-middle opacity-70">[creation by ❤️ and AI]</span></h1>

    </div>

    </>
    
  )
}