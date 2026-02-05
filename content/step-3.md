## 🎨 Menambahkan Avatar

Avatar adalah foto profil yang akan ditampilkan di website-mu.

## 🖼️ Menambahkan Tag Image

Tambahkan kode ini di dalam `.profile-card`:

```html
<img src="avatar.jpg" alt="Foto Profil" class="avatar">
```

### Penjelasan:
- `src="avatar.jpg"` - Lokasi file gambar
- `alt="Foto Profil"` - Teks alternatif jika gambar tidak muncul
- `class="avatar"` - Nama class untuk styling

## 🎨 Styling Avatar dengan CSS

Tambahkan style di dalam `<head>`:

```html
<style>
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #333;
  }
</style>
```

### Penjelasan CSS:
- `width & height` - Ukuran avatar
- `border-radius: 50%` - Membuat gambar jadi lingkaran
- `object-fit: cover` - Gambar tidak terdistorsi
- `border` - Garis pinggir

## 💡 Tips Gambar

Untuk gambar avatar:
1. Gunakan gambar persegi (1:1) untuk hasil terbaik
2. Ukuran minimal 200x200 pixel
3. Format JPG atau PNG

> Avatar sudah siap! Lanjut ke **Step 4 - Nama dan Deskripsi**!