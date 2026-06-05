/* ─── stack.js — My Stack page: add, delete, filter, render ── */

const CATEGORY_STYLES = {
  'General AI Chat':       { color: '#7c6dfa', bg: '#2a2550', label: 'General AI' },
  'Coding Assistant':      { color: '#3b82f6', bg: '#0e1e3d', label: 'Coding' },
  'Writing & Content':     { color: '#00d4aa', bg: '#0a3330', label: 'Writing' },
  'Image Generation':      { color: '#ec4899', bg: '#3d0a24', label: 'Image Gen' },
  'Video Creation':        { color: '#f97316', bg: '#3d1a06', label: 'Video' },
  'Audio & Transcription': { color: '#f59e0b', bg: '#3a2800', label: 'Audio' },
  'Research & Search':     { color: '#06b6d4', bg: '#062830', label: 'Research' },
  'Productivity & Notes':  { color: '#22c55e', bg: '#0a2818', label: 'Productivity' },
  'SEO & Marketing':       { color: '#f43f5e', bg: '#3a0a15', label: 'SEO' },
  'Data & Analytics':      { color: '#a78bfa', bg: '#200d40', label: 'Data' },
  'Other':                 { color: '#606080', bg: '#1a1a26', label: 'Other' },
};

function getCatStyle(cat) {
  return CATEGORY_STYLES[cat] || CATEGORY_STYLES['Other'];
}

