'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { loadAssetPhotos, type AssetPhoto } from '@/utils/assetPhotos'

interface Photo {
  id: string
  url: string
  name: string
  uploadedAt: string
  isAsset?: boolean
}

// Photo Card Component dengan animasi
const PhotoCard = ({ photo, index, size, onSelect }: { 
  photo: Photo, 
  index: number, 
  size: { height: string, span: number },
  onSelect: () => void
}) => {
  const ref = useRef(null)
  // Remove margin restriction to ensure all photos are detected
  const isInView = useInView(ref, { once: true, margin: "0px" })
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.95 }}
      transition={{ 
        delay: index * 0.05,
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        scale: 1.03,
        y: -8,
        transition: { duration: 0.3 }
      }}
      className="relative group cursor-pointer mb-1 md:mb-1 break-inside-avoid w-full"
      onClick={onSelect}
    >
      <motion.div 
        className={`relative ${size.height} overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-500`}
        whileHover={{ 
          boxShadow: "0 25px 50px -12px rgba(243, 208, 215, 0.5)",
        }}
      >
        <motion.div
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full h-full"
        >
          <Image
            src={photo.url}
            alt=""
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
        </motion.div>
        
        {/* Animated gradient overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Animated color overlay */}
        <motion.div 
          className="absolute inset-0"
          style={{ backgroundColor: '#F3D0D7' }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.15 }}
          transition={{ duration: 0.4 }}
        />
        
        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%', opacity: 0 }}
          whileHover={{ x: '100%', opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </motion.div>
    </motion.div>
  )
}

