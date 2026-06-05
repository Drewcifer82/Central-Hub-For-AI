/* ─── aifeatures.js — Overlap Detector, Gap Finder, Compare Tools ── */

/* ═══════════════════════════════════════════════════════════════════
   OVERLAP DETECTOR
   ═══════════════════════════════════════════════════════════════════ */

let _overlapResults = null;
let _overlapRunning = false;

function initOverlap() {
  _renderOverlapStatus();
  if (_overlapResults) {
    _renderOverlapResults(_overlapResults);
  } else {
    _renderOverlapIdle();
  }
  _syncRunBtn();
}

function _renderOverlapStatus() {
  const el = document.getElementById('overlap-status-bar');
  if (!el) return;

  const count  = STATE.stack.length;
  const hasKey = !!STATE.apiKey;

  el.innerHTML = `
    <div class="overlap-status">
      <div class="overlap-status-item">
        <span class="overlap-status-num">${count}</span>
        <span class="overlap-status-label">tool${count !== 1 ? 's' : ''} in stack</span>
      </div>
      <div class="overlap-status-item">
        <span class="overlap-status-dot ${hasKey ? 'green' : 'amber'}"></span>
        <span class="overlap-status-label">${hasKey ? 'API key set' : 'No API key — required for analysis'}</span>
        ${!hasKey ? `<button class="btn btn-ghost" style="padding:3px 10px;font-size:11px;margin-left:6px" onclick="openApiModal()">Set Key</button>` : ''}
      </div>
    </div>`;
}

function _renderOverlapIdle() {
  const el = document.getElementById('overlap-results');
  if (!el) return;

  const count = STATE.stack.length;

  if (count < 2) {
    el.innerHTML = `
      <div class="overlap-empty">
        <div class="overlap-empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>
          </svg>
        </div>
        <h3>Not enough tools</h3>
        <p>Add at least 2 tools to your stack, then run the analysis.</p>
        <button class="btn btn-ghost" onclick="navigate('stack')">Go to My Stack</button>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="overlap-empty">
      <div class="overlap-empty-icon" style="background:var(--accent-dim); border-color:var(--accent)44">
        <svg fill="none" stroke="var(--accent-lt)" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>
        </svg>
      </div>
      <h3>Ready to analyze</h3>
      <p>Click <strong style="color:var(--text)">Run Analysis</strong> to find overlapping tools in your ${count}-tool stack.</p>
    </div>`;
}

function _syncRunBtn() {
  const btn = document.getElementById('overlapRunBtn');
  if (!btn) return;
  btn.innerHTML = `
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>
    </svg>
    ${_overlapResults ? 'Re-run Analysis' : 'Run Analysis'}`;
  btn.disabled = false;
}

async function runOverlapDetector() {
  if (_overlapRunning) return;

  if (!STATE.apiKey) {
    openApiModal();
    return;
  }

  if (STATE.stack.length < 2) {
    navigate('stack');
    return;
  }

  _overlapRunning = true;
  _setOverlapLoading(true);

  const toolsSummary = STATE.stack
    .map(t => `- ${t.name} (${t.category}): ${t.useCase}`)
    .join('\n');

  const prompt = `You are an AI tool stack analyzer. I will give you a list of AI tools with their categories and use cases. Find groups of tools that meaningfully overlap in functionality — tools that do the same job and could replace each other.

My current AI tool stack:
${toolsSummary}

Return ONLY valid JSON in this exact format with no other text:
{
  "overlaps": [
    {
      "title": "Short descriptive title for what these tools overlap on",
      "tools": ["Tool Name 1", "Tool Name 2"],
      "severity": "high",
      "overlap_reason": "One sentence explaining how they overlap",
      "recommendation": "One concrete recommendation — what to keep, cut, or when to use each"
    }
  ],
  "summary": "One sentence summary of what you found"
}

Rules:
- "severity" must be "high" (same core job, strong overlap) or "medium" (partial overlap, situational)
- Only report genuine overlaps — not superficial ones
- If no meaningful overlaps, return { "overlaps": [], "summary": "No significant overlaps detected in your stack." }
- Each tools array should have 2–5 tool names
- Do not include tools that don't overlap with anything`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': STATE.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    const data   = await res.json();
    const rawText = data.content[0].text.trim();

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Unexpected response format from Claude.');

    const parsed = JSON.parse(jsonMatch[0]);
    _overlapResults = parsed;

    _renderOverlapResults(parsed);
    logActivity(
      `Overlap scan complete — ${parsed.overlaps.length} group${parsed.overlaps.length !== 1 ? 's' : ''} found`,
      'teal'
    );

  } catch (err) {
    _renderOverlapError(err.message);
  } finally {
    _overlapRunning = false;
    _setOverlapLoading(false);
    _syncRunBtn();
  }
}

