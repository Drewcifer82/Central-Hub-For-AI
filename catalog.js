/* ─── catalog.js — Tool Catalog page: search, filter, render, add to stack ── */

let catalogSearch   = '';
let catalogCategory = 'all';

function initCatalog() {
  renderCatalog();
}

function getFilteredCatalog() {
  const q   = catalogSearch.toLowerCase();
  const cat = catalogCategory;

  return CATALOG.filter(tool => {
    const matchCat = cat === 'all' || tool.category === cat;
    const matchQ   = !q ||
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      (tool.tags || []).some(t => t.toLowerCase().includes(q));
    return matchCat && matchQ;
  });
}

function onCatalogSearch(val) {
  catalogSearch = val;
  renderCatalog();
}

function onCatalogCategory(val) {
  catalogCategory = val;
  renderCatalog();
}

function isInStack(catalogId) {
  return STATE.stack.some(t => t.catalogId === catalogId || t.name === CATALOG.find(c => c.id === catalogId)?.name);
}

function addFromCatalog(id) {
  const tool = CATALOG.find(t => t.id === id);
  if (!tool) return;

  if (isInStack(id)) {
    navigate('stack');
    return;
  }

  STATE.stack.push({
    id:        Date.now(),
    catalogId: tool.id,
    name:      tool.name,
    cost:      tool.cost,
    category:  tool.category,
    useCase:   tool.description,
    website:   tool.website || '',
    features:  tool.features || [],
    addedAt:   new Date().toISOString(),
  });

  localStorage.setItem('aiHub_stack', JSON.stringify(STATE.stack));
  refreshStats();
  renderStack();
  logActivity(`Added <strong>${tool.name}</strong> from catalog`, 'teal');

  renderCatalog();
  navigate('stack');
}

function renderCatalog() {
  const tools = getFilteredCatalog();
  const grid  = document.getElementById('catalog-grid');
  const count = document.getElementById('catalog-count');
  if (count) count.textContent = tools.length;

  if (tools.length === 0) {
    grid.innerHTML = `
      <div class="catalog-empty">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <h4>No tools match</h4>
        <p>Try a different search term or category.</p>
      </div>`;
    return;
  }

  grid.innerHTML = tools.map(tool => {
    const style   = getCatStyle(tool.category);
    const inStack = isInStack(tool.id);
    const isFree  = !tool.cost || tool.cost === 0;

    return `
      <div class="catalog-card">
        <div class="catalog-card-accent" style="background:${style.color}"></div>
        <div class="catalog-card-body">
          <div class="catalog-card-top">
            <div>
              <div class="catalog-tool-name">${tool.name}</div>
              <span class="cat-badge" style="background:${style.bg};color:${style.color};margin-top:5px;display:inline-block">${style.label}</span>
            </div>
            <div class="catalog-cost${isFree ? ' free' : ''}">${isFree ? 'Free' : tool.costLabel}</div>
          </div>
          <p class="catalog-desc">${tool.description}</p>
          <div class="catalog-features">
            ${tool.features.slice(0, 4).map(f => `<span class="feature-tag">${f}</span>`).join('')}
          </div>
        </div>
        <div class="catalog-card-footer">
          ${tool.website
            ? `<a href="https://${tool.website.replace(/^https?:\/\//,'')}" target="_blank" rel="noopener"
                 class="catalog-website" onclick="event.stopPropagation()">
                 ${tool.website.replace(/^https?:\/\//,'').replace(/\/$/,'')}
               </a>`
            : `<span></span>`}
          <button
            class="btn ${inStack ? 'btn-in-stack' : 'btn-add-catalog'}"
            onclick="addFromCatalog('${tool.id}')"
          >
            ${inStack
              ? `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"/></svg> In Stack`
              : `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg> Add to Stack`}
          </button>
        </div>
      </div>`;
  }).join('');
}
