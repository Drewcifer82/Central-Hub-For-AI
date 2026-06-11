/* ─── share.js — shareable stack links ─────────────────────────
   Encodes the user's stack into a compact ?stack= URL parameter.
   Catalog tools travel as their id; custom tools as {n, m, g}
   (name, monthly cost, category). On load, a ?stack= param opens
   an import modal so the recipient can merge the shared stack. */

const SHARE_VERSION = 1;

/* base64url helpers (unicode-safe) */
function _shareEncode(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function _shareDecode(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return JSON.parse(decodeURIComponent(escape(atob(b64))));
}

/* ── Build & open share modal ── */
function buildShareUrl() {
  const tools = STATE.stack.map(t =>
    t.catalogId && CATALOG.some(c => c.id === t.catalogId)
      ? t.catalogId
      : { n: t.name, m: parseFloat(t.cost) || 0, g: t.category || 'Other' }
  );
  return location.origin + location.pathname + '?stack=' +
    _shareEncode({ v: SHARE_VERSION, t: tools });
}

function shareText() {
  const count = STATE.stack.length;
  const spend = STATE.stack.reduce((s, t) => s + (parseFloat(t.cost) || 0), 0);
  const cost  = spend > 0 ? `$${spend % 1 === 0 ? spend : spend.toFixed(2)}/mo` : 'all free';
  return `My AI stack: ${count} tool${count !== 1 ? 's' : ''}, ${cost} — built with Central Hub For AI`;
}

function openShareStackModal() {
  if (STATE.stack.length === 0) {
    alert('Your stack is empty — add some tools before sharing.');
    return;
  }
  const url = buildShareUrl();
  document.getElementById('share-link-input').value = url;
  document.getElementById('share-modal-sub').textContent = shareText();

  const text = encodeURIComponent(shareText());
  const link = encodeURIComponent(url);
  document.getElementById('share-x').href        = `https://twitter.com/intent/tweet?text=${text}&url=${link}`;
  document.getElementById('share-reddit').href   = `https://www.reddit.com/submit?url=${link}&title=${text}`;
  document.getElementById('share-linkedin').href = `https://www.linkedin.com/sharing/share-offsite/?url=${link}`;

  const btn = document.getElementById('share-copy-btn');
  btn.textContent = 'Copy Link';
  document.getElementById('shareStackModal').classList.add('open');
}

function closeShareStackModal() {
  document.getElementById('shareStackModal').classList.remove('open');
}

function copyShareLink() {
  const input = document.getElementById('share-link-input');
  const done = () => {
    const btn = document.getElementById('share-copy-btn');
    btn.textContent = '✓ Copied!';
    setTimeout(() => { btn.textContent = 'Copy Link'; }, 2000);
    logActivity('Copied stack share link', 'teal');
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(input.value).then(done).catch(() => {
      input.select(); document.execCommand('copy'); done();
    });
  } else {
    input.select(); document.execCommand('copy'); done();
  }
}

/* ── Receive a shared stack ── */
function _sharedEntryToTool(entry) {
  if (typeof entry === 'string') {
    const c = CATALOG.find(t => t.id === entry);
    if (!c) return null;
    return {
      catalogId: c.id, name: c.name, cost: c.cost, category: c.category,
      useCase: c.description, website: c.website || '', features: c.features || [],
    };
  }
  if (entry && typeof entry.n === 'string' && entry.n.trim()) {
    return {
      catalogId: undefined, name: entry.n.trim().slice(0, 60),
      cost: parseFloat(entry.m) || 0, category: typeof entry.g === 'string' ? entry.g.slice(0, 40) : 'Other',
      useCase: '', website: '', features: [],
    };
  }
  return null;
}

function checkForSharedStack() {
  const param = new URLSearchParams(location.search).get('stack');
  if (!param) return;
  /* Clean the URL either way so refreshes don't re-trigger */
  history.replaceState({}, '', location.pathname);

  let payload;
  try { payload = _shareDecode(param); } catch { return; }
  if (!payload || !Array.isArray(payload.t)) return;

  const tools = payload.t.map(_sharedEntryToTool).filter(Boolean);
  if (tools.length === 0) return;

  window._pendingSharedStack = tools;

  const spend = tools.reduce((s, t) => s + (t.cost || 0), 0);
  document.getElementById('shared-import-sub').textContent =
    `${tools.length} tool${tools.length !== 1 ? 's' : ''} · ${spend > 0 ? '$' + (spend % 1 === 0 ? spend : spend.toFixed(2)) + '/mo' : 'all free'}`;

  const inStack = new Set(STATE.stack.map(t => t.name.toLowerCase()));
  document.getElementById('shared-import-list').innerHTML = tools.map(t => {
    const cs  = getCatStyle(t.category);
    const dup = inStack.has(t.name.toLowerCase());
    return `<span class="scmp-chip" style="background:${cs.bg};color:${cs.color};border-color:${cs.color}44;${dup ? 'opacity:.45' : ''}"
      title="${dup ? 'Already in your stack' : t.category}">${t.name}${dup ? ' ✓' : ''}</span>`;
  }).join('');

  const newCount = tools.filter(t => !inStack.has(t.name.toLowerCase())).length;
  const btn = document.getElementById('shared-import-btn');
  if (newCount === 0) {
    btn.textContent = 'All of these are already in your stack';
    btn.disabled = true;
    btn.style.opacity = '0.5';
  } else {
    btn.textContent = `Add ${newCount} Tool${newCount !== 1 ? 's' : ''} to My Stack`;
    btn.disabled = false;
    btn.style.opacity = '';
  }

  document.getElementById('sharedImportModal').classList.add('open');
}

function importSharedStack() {
  const tools = window._pendingSharedStack || [];
  const inStack = new Set(STATE.stack.map(t => t.name.toLowerCase()));
  const fresh = tools.filter(t => !inStack.has(t.name.toLowerCase()));

  fresh.forEach((t, i) => {
    STATE.stack.push({
      id: Date.now() + i, ...t, tier: 'Primary', addedAt: new Date().toISOString(),
    });
  });

  localStorage.setItem('aiHub_stack', JSON.stringify(STATE.stack));
  refreshStats();
  renderStack();
  logActivity(`Imported <strong>${fresh.length} tool${fresh.length !== 1 ? 's' : ''}</strong> from a shared stack`, 'teal');
  closeSharedImportModal();
  navigate('stack');
}

function closeSharedImportModal() {
  window._pendingSharedStack = null;
  document.getElementById('sharedImportModal').classList.remove('open');
}

/* ── Init ── */
checkForSharedStack();
