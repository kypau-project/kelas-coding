## 🔗 Membuat Container Link

Tambahkan kode ini untuk container link-link sosmed:

```html
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
```

## 🎨 Styling Link

```css
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
```

## ✨ Variasi Style

### Link dengan Border:
```css
.link-item {
  background: transparent;
  border: 2px solid #444;
}

.link-item:hover {
  border-color: #d4a853;
  background-color: rgba(212, 168, 83, 0.1);
}
```

### Link dengan Gradient:
```css
.link-item:hover {
  background: linear-gradient(90deg, #ff6b6b, #4ecdc4);
}
```

## 🎯 Menggunakan Icon SVG

Untuk icon yang lebih profesional, gunakan SVG:

```html
<a href="#" class="link-item">
  <svg width="20" height="20" viewBox="0 0 24 24">...</svg>
  <span>Instagram</span>
</a>
```

> Link sudah siap! Lanjut ke **Step 6 - Deploy** untuk mempublikasikan!