/**
 * Markdown Docs Reviewer - Core Application Logic
 * Pure Static, Zero Build Tools, Lightweight & Fast
 */

(function () {
  'use strict';

  // State Management
  const state = {
    currentDocPath: '',
    activeCategory: 'all',
    searchQuery: '',
    manifest: [],
    cache: new Map(),
    theme: localStorage.getItem('docs_theme') || 'dark',
    sidebarOpen: true,
    tocOpen: true
  };

  // DOM Elements Cache
  const DOM = {
    html: document.documentElement,
    sidebar: document.getElementById('sidebar'),
    toggleSidebarBtn: document.getElementById('toggle-sidebar-btn'),
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    toggleTocBtn: document.getElementById('toggle-toc-btn'),
    tocSidebar: document.getElementById('toc-sidebar'),
    tocNav: document.getElementById('toc-nav'),
    globalSearch: document.getElementById('global-search'),
    categoryTabs: document.getElementById('category-tabs'),
    treeContainer: document.getElementById('tree-container'),
    docCounter: document.getElementById('doc-counter'),
    breadcrumb: document.getElementById('breadcrumb'),
    docCategory: document.getElementById('doc-category'),
    docPathDisplay: document.getElementById('doc-path-display'),
    docTitle: document.getElementById('doc-title'),
    markdownContainer: document.getElementById('markdown-container'),
    loadingState: document.getElementById('loading-state'),
    errorState: document.getElementById('error-state'),
    errorMessage: document.getElementById('error-message'),
    backToTopBtn: document.getElementById('back-to-top'),
    contentArea: document.getElementById('content-area'),
    imageModal: document.getElementById('image-modal'),
    modalImg: document.getElementById('modal-img'),
    modalCaption: document.getElementById('modal-caption'),
    modalClose: document.getElementById('modal-close')
  };

  /* ==========================================================================
     Helper Utilities
     ========================================================================== */

  function getRepoRootPrefix() {
    const path = window.location.pathname;
    if (path.includes('/web/') || path.endsWith('/web')) {
      return '../';
    }
    return './';
  }

  function resolveStaticAssetUrl(relativePathFromRepoRoot) {
    const cleanPath = relativePathFromRepoRoot.replace(/^\/+/, '');
    return getRepoRootPrefix() + cleanPath;
  }

  function resolveRelativePath(baseDir, relativePath) {
    if (!relativePath || /^(https?:|\/\/|data:|blob:|\/)/i.test(relativePath)) {
      return relativePath;
    }

    const baseParts = baseDir ? baseDir.split('/').filter(Boolean) : [];
    const relParts = relativePath.split('/').filter(Boolean);

    for (const part of relParts) {
      if (part === '.') {
        continue;
      } else if (part === '..') {
        if (baseParts.length > 0) {
          baseParts.pop();
        }
      } else {
        baseParts.push(part);
      }
    }
    return baseParts.join('/');
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\u00C0-\u1EF9\- ]+/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /* ==========================================================================
     Theme Management
     ========================================================================== */

  function applyTheme(theme) {
    state.theme = theme;
    DOM.html.setAttribute('data-theme', theme);
    localStorage.setItem('docs_theme', theme);

    if (window.mermaid) {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'loose'
        });
      } catch (e) {
        console.warn('Mermaid re-init error', e);
      }
    }
  }

  function initTheme() {
    applyTheme(state.theme);
    DOM.themeToggleBtn.addEventListener('click', () => {
      applyTheme(state.theme === 'dark' ? 'light' : 'dark');
      // Re-render mermaid diagrams if active
      if (DOM.markdownContainer.querySelector('.mermaid')) {
        renderMermaidDiagrams(DOM.markdownContainer);
      }
    });
  }

  /* ==========================================================================
     Manifest Loading & File Tree
     ========================================================================== */

  async function loadManifest() {
    if (window.DOCS_MANIFEST && Array.isArray(window.DOCS_MANIFEST) && window.DOCS_MANIFEST.length > 0) {
      state.manifest = window.DOCS_MANIFEST;
      renderFileTree();
      return;
    }

    try {
      const res = await fetch(resolveStaticAssetUrl('web/manifest.json'));
      if (res.ok) {
        state.manifest = await res.json();
        renderFileTree();
      } else {
        throw new Error('Không thể tải manifest.json');
      }
    } catch (err) {
      console.warn('Fetch manifest.json error, using empty tree:', err);
      DOM.docCounter.textContent = '0 tài liệu';
    }
  }

  function renderFileTree() {
    const { manifest, activeCategory, searchQuery } = state;
    let filtered = manifest;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === activeCategory);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(q) || doc.path.toLowerCase().includes(q)
      );
    }

    DOM.docCounter.textContent = `${filtered.length} tài liệu`;

    if (filtered.length === 0) {
      DOM.treeContainer.innerHTML = `
        <div style="padding: 20px; text-align: center; color: var(--text-muted); font-size: 13px;">
          Không tìm thấy tài liệu phù hợp
        </div>
      `;
      return;
    }

    // If searching, show flat list for quick scanning
    if (searchQuery) {
      const listHtml = filtered.map(doc => {
        const isActive = doc.path === state.currentDocPath ? 'active' : '';
        return `
          <a class="tree-item ${isActive}" href="#${doc.path}" data-path="${doc.path}">
            <span class="badge-cat cat-${doc.category}">${doc.category.toUpperCase().slice(0, 3)}</span>
            <span class="tree-item-title" title="${doc.path}">${escapeHtml(doc.title)}</span>
          </a>
        `;
      }).join('');
      DOM.treeContainer.innerHTML = listHtml;
      attachTreeItemListeners();
      return;
    }

    // Build hierarchical tree grouped by category and subdirectories
    const tree = {};
    for (const doc of filtered) {
      const cat = doc.category;
      if (!tree[cat]) tree[cat] = {};

      const relFolder = doc.folder.replace(new RegExp(`^${cat}\\/?`), '');
      if (!tree[cat][relFolder]) tree[cat][relFolder] = [];
      tree[cat][relFolder].push(doc);
    }

    let treeHtml = '';
    const categoryLabels = {
      release: '🚀 RELEASE (Chính thức)',
      temporary: '⏳ TEMPORARY (Bản nháp)',
      interesting: '💡 INTERESTING (Thú vị)'
    };

    for (const cat of ['release', 'temporary', 'interesting']) {
      if (!tree[cat]) continue;
      const folderKeys = Object.keys(tree[cat]).sort();

      treeHtml += `
        <div class="tree-group">
          <div class="tree-group-title">
            <span>${categoryLabels[cat] || cat}</span>
            <span class="badge-cat cat-${cat}">${countDocsInCat(tree[cat])}</span>
          </div>
      `;

      for (const folder of folderKeys) {
        const docs = tree[cat][folder];
        const isRootFolder = !folder;
        const folderName = isRootFolder ? 'Gốc' : folder.split('/').pop().replace(/^\d+_/, '').replace(/_/g, ' ');

        const isOpen = state.currentDocPath && state.currentDocPath.startsWith(`${cat}/${folder}`) ? 'open' : '';

        treeHtml += `
          <div class="tree-folder ${isOpen || isRootFolder ? 'open' : ''}">
            <div class="tree-folder-title">
              <span class="folder-arrow">▶</span>
              <span class="folder-name">${escapeHtml(folderName)}</span>
            </div>
            <div class="tree-folder-content">
        `;

        for (const doc of docs) {
          const isActive = doc.path === state.currentDocPath ? 'active' : '';
          treeHtml += `
            <a class="tree-item ${isActive}" href="#${doc.path}" data-path="${doc.path}">
              <svg class="tree-item-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              <span class="tree-item-title" title="${doc.path}">${escapeHtml(doc.title)}</span>
            </a>
          `;
        }

        treeHtml += `
            </div>
          </div>
        `;
      }

      treeHtml += `</div>`;
    }

    DOM.treeContainer.innerHTML = treeHtml;
    attachFolderToggleListeners();
    attachTreeItemListeners();
  }

  function countDocsInCat(catFolders) {
    let count = 0;
    for (const k in catFolders) {
      count += catFolders[k].length;
    }
    return count;
  }

  function attachFolderToggleListeners() {
    DOM.treeContainer.querySelectorAll('.tree-folder-title').forEach(titleEl => {
      titleEl.addEventListener('click', () => {
        const folderEl = titleEl.closest('.tree-folder');
        if (folderEl) {
          folderEl.classList.toggle('open');
        }
      });
    });
  }

  function attachTreeItemListeners() {
    DOM.treeContainer.querySelectorAll('.tree-item').forEach(item => {
      item.addEventListener('click', (e) => {
        const path = item.getAttribute('data-path');
        if (path) {
          e.preventDefault();
          navigateTo(path);
        }
      });
    });
  }

  function highlightActiveTreeItem(path) {
    DOM.treeContainer.querySelectorAll('.tree-item').forEach(item => {
      const match = item.getAttribute('data-path') === path;
      item.classList.toggle('active', match);
      if (match) {
        // Expand all parent folders
        let parent = item.closest('.tree-folder');
        while (parent) {
          parent.classList.add('open');
          parent = parent.parentElement ? parent.parentElement.closest('.tree-folder') : null;
        }
        item.scrollIntoView({ block: 'nearest' });
      }
    });
  }

  /* ==========================================================================
     Markdown Fetching & Rendering Pipeline
     ========================================================================== */

  async function loadDocument(docPath, targetAnchor = '') {
    if (!docPath) return;

    state.currentDocPath = docPath;
    highlightActiveTreeItem(docPath);
    updateBreadcrumb(docPath);

    DOM.loadingState.style.display = 'flex';
    DOM.errorState.style.display = 'none';
    DOM.markdownContainer.innerHTML = '';

    try {
      let markdownText = state.cache.get(docPath);

      if (!markdownText) {
        const fetchUrl = resolveStaticAssetUrl(docPath);
        const res = await fetch(fetchUrl);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: Không tìm thấy file "${docPath}"`);
        }
        markdownText = await res.text();
        state.cache.set(docPath, markdownText);
      }

      renderMarkdown(markdownText, docPath, targetAnchor);
    } catch (err) {
      DOM.loadingState.style.display = 'none';
      DOM.errorState.style.display = 'flex';
      DOM.errorMessage.textContent = err.message || 'Lỗi không xác định khi tải tài liệu';
      DOM.docTitle.textContent = 'Lỗi nạp tài liệu';
    }
  }

  function renderMarkdown(markdown, docPath, targetAnchor = '') {
    const docDir = docPath.includes('/') ? docPath.substring(0, docPath.lastIndexOf('/')) : '';

    // Extract first H1 heading as document title if present
    const h1Match = markdown.match(/^#\s+(.+)$/m);
    if (h1Match) {
      const cleanTitle = h1Match[1].replace(/\[(.*?)\]\(.*?\)/g, '$1').replace(/[*`_]/g, '');
      DOM.docTitle.textContent = cleanTitle;
    } else {
      const fallback = state.manifest.find(d => d.path === docPath);
      DOM.docTitle.textContent = fallback ? fallback.title : docPath.split('/').pop();
    }

    // Configure Marked
    if (window.marked) {
      marked.setOptions({
        gfm: true,
        breaks: false
      });
    }

    // Parse Markdown to HTML
    const rawHtml = window.marked ? marked.parse(markdown) : `<pre>${escapeHtml(markdown)}</pre>`;
    DOM.markdownContainer.innerHTML = rawHtml;

    // Post-Processing Transformers
    resolveImageAndMediaPaths(DOM.markdownContainer, docDir);
    interceptInternalLinks(DOM.markdownContainer, docDir);
    transformAlerts(DOM.markdownContainer);
    setupCodeBlocksWithCopy(DOM.markdownContainer);
    generateHeadingsAndTOC(DOM.markdownContainer, targetAnchor);
    renderMermaidDiagrams(DOM.markdownContainer);

    DOM.loadingState.style.display = 'none';

    // Scroll to target anchor if requested, otherwise top
    if (targetAnchor) {
      scrollToAnchor(targetAnchor);
    } else {
      DOM.contentArea.scrollTop = 0;
    }
  }

  /* ==========================================================================
     Path Resolvers (Links, Images, Anchors)
     ========================================================================== */

  function resolveImageAndMediaPaths(container, docDir) {
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      const rawSrc = img.getAttribute('src');
      if (!rawSrc) return;

      // Skip external or inline data images
      if (/^(https?:|\/\/|data:|blob:)/i.test(rawSrc)) {
        return;
      }

      const resolvedRelPath = resolveRelativePath(docDir, rawSrc);
      const finalUrl = resolveStaticAssetUrl(resolvedRelPath);
      img.src = finalUrl;

      // Lightbox click handler
      img.addEventListener('click', () => {
        openLightbox(finalUrl, img.getAttribute('alt') || '');
      });

      // Handle image load error gracefully
      img.addEventListener('error', () => {
        img.style.border = '2px dashed #da3633';
        img.title = `Không thể nạp ảnh từ: ${finalUrl}`;
      });
    });
  }

  function interceptInternalLinks(container, docDir) {
    const links = container.querySelectorAll('a');
    links.forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;

      // Case 1: In-page anchor link (#section)
      if (href.startsWith('#')) {
        a.addEventListener('click', (e) => {
          e.preventDefault();
          const targetSlug = href.substring(1);
          scrollToAnchor(targetSlug);
          history.pushState(null, '', `#${state.currentDocPath}#${targetSlug}`);
        });
        return;
      }

      // Case 2: External Link (http/https/mailto)
      if (/^(https?:|\/\/|mailto:|tel:)/i.test(href)) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        return;
      }

      // Case 3: Relative Markdown Link (.md)
      const [pathPart, anchorPart] = href.split('#');
      if (pathPart.toLowerCase().endsWith('.md') || pathPart.endsWith('/')) {
        const resolvedDocPath = resolveRelativePath(docDir, pathPart);

        a.href = `#${resolvedDocPath}${anchorPart ? '#' + anchorPart : ''}`;
        a.addEventListener('click', (e) => {
          e.preventDefault();
          navigateTo(resolvedDocPath, anchorPart || '');
        });
      }
    });
  }

  /* ==========================================================================
     GitHub Style Alert Callouts
     ========================================================================== */

  function transformAlerts(container) {
    const blockquotes = container.querySelectorAll('blockquote');
    const alertIcons = {
      note: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>`,
      tip: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.604-.72-1.396-1.664-1.396-3.279C2.7 1.77 4.9 0 8 0s5.3 1.77 5.3 4.25c0 1.615-.792 2.56-1.396 3.28a8.456 8.456 0 0 0-.542.68c-.207.3-.33.565-.37.847a.75.75 0 0 1-1.484-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM6 11.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Zm.75 2.25a.75.75 0 0 0 0 1.5h2.5a.75.75 0 0 0 0-1.5h-2.5Z"></path></svg>`,
      important: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H9.06l-2.573 2.573A1.458 1.458 0 0 1 4 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`,
      warning: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`,
      caution: `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.47.047A1.75 1.75 0 0 1 5.71 0h4.58c.464 0 .909.184 1.237.513l3.96 3.96c.329.328.513.773.513 1.237v4.58c0 .464-.184.909-.513 1.237l-3.96 3.96a1.75 1.75 0 0 1-1.237.513H5.71a1.75 1.75 0 0 1-1.237-.513l-3.96-3.96A1.75 1.75 0 0 1 0 10.29V5.71c0-.464.184-.909.513-1.237l3.96-3.96ZM5.71 1.5a.25.25 0 0 0-.177.073L1.573 5.534a.25.25 0 0 0-.073.176v4.58c0 .066.026.13.073.177l3.96 3.96c.047.047.111.073.177.073h4.58a.25.25 0 0 0 .177-.073l3.96-3.96a.25.25 0 0 0 .073-.177V5.71a.25.25 0 0 0-.073-.177L9.884 1.573A.25.25 0 0 0 9.707 1.5Zm2.79 3.25v3.5a.75.75 0 0 1-1.5 0v-3.5a.75.75 0 0 1 1.5 0ZM9 10.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>`
    };

    blockquotes.forEach(bq => {
      const firstP = bq.querySelector('p');
      if (!firstP) return;

      const match = firstP.innerHTML.match(/^\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(<br\s*\/?>)?\s*/i);
      if (match) {
        const type = match[1].toLowerCase();
        firstP.innerHTML = firstP.innerHTML.replace(match[0], '');
        bq.classList.add('gh-alert', `gh-alert-${type}`);

        const titleDiv = document.createElement('div');
        titleDiv.className = 'gh-alert-title';
        titleDiv.innerHTML = `${alertIcons[type] || ''} <span>${type.toUpperCase()}</span>`;
        bq.insertBefore(titleDiv, bq.firstChild);
      }
    });
  }

  /* ==========================================================================
     Code Highlighting & Copy Button
     ========================================================================== */

  function setupCodeBlocksWithCopy(container) {
    const preBlocks = container.querySelectorAll('pre');
    preBlocks.forEach(pre => {
      const code = pre.querySelector('code');
      if (!code) return;

      // Skip mermaid blocks (they get replaced with SVG)
      if (code.classList.contains('language-mermaid')) {
        return;
      }

      // Wrap in wrapper for copy button positioning
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';
      pre.parentNode.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);

      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-code-btn';
      copyBtn.textContent = 'Copy';

      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(code.textContent);
          copyBtn.textContent = 'Copied!';
          copyBtn.style.background = '#238636';
          setTimeout(() => {
            copyBtn.textContent = 'Copy';
            copyBtn.style.background = '';
          }, 2000);
        } catch (err) {
          copyBtn.textContent = 'Failed';
        }
      });

      wrapper.appendChild(copyBtn);
    });

    // Run Prism highlighting
    if (window.Prism) {
      Prism.highlightAllUnder(container);
    }
  }

  /* ==========================================================================
     Mermaid Diagrams Engine
     ========================================================================== */

  async function renderMermaidDiagrams(container) {
    const mermaidCodes = container.querySelectorAll('pre code.language-mermaid, div.mermaid');
    if (mermaidCodes.length === 0) return;

    mermaidCodes.forEach(codeEl => {
      let codeText = codeEl.textContent;
      const pre = codeEl.closest('pre') || codeEl;

      const wrapper = document.createElement('div');
      wrapper.className = 'mermaid-wrapper';

      const mDiv = document.createElement('div');
      mDiv.className = 'mermaid';
      mDiv.textContent = codeText;

      wrapper.appendChild(mDiv);
      pre.replaceWith(wrapper);
    });

    if (window.mermaid) {
      try {
        await mermaid.run({
          nodes: container.querySelectorAll('.mermaid')
        });
      } catch (err) {
        console.warn('Mermaid rendering error:', err);
      }
    }
  }

  /* ==========================================================================
     Table of Contents (TOC) & Anchors
     ========================================================================== */

  function generateHeadingsAndTOC(container, targetAnchor) {
    const headings = container.querySelectorAll('h1, h2, h3, h4');
    const tocItems = [];

    headings.forEach((heading, idx) => {
      let id = heading.id || slugify(heading.textContent);
      if (!id) id = `heading-${idx}`;
      heading.id = id;

      // Add to TOC (skip H1 as it represents main doc title)
      const tagName = heading.tagName.toLowerCase();
      if (tagName !== 'h1') {
        tocItems.push({
          id: id,
          title: heading.textContent.trim(),
          level: tagName
        });
      }
    });

    if (tocItems.length === 0) {
      DOM.tocNav.innerHTML = '<p class="toc-empty">Không có mục con</p>';
      return;
    }

    const tocHtml = tocItems.map(item => `
      <a class="toc-link toc-${item.level}" href="#${item.id}" data-anchor="${item.id}" title="${escapeHtml(item.title)}">
        ${escapeHtml(item.title)}
      </a>
    `).join('');

    DOM.tocNav.innerHTML = tocHtml;

    DOM.tocNav.querySelectorAll('.toc-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const anchor = link.getAttribute('data-anchor');
        scrollToAnchor(anchor);
        history.pushState(null, '', `#${state.currentDocPath}#${anchor}`);
      });
    });
  }

  function scrollToAnchor(anchorId) {
    if (!anchorId) return;
    const target = document.getElementById(anchorId) ||
                   document.getElementById(decodeURIComponent(anchorId)) ||
                   document.querySelector(`[name="${anchorId}"]`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /* ==========================================================================
     Breadcrumb & Header Meta
     ========================================================================== */

  function updateBreadcrumb(docPath) {
    const parts = docPath.split('/');
    const cat = parts[0] || 'doc';

    DOM.docCategory.textContent = cat.toUpperCase();
    DOM.docCategory.className = `category-pill cat-${cat}`;
    DOM.docPathDisplay.textContent = docPath;

    let breadcrumbHtml = `<span class="breadcrumb-item">${cat}</span>`;
    for (let i = 1; i < parts.length; i++) {
      const isLast = i === parts.length - 1;
      breadcrumbHtml += `
        <span class="breadcrumb-sep">/</span>
        <span class="breadcrumb-item ${isLast ? 'active' : ''}">${parts[i]}</span>
      `;
    }
    DOM.breadcrumb.innerHTML = breadcrumbHtml;
  }

  /* ==========================================================================
     Routing & Navigation
     ========================================================================== */

  function parseHashRoute() {
    let hash = window.location.hash.replace(/^#/, '');
    if (!hash) {
      return { path: 'release/README.md', anchor: '' };
    }

    // Support #path/to/file.md#anchor-name
    const secondHashIdx = hash.indexOf('#');
    if (secondHashIdx !== -1) {
      return {
        path: hash.substring(0, secondHashIdx),
        anchor: hash.substring(secondHashIdx + 1)
      };
    }
    return { path: hash, anchor: '' };
  }

  function navigateTo(path, anchor = '') {
    const fullHash = `#${path}${anchor ? '#' + anchor : ''}`;
    if (window.location.hash === fullHash) {
      loadDocument(path, anchor);
    } else {
      window.location.hash = fullHash;
    }
  }

  window.addEventListener('hashchange', () => {
    const route = parseHashRoute();
    loadDocument(route.path, route.anchor);
  });

  /* ==========================================================================
     Image Lightbox Modal
     ========================================================================== */

  function openLightbox(src, alt) {
    DOM.modalImg.src = src;
    DOM.modalCaption.textContent = alt;
    DOM.imageModal.style.display = 'flex';
  }

  function closeLightbox() {
    DOM.imageModal.style.display = 'none';
    DOM.modalImg.src = '';
  }

  DOM.modalClose.addEventListener('click', closeLightbox);
  DOM.imageModal.addEventListener('click', (e) => {
    if (e.target === DOM.imageModal) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === '/' && document.activeElement !== DOM.globalSearch) {
      e.preventDefault();
      DOM.globalSearch.focus();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
      e.preventDefault();
      DOM.sidebar.classList.toggle('collapsed');
    }
  });

  /* ==========================================================================
     UI Event Handlers
     ========================================================================== */

  DOM.toggleSidebarBtn.addEventListener('click', () => {
    if (window.innerWidth <= 768) {
      DOM.sidebar.classList.toggle('open');
    } else {
      DOM.sidebar.classList.toggle('collapsed');
    }
  });

  DOM.toggleTocBtn.addEventListener('click', () => {
    if (window.innerWidth <= 1100) {
      DOM.tocSidebar.classList.toggle('open');
    } else {
      DOM.tocSidebar.classList.toggle('collapsed');
    }
  });

  // Category filter tabs
  DOM.categoryTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.categoryTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeCategory = btn.getAttribute('data-cat') || 'all';
      renderFileTree();
    });
  });

  // Global search input
  DOM.globalSearch.addEventListener('input', (e) => {
    state.searchQuery = e.target.value.trim();
    renderFileTree();
  });

  // Back to top button
  DOM.contentArea.addEventListener('scroll', () => {
    if (DOM.contentArea.scrollTop > 300) {
      DOM.backToTopBtn.classList.add('visible');
    } else {
      DOM.backToTopBtn.classList.remove('visible');
    }
  });

  DOM.backToTopBtn.addEventListener('click', () => {
    DOM.contentArea.scrollTo({ top: 0, behavior: 'smooth' });
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  async function init() {
    initTheme();
    await loadManifest();

    const initialRoute = parseHashRoute();
    loadDocument(initialRoute.path, initialRoute.anchor);
  }

  // Launch when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
