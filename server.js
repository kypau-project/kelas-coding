const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const { marked } = require('marked');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Content directory
const CONTENT_DIR = path.join(__dirname, 'content');

// Admin credentials (use environment variables in production)
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Simple session storage (in-memory, resets on restart)
const sessions = new Map();

// Ensure content directory exists
async function ensureContentDir() {
    try {
        await fs.access(CONTENT_DIR);
    } catch {
        await fs.mkdir(CONTENT_DIR, { recursive: true });
        // Create default content files
        await createDefaultContent();
    }
}

// Create default markdown content files
async function createDefaultContent() {
    const defaultContent = {
        'index': `## 👋 Tentang Tutorial Ini

Selamat datang di tutorial **Membuat Website Link Bio**! Tutorial ini dirancang khusus untuk pemula yang ingin belajar membuat website pertama mereka.

> **Tenang, semuanya sederhana kok!** Kamu akan dipandu langkah demi langkah dari awal sampai website-mu bisa diakses oleh semua orang di internet.

## 🔗 Apa itu Website Link Bio?

Website Link Bio adalah halaman sederhana yang berisi:
- Foto profil atau avatar
- Nama dan deskripsi singkat
- Kumpulan link ke sosial media dan website lainnya

Contohnya seperti Linktree, tapi kamu akan membuatnya sendiri dengan kode!

## 📚 Yang Akan Kamu Pelajari

Di tutorial ini, kamu akan belajar:
1. **Persiapan** - Membuat akun GitHub dan repository
2. **Struktur Dasar** - Menulis kode HTML pertamamu
3. **Avatar** - Menambahkan foto profil
4. **Nama dan Deskripsi** - Menulis identitas diri
5. **Link Sosmed** - Menambahkan tombol link
6. **Deploy** - Mempublikasikan ke internet

## ✅ Persyaratan

Yang kamu butuhkan untuk mengikuti tutorial ini:
- Komputer atau laptop dengan koneksi internet
- Browser modern (Chrome, Firefox, Edge)
- Semangat belajar! 💪

### Tidak Perlu Pengalaman Sebelumnya
Tutorial ini cocok untuk pemula total. Kamu tidak perlu tahu tentang coding sebelumnya. Semua akan dijelaskan dari nol!

> Siap untuk memulai? Klik **Step 1 - Persiapan** untuk memulai perjalanan coding-mu!`,

        'step-1': `## 🔶 Persiapan Sebelum Memulai

Sebelum kita mulai membuat project website Link Bio, ada beberapa hal yang perlu kamu siapkan. Tenang, semuanya sederhana kok!

> **Tips:** Kamu tidak perlu menginstall software apapun. Semua bisa dilakukan langsung di browser!

## 🐙 1. Buat Akun GitHub (Direkomendasikan)

GitHub adalah tempat menyimpan dan membagikan kode. Kamu bisa pakai ini untuk menyimpan project-mu secara online, menunjukkan hasil kerja ke teman atau guru, dan deploy website gratis dengan GitHub Pages.

### Cara membuat akun GitHub:
1. Buka [github.com](https://github.com)
2. Klik tombol **"Sign up"** di pojok kanan atas
3. Masukkan email yang valid
4. Buat password yang kuat
5. Pilih username (ini akan jadi bagian dari URL website-mu!)
6. Verifikasi emailmu

> **Penting:** Pilih username dengan hati-hati karena URL website-mu akan menjadi: \`username.github.io\`

## 📁 2. Buat Repository Baru

Repository adalah "folder" untuk menyimpan semua file project-mu di GitHub.

### Langkah-langkah:
1. Login ke akun GitHub-mu
2. Klik tombol **"+"** di pojok kanan atas
3. Pilih **"New repository"**
4. Isi nama repository: \`link-bio\` (atau nama lain yang kamu suka)
5. Pilih **"Public"** agar bisa diakses semua orang
6. Centang **"Add a README file"**
7. Klik **"Create repository"**

## ✨ 3. Alternatif: Gunakan CodePen

Jika kamu tidak ingin membuat akun GitHub, kamu bisa menggunakan [CodePen](https://codepen.io) untuk berlatih.

### Kelebihan CodePen:
- Bisa langsung mulai coding tanpa setup
- Preview langsung di browser
- Cocok untuk eksperimen cepat

### Kekurangan CodePen:
- URL tidak se-profesional GitHub Pages
- Fitur terbatas untuk akun gratis

> Sudah siap? Lanjut ke **Step 2 - Struktur Dasar** untuk mulai menulis kode!`,

        'step-2': `## 📦 Struktur Dasar HTML

Mari kita mulai dengan membuat struktur dasar file HTML.

## 📄 Membuat File index.html

Buat file baru bernama \`index.html\` dan salin kode berikut:

\`\`\`html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Link Bio Saya</title>
</head>
<body>
  <!-- Konten akan kita tambahkan di sini -->
</body>
</html>
\`\`\`

## 🔍 Penjelasan Kode

Mari kita pahami setiap bagian:

### DOCTYPE dan HTML
- \`<!DOCTYPE html>\` - Memberitahu browser ini adalah dokumen HTML5
- \`<html lang="id">\` - Elemen root, lang="id" artinya bahasa Indonesia

### Head Section
- \`<meta charset="UTF-8">\` - Encoding karakter untuk emoji dan huruf Indonesia
- \`<meta name="viewport">\` - Agar website responsif di mobile
- \`<title>\` - Judul yang muncul di tab browser

### Body Section
- \`<body>\` - Tempat semua konten yang terlihat di halaman

## 🎨 Menambahkan Container Utama

Sekarang tambahkan container di dalam \`<body>\`:

\`\`\`html
<div class="container">
  <div class="profile-card">
    <!-- Konten profile akan di sini -->
  </div>
</div>
\`\`\`

> Keren! Struktur dasar sudah siap. Lanjut ke **Step 3 - Avatar** untuk menambahkan foto profil!`,

        'step-3': `## 🎨 Menambahkan Avatar

Avatar adalah foto profil yang akan ditampilkan di website-mu.

## 🖼️ Menambahkan Tag Image

Tambahkan kode ini di dalam \`.profile-card\`:

\`\`\`html
<img src="avatar.jpg" alt="Foto Profil" class="avatar">
\`\`\`

### Penjelasan:
- \`src="avatar.jpg"\` - Lokasi file gambar
- \`alt="Foto Profil"\` - Teks alternatif jika gambar tidak muncul
- \`class="avatar"\` - Nama class untuk styling

## 🎨 Styling Avatar dengan CSS

Tambahkan style di dalam \`<head>\`:

\`\`\`html
<style>
  .avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #333;
  }
</style>
\`\`\`

### Penjelasan CSS:
- \`width & height\` - Ukuran avatar
- \`border-radius: 50%\` - Membuat gambar jadi lingkaran
- \`object-fit: cover\` - Gambar tidak terdistorsi
- \`border\` - Garis pinggir

## 💡 Tips Gambar

Untuk gambar avatar:
1. Gunakan gambar persegi (1:1) untuk hasil terbaik
2. Ukuran minimal 200x200 pixel
3. Format JPG atau PNG

> Avatar sudah siap! Lanjut ke **Step 4 - Nama dan Deskripsi**!`,

        'step-4': `## ✏️ Nama dan Deskripsi

Sekarang kita akan menambahkan nama dan deskripsi singkat tentang diri kamu.

## 👤 Menambahkan Nama

Tambahkan kode ini setelah avatar:

\`\`\`html
<h1 class="name">Nama Kamu</h1>
\`\`\`

## 📝 Menambahkan Deskripsi

\`\`\`html
<p class="bio">Pelajar | Web Developer | Content Creator</p>
\`\`\`

## 🎨 Styling Nama dan Bio

Tambahkan CSS ini:

\`\`\`css
.name {
  font-size: 24px;
  font-weight: 700;
  margin: 16px 0 8px;
  color: #ffffff;
}

.bio {
  color: #a0a0a0;
  font-size: 14px;
  margin-bottom: 24px;
}
\`\`\`

## 💡 Tips Penulisan Bio

Bio yang bagus itu:
- **Singkat** - Maksimal 1-2 baris
- **Informatif** - Jelaskan siapa kamu
- **Menarik** - Gunakan emoji jika mau!

### Contoh Bio:
- "🎮 Gamer | 📷 Photographer | ☕ Coffee Lover"
- "Pelajar SMA yang suka coding"
- "Belajar web development 🚀"

> Nama dan bio sudah ada! Lanjut ke **Step 5 - Link Sosmed**!`,

        'step-5': `## 🔗 Membuat Container Link

Tambahkan kode ini untuk container link-link sosmed:

\`\`\`html
<div class="links">
  <a href="https://instagram.com/username" class="link-item">
    📷 Instagram
  </a>
  <a href="https://twitter.com/username" class="link-item">
    🐦 Twitter
  </a>
  <a href="https://github.com/username" class="link-item">
    💻 GitHub
  </a>
  <a href="https://youtube.com/@channel" class="link-item">
    🎬 YouTube
  </a>
</div>
\`\`\`

## 🎨 Styling Link

\`\`\`css
.links {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.link-item {
  display: block;
  padding: 14px 20px;
  background-color: #2a2a2a;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
}

.link-item:hover {
  background-color: #3a3a3a;
  transform: translateY(-2px);
}
\`\`\`

## ✨ Variasi Style

### Link dengan Border:
\`\`\`css
.link-item {
  background: transparent;
  border: 2px solid #444;
}

.link-item:hover {
  border-color: #d4a853;
  background-color: rgba(212, 168, 83, 0.1);
}
\`\`\`

### Link dengan Gradient:
\`\`\`css
.link-item:hover {
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
}
\`\`\`

## 🎯 Menggunakan Icon SVG

Untuk icon yang lebih profesional, gunakan SVG:

\`\`\`html
<a href="#" class="link-item">
  <svg width="20" height="20" viewBox="0 0 24 24">...</svg>
  <span>Instagram</span>
</a>
\`\`\`

> Link sudah siap! Lanjut ke **Step 6 - Deploy** untuk mempublikasikan!`,

        'step-6': `## 🚀 Deploy ke GitHub Pages

Sekarang saatnya membuat website-mu bisa diakses oleh semua orang!

## 📤 Upload File ke GitHub

### Cara 1: Langsung di GitHub (Mudah)
1. Buka repository yang sudah kamu buat
2. Klik tombol **"Add file"** → **"Upload files"**
3. Drag & drop file \`index.html\` dan folder lainnya
4. Tulis pesan commit: "Initial upload"
5. Klik **"Commit changes"**

### Cara 2: Menggunakan Git (Advanced)
\`\`\`bash
git add .
git commit -m "Initial commit"
git push origin main
\`\`\`

## ⚙️ Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik tab **Settings**
3. Di sidebar kiri, klik **Pages**
4. Di bagian "Source", pilih branch **main**
5. Klik **Save**

## 🌐 Akses Website

Setelah beberapa menit, website-mu akan tersedia di:
\`\`\`
https://username.github.io/nama-repo
\`\`\`

Contoh: \`https://johndoe.github.io/link-bio\`

## ⏱️ Waktu Deploy

- Deploy pertama: 1-5 menit
- Update berikutnya: beberapa detik

> **Tips:** Jika website tidak muncul, tunggu beberapa menit dan refresh halaman.

## ✅ Checklist Sebelum Share

Pastikan:
- [ ] Semua link berfungsi
- [ ] Gambar avatar muncul
- [ ] Tampilan bagus di mobile
- [ ] Tidak ada typo

> 🎉 Selamat! Website-mu sudah live! Lanjut ke **Penutup** untuk tips selanjutnya!`,

        'penutup': `## 🎉 Selamat!

Kamu telah berhasil membuat website Link Bio sendiri! Ini adalah langkah pertama yang luar biasa dalam perjalanan coding-mu.

## 📊 Apa yang Sudah Kamu Pelajari

- ✅ Struktur dasar HTML
- ✅ Menambahkan gambar (avatar)
- ✅ Styling dengan CSS
- ✅ Membuat link interaktif
- ✅ Deploy ke GitHub Pages

## 🚀 Apa Selanjutnya?

### Tingkatkan Website-mu:
- Eksperimen dengan warna dan font yang berbeda
- Tambahkan animasi CSS
- Buat tampilan dark/light mode toggle
- Tambahkan lebih banyak link

### Pelajari Lebih Lanjut:
- **JavaScript** - Untuk fitur interaktif
- **CSS Advanced** - Flexbox, Grid, animasi
- **Responsive Design** - Agar bagus di semua device
- **Framework** - React, Vue, atau Tailwind CSS

## 📚 Resources Belajar

### Gratis:
- [freeCodeCamp](https://freecodecamp.org) - Kursus lengkap gratis
- [MDN Web Docs](https://developer.mozilla.org) - Dokumentasi resmi
- [CSS-Tricks](https://css-tricks.com) - Tutorial CSS

### YouTube Channel:
- Web Programming UNPAS
- Traversy Media
- Kevin Powell (CSS)

## 💪 Tips Terakhir

1. **Praktik setiap hari** - 30 menit coding lebih baik dari tidak sama sekali
2. **Buat project** - Belajar sambil membuat sesuatu
3. **Join komunitas** - Discord, Telegram, atau forum coding
4. **Jangan takut error** - Itu bagian dari belajar!

> **Jangan lupa untuk terus belajar dan bereksperimen. Setiap developer hebat dimulai dari langkah kecil seperti ini!** 💪

## 🤝 Share Hasil Karyamu!

Bagikan link website-mu ke teman-teman dan keluarga. Kamu layak bangga dengan hasil kerjamu!

---

*Terima kasih sudah mengikuti tutorial ini. Semoga sukses dalam perjalanan coding-mu!* ✨`
    };

    for (const [page, content] of Object.entries(defaultContent)) {
        await fs.writeFile(path.join(CONTENT_DIR, `${page}.md`), content, 'utf-8');
    }
}