function _setOverlapLoading(loading) {
  const btn = document.getElementById('overlapRunBtn');
  const el  = document.getElementById('overlap-results');

  if (loading) {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <svg class="overlap-spin-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
          style="animation:spin 0.8s linear infinite">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Analyzing…`;
    }
    if (el) {
      el.innerHTML = `
        <div class="overlap-loading">
          <div class="overlap-spinner"></div>
          <p>Claude is analyzing your stack…</p>
        </div>`;
    }
  }
}

function _renderOverlapResults(data) {
  const el = document.getElementById('overlap-results');
  if (!el) return;

  if (!data.overlaps || data.overlaps.length === 0) {
    el.innerHTML = `
      <div class="overlap-empty">
        <div class="overlap-empty-icon" style="background:var(--teal-dim); border-color:var(--teal)44">
          <svg fill="none" stroke="var(--teal)" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3>No overlaps found</h3>
        <p>${data.summary || 'Your stack looks clean — no significant tool overlap detected.'}</p>
      </div>`;
    return;
  }

  const highCount = data.overlaps.filter(o => o.severity === 'high').length;
  const medCount  = data.overlaps.filter(o => o.severity === 'medium').length;

  el.innerHTML = `
    <div class="overlap-summary-bar">
      <span class="overlap-summary-text">${data.summary}</span>
      <div class="overlap-summary-chips">
        ${highCount > 0 ? `<span class="overlap-chip red">${highCount} high</span>` : ''}
        ${medCount  > 0 ? `<span class="overlap-chip amber">${medCount} medium</span>` : ''}
      </div>
    </div>
    <div class="overlap-list">
      ${data.overlaps.map(_renderOverlapGroup).join('')}
    </div>`;
}

function _renderOverlapGroup(group) {
  const isHigh   = group.severity === 'high';
  const color    = isHigh ? 'var(--red)'    : 'var(--amber)';
  const colorDim = isHigh ? 'var(--red-dim)': 'var(--amber-dim)';
  const label    = isHigh ? 'HIGH' : 'MED';

  const toolChips = group.tools.map(name => {
    const inStack  = STATE.stack.find(t => t.name.toLowerCase() === name.toLowerCase());
    const catStyle = inStack ? getCatStyle(inStack.category) : null;
    const chipStyle = catStyle
      ? `background:${catStyle.bg};color:${catStyle.color};border-color:${catStyle.color}44`
      : `background:var(--card);color:var(--text-md);border-color:var(--border)`;
    return `<span class="overlap-tool-chip" style="${chipStyle}">${name}</span>`;
  }).join('');

  return `
    <div class="overlap-group">
      <div class="overlap-group-bar" style="background:${color}"></div>
      <div class="overlap-group-body">
        <div class="overlap-group-header">
          <span class="overlap-severity-badge" style="background:${colorDim};color:${color}">${label}</span>
          <span class="overlap-group-title">${group.title}</span>
        </div>
        <div class="overlap-tools-row">${toolChips}</div>
        <p class="overlap-reason">${group.overlap_reason}</p>
        <div class="overlap-rec">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
            style="width:14px;height:14px;flex-shrink:0;margin-top:2px">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          <span>${group.recommendation}</span>
        </div>
      </div>
    </div>`;
}

function _renderOverlapError(msg) {
  const el = document.getElementById('overlap-results');
  if (!el) return;
  el.innerHTML = `
    <div class="overlap-empty">
      <div class="overlap-empty-icon" style="background:var(--red-dim); border-color:var(--red)44">
        <svg fill="none" stroke="var(--red)" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h3>Analysis failed</h3>
      <p style="color:var(--red);font-size:12px;max-width:340px">${msg}</p>
      <button class="btn btn-ghost" onclick="runOverlapDetector()">Try Again</button>
    </div>`;
}


/* ═══════════════════════════════════════════════════════════════════
   GAP FINDER
   ═══════════════════════════════════════════════════════════════════ */

const _ALL_CATEGORIES = [
  'General AI Chat',
  'Coding Assistant',
  'Writing & Content',
  'Image Generation',
  'Video Creation',
  'Audio & Transcription',
  'Research & Search',
  'Productivity & Notes',
  'SEO & Marketing',
  'Data & Analytics',
];

let _gapsResults = null;
let _gapsRunning = false;

function initGaps() {
  _renderGapsStatus();
  if (_gapsResults) {
    _renderGapsResults(_gapsResults);
  } else {
    _renderGapsIdle();
  }
  _syncGapsBtn();
}

function _coveredCategories() {
  return new Set(STATE.stack.map(t => t.category).filter(c => _ALL_CATEGORIES.includes(c)));
}

function _renderGapsStatus() {
  const el = document.getElementById('gaps-status-bar');
  if (!el) return;

  const count    = STATE.stack.length;
  const hasKey   = !!STATE.apiKey;
  const covered  = _coveredCategories();
  const total    = _ALL_CATEGORIES.length;

  const dots = _ALL_CATEGORIES.map(cat => {
    const style = getCatStyle(cat);
    const isCovered = covered.has(cat);
    return isCovered
      ? `<span class="gap-coverage-dot" style="background:${style.color}" title="${cat}"></span>`
      : `<span class="gap-coverage-dot uncovered" title="${cat} (missing)"></span>`;
  }).join('');

  el.innerHTML = `
    <div class="overlap-status" style="flex-direction:column; align-items:flex-start; gap:10px">
      <div style="display:flex; gap:24px; align-items:center; flex-wrap:wrap">
        <div class="overlap-status-item">
          <span class="overlap-status-num">${count}</span>
          <span class="overlap-status-label">tool${count !== 1 ? 's' : ''} in stack</span>
        </div>
        <div class="overlap-status-item">
          <span class="overlap-status-num" style="color:var(--teal)">${covered.size}</span>
          <span class="overlap-status-label">/ ${total} categories covered</span>
        </div>
        <div class="overlap-status-item">
          <span class="overlap-status-dot ${hasKey ? 'green' : 'amber'}"></span>
          <span class="overlap-status-label">${hasKey ? 'API key set' : 'No API key'}</span>
          ${!hasKey ? `<button class="btn btn-ghost" style="padding:3px 10px;font-size:11px;margin-left:6px" onclick="openApiModal()">Set Key</button>` : ''}
        </div>
      </div>
      <div class="gap-coverage-row">
        ${dots}
        <span class="gap-coverage-label">${total - covered.size} gap${total - covered.size !== 1 ? 's' : ''} detected</span>
      </div>
    </div>`;
}

function _renderGapsIdle() {
  const el = document.getElementById('gaps-results');
  if (!el) return;

  const count = STATE.stack.length;

  if (count === 0) {
    el.innerHTML = `
      <div class="overlap-empty">
        <div class="overlap-empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <h3>Stack is empty</h3>
        <p>Add some AI tools to your stack first so Claude can identify what's missing.</p>
        <button class="btn btn-ghost" onclick="navigate('stack')">Go to My Stack</button>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="overlap-empty">
      <div class="overlap-empty-icon" style="background:var(--teal-dim); border-color:var(--teal)44">
        <svg fill="none" stroke="var(--teal)" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
      </div>
      <h3>Ready to scan</h3>
      <p>Click <strong style="color:var(--text)">Find Gaps</strong> to see which tool categories are missing from your stack.</p>
    </div>`;
}

function _syncGapsBtn() {
  const btn = document.getElementById('gapsRunBtn');
  if (!btn) return;
  btn.innerHTML = `
    <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    ${_gapsResults ? 'Re-scan Stack' : 'Find Gaps'}`;
  btn.disabled = false;
}

async function runGapFinder() {
  if (_gapsRunning) return;

  if (!STATE.apiKey) {
    openApiModal();
    return;
  }

  if (STATE.stack.length === 0) {
    navigate('stack');
    return;
  }

  _gapsRunning = true;
  _setGapsLoading(true);

  const covered = _coveredCategories();
  const missing = _ALL_CATEGORIES.filter(c => !covered.has(c));

  const stackSummary = STATE.stack
    .map(t => `- ${t.name} (${t.category}): ${t.useCase}`)
    .join('\n');

  const prompt = `You are an AI tool stack advisor. I will give you a user's current AI tool stack and a list of tool categories they do NOT yet have. Analyze what the user does with their current tools, then rank the missing categories by how valuable they would likely be for this specific user.

Current stack:
${stackSummary}

Categories the user is MISSING:
${missing.map(c => `- ${c}`).join('\n')}

${missing.length === 0 ? 'The user covers all 10 categories — great stack!' : ''}

Return ONLY valid JSON in this exact format with no other text:
{
  "gaps": [
    {
      "category": "Exact category name from the missing list",
      "priority": "high",
      "why_it_matters": "Two sentences max. Why would THIS specific user benefit from this category, based on what they already use?",
      "suggested_tool": "Best tool name from this category",
      "suggested_reason": "One sentence: why this specific tool is the best entry point for this category"
    }
  ],
  "summary": "One sentence summary, e.g. 'Your stack covers writing and chat well — these 3 categories would round it out.'"
}

Rules:
- Only include categories from the missing list above
- "priority" must be "high", "medium", or "low" — assign based on how relevant to this user's evident workflow
- Order gaps from highest to lowest priority
- suggested_tool should be a real, well-known tool in that category
- If the user covers all categories, return { "gaps": [], "summary": "Full coverage! Your stack covers all 10 AI tool categories." }`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': STATE.apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    const data    = await res.json();
    const rawText = data.content[0].text.trim();

    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Unexpected response format from Claude.');

    const parsed = JSON.parse(jsonMatch[0]);
    _gapsResults = parsed;

    _renderGapsResults(parsed);
    _renderGapsStatus();
    logActivity(
      `Gap scan complete — ${parsed.gaps.length} gap${parsed.gaps.length !== 1 ? 's' : ''} identified`,
      'teal'
    );

  } catch (err) {
    _renderGapsError(err.message);
  } finally {
    _gapsRunning = false;
    _setGapsLoading(false);
    _syncGapsBtn();
  }
}

function _setGapsLoading(loading) {
  const btn = document.getElementById('gapsRunBtn');
  const el  = document.getElementById('gaps-results');

  if (loading) {
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
          style="animation:spin 0.8s linear infinite">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
        Scanning…`;
    }
    if (el) {
      el.innerHTML = `
        <div class="overlap-loading">
          <div class="overlap-spinner" style="border-top-color:var(--teal)"></div>
          <p>Claude is scanning your stack for gaps…</p>
        </div>`;
    }
  }
}