function formatCost(cost) {
  const n = parseFloat(cost);
  if (!n || n === 0) return 'free';
  return '$' + (n % 1 === 0 ? n : n.toFixed(2)) + '/mo';
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

/* ── Add Tool Modal ── */
function openAddToolModal() {
  document.getElementById('tool-name').value     = '';
  document.getElementById('tool-cost').value     = '';
  document.getElementById('tool-category').value = '';
  document.getElementById('tool-usecase').value  = '';
  document.getElementById('tool-website').value  = '';
  document.getElementById('add-tool-error').style.display = 'none';
  document.getElementById('addToolModalTitle').textContent = 'Add Tool to Stack';
  document.getElementById('addToolModal').classList.add('open');
  setTimeout(() => document.getElementById('tool-name').focus(), 50);
}

function closeAddToolModal() {
  document.getElementById('addToolModal').classList.remove('open');
}

function saveToolToStack() {
  const name    = document.getElementById('tool-name').value.trim();
  const cost    = document.getElementById('tool-cost').value;
  const cat     = document.getElementById('tool-category').value;
  const usecase = document.getElementById('tool-usecase').value.trim();
  const website = document.getElementById('tool-website').value.trim();
  const errEl   = document.getElementById('add-tool-error');

  if (!name || !cat || !usecase) {
    errEl.textContent = 'Please fill in Tool Name, Category, and Use Case.';
    errEl.style.display = 'block';
    return;
  }

  errEl.style.display = 'none';

  STATE.stack.push({
    id:       Date.now(),
    name,
    cost:     parseFloat(cost) || 0,
    category: cat,
    useCase:  usecase,
    website:  website || '',
    features: [],
    tier:     'Primary',
    addedAt:  new Date().toISOString(),
  });

  localStorage.setItem('aiHub_stack', JSON.stringify(STATE.stack));
  closeAddToolModal();
  renderStack();
  refreshStats();
  logActivity(`Added <strong>${name}</strong> to stack`, 'purple');
}

/* ── Delete ── */
function confirmDeleteTool(id) {
  const card = document.querySelector(`.tool-card[data-id="${id}"]`);
  if (card) card.querySelector('.delete-confirm').classList.add('show');
}

function cancelDeleteTool(id) {
  const card = document.querySelector(`.tool-card[data-id="${id}"]`);
  if (card) card.querySelector('.delete-confirm').classList.remove('show');
}

function deleteTool(id) {
  const tool = STATE.stack.find(t => t.id === id);
  if (!tool) return;
  STATE.stack = STATE.stack.filter(t => t.id !== id);
  localStorage.setItem('aiHub_stack', JSON.stringify(STATE.stack));
  renderStack();
  refreshStats();
  logActivity(`Removed <strong>${tool.name}</strong> from stack`, 'amber');
}

/* ── Filter / Sort ── */
function filterStack() { renderStack(); }

function getFilteredStack() {
  const cat  = document.getElementById('stack-filter')?.value || 'all';
  const sort = document.getElementById('stack-sort')?.value   || 'newest';
  let tools  = [...STATE.stack];
  if (cat !== 'all') tools = tools.filter(t => t.category === cat);
  switch (sort) {
    case 'newest':    tools.sort((a,b) => b.id - a.id); break;
    case 'oldest':    tools.sort((a,b) => a.id - b.id); break;
    case 'cost-high': tools.sort((a,b) => b.cost - a.cost); break;
    case 'cost-low':  tools.sort((a,b) => a.cost - b.cost); break;
    case 'name':      tools.sort((a,b) => a.name.localeCompare(b.name)); break;
  }
  return tools;
}

/* ── Render ── */
function renderStack() {
  const grid  = document.getElementById('stack-grid');
  const tools = getFilteredStack();
  const total = STATE.stack.reduce((s,t) => s + (t.cost || 0), 0);
  const fmt   = n => '$' + (n % 1 === 0 ? n : n.toFixed(2));

  document.getElementById('stack-visible-count').textContent  = tools.length;
  document.getElementById('stack-total-tools').textContent    = STATE.stack.length;
  document.getElementById('stack-monthly-total').textContent  = fmt(total);
  document.getElementById('stack-yearly-total').textContent   = fmt(total * 12);

  if (STATE.stack.length === 0) {
    grid.innerHTML = `
      <div class="stack-empty">
        <div class="big-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <rect x="2" y="3" width="20" height="4" rx="1"/>
            <rect x="2" y="10" width="20" height="4" rx="1"/>
            <rect x="2" y="17" width="20" height="4" rx="1"/>
          </svg>
        </div>
        <h3>Your stack is empty</h3>
        <p>Add the AI tools you use — track what they cost and what you use them for.</p>
        <button class="btn btn-primary" onclick="openAddToolModal()">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          Add Your First Tool
        </button>
      </div>`;
    return;
  }

  if (tools.length === 0) {
    grid.innerHTML = `<div class="stack-empty"><p style="color:var(--text-dim)">No tools match this filter.</p></div>`;
    return;
  }

  grid.innerHTML = `<div class="tool-grid">` + tools.map(t => {
    const style  = getCatStyle(t.category);
    const isFree = !t.cost || t.cost === 0;
    const footer = t.website
      ? `<a href="https://${t.website.replace(/^https?:\/\//,'')}" target="_blank" rel="noopener"
           style="font-size:11px;color:var(--accent-lt);text-decoration:none;"
           onclick="event.stopPropagation()">${t.website.replace(/^https?:\/\//,'').replace(/\/$/,'')}</a>`
      : `<span style="font-size:10px;color:var(--text-dim)">Added ${formatDate(t.addedAt)}</span>`;

    const featuresHTML = t.features && t.features.length
      ? `<div class="tool-features">
          ${t.features.slice(0,4).map(f => `<span class="feature-tag">${f}</span>`).join('')}
         </div>`
      : '';

    const tier      = t.tier || 'Primary';
    const tierClass = 'tier-' + tier.toLowerCase();

    return `
      <div class="tool-card" data-id="${t.id}">
        <div class="tool-card-accent" style="background:${style.color}"></div>
        <div class="tool-card-body">
          <div class="tool-card-top">
            <div class="tool-name">${t.name}</div>
            <div class="tool-cost${isFree ? ' free' : ''}">${isFree ? 'Free' : formatCost(t.cost)}</div>
          </div>
          <div class="tool-meta">
            <span class="cat-badge" style="background:${style.bg};color:${style.color}">${style.label}</span>
            <span class="tier-badge ${tierClass}" onclick="setTier(${t.id})" title="Click to change tier">${tier}</span>
          </div>
          <div class="tool-use-case">${t.useCase}</div>
          ${featuresHTML}
        </div>
        <div class="tool-card-footer">
          ${footer}
          <div class="tool-actions">
            <button class="tool-btn" onclick="openAlternatives(${t.id})" title="Find alternatives">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
              </svg>
            </button>
            <button class="tool-btn delete" onclick="confirmDeleteTool(${t.id})" title="Remove">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="delete-confirm">
          <p>Remove <span>${t.name}</span> from your stack?</p>
          <div class="delete-confirm-actions">
            <button class="btn btn-ghost" style="font-size:12px;padding:6px 12px" onclick="cancelDeleteTool(${t.id})">Cancel</button>
            <button class="btn btn-danger" onclick="deleteTool(${t.id})">Remove</button>
          </div>
        </div>
      </div>`;
  }).join('') + `</div>`;
}

/* ── Tier ── */
function setTier(id) {
  const tool = STATE.stack.find(t => t.id === id);
  if (!tool) return;
  const tiers = ['Primary', 'Secondary', 'Evaluating'];
  const cur   = tiers.indexOf(tool.tier || 'Primary');
  tool.tier   = tiers[(cur + 1) % tiers.length];
  localStorage.setItem('aiHub_stack', JSON.stringify(STATE.stack));
  renderStack();
}

/* ── Export ── */
function exportStack() {
  if (STATE.stack.length === 0) {
    alert('Your stack is empty — nothing to export.');
    return;
  }
  const blob = new Blob([JSON.stringify(STATE.stack, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = 'ai-stack-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click();
  URL.revokeObjectURL(url);
  logActivity('Exported stack as JSON', 'teal');
}

/* ── Import ── */
function importStack(event) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = '';

  const reader = new FileReader();
  reader.onload = function(e) {
    let parsed;
    try { parsed = JSON.parse(e.target.result); }
    catch { alert('Invalid JSON file. Please use a file exported from Central Hub For AI.'); return; }

    if (!Array.isArray(parsed)) { alert('Invalid format — expected an array of tools.'); return; }

    const valid = parsed.filter(t => t && typeof t.name === 'string' && t.name.trim());
    if (valid.length === 0) { alert('No valid tools found in the file.'); return; }

    const msg = STATE.stack.length > 0
      ? `This will replace your ${STATE.stack.length} current tool${STATE.stack.length !== 1 ? 's' : ''} with ${valid.length} imported tool${valid.length !== 1 ? 's' : ''}. Continue?`
      : `Import ${valid.length} tool${valid.length !== 1 ? 's' : ''}?`;
    if (!confirm(msg)) return;

    STATE.stack = valid.map(t => ({
      id:        t.id        || Date.now() + Math.random(),
      catalogId: t.catalogId || undefined,
      name:      t.name.trim(),
      cost:      parseFloat(t.cost) || 0,
      category:  t.category || 'Other',
      useCase:   t.useCase  || '',
      website:   t.website  || '',
      features:  Array.isArray(t.features) ? t.features : [],
      tier:      t.tier     || 'Primary',
      addedAt:   t.addedAt  || new Date().toISOString(),
    }));

    localStorage.setItem('aiHub_stack', JSON.stringify(STATE.stack));
    renderStack();
    refreshStats();
    logActivity(`Imported ${valid.length} tool${valid.length !== 1 ? 's' : ''} from file`, 'teal');
  };
  reader.readAsText(file);
}

/* ── Alternative Finder ── */
function openAlternatives(toolId) {
  const tool = STATE.stack.find(t => t.id === toolId);
  if (!tool) return;

  const alts = CATALOG
    .filter(c => c.category === tool.category && !isInStack(c.id))
    .sort((a, b) => (a.cost || 0) - (b.cost || 0))
    .slice(0, 6);

  document.getElementById('altModalTitle').textContent = `Alternatives to ${tool.name}`;
  document.getElementById('altModalSub').textContent   = `${tool.category} tools not currently in your stack`;

  const body = document.getElementById('alt-list-body');

  if (alts.length === 0) {
    body.innerHTML = `<div class="alt-empty">All <strong>${tool.category}</strong> tools in the catalog are already in your stack.</div>`;
  } else {
    body.innerHTML = `<div class="alt-list">` + alts.map(c => {
      const isFree = !c.cost || c.cost === 0;
      return `
        <div class="alt-item">
          <div class="alt-item-info">
            <div class="alt-item-name">${c.name}</div>
            <div class="alt-item-cost">${isFree ? 'Free' : c.costLabel}</div>
            <div class="alt-item-desc">${c.description}</div>
          </div>
          <button class="btn btn-add-catalog" style="font-size:11px;padding:5px 11px;flex-shrink:0"
            onclick="addFromAlternativesModal('${c.id}')">
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:12px;height:12px">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Add
          </button>
        </div>`;
    }).join('') + `</div>`;
  }

  document.getElementById('alternativesModal').classList.add('open');
}

function closeAlternativesModal() {
  document.getElementById('alternativesModal').classList.remove('open');
}

function addFromAlternativesModal(catalogId) {
  const tool = CATALOG.find(t => t.id === catalogId);
  if (!tool || isInStack(catalogId)) return;

  STATE.stack.push({
    id:        Date.now(),
    catalogId: tool.id,
    name:      tool.name,
    cost:      tool.cost,
    category:  tool.category,
    useCase:   tool.description,
    website:   tool.website  || '',
    features:  tool.features || [],
    tier:      'Primary',
    addedAt:   new Date().toISOString(),
  });

  localStorage.setItem('aiHub_stack', JSON.stringify(STATE.stack));
  refreshStats();
  renderStack();
  logActivity(`Added <strong>${tool.name}</strong> from alternatives`, 'teal');
  closeAlternativesModal();
}

/* ── Init ── */
renderStack();
