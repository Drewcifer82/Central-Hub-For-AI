/* ─── templates.js — Stack Templates ── */

const STACK_TEMPLATES = [
  {
    id: 'solo-creator',
    name: 'Solo Creator',
    persona: 'Bloggers · YouTubers · Podcasters',
    description: 'A well-rounded creative stack for solo content producers — covers writing, images, video, and audio so you can ship across every format.',
    color: '#ec4899',
    colorDim: '#3d0a24',
    tools: ['claude', 'grammarly', 'midjourney', 'pika', 'descript', 'notion'],
  },
  {
    id: 'developer',
    name: 'Developer',
    persona: 'Engineers · Indie Hackers · Tech Leads',
    description: 'A lean but powerful dev stack — AI-aware IDE editing, sharp web research, solid knowledge base, and data analysis when you need it.',
    color: '#3b82f6',
    colorDim: '#0e1e3d',
    tools: ['cursor', 'claude', 'perplexity-pro', 'notion', 'julius-ai'],
  },
  {
    id: 'content-marketer',
    name: 'Content Marketer',
    persona: 'Marketers · SEO Specialists · Growth',
    description: 'Built to drive traffic and ship content fast — from research and first draft to SEO scoring, visual assets, and a central knowledge base.',
    color: '#f59e0b',
    colorDim: '#3a2800',
    tools: ['chatgpt', 'grammarly', 'midjourney', 'frase', 'perplexity-pro', 'notion'],
  },
  {
    id: 'researcher',
    name: 'Researcher',
    persona: 'Academics · Analysts · Knowledge Workers',
    description: 'Deep research and clear synthesis — strong on finding papers, reasoning through complexity, writing polished output, and spotting data patterns.',
    color: '#22c55e',
    colorDim: '#0a2818',
    tools: ['claude', 'elicit', 'grammarly', 'notion', 'julius-ai'],
  },
  {
    id: 'startup-founder',
    name: 'Startup Founder',
    persona: 'Founders · PMs · Small Teams',
    description: 'The essential kit for building and growing — covers shipping code, writing copy, capturing meetings, SEO, and staying organized.',
    color: '#7c6dfa',
    colorDim: '#2a2550',
    tools: ['claude', 'cursor', 'writesonic', 'frase', 'otter-ai', 'notion'],
  },
];

let _tplPreviewId = null;

/* ── Init ── */
function initTemplates() {
  renderTemplates();
}

function renderTemplates() {
  const grid = document.getElementById('templates-grid');
  if (!grid) return;

  grid.innerHTML = STACK_TEMPLATES.map(tpl => {
    const tools    = tpl.tools.map(id => CATALOG.find(c => c.id === id)).filter(Boolean);
    const cost     = tools.reduce((s, t) => s + (t.cost || 0), 0);
    const costStr  = `$${cost % 1 === 0 ? cost : cost.toFixed(2)}<span>/mo</span>`;

    /* category chips */
    const chipsHTML = tools.map(t => {
      const cs = getCatStyle(t.category);
      return `<span class="template-tool-chip"
        style="background:${cs.bg};color:${cs.color};border-color:${cs.color}44">${t.name}</span>`;
    }).join('');

    /* how many already in stack */
    const alreadyIn = tools.filter(t => isInStack(t.id)).length;
    const allIn     = alreadyIn === tools.length;
    const note      = allIn
      ? `<span style="font-size:11px;color:var(--teal)">All ${tools.length} tools already in stack</span>`
      : alreadyIn > 0
        ? `<span style="font-size:11px;color:var(--text-dim)">${alreadyIn} of ${tools.length} already in stack</span>`
        : '';

    return `
      <div class="template-card" onclick="openTemplatePreview('${tpl.id}')">
        <div class="template-card-accent" style="background:${tpl.color}"></div>
        <div class="template-card-body">
          <div class="template-card-header">
            <div class="template-name">${tpl.name}</div>
            <span class="template-persona"
              style="background:${tpl.colorDim};color:${tpl.color};border:1px solid ${tpl.color}33">${tpl.persona.split(' · ')[0]}</span>
          </div>
          <div class="template-desc">${tpl.description}</div>
          <div class="template-tools-row">${chipsHTML}</div>
        </div>
        <div class="template-card-footer">
          <div>
            <div class="template-cost">${costStr}</div>
            ${note}
          </div>
          <button class="btn btn-ghost" style="font-size:12px;padding:6px 14px"
            onclick="event.stopPropagation();openTemplatePreview('${tpl.id}')">Preview →</button>
        </div>
      </div>`;
  }).join('');
}

