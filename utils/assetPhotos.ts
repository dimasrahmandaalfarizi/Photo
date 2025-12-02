// List of photos from Asset folder
export const assetPhotos = [
  { filename: '1.jpg', id: 'asset-1' },
  { filename: '2.webp', id: 'asset-2' },
  { filename: '3.jpg', id: 'asset-3' },
  { filename: '4.jpg', id: 'asset-4' },
  { filename: '5.jpg', id: 'asset-5' },
  { filename: '6.jpg', id: 'asset-6' },
  { filename: '7.jpg', id: 'asset-7' },
  { filename: '8.jpg', id: 'asset-8' },
  { filename: '9.jpg', id: 'asset-9' },
  { filename: '10.jpg', id: 'asset-10' },
  { filename: '11.jpg', id: 'asset-11' },
  { filename: '12.jpeg', id: 'asset-12' },
  { filename: '13.jpeg', id: 'asset-13' },
  { filename: '14.jpeg', id: 'asset-14' },
  { filename: '15.jpg', id: 'asset-15' },
  { filename: '16.JPG', id: 'asset-16' },
  { filename: '17.JPG', id: 'asset-17' },
  { filename: '18.JPG', id: 'asset-18' },
]

export interface AssetPhoto {
  id: string
  url: string
  name: string
  uploadedAt: string
  isAsset?: boolean
}

export function loadAssetPhotos(): AssetPhoto[] {
  return assetPhotos.map((photo, index) => ({
    id: photo.id,
    url: `/photos/${photo.filename}`,
    name: photo.filename,
    uploadedAt: new Date(Date.now() - (assetPhotos.length - index) * 86400000).toISOString(), // Stagger dates
    isAsset: true,
  }))
}


