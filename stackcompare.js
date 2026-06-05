/* ─── stackcompare.js — Stack Compare ── */

let _scmpTarget      = null;  // array of {name, cost, category}
let _scmpTargetLabel = '';

/* ── Init ── */
function initStackCompare() {
  _scmpRenderMyInfo();
  _scmpRenderResults();
}

function _scmpRenderMyInfo() {
  const el = document.getElementById('scmp-my-info');
  if (!el) return;
  const count = STATE.stack.length;
  const spend = STATE.stack.reduce((s, t) => s + (parseFloat(t.cost) || 0), 0);
  if (count === 0) {
    el.innerHTML = '<span style="color:var(--text-dim)">No tools in stack yet</span>';
  } else {
    el.innerHTML = `<strong style="color:var(--white)">${count}</strong> tool${count !== 1 ? 's' : ''} &nbsp;·&nbsp; <strong style="color:var(--teal)">$${spend > 0 ? (spend % 1 === 0 ? spend : spend.toFixed(2)) : 0}/mo</strong>`;
  }
}

/* ── Target Selection ── */
function handleScmpTargetSelect() {
  const val = document.getElementById('scmp-target-select').value;
  document.getElementById('scmp-import-label').style.display = 'none';

  if (!val) {
    _scmpTarget      = null;
    _scmpTargetLabel = '';
    _scmpRenderResults();
    return;
  }

  if (val === 'import') {
    document.getElementById('scmp-import-input').click();
    document.getElementById('scmp-target-select').value = '';
    return;
  }

  const tpl = STACK_TEMPLATES.find(t => t.id === val);
  if (!tpl) return;

  _scmpTargetLabel = tpl.name + ' Template';
  _scmpTarget = tpl.tools
    .map(id => CATALOG.find(c => c.id === id))
    .filter(Boolean)
    .map(t => ({ name: t.name, cost: t.cost || 0, category: t.category, catalogId: t.id }));
  _scmpRenderResults();
}

function handleScmpImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  event.target.value = '';

  const reader = new FileReader();
  reader.onload = function(e) {
    let parsed;
    try { parsed = JSON.parse(e.target.result); }
    catch { alert("Couldn't read that file — make sure it's a stack JSON exported from Central Hub For AI."); return; }

    if (!Array.isArray(parsed)) { alert('Invalid format — expected an array of tools.'); return; }

    const valid = parsed.filter(t => t && typeof t.name === 'string' && t.name.trim());
    if (valid.length === 0) { alert('No valid tools found in this file.'); return; }

    const shortName = file.name.replace(/\.json$/i, '');
    _scmpTargetLabel = shortName;
    _scmpTarget = valid.map(t => ({
      name:      t.name.trim(),
      cost:      parseFloat(t.cost) || 0,
      category:  t.category || 'Other',
      catalogId: t.catalogId || null,
    }));

    const lbl = document.getElementById('scmp-import-label');
    lbl.textContent = `"${shortName}" loaded — ${valid.length} tools`;
    lbl.style.display = 'block';
    _scmpRenderResults();
  };
  reader.readAsText(file);
}

