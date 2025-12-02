# 📸 Photo Gallery - Kenangan

Aplikasi galeri foto pribadi untuk menyimpan foto-foto kenangan Anda. Dibangun dengan Next.js 14, React, dan TypeScript.

## ✨ Fitur

- 📤 **Upload Foto** - Upload multiple foto sekaligus
- 🖼️ **Galeri Grid** - Tampilan grid yang indah dan responsif
- 🔍 **Preview Foto** - Klik foto untuk melihat dalam ukuran penuh
- 🗑️ **Hapus Foto** - Hapus foto yang tidak diinginkan
- 💾 **Penyimpanan Lokal** - Foto disimpan di browser (localStorage)
- 📱 **Responsif** - Tampil sempurna di desktop dan mobile
- 🎨 **UI Modern** - Desain yang cantik dengan animasi smooth

## 🚀 Teknologi yang Digunakan

- **Next.js 14** - Framework React untuk production
- **React 18** - Library UI
- **TypeScript** - Type safety
- **Framer Motion** - Animasi yang smooth
- **Lucide React** - Icon yang cantik
- **Tailwind CSS** (via inline styles) - Styling modern

## 📦 Instalasi

1. **Install dependencies**:
```bash
npm install
```

2. **Tambahkan foto ke folder `public/photos/`**:
   - Copy foto langsung ke folder `public/photos/`
   - Atau jalankan `npm run setup` jika ada foto di folder Asset

3. **Jalankan development server** (Chrome akan auto-open):
```bash
npm run dev
```

Browser Chrome akan **otomatis terbuka** di `http://localhost:3000` 🎉

## 📁 Struktur Folder

- `public/photos/` - Folder untuk menyimpan semua foto (satu-satunya folder foto yang digunakan)
- Foto yang ditambahkan ke folder ini akan otomatis muncul di gallery

## 🛠️ Build untuk Production

```bash
npm run build
npm start
```

## 📝 Catatan

- Foto disimpan di localStorage browser, jadi data akan hilang jika Anda menghapus cache browser
- Untuk penyimpanan permanen, Anda bisa mengintegrasikan dengan:
  - Cloud storage (AWS S3, Cloudinary, dll)
  - Database (MongoDB, PostgreSQL, dll)
  - File system server

## 🎯 Fitur yang Bisa Ditambahkan

- [ ] Kategori/Album foto
- [ ] Pencarian foto
- [ ] Edit foto (crop, filter, dll)
- [ ] Upload ke cloud storage
- [ ] Backup & restore
- [ ] Share foto
- [ ] Metadata foto (lokasi, tanggal, dll)

## 📄 License

MIT

---

Dibuat dengan ❤️ untuk menyimpan kenangan berharga


