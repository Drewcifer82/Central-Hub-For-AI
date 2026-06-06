/* ─── promptlibrary.js — Prompt Library UI ── */

let _plInitialized = false;
let _plQuery = '';

function initPromptLibrary() {
  if (_plInitialized) {
    _plFilterAndRender();
    return;
  }
  _plInitialized = true;

  const searchEl = document.getElementById('pl-search');
  if (searchEl) {
    searchEl.addEventListener('input', function () {
      _plQuery = this.value.trim().toLowerCase();
      _plFilterAndRender();
    });
  }

  _plFilterAndRender();
}

function _plFilterAndRender() {
  const container = document.getElementById('pl-categories');
  if (!container) return;

  const q = _plQuery;

  const filtered = PROMPT_LIBRARY.map(group => {
    if (!q) return group;
    const matchingTools = group.tools.map(tool => {
      const toolMatch = tool.name.toLowerCase().includes(q);
      const matchingPrompts = tool.prompts.filter(p =>
        p.title.toLowerCase().includes(q) || p.text.toLowerCase().includes(q)
      );
      if (toolMatch) return tool;
      if (matchingPrompts.length) return { ...tool, prompts: matchingPrompts };
      return null;
    }).filter(Boolean);

    if (!matchingTools.length && !group.category.toLowerCase().includes(q)) return null;
    return { ...group, tools: matchingTools.length ? matchingTools : group.tools };
  }).filter(Boolean);

  if (!filtered.length) {
    container.innerHTML = `
      <div class="pl-empty">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <p>No prompts found for "<strong>${_escHtml(q)}</strong>"</p>
      </div>`;
    return;
  }

  container.innerHTML = filtered.map(group => _plRenderGroup(group, !!q)).join('');
}

function _plRenderGroup(group, forceOpen) {
  const colorClass = group.color || 'purple';
  const totalPrompts = group.tools.reduce((n, t) => n + t.prompts.length, 0);
  const isOpen = forceOpen;

  return `
    <div class="pl-group" id="plg-${group.id}">
      <button class="pl-group-header ${isOpen ? 'open' : ''}" onclick="_plToggleGroup('${group.id}')">
        <span class="pl-group-icon ${colorClass}">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            ${group.icon}
          </svg>
        </span>
        <span class="pl-group-title">${group.category}</span>
        <span class="pl-group-meta">${group.tools.length} tools · ${totalPrompts} prompts</span>
        <span class="pl-group-chevron">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6"/>
          </svg>
        </span>
      </button>
      <div class="pl-group-body ${isOpen ? 'open' : ''}">
        ${group.tools.map(tool => _plRenderTool(tool, group.color)).join('')}
      </div>
    </div>`;
}

function _plRenderTool(tool, color) {
  return `
    <div class="pl-tool-section">
      <div class="pl-tool-name">
        <span class="pl-tool-dot ${color || 'purple'}"></span>
        ${tool.name}
      </div>
      <div class="pl-prompts">
        ${tool.prompts.map((p, i) => _plRenderPrompt(p, tool.name, i)).join('')}
      </div>
    </div>`;
}

function _plRenderPrompt(prompt, toolName, idx) {
  const id = `plp-${toolName.replace(/\s+/g, '-').toLowerCase()}-${idx}`;
  return `
    <div class="pl-prompt-card" id="${id}">
      <div class="pl-prompt-top">
        <div class="pl-prompt-title">${prompt.title}</div>
        <button class="pl-copy-btn" onclick="_plCopy('${id}', this)" title="Copy prompt">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <span>Copy</span>
        </button>
      </div>
      <div class="pl-prompt-text">${_escHtml(prompt.text)}</div>
    </div>`;
}

function _plToggleGroup(id) {
  const header = document.querySelector(`#plg-${id} .pl-group-header`);
  const body   = document.querySelector(`#plg-${id} .pl-group-body`);
  if (!header || !body) return;
  const isOpen = header.classList.contains('open');
  header.classList.toggle('open', !isOpen);
  body.classList.toggle('open', !isOpen);
}

function _plCopy(cardId, btn) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const textEl = card.querySelector('.pl-prompt-text');
  if (!textEl) return;

  navigator.clipboard.writeText(textEl.innerText).then(() => {
    const span = btn.querySelector('span');
    const svg  = btn.querySelector('svg');
    span.textContent = 'Copied!';
    svg.innerHTML = `<path d="M20 6L9 17l-5-5"/>`;
    btn.classList.add('copied');
    setTimeout(() => {
      span.textContent = 'Copy';
      svg.innerHTML = `<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>`;
      btn.classList.remove('copied');
    }, 2000);
  });
}

function _escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