/* ── Preview Modal ── */
function openTemplatePreview(id) {
  const tpl = STACK_TEMPLATES.find(t => t.id === id);
  if (!tpl) return;
  _tplPreviewId = id;

  const tools   = tpl.tools.map(id => CATALOG.find(c => c.id === id)).filter(Boolean);
  const cost    = tools.reduce((s, t) => s + (t.cost || 0), 0);
  const inStack = tools.filter(t => isInStack(t.id)).length;

  document.getElementById('tplModalTitle').textContent = tpl.name + ' Template';
  document.getElementById('tplModalSub').textContent   = tpl.persona;

  const footerNote = inStack === tools.length
    ? 'All tools already in your stack'
    : inStack > 0
      ? `${inStack} of ${tools.length} tools already in your stack — "Add Missing" adds the rest`
      : `${tools.length} tools · $${cost}/mo total`;
  document.getElementById('tplModalFooterNote').textContent = footerNote;

  /* Disable Load Template if all already in stack */
  document.getElementById('tplReplaceBtn').textContent = STATE.stack.length > 0 ? 'Replace Stack' : 'Load Template';

  document.getElementById('tplModalBody').innerHTML = `
    <div style="background:linear-gradient(135deg,${tpl.colorDim},${tpl.colorDim}88);border:1px solid ${tpl.color}33;border-radius:var(--radius-sm);padding:12px 14px;margin-bottom:14px">
      <div style="font-size:13px;color:var(--text-md);line-height:1.6">${tpl.description}</div>
    </div>
    <div style="display:flex;flex-direction:column;gap:8px">
      ${tools.map(t => {
        const cs     = getCatStyle(t.category);
        const inSt   = isInStack(t.id);
        const isFree = !t.cost || t.cost === 0;
        return `
          <div style="display:flex;align-items:center;gap:12px;background:var(--surface);border:1px solid ${inSt ? 'var(--teal)33' : 'var(--border)'};border-radius:var(--radius-sm);padding:10px 12px">
            <div style="flex:1;min-width:0">
              <div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin-bottom:3px">
                <span style="font-size:13px;font-weight:600;color:var(--white)">${t.name}</span>
                <span style="background:${cs.bg};color:${cs.color};border:1px solid ${cs.color}33;padding:1px 7px;border-radius:20px;font-size:10px;font-weight:600">${cs.label}</span>
                ${inSt ? '<span style="font-size:10px;color:var(--teal);background:var(--teal-dim);padding:1px 6px;border-radius:4px">In Stack</span>' : ''}
              </div>
              <div style="font-size:11px;color:var(--text-dim);line-height:1.5">${t.description}</div>
            </div>
            <div style="font-size:13px;font-weight:700;color:${isFree ? 'var(--teal)' : 'var(--text)'};white-space:nowrap;flex-shrink:0">
              ${isFree ? 'Free' : '$' + t.cost + '/mo'}
            </div>
          </div>`;
      }).join('')}
    </div>
    <div style="display:flex;align-items:center;justify-content:space-between;margin-top:14px;padding:10px 12px;background:var(--surface);border-radius:var(--radius-sm);border:1px solid var(--border)">
      <span style="font-size:12px;color:var(--text-md)">${tools.length} tools</span>
      <span style="font-size:15px;font-weight:700;color:var(--teal)">$${cost}<span style="font-size:12px;font-weight:400;color:var(--text-dim)">/mo total</span></span>
    </div>`;

  document.getElementById('templatePreviewModal').classList.add('open');
}

function closeTemplatePreview() {
  document.getElementById('templatePreviewModal').classList.remove('open');
  _tplPreviewId = null;
}

/* ── Load Template ── */
function loadTemplate(templateId, mode) {
  const tpl = STACK_TEMPLATES.find(t => t.id === templateId);
  if (!tpl) return;

  const tools = tpl.tools.map(id => CATALOG.find(c => c.id === id)).filter(Boolean);

  if (mode === 'replace') {
    if (STATE.stack.length > 0) {
      if (!confirm(`Replace your ${STATE.stack.length} current tool${STATE.stack.length > 1 ? 's' : ''} with the ${tpl.name} template (${tools.length} tools)?`)) return;
    }
    STATE.stack = tools.map(t => _toolFromCatalog(t));
    logActivity(`Loaded <strong>${tpl.name}</strong> template`, 'teal');
  } else {
    const existing = new Set(STATE.stack.map(t => t.catalogId).filter(Boolean));
    const toAdd    = tools.filter(t => !existing.has(t.id));
    if (toAdd.length === 0) {
      alert('All tools from this template are already in your stack!');
      return;
    }
    toAdd.forEach(t => STATE.stack.push(_toolFromCatalog(t)));
    logActivity(`Added ${toAdd.length} tool${toAdd.length > 1 ? 's' : ''} from <strong>${tpl.name}</strong> template`, 'teal');
  }

  localStorage.setItem('aiHub_stack', JSON.stringify(STATE.stack));
  closeTemplatePreview();
  refreshStats();
  renderStack();
  navigate('stack');
}

function _toolFromCatalog(t) {
  return {
    id:        Date.now() + Math.random(),
    catalogId: t.id,
    name:      t.name,
    cost:      t.cost,
    category:  t.category,
    useCase:   t.description,
    website:   t.website  || '',
    features:  t.features || [],
    tier:      'Primary',
    addedAt:   new Date().toISOString(),
  };
}