// API Routes

// Get page content (Markdown)
app.get('/api/content/:page', async (req, res) => {
    try {
        const { page } = req.params;
        const filePath = path.join(CONTENT_DIR, `${page}.md`);

        try {
            const markdown = await fs.readFile(filePath, 'utf-8');
            const html = marked(markdown);
            res.json({ success: true, markdown, html });
        } catch {
            res.status(404).json({ success: false, error: 'Page not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Save page content (requires auth)
app.put('/api/content/:page', async (req, res) => {
    try {
        const { page } = req.params;
        const { markdown, sessionId } = req.body;

        // Check authentication
        if (!sessionId || !sessions.has(sessionId)) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        const filePath = path.join(CONTENT_DIR, `${page}.md`);
        await fs.writeFile(filePath, markdown, 'utf-8');

        const html = marked(markdown);
        res.json({ success: true, html });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Login
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        sessions.set(sessionId, { username, createdAt: Date.now() });
        res.json({ success: true, sessionId });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// Verify session
app.get('/api/auth/verify', (req, res) => {
    const sessionId = req.headers['x-session-id'];

    if (sessionId && sessions.has(sessionId)) {
        res.json({ success: true, authenticated: true });
    } else {
        res.json({ success: true, authenticated: false });
    }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
    const sessionId = req.headers['x-session-id'];

    if (sessionId) {
        sessions.delete(sessionId);
    }
    res.json({ success: true });
});

// Start server
async function startServer() {
    await ensureContentDir();

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📝 Admin login: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
    });
}

startServer();
