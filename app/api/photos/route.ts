import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const photosDir = path.join(process.cwd(), 'public', 'photos')
    
    // Check if directory exists
    if (!fs.existsSync(photosDir)) {
      return NextResponse.json({ photos: [] })
    }

    // Read all files from photos directory
    const files = fs.readdirSync(photosDir)
    
    // Filter only image files
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.JPG', '.JPEG', '.PNG', '.WEBP', '.GIF']
    const imageFiles = files.filter(file => {
      const ext = path.extname(file)
      return imageExtensions.includes(ext)
    })

    // Sort files naturally (1.jpg, 2.jpg, ..., 10.jpg, etc.)
    const sortedFiles = imageFiles.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0')
      const numB = parseInt(b.match(/\d+/)?.[0] || '0')
      return numA - numB
    })

    console.log(`📸 Found ${sortedFiles.length} photos in public/photos`)
    console.log(`📋 All files:`, sortedFiles.join(', '))

    // Create photo objects - ALL photos, no limit, no filtering
    const photos = sortedFiles.map((filename, index) => {
      const photo = {
        id: `photo-${index + 1}-${filename}`,
        url: `/photos/${filename}`,
        name: filename,
        uploadedAt: new Date(Date.now() - (sortedFiles.length - index) * 86400000).toISOString(),
      }
      return photo
    })

    console.log(`✅ Created ${photos.length} photo objects`)
    console.log(`✅ Returning ALL ${photos.length} photos to frontend`)
    
    // Verify we have all 52
    if (photos.length !== 52) {
      console.warn(`⚠️ WARNING: Expected 52 photos but got ${photos.length}`)
    }

    // Ensure we return ALL photos
    return NextResponse.json({ 
      photos, 
      count: photos.length,
      total: sortedFiles.length 
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    })
  } catch (error) {
    console.error('Error reading photos:', error)
    return NextResponse.json({ photos: [] }, { status: 500 })
  }
}

