/**
 * Documentation Website - Main JavaScript
 * Features: ToC Generation, Scroll Spy, Mobile Menu, Code Highlighting, Search
 */

(function () {
  'use strict';

  // ========================================
  // Configuration
  // ========================================
  const API_BASE = '/api';
  const IS_SERVER_MODE = window.location.protocol !== 'file:';

  // ========================================
  // IMMEDIATE: Hide content in server mode to prevent flash
  // This runs BEFORE DOMContentLoaded
  // ========================================
  if (IS_SERVER_MODE) {
    // Add server-mode class to body as soon as possible
    document.documentElement.classList.add('server-mode-pending');

    // Use MutationObserver to add class as soon as body and content exist
    const observer = new MutationObserver(function (mutations, obs) {
      const content = document.querySelector('.content');
      if (content) {
        document.body.classList.add('server-mode');
        content.classList.add('hide-until-loaded');
        obs.disconnect();
      }
    });

    if (document.body) {
      const content = document.querySelector('.content');
      if (content) {
        document.body.classList.add('server-mode');
        content.classList.add('hide-until-loaded');
      }
    } else {
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  // ========================================
  // Table of Contents Generator
  // ========================================
  function generateTableOfContents() {
    const tocContainer = document.getElementById('toc-list');
    const content = document.querySelector('.content');

    if (!tocContainer || !content) return;

    const headings = content.querySelectorAll('h2, h3');

    if (headings.length === 0) {
      document.querySelector('.toc-sidebar')?.classList.add('empty');
      return;
    }

    tocContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    headings.forEach((heading, index) => {
      if (!heading.id) {
        heading.id = 'heading-' + index;
      }

      const link = document.createElement('a');
      link.href = '#' + heading.id;
      link.className = 'toc-item toc-' + heading.tagName.toLowerCase();
      link.textContent = heading.textContent.replace(/^[🔶📦🎨✏️🔗🚀📝🎉⚡💡🔧📌👋📚✅🐙📁✨🖼️]+\s*/, '');
      link.setAttribute('data-target', heading.id);

      link.addEventListener('click', function (e) {
        e.preventDefault();
        smoothScrollTo(heading);
      });

      fragment.appendChild(link);
    });

    tocContainer.appendChild(fragment);
  }

  // ========================================
  // Smooth Scroll
  // ========================================
  function smoothScrollTo(element) {
    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });

    history.pushState(null, null, '#' + element.id);
  }

  // ========================================
  // Scroll Spy
  // ========================================
  function initScrollSpy() {
    const tocItems = document.querySelectorAll('.toc-item');
    const content = document.querySelector('.content');

    if (!tocItems.length || !content) return;

    const headings = content.querySelectorAll('h2, h3');

    function updateActiveState() {
      const scrollPosition = window.scrollY + 100;
      let activeId = null;

      headings.forEach((heading) => {
        if (heading.offsetTop <= scrollPosition) {
          activeId = heading.id;
        }
      });

      tocItems.forEach((item) => {
        item.classList.remove('active');
        if (item.getAttribute('data-target') === activeId) {
          item.classList.add('active');
        }
      });

      updateMobileBreadcrumb(activeId, headings);
    }

    let ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          updateActiveState();
          ticking = false;
        });
        ticking = true;
      }
    });

    updateActiveState();
  }

  // ========================================
  // Mobile Breadcrumb
  // ========================================
  function updateMobileBreadcrumb(activeId, headings) {
    const breadcrumb = document.querySelector('.mobile-breadcrumb .current-section');
    if (!breadcrumb || !activeId) return;

    const activeHeading = Array.from(headings).find(h => h.id === activeId);
    if (activeHeading) {
      const text = activeHeading.textContent.replace(/^[🔶📦🎨✏️🔗🚀📝🎉⚡💡🔧📌👋📚✅🐙📁✨🖼️]+\s*/, '');
      breadcrumb.innerHTML = `<span class="section-icon">📑</span> ${text}`;
    }
  }

  function createMobileBreadcrumb() {
    if (window.innerWidth > 768) return;

    const mainContent = document.querySelector('.main-content');
    const pageHeader = document.querySelector('.page-header');

    if (!mainContent || !pageHeader || document.querySelector('.mobile-breadcrumb')) return;

    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'mobile-breadcrumb';
    breadcrumb.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
      <span>On this page</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9,18 15,12 9,6"></polyline>
      </svg>
      <span class="current-section"><span class="section-icon">📑</span> Introduction</span>
    `;

    mainContent.insertBefore(breadcrumb, pageHeader);
  }

  // ========================================
  // Mobile Menu
  // ========================================
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (!toggle || !sidebar) return;

    function openMenu() {
      toggle.classList.add('active');
      sidebar.classList.add('open');
      overlay?.classList.add('open');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      toggle.classList.remove('active');
      sidebar.classList.remove('open');
      overlay?.classList.remove('open');
      document.body.style.overflow = '';
    }

    toggle.addEventListener('click', function () {
      if (sidebar.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    overlay?.addEventListener('click', closeMenu);

    const navItems = sidebar.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && sidebar.classList.contains('open')) {
        closeMenu();
      }
    });
  }

  // ========================================
  // Active Navigation State
  // ========================================
  function setActiveNavItem() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
      item.classList.remove('active');
      const href = item.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        item.classList.add('active');
      }
    });
  }

  // ========================================
  // Code Block Enhancements
  // ========================================
  function enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll('.content pre');

    codeBlocks.forEach((pre) => {
      // Add copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy-btn';
      copyBtn.setAttribute('aria-label', 'Copy code');
      copyBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
      `;

      copyBtn.addEventListener('click', async () => {
        const code = pre.querySelector('code');
        const text = code ? code.textContent : pre.textContent;

        try {
          await navigator.clipboard.writeText(text);
          copyBtn.classList.add('copied');
          copyBtn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;

          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.innerHTML = `
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            `;
          }, 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
      });

      pre.appendChild(copyBtn);

      // Apply syntax highlighting
      const code = pre.querySelector('code');
      if (code) {
        code.innerHTML = highlightSyntax(code.textContent);
      }
    });
  }

  // ========================================
  // Simple Syntax Highlighter
  // ========================================
  function highlightSyntax(code) {
    // Escape HTML entities first
    let html = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Store replacements to avoid nested matching
    const tokens = [];
    let tokenId = 0;

    function saveToken(match, className) {
      const placeholder = `__TOKEN_${tokenId}__`;
      tokens.push({ placeholder, html: `<span class="${className}">${match}</span>` });
      tokenId++;
      return placeholder;
    }

    // HTML Comments (must be first)
    html = html.replace(
      /(&lt;!--[\s\S]*?--&gt;)/g,
      (m) => saveToken(m, 'comment')
    );

    // Strings in quotes (for attribute values)
    html = html.replace(
      /"([^"]*)"/g,
      (m, content) => `"${saveToken(content, 'attr-value')}"`
    );

    // HTML Tag names (after &lt; or &lt;/)
    html = html.replace(
      /(&lt;\/?)([\w-]+)/g,
      (m, prefix, tagName) => `${prefix}${saveToken(tagName, 'tag')}`
    );

    // Attribute names (word followed by =)
    html = html.replace(
      /\s([\w-]+)(=)/g,
      (m, attrName, eq) => ` ${saveToken(attrName, 'attr-name')}${eq}`
    );

    // CSS: property names at start of line
    html = html.replace(
      /^(\s*)([\w-]+)(\s*:)/gm,
      (m, space, prop, colon) => `${space}${saveToken(prop, 'property')}${colon}`
    );

    // Restore tokens
    tokens.forEach(({ placeholder, html: tokenHtml }) => {
      html = html.replace(placeholder, tokenHtml);
    });

    return html;
  }

  // ========================================
  // Search Functionality
  // ========================================
  function initSearch() {
    const searchBox = document.querySelector('.search-box');
    const mobileSearchBtn = document.querySelector('.mobile-header-btn[aria-label="Search"]');

    if (!searchBox && !mobileSearchBtn) return;

    // Create search modal
    const searchModal = document.createElement('div');
    searchModal.className = 'search-modal';
    searchModal.innerHTML = `
      <div class="search-modal-backdrop"></div>
      <div class="search-modal-content">
        <div class="search-input-wrapper">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" class="search-input" placeholder="Cari halaman...">
          <kbd>ESC</kbd>
        </div>
        <div class="search-results"></div>
      </div>
    `;
    document.body.appendChild(searchModal);

    // Search pages data
    const pages = [
      { title: 'Selamat Datang', url: 'index.html', desc: 'Panduan lengkap membuat website Link Bio' },
      { title: 'Step 1 - Persiapan', url: 'step-1.html', desc: 'Membuat akun GitHub dan repository' },
      { title: 'Step 2 - Struktur Dasar', url: 'step-2.html', desc: 'Menulis kode HTML pertama' },
      { title: 'Step 3 - Avatar', url: 'step-3.html', desc: 'Menambahkan foto profil' },
      { title: 'Step 4 - Nama dan Deskripsi', url: 'step-4.html', desc: 'Menulis identitas diri' },
      { title: 'Step 5 - Link Sosmed', url: 'step-5.html', desc: 'Menambahkan tombol link' },
      { title: 'Step 6 - Deploy', url: 'step-6.html', desc: 'Mempublikasikan ke internet' },
      { title: 'Penutup', url: 'penutup.html', desc: 'Langkah selanjutnya dan referensi' }
    ];

    const input = searchModal.querySelector('.search-input');
    const results = searchModal.querySelector('.search-results');
    const backdrop = searchModal.querySelector('.search-modal-backdrop');

    function openSearch() {
      searchModal.classList.add('open');
      input.value = '';
      input.focus();
      renderResults('');
      document.body.style.overflow = 'hidden';
    }

    function closeSearch() {
      searchModal.classList.remove('open');
      document.body.style.overflow = '';
    }

    function renderResults(query) {
      const filtered = query
        ? pages.filter(p =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.desc.toLowerCase().includes(query.toLowerCase())
        )
        : pages;

      if (filtered.length === 0) {
        results.innerHTML = '<div class="search-no-results">Tidak ditemukan hasil untuk "' + query + '"</div>';
        return;
      }

      results.innerHTML = filtered.map(p => `
        <a href="${p.url}" class="search-result-item">
          <div class="search-result-title">${highlightMatch(p.title, query)}</div>
          <div class="search-result-desc">${highlightMatch(p.desc, query)}</div>
        </a>
      `).join('');
    }

    function highlightMatch(text, query) {
      if (!query) return text;
      const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
      return text.replace(regex, '<mark>$1</mark>');
    }

    function escapeRegex(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Event listeners
    searchBox?.addEventListener('click', openSearch);
    mobileSearchBtn?.addEventListener('click', openSearch);
    backdrop.addEventListener('click', closeSearch);

    input.addEventListener('input', (e) => {
      renderResults(e.target.value);
    });

    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape' && searchModal.classList.contains('open')) {
        closeSearch();
      }
    });
  }

  // ========================================
  // Dynamic Content Loading
  // ========================================
  async function loadDynamicContent() {
    const content = document.querySelector('.content');
    if (!content) return;

    // If not in server mode, just enhance code blocks and return
    if (!IS_SERVER_MODE) {
      content.classList.remove('hide-until-loaded');
      return;
    }

    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPath.replace('.html', '') || 'index';

    try {
      const response = await fetch(`${API_BASE}/content/${pageName}`);
      const data = await response.json();

      if (data.success && data.html) {
        content.innerHTML = data.html;
        content.classList.add('loaded');
        content.style.visibility = 'visible';
        content.classList.remove('hide-until-loaded');
        generateTableOfContents();
        initScrollSpy();
        enhanceCodeBlocks();
      } else {
        // If no dynamic content, show original
        content.classList.add('loaded');
        content.style.visibility = 'visible';
        content.classList.remove('hide-until-loaded');
        enhanceCodeBlocks();
      }
    } catch (error) {
      // Running in static mode, show original content
      console.log('Running in static mode, using embedded content');
      content.classList.add('loaded');
      content.style.visibility = 'visible';
      content.classList.remove('hide-until-loaded');
      enhanceCodeBlocks();
    }
  }

  // ========================================
  // Initialize
  // ========================================
  document.addEventListener('DOMContentLoaded', function () {
    // Load dynamic content first (this will handle TOC, scroll spy, code blocks)
    loadDynamicContent().then(() => {
      // These don't depend on content, so init them regardless
      initMobileMenu();
      setActiveNavItem();
      createMobileBreadcrumb();
      initSearch();
    });

    // Only generate TOC if not in server mode (server mode does it after content loads)
    if (!IS_SERVER_MODE) {
      generateTableOfContents();
      initScrollSpy();
      enhanceCodeBlocks();
    }

    window.addEventListener('resize', createMobileBreadcrumb);
  });

})();