function _renderGapsResults(data) {
  const el = document.getElementById('gaps-results');
  if (!el) return;

  if (!data.gaps || data.gaps.length === 0) {
    el.innerHTML = `
      <div class="overlap-empty">
        <div class="overlap-empty-icon" style="background:var(--teal-dim); border-color:var(--teal)44">
          <svg fill="none" stroke="var(--teal)" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3>Full coverage!</h3>
        <p>${data.summary || 'Your stack covers all 10 AI tool categories.'}</p>
      </div>`;
    return;
  }

  const highCount = data.gaps.filter(g => g.priority === 'high').length;
  const medCount  = data.gaps.filter(g => g.priority === 'medium').length;
  const lowCount  = data.gaps.filter(g => g.priority === 'low').length;

  el.innerHTML = `
    <div class="overlap-summary-bar">
      <span class="overlap-summary-text">${data.summary}</span>
      <div class="overlap-summary-chips">
        ${highCount > 0 ? `<span class="overlap-chip red">${highCount} high</span>` : ''}
        ${medCount  > 0 ? `<span class="overlap-chip amber">${medCount} medium</span>` : ''}
        ${lowCount  > 0 ? `<span class="overlap-chip" style="background:var(--card);color:var(--text-dim)">${lowCount} low</span>` : ''}
      </div>
    </div>
    <div class="gap-list">
      ${data.gaps.map(_renderGapCard).join('')}
    </div>`;
}