/* ── Results ── */
function _scmpRenderResults() {
  const el = document.getElementById('scmp-results');
  if (!el) return;

  if (STATE.stack.length === 0) {
    el.innerHTML = _scmpEmptyState(
      'Your stack is empty',
      'Add tools to your stack first, then compare it against a template or a friend\'s exported stack.',
      `<button class="btn btn-ghost" onclick="navigate('stack')">Go to My Stack →</button>`
    );
    return;
  }

  if (!_scmpTarget) {
    el.innerHTML = _scmpEmptyState(
      'Choose a stack to compare against',
      'Pick one of the 5 built-in templates from the dropdown, or import a friend\'s exported stack JSON.',
      ''
    );
    return;
  }

  const myNames    = new Set(STATE.stack.map(t => t.name.toLowerCase()));
  const theirNames = new Set(_scmpTarget.map(t => t.name.toLowerCase()));

  const shared     = STATE.stack.filter(t => theirNames.has(t.name.toLowerCase()));
  const onlyMine   = STATE.stack.filter(t => !theirNames.has(t.name.toLowerCase()));
  const onlyTheirs = _scmpTarget.filter(t => !myNames.has(t.name.toLowerCase()));

  const myCost    = STATE.stack.reduce((s, t) => s + (parseFloat(t.cost) || 0), 0);
  const theirCost = _scmpTarget.reduce((s, t) => s + (t.cost || 0), 0);
  const diff      = myCost - theirCost;

  const pct = (n, total) => total > 0 ? Math.round((n / total) * 100) : 0;
  const totalUniq = shared.length + onlyMine.length + onlyTheirs.length;

  el.innerHTML = `
    <div class="scmp-stats-row">
      <div class="scmp-stat-card" style="border-color:var(--teal)44;background:var(--teal-dim)">
        <div class="scmp-stat-num" style="color:var(--teal)">${shared.length}</div>
        <div class="scmp-stat-label">Tools in common</div>
        <div class="scmp-stat-pct">${pct(shared.length, totalUniq)}% overlap</div>
      </div>
      <div class="scmp-stat-card" style="border-color:var(--accent)44;background:var(--accent-dim)">
        <div class="scmp-stat-num" style="color:var(--accent-lt)">${onlyMine.length}</div>
        <div class="scmp-stat-label">Only in your stack</div>
        <div class="scmp-stat-pct">Unique to you</div>
      </div>
      <div class="scmp-stat-card" style="border-color:var(--amber)44;background:var(--amber-dim)">
        <div class="scmp-stat-num" style="color:var(--amber)">${onlyTheirs.length}</div>
        <div class="scmp-stat-label">Only in ${_scmpTargetLabel}</div>
        <div class="scmp-stat-pct">Consider adding</div>
      </div>
    </div>

    <div class="scmp-cost-strip">
      <div class="scmp-cost-item">
        <div class="scmp-cost-label">Your Stack</div>
        <div class="scmp-cost-val">${myCost > 0 ? '$' + (myCost % 1 === 0 ? myCost : myCost.toFixed(2)) + '/mo' : 'All free'}</div>
      </div>
      <div class="scmp-vs-pill">VS</div>
      <div class="scmp-cost-item">
        <div class="scmp-cost-label">${_scmpTargetLabel}</div>
        <div class="scmp-cost-val">${theirCost > 0 ? '$' + (theirCost % 1 === 0 ? theirCost : theirCost.toFixed(2)) + '/mo' : 'All free'}</div>
      </div>
      ${diff !== 0 ? `
        <div style="margin-left:auto;font-size:12px;font-weight:700;padding:5px 12px;border-radius:20px;
          background:${diff > 0 ? 'var(--red-dim)' : 'var(--teal-dim)'};
          color:${diff > 0 ? 'var(--red)' : 'var(--teal)'}">
          ${diff > 0 ? '▲' : '▼'} $${Math.abs(diff % 1 === 0 ? diff : diff.toFixed(2))}/mo ${diff > 0 ? 'more' : 'less'}
        </div>` : `
        <div style="margin-left:auto;font-size:12px;color:var(--teal);font-weight:600">Same cost</div>`}
    </div>

    ${shared.length > 0 ? `
    <div class="scmp-section">
      <div class="scmp-section-header scmp-sh-shared">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:13px;height:13px;flex-shrink:0">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        In both stacks &nbsp;<span style="opacity:.6;font-weight:500">${shared.length} tool${shared.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="scmp-chip-row">${shared.map(t => _scmpChip(t, 'shared')).join('')}</div>
    </div>` : ''}

    ${onlyMine.length > 0 ? `
    <div class="scmp-section">
      <div class="scmp-section-header scmp-sh-mine">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:13px;height:13px;flex-shrink:0">
          <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
        </svg>
        Only in your stack &nbsp;<span style="opacity:.6;font-weight:500">${onlyMine.length} tool${onlyMine.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="scmp-chip-row">${onlyMine.map(t => _scmpChip(t, 'mine')).join('')}</div>
    </div>` : ''}

    ${onlyTheirs.length > 0 ? `
    <div class="scmp-section">
      <div class="scmp-section-header scmp-sh-theirs">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:13px;height:13px;flex-shrink:0">
          <path d="M12 4v16m8-8H4"/>
        </svg>
        Only in ${_scmpTargetLabel} — consider adding &nbsp;<span style="opacity:.6;font-weight:500">${onlyTheirs.length} tool${onlyTheirs.length !== 1 ? 's' : ''}</span>
      </div>
      <div class="scmp-chip-row">${onlyTheirs.map(t => _scmpTheirChip(t)).join('')}</div>
    </div>` : ''}`;

  logActivity(`Compared your stack vs <strong>${_scmpTargetLabel}</strong>`, 'purple');
}

function _scmpEmptyState(title, body, extra) {
  return `<div class="overlap-empty">
    <div class="overlap-empty-icon">
      <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
        <path d="M18 20V10M12 20V4M6 20v-6"/>
      </svg>
    </div>
    <h3>${title}</h3>
    <p>${body}</p>
    ${extra}
  </div>`;
}

function _scmpChip(t, type) {
  const cs = getCatStyle(t.category);
  return `<span class="scmp-chip scmp-chip-${type}"
    style="background:${cs.bg};color:${cs.color};border-color:${cs.color}44"
    title="${t.category}">${t.name}</span>`;
}

function _scmpTheirChip(t) {
  const cs         = getCatStyle(t.category);
  const catalogTool = CATALOG.find(c => c.name.toLowerCase() === t.name.toLowerCase());
  const addBtn = catalogTool && !isInStack(catalogTool.id)
    ? `<button onclick="scmpAddTool('${catalogTool.id}',event)"
        style="background:none;border:none;cursor:pointer;color:var(--teal);font-size:11px;
               padding:0 0 0 5px;font-family:inherit;font-weight:600;line-height:1">+ Add</button>`
    : '';
  return `<span class="scmp-chip scmp-chip-theirs"
    style="background:${cs.bg};color:${cs.color};border-color:${cs.color}44"
    title="${t.category}">${t.name}${addBtn}</span>`;
}

function scmpAddTool(catalogId, event) {
  event.stopPropagation();
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
  logActivity(`Added <strong>${tool.name}</strong> from comparison`, 'teal');
  _scmpRenderMyInfo();
  _scmpRenderResults();
}
