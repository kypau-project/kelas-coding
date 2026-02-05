/**
 * Admin Dashboard JavaScript
 * Handles Markdown editing, API calls, and live preview
 */

(function () {
    'use strict';

    // API base URL
    const API_BASE = '/api';

    // Session storage key
    const SESSION_KEY = 'admin_session_id';

    // Current state
    let currentPage = 'index';
    let sessionId = localStorage.getItem(SESSION_KEY);
    let saveTimeout = null;
    let hasUnsavedChanges = false;

    // DOM Elements
    const elements = {
        editor: document.getElementById('editor-content'),
        preview: document.getElementById('preview-content'),
        currentFile: document.getElementById('current-file'),
        saveBtn: document.getElementById('save-btn'),
        saveStatus: document.getElementById('save-status'),
        logoutBtn: document.getElementById('logout-btn'),
        connectionDot: document.getElementById('connection-dot'),
        connectionStatus: document.getElementById('connection-status'),
        navItems: document.querySelectorAll('.admin-nav-item'),
        toolbarBtns: document.querySelectorAll('.toolbar-btn')
    };

    // ========================================
    // Authentication
    // ========================================

    async function checkAuth() {
        if (!sessionId) {
            redirectToLogin();
            return false;
        }

        try {
            const response = await fetch(`${API_BASE}/auth/verify`, {
                headers: { 'X-Session-Id': sessionId }
            });
            const data = await response.json();

            if (!data.authenticated) {
                redirectToLogin();
                return false;
            }

            setConnectionStatus('connected');
            return true;
        } catch (error) {
            console.error('Auth check failed:', error);
            setConnectionStatus('error');
            return false;
        }
    }

    function redirectToLogin() {
        localStorage.removeItem(SESSION_KEY);
        window.location.href = 'admin-login.html';
    }

    async function logout() {
        try {
            await fetch(`${API_BASE}/auth/logout`, {
                method: 'POST',
                headers: { 'X-Session-Id': sessionId }
            });
        } catch (error) {
            console.error('Logout error:', error);
        }
        redirectToLogin();
    }

    // ========================================
    // Connection Status
    // ========================================

    function setConnectionStatus(status) {
        const { connectionDot, connectionStatus } = elements;

        connectionDot.className = 'status-dot';

        switch (status) {
            case 'connected':
                connectionDot.classList.add('connected');
                connectionStatus.textContent = 'Connected';
                break;
            case 'saving':
                connectionDot.classList.add('saving');
                connectionStatus.textContent = 'Saving...';
                break;
            case 'error':
                connectionDot.classList.add('error');
                connectionStatus.textContent = 'Disconnected';
                break;
            default:
                connectionStatus.textContent = 'Connecting...';
        }
    }

    // ========================================
    // Content Management
    // ========================================

    async function loadContent(page) {
        try {
            const response = await fetch(`${API_BASE}/content/${page}`);
            const data = await response.json();

            if (data.success) {
                elements.editor.value = data.markdown;
                elements.preview.innerHTML = data.html;
                currentPage = page;
                elements.currentFile.textContent = `${page}.md`;
                hasUnsavedChanges = false;
                updateSaveStatus('');
            } else {
                showError('Failed to load content');
            }
        } catch (error) {
            console.error('Load error:', error);
            showError('Could not load content. Server might be offline.');
        }
    }

    async function saveContent() {
        if (!elements.editor.value.trim()) {
            showError('Content cannot be empty');
            return;
        }

        setConnectionStatus('saving');
        updateSaveStatus('Saving...');

        try {
            const response = await fetch(`${API_BASE}/content/${currentPage}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    markdown: elements.editor.value,
                    sessionId: sessionId
                })
            });

            const data = await response.json();

            if (data.success) {
                elements.preview.innerHTML = data.html;
                hasUnsavedChanges = false;
                updateSaveStatus('✓ Saved!');
                setConnectionStatus('connected');

                setTimeout(() => {
                    updateSaveStatus('');
                }, 3000);
            } else {
                if (response.status === 401) {
                    showError('Session expired. Please login again.');
                    setTimeout(redirectToLogin, 2000);
                } else {
                    showError(data.error || 'Failed to save');
                }
            }
        } catch (error) {
            console.error('Save error:', error);
            setConnectionStatus('error');
            showError('Could not save. Check your connection.');
        }
    }

    // Auto-save with debounce
    function scheduleSave() {
        if (saveTimeout) clearTimeout(saveTimeout);
        saveTimeout = setTimeout(saveContent, 2000);
        hasUnsavedChanges = true;
        updateSaveStatus('Unsaved changes...');
    }

    // ========================================
    // Preview
    // ========================================

    function updatePreview() {
        try {
            const html = marked.parse(elements.editor.value);
            elements.preview.innerHTML = html;
        } catch (error) {
            console.error('Preview error:', error);
        }
    }

    // ========================================
    // Toolbar
    // ========================================

    function insertText(text, wrap = false) {
        const editor = elements.editor;
        const start = editor.selectionStart;
        const end = editor.selectionEnd;
        const selectedText = editor.value.substring(start, end);

        let newText;
        let cursorPos;

        if (wrap && selectedText) {
            // Wrap selected text
            newText = text + selectedText + text;
            cursorPos = start + text.length + selectedText.length + text.length;
        } else if (wrap) {
            // Insert placeholder for wrapping
            newText = text + text;
            cursorPos = start + text.length;
        } else {
            // Just insert
            newText = text;
            cursorPos = start + text.length;
        }

        editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end);
        editor.focus();
        editor.setSelectionRange(cursorPos, cursorPos);

        updatePreview();
        scheduleSave();
    }

    // ========================================
    // UI Helpers
    // ========================================

    function updateSaveStatus(message) {
        elements.saveStatus.textContent = message;
    }

    function showError(message) {
        setConnectionStatus('error');
        updateSaveStatus('❌ ' + message);

        setTimeout(() => {
            setConnectionStatus('connected');
        }, 5000);
    }

    // ========================================
    // Event Listeners
    // ========================================

    function initEventListeners() {
        // Navigation
        elements.navItems.forEach(item => {
            item.addEventListener('click', async function () {
                if (hasUnsavedChanges) {
                    if (!confirm('You have unsaved changes. Continue?')) {
                        return;
                    }
                }

                elements.navItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                const page = this.getAttribute('data-page');
                await loadContent(page);
            });
        });

        // Editor input
        elements.editor.addEventListener('input', () => {
            updatePreview();
            scheduleSave();
        });

        // Manual save
        elements.saveBtn.addEventListener('click', saveContent);

        // Logout
        elements.logoutBtn.addEventListener('click', logout);

        // Toolbar buttons
        elements.toolbarBtns.forEach(btn => {
            btn.addEventListener('click', function () {
                const text = this.getAttribute('data-insert');
                const wrap = this.getAttribute('data-wrap') === 'true';
                insertText(text, wrap);
            });
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveContent();
            }
        });

        // Warn before leaving with unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (hasUnsavedChanges) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    // ========================================
    // Initialize
    // ========================================

    async function init() {
        const isAuthenticated = await checkAuth();

        if (!isAuthenticated) return;

        initEventListeners();
        await loadContent('index');
    }

    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