function _renderGapCard(gap) {
  const catStyle = getCatStyle(gap.category);
  const prio     = (gap.priority || 'medium').toLowerCase();

  const prioBg    = prio === 'high' ? 'var(--red-dim)'   : prio === 'medium' ? 'var(--amber-dim)' : 'var(--card)';
  const prioColor = prio === 'high' ? 'var(--red)'       : prio === 'medium' ? 'var(--amber)'     : 'var(--text-dim)';
  const prioLabel = prio.toUpperCase();

  return `
    <div class="gap-card">
      <div class="gap-card-bar" style="background:${catStyle.color}"></div>
      <div class="gap-card-body">
        <div class="gap-card-header">
          <span class="gap-category-chip"
            style="background:${catStyle.bg};color:${catStyle.color};border-color:${catStyle.color}44">
            ${gap.category}
          </span>
          <span class="gap-priority-badge" style="background:${prioBg};color:${prioColor}">${prioLabel}</span>
        </div>
        <p class="gap-why">${gap.why_it_matters}</p>
        <div class="gap-suggestion">
          <div class="gap-suggestion-text">
            <div class="gap-suggestion-name">${gap.suggested_tool}</div>
            <div class="gap-suggestion-reason">${gap.suggested_reason}</div>
          </div>
          <button class="gap-browse-btn" onclick="browseGapCategory('${gap.category.replace(/'/g, "\\'")}')">
            Browse →
          </button>
        </div>
      </div>
    </div>`;
}

function browseGapCategory(category) {
  catalogCategory = category;
  const sel = document.getElementById('catalog-cat-filter');
  if (sel) sel.value = category;
  navigate('catalog');
}

function _renderGapsError(msg) {
  const el = document.getElementById('gaps-results');
  if (!el) return;
  el.innerHTML = `
    <div class="overlap-empty">
      <div class="overlap-empty-icon" style="background:var(--red-dim); border-color:var(--red)44">
        <svg fill="none" stroke="var(--red)" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
        </svg>
      </div>
      <h3>Scan failed</h3>
      <p style="color:var(--red);font-size:12px;max-width:340px">${msg}</p>
      <button class="btn btn-ghost" onclick="runGapFinder()">Try Again</button>
    </div>`;
}
