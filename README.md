# Kelas Coding - Tutorial Website Link Bio

Website dokumentasi interaktif untuk tutorial membuat website Link Bio. Dibangun dengan HTML, CSS, JavaScript vanilla, dan Node.js backend untuk admin CMS.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start server
npm run dev

# Open http://localhost:3000
```

### Deploy ke Railway

1. **Fork/Clone repository ini ke GitHub**

2. **Buat project baru di Railway**
   - Buka [railway.app](https://railway.app)
   - Klik "New Project" → "Deploy from GitHub repo"
   - Pilih repository ini

3. **Set Environment Variables** (opsional, untuk keamanan)
   ```
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_secure_password
   ```

4. **Deploy!**
   - Railway akan otomatis build dan deploy
   - URL akan tersedia dalam beberapa menit

## 📝 Admin Panel

Akses admin panel untuk mengedit konten:

1. Buka `/admin-login.html`
2. Login dengan kredensial:
   - Default: `admin` / `admin123`
   - Atau sesuai environment variables

### Fitur Admin:
- ✅ Markdown editor (format GitHub README)
- ✅ Live preview
- ✅ Auto-save
- ✅ Real-time content updates

## 📁 Struktur Project

```
kelas-coding/
├── index.html          # Halaman utama
├── step-1.html         # Step 1 - Persiapan
├── step-2.html         # Step 2 - Struktur Dasar
├── step-3.html         # Step 3 - Avatar
├── step-4.html         # Step 4 - Nama & Deskripsi
├── step-5.html         # Step 5 - Link Sosmed
├── step-6.html         # Step 6 - Deploy
├── penutup.html        # Penutup
├── admin.html          # Admin dashboard
├── admin-login.html    # Admin login
├── server.js           # Express.js backend
├── package.json        # Dependencies
├── railway.json        # Railway config
├── content/            # Markdown content (auto-generated)
└── assets/
    ├── css/style.css   # Styling
    └── js/
        ├── main.js     # Frontend JS
        └── admin.js    # Admin panel JS
```

## 🎨 Teknologi

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Markdown**: marked.js
- **Deployment**: Railway

## 📱 Responsive

Website sudah responsive untuk:
- Desktop (1200px+)
- Tablet (768px - 1199px)  
- Mobile (< 768px)

## 🔧 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port (Railway sets automatically) |
| ADMIN_USERNAME | admin | Admin login username |
| ADMIN_PASSWORD | admin123 | Admin login password |

## 📄 License

MIT License - Feel free to use and modify!
