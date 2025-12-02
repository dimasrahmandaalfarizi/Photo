# Script untuk setup foto di public/photos
# Jika ada foto di folder Asset, akan di-copy ke public/photos
Write-Host "Setting up photos in public/photos..." -ForegroundColor Green

$assetFolder = "Asset"
$targetFolder = "public\photos"

# Create target folder if not exists
if (-not (Test-Path $targetFolder)) {
    New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
}

# Check if Asset folder exists (optional source)
$hasAssetFolder = Test-Path $assetFolder

# Get all image files from public/photos (already there)
$existingPhotos = Get-ChildItem -Path $targetFolder -Include *.jpg,*.jpeg,*.png,*.webp,*.JPG,*.JPEG,*.PNG,*.WEBP -ErrorAction SilentlyContinue

if ($existingPhotos.Count -gt 0) {
    Write-Host "Found $($existingPhotos.Count) photos in public/photos" -ForegroundColor Green
    Write-Host "Photos are ready to use!" -ForegroundColor Cyan
} else {
    # If no photos in public/photos, try to copy from Asset if exists
    if ($hasAssetFolder) {
        Write-Host "Copying photos from Asset to public/photos..." -ForegroundColor Yellow
        $imageFiles = Get-ChildItem -Path $assetFolder -Include *.jpg,*.jpeg,*.png,*.webp,*.JPG,*.JPEG,*.PNG,*.WEBP -Recurse
        
        if ($imageFiles.Count -eq 0) {
            Write-Host "WARNING: Tidak ada foto ditemukan" -ForegroundColor Yellow
            exit 0
        }
        
        $copied = 0
        foreach ($file in $imageFiles) {
            $destination = Join-Path $targetFolder $file.Name
            Copy-Item -Path $file.FullName -Destination $destination -Force
            $copied++
            Write-Host "Copied: $($file.Name)" -ForegroundColor Cyan
        }
        
        Write-Host ""
        Write-Host "Selesai! $copied foto berhasil di-copy ke public/photos" -ForegroundColor Green
    } else {
        Write-Host "INFO: Folder public/photos sudah ada. Tambahkan foto langsung ke folder tersebut." -ForegroundColor Cyan
    }
}

Write-Host ""
Write-Host "Sekarang jalankan: npm run dev" -ForegroundColor Yellow