export default function Home() {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load photos from public/photos folder automatically
  useEffect(() => {
    const loadPhotosFromFolder = async () => {
      try {
        // Load photos from API (scans public/photos folder)
        // Add cache busting to ensure fresh data
        const response = await fetch('/api/photos?' + new Date().getTime())
        const data = await response.json()
        
        if (data.photos && Array.isArray(data.photos)) {
          console.log(`✅ API Response: ${data.photos.length} photos`)
          console.log(`📊 Count from API: ${data.count || 'N/A'}, Total: ${data.total || 'N/A'}`)
          
          // Use ALL photos from API - no filtering unless truly broken
          const allPhotos = data.photos.filter(p => {
            if (!p) {
              console.warn('Found null/undefined photo')
              return false
            }
            if (!p.url) {
              console.warn('Found photo without URL:', p)
              return false
            }
            return true
          })
          
          console.log(`📸 After filtering invalid: ${allPhotos.length} photos`)
          console.log(`📋 First photo:`, allPhotos[0]?.name)
          console.log(`📋 Last photo:`, allPhotos[allPhotos.length - 1]?.name)
          
          if (allPhotos.length !== 52) {
            console.error(`❌ ERROR: Expected 52 photos but got ${allPhotos.length}`)
            console.log(`📋 All photo names:`, allPhotos.map(p => p.name))
          }
          
          // Force React to re-render by using new array reference
          setPhotos([...allPhotos])
          
          // Verify state was set correctly
          setTimeout(() => {
            console.log(`✅ State should now have ${allPhotos.length} photos`)
          }, 100)
        } else {
          console.warn('No photos found in API response')
          // Fallback: try loading from localStorage or asset photos
          const savedPhotos = localStorage.getItem('photoGallery')
          if (savedPhotos) {
            const parsed = JSON.parse(savedPhotos)
            setPhotos(Array.isArray(parsed) ? parsed : [])
          } else {
            // Last resort: load from assetPhotos
            const assetPhotos = loadAssetPhotos()
            setPhotos(assetPhotos)
          }
        }
      } catch (error) {
        console.error('❌ Error loading photos:', error)
        // Fallback to localStorage or asset photos
        const savedPhotos = localStorage.getItem('photoGallery')
        if (savedPhotos) {
          const parsed = JSON.parse(savedPhotos)
          setPhotos(Array.isArray(parsed) ? parsed : [])
        } else {
          const assetPhotos = loadAssetPhotos()
          setPhotos(assetPhotos)
        }
      } finally {
        setIsInitialized(true)
      }
    }

    loadPhotosFromFolder()
  }, [])

  // Debug: Log when photos change
  useEffect(() => {
    if (photos.length > 0) {
      console.log(`🖼️ Photos state updated: ${photos.length} photos`)
      console.log(`📋 Photo IDs (first 10):`, photos.slice(0, 10).map(p => p.id))
      console.log(`📋 Photo IDs (last 10):`, photos.slice(-10).map(p => p.id))
      
      if (photos.length !== 52) {
        console.error(`❌ PROBLEM: Only ${photos.length} photos in state, expected 52!`)
        console.log(`📋 All photo names:`, photos.map(p => p.name))
      } else {
        console.log(`✅ SUCCESS: All 52 photos in state!`)
      }
    }
  }, [photos])
  
  // Verify DOM rendering
  useEffect(() => {
    if (photos.length > 0) {
      setTimeout(() => {
        const photoElements = document.querySelectorAll('[class*="masonry"] > div')
        console.log(`🖼️ DOM Check: Found ${photoElements.length} photo elements in DOM`)
        if (photoElements.length !== photos.length) {
          console.error(`❌ DOM MISMATCH: ${photoElements.length} elements in DOM but ${photos.length} in state!`)
        }
      }, 1000)
    }
  }, [photos])

  // Variasi ukuran untuk layout yang menarik - lebih variatif
  const sizeVariations = [
    { height: 'h-56', span: 1 },   // Extra small
    { height: 'h-72', span: 1 },   // Small-medium
    { height: 'h-64', span: 1 },   // Small
    { height: 'h-80', span: 1 },   // Medium
    { height: 'h-96', span: 1 },   // Large
    { height: 'h-88', span: 1 },   // Medium-large
    { height: 'h-60', span: 1 },   // Small
    { height: 'h-76', span: 1 },   // Medium-small
    { height: 'h-84', span: 1 },   // Medium
    { height: 'h-92', span: 1 },   // Large-medium
    { height: 'h-68', span: 1 },   // Small-medium
    { height: 'h-100', span: 1 },   // Extra large
  ]

  return (
    <main className="min-h-screen" style={{ background: 'linear-gradient(135deg, #F6F5F2 0%, #F0EBE3 50%, #FFEFEF 100%)' }}>
      <div className="w-full">
        {/* Photo Grid */}
        {photos.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center min-h-screen"
          >
            <p className="text-gray-400 text-lg">Tidak ada foto di folder public/photos</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="masonry-container p-2 md:p-3 lg:p-4"
            >
              {photos && photos.length > 0 ? (
                <>
                  {photos.map((photo, index) => {
                    if (!photo || !photo.url) {
                      console.warn(`⚠️ Invalid photo at index ${index}:`, photo)
                      return null
                    }
                    
                    const size = sizeVariations[index % sizeVariations.length]
                    
                    return (
                      <PhotoCard 
                        key={`${photo.id || photo.url}-${index}`} 
                        photo={photo} 
                        index={index} 
                        size={size}
                        onSelect={() => setSelectedPhoto(photo)}
                      />
                    )
                  })}
                  {/* Log rendered count */}
                  {process.env.NODE_ENV === 'development' && (
                    <div style={{ display: 'none' }}>
                      {console.log(`🖼️ Rendered ${photos.length} PhotoCard components in DOM`)}
                    </div>
                  )}
                </>
              ) : (
                <div className="col-span-full text-center p-4">
                  No photos to display
                </div>
              )}
              {/* Debug info */}
              {process.env.NODE_ENV === 'development' && photos.length < 52 && (
                <div className="col-span-full text-center text-red-500 p-4 bg-red-50 rounded">
                  ⚠️ Warning: Only {photos.length} photos rendered (expected 52)
                  <br />
                  Check console for details
                </div>
              )}
            </motion.div>
            {/* Photo count indicator - always visible */}
            <div className="fixed bottom-4 left-4 bg-[#F3D0D7]/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm z-40 shadow-lg font-semibold">
              {photos.length} / 52 foto
            </div>
          </>
        )}

        {/* Photo Viewer Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              style={{ backgroundColor: 'rgba(246, 245, 242, 0.95)' }}
              onClick={() => setSelectedPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: 20 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="relative max-w-5xl max-h-[90vh] w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <motion.button
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  onClick={() => setSelectedPhoto(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 text-white p-2 rounded-full z-10 backdrop-blur-sm"
                  style={{ backgroundColor: '#F3D0D7' }}
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </motion.button>
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="relative w-full h-[90vh] overflow-hidden rounded-2xl"
                >
                  <Image
                    src={selectedPhoto.url}
                    alt={selectedPhoto.name}
                    fill
                    className="object-contain"
                    sizes="90vw"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
