/* ─── aifeatures.js — Overlap Detector, Gap Finder, Compare Tools ── */

/* ═══════════════════════════════════════════════════════════════════
   SHARED DATA
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

/* Best catalog entry-point tool per category (catalog ID) */
const _BEST_ENTRY = {
  'General AI Chat':        'chatgpt',
  'Coding Assistant':       'cursor',
  'Writing & Content':      'grammarly',
  'Image Generation':       'midjourney',
  'Video Creation':         'runway',
  'Audio & Transcription':  'otter-ai',
  'Research & Search':      'perplexity-pro',
  'Productivity & Notes':   'notion',
  'SEO & Marketing':        'frase',
  'Data & Analytics':       'julius-ai',
};

/* ═══════════════════════════════════════════════════════════════════
   OVERLAP DETECTOR
   ═══════════════════════════════════════════════════════════════════ */

/* Recommendations for same-category overlaps */
const _SAME_CAT_RECS = {
  'General AI Chat':       'These tools are largely substitutable for everyday tasks. Keep one or two that serve distinct strengths (Claude for long documents, Perplexity for cited answers) and cut the rest.',
  'Coding Assistant':      'Most developers only need one coding assistant. Run them side-by-side for a week — whichever you reach for more naturally becomes your default; cut the other.',
  'Writing & Content':     'Audit whether each tool has a distinct role: long-form drafting, quick social copy, and grammar checking are complementary. If two tools do the same job, cut the pricier one.',
  'Image Generation':      'Image generators have real style differences. Keep one for photorealism and one for illustration if you need both — more than two is almost always redundant.',
  'Video Creation':        'Video tools specialize differently: text-to-video, avatar presenters, and podcast editing are distinct use cases. Audit whether each one serves a workflow you actually use.',
  'Audio & Transcription': 'Meeting transcription and voice synthesis are different jobs. If two tools both transcribe meetings, keep the one with better integrations and cut the other.',
  'Research & Search':     'Multiple research tools make sense only if they cover different sources (academic papers vs. live web). If both do general web research, one is redundant.',
  'Productivity & Notes':  'Overlap here hurts most — splitting attention across note systems means nothing gets organized well. Pick one primary knowledge base and commit to it.',
  'SEO & Marketing':       'SEO tools at the same price point are largely substitutable. Keep the one that best covers your workflow: keyword research, content grading, or backlink analysis.',
  'Data & Analytics':      'Data tools overlap heavily for similar analysis tasks. Consolidate to the one that fits your data format and the team\'s skill level.',
};

/* Known cross-category overlapping pairs */
const _CROSS_OVERLAPS = [
  {
    cats: ['General AI Chat', 'Writing & Content'],
    title: 'Chat AI doubling as a writing tool',
    reason: 'General-purpose chat AIs handle most writing tasks — your dedicated writing tool may be redundant unless you rely on its brand voice controls, templates, or marketing workflows specifically.',
    rec: 'Keep the writing tool only if its templates or brand voice features save you meaningful time beyond what your chat AI already does.',
    severity: 'medium',
  },
  {
    cats: ['General AI Chat', 'Research & Search'],
    title: 'Chat AI overlapping with research tool',
    reason: 'Chat AIs can summarize and reason about topics, but lack real-time web access and reliable source citations. Worth keeping both if you use the research tool specifically for cited, factual answers.',
    rec: 'Keep both if citations matter to you. Cut the research tool if you rarely verify its sources or use it for anything your chat AI can\'t do.',
    severity: 'medium',
  },
  {
    cats: ['General AI Chat', 'Coding Assistant'],
    title: 'Chat AI overlapping with coding assistant',
    reason: 'Chat AIs can write and review code, but a dedicated coding assistant adds IDE integration, inline autocomplete, and full codebase context that chat cannot replicate in the editor.',
    rec: 'These are worth keeping together — they serve genuinely different contexts. The overlap is manageable and both tools earn their place.',
    severity: 'medium',
  },
  {
    cats: ['Writing & Content', 'SEO & Marketing'],
    title: 'Writing tool with built-in SEO vs. standalone SEO tool',
    reason: 'Tools like Jasper and Writesonic include SEO scoring and keyword suggestions. If your writing tool already handles basic optimization, a standalone SEO tool may duplicate that layer.',
    rec: 'Check whether your writing tool\'s SEO features cover your needs. A standalone SEO tool earns its cost only if you do deep keyword research, backlink analysis, or SERP tracking.',
    severity: 'medium',
  },
  {
    cats: ['Productivity & Notes', 'Writing & Content'],
    title: 'Notes app with writing AI vs. dedicated writing tool',
    reason: 'Notion AI and similar tools combine note-taking with AI writing. If you write primarily inside your notes app, a separate writing tool may not add enough to justify its cost.',
    rec: 'Keep both if your writing tool handles external content (blog posts, ads) and your notes app handles internal docs. Consolidate if they serve the same writing workflow.',
    severity: 'medium',
  },
  {
    cats: ['Image Generation', 'Video Creation'],
    title: 'Image generator with video output vs. standalone video tool',
    reason: 'Some image tools generate short video clips (Leonardo AI, Adobe Firefly) and some video tools produce from images. If your image tool produces motion content, a separate video tool may be redundant for light use.',
    rec: 'Keep both if you need full video production features. If you only need short clips for social, check if your image tool\'s video feature already covers it.',
    severity: 'low',
  },
  {
    cats: ['Audio & Transcription', 'Video Creation'],
    title: 'Audio/video editing tool overlap',
    reason: 'Descript covers both podcast audio editing and video editing in one tool. If you have Descript alongside a dedicated video editor, audit whether Descript already handles your video workflow.',
    rec: 'Descript is a strong all-in-one for creators producing both audio and video. If it covers both needs, a separate video editor may be unnecessary overhead.',
    severity: 'low',
  },
];

let _overlapResults = null;

function initOverlap() {
  _renderOverlapStatusBar();
  if (_overlapResults) {
    _renderOverlapResults(_overlapResults);
  } else {
    _renderOverlapIdle();
  }
}

function _renderOverlapStatusBar() {
  const el = document.getElementById('overlap-status-bar');
  if (!el) return;

  const count     = STATE.stack.length;
  const catCount  = new Set(STATE.stack.map(t => t.category)).size;

  el.innerHTML = `
    <div class="overlap-status">
      <div class="overlap-status-item">
        <span class="overlap-status-num">${count}</span>
        <span class="overlap-status-label">tool${count !== 1 ? 's' : ''} in stack</span>
      </div>
      <div class="overlap-status-item">
        <span class="overlap-status-num" style="color:var(--accent-lt)">${catCount}</span>
        <span class="overlap-status-label">categor${catCount !== 1 ? 'ies' : 'y'} represented</span>
      </div>
    </div>`;
}

function _renderOverlapIdle() {
  const el = document.getElementById('overlap-results');
  if (!el) return;

  if (STATE.stack.length < 2) {
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
      <p>Click <strong style="color:var(--text)">Run Analysis</strong> to find overlapping tools in your ${STATE.stack.length}-tool stack.</p>
    </div>`;
}

function runOverlapDetector() {
  if (STATE.stack.length < 2) {
    navigate('stack');
    return;
  }

  const overlaps = [];

  /* ── Same-category overlaps (HIGH) ── */
  const byCategory = {};
  STATE.stack.forEach(t => {
    if (!byCategory[t.category]) byCategory[t.category] = [];
    byCategory[t.category].push(t);
  });

  Object.entries(byCategory).forEach(([cat, tools]) => {
    if (tools.length < 2) return;
    overlaps.push({
      title: `${tools.length} ${cat} tools`,
      tools: tools.map(t => t.name),
      severity: 'high',
      overlap_reason: `You have ${tools.length} tools in the same category (${cat}) — they likely handle the same core job.`,
      recommendation: _SAME_CAT_RECS[cat] || 'Audit which tool you reach for most and consider cutting the others.',
    });
  });

  /* ── Cross-category overlaps (MEDIUM / LOW) ── */
  const userCats = new Set(STATE.stack.map(t => t.category));

  _CROSS_OVERLAPS.forEach(pair => {
    const [catA, catB] = pair.cats;
    if (!userCats.has(catA) || !userCats.has(catB)) return;
    const toolsA = STATE.stack.filter(t => t.category === catA).map(t => t.name);
    const toolsB = STATE.stack.filter(t => t.category === catB).map(t => t.name);
    overlaps.push({
      title: pair.title,
      tools: [...toolsA, ...toolsB],
      severity: pair.severity,
      overlap_reason: pair.reason,
      recommendation: pair.rec,
    });
  });

  /* Sort high → medium → low */
  const order = { high: 0, medium: 1, low: 2 };
  overlaps.sort((a, b) => order[a.severity] - order[b.severity]);

  const data = {
    overlaps,
    summary: overlaps.length === 0
      ? 'No significant overlaps detected in your stack.'
      : `Found ${overlaps.length} overlap group${overlaps.length !== 1 ? 's' : ''} across your ${STATE.stack.length}-tool stack.`,
  };

  _overlapResults = data;
  _renderOverlapResults(data);
  _renderOverlapStatusBar();
  logActivity(
    `Overlap scan — ${overlaps.length} group${overlaps.length !== 1 ? 's' : ''} found`,
    'teal'
  );
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
        <p>${data.summary}</p>
      </div>`;
    return;
  }

  const highCount = data.overlaps.filter(o => o.severity === 'high').length;
  const medCount  = data.overlaps.filter(o => o.severity === 'medium').length;
  const lowCount  = data.overlaps.filter(o => o.severity === 'low').length;

  el.innerHTML = `
    <div class="overlap-summary-bar">
      <span class="overlap-summary-text">${data.summary}</span>
      <div class="overlap-summary-chips">
        ${highCount > 0 ? `<span class="overlap-chip red">${highCount} high</span>` : ''}
        ${medCount  > 0 ? `<span class="overlap-chip amber">${medCount} medium</span>` : ''}
        ${lowCount  > 0 ? `<span class="overlap-chip" style="background:var(--card);color:var(--text-dim)">${lowCount} low</span>` : ''}
      </div>
    </div>
    <div class="overlap-list">
      ${data.overlaps.map(_renderOverlapGroup).join('')}
    </div>`;
}

function _renderOverlapGroup(group) {
  const isHigh   = group.severity === 'high';
  const isMed    = group.severity === 'medium';
  const color    = isHigh ? 'var(--red)' : isMed ? 'var(--amber)' : 'var(--text-dim)';
  const colorDim = isHigh ? 'var(--red-dim)' : isMed ? 'var(--amber-dim)' : 'var(--card)';
  const label    = isHigh ? 'HIGH' : isMed ? 'MED' : 'LOW';

  const toolChips = group.tools.map(name => {
    const inStack   = STATE.stack.find(t => t.name.toLowerCase() === name.toLowerCase());
    const catStyle  = inStack ? getCatStyle(inStack.category) : null;
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


/* ═══════════════════════════════════════════════════════════════════
   GAP FINDER
   ═══════════════════════════════════════════════════════════════════ */

let _gapsResults = null;

function initGaps() {
  _renderGapsStatus();
  if (_gapsResults) {
    _renderGapsResults(_gapsResults);
  } else {
    _renderGapsIdle();
  }
}

function _coveredCategories() {
  return new Set(STATE.stack.map(t => t.category).filter(c => _ALL_CATEGORIES.includes(c)));
}

function _renderGapsStatus() {
  const el = document.getElementById('gaps-status-bar');
  if (!el) return;

  const count   = STATE.stack.length;
  const covered = _coveredCategories();
  const total   = _ALL_CATEGORIES.length;

  const dots = _ALL_CATEGORIES.map(cat => {
    const style = getCatStyle(cat);
    return covered.has(cat)
      ? `<span class="gap-coverage-dot" style="background:${style.color}" title="${cat} ✓"></span>`
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

  if (STATE.stack.length === 0) {
    el.innerHTML = `
      <div class="overlap-empty">
        <div class="overlap-empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div>
        <h3>Stack is empty</h3>
        <p>Add some AI tools to your stack first so we can identify what's missing.</p>
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

function runGapFinder() {
  if (STATE.stack.length === 0) {
    navigate('stack');
    return;
  }

  const covered = _coveredCategories();
  const missing = _ALL_CATEGORIES.filter(c => !covered.has(c));

  const gaps = missing.map(cat => {
    const entryId   = _BEST_ENTRY[cat];
    const entryTool = CATALOG.find(t => t.id === entryId);

    return {
      category:         cat,
      priority:         _gapPriority(cat, covered),
      why_it_matters:   _gapWhyText(cat, covered),
      suggested_tool:   entryTool ? entryTool.name    : cat,
      suggested_reason: entryTool ? entryTool.description : '',
      suggested_cost:   entryTool ? entryTool.costLabel : '',
    };
  });

  /* Sort high → medium → low */
  const order = { high: 0, medium: 1, low: 2 };
  gaps.sort((a, b) => order[a.priority] - order[b.priority]);

  const data = {
    gaps,
    summary: gaps.length === 0
      ? 'Full coverage! Your stack covers all 10 AI tool categories.'
      : `Your stack covers ${covered.size} of ${_ALL_CATEGORIES.length} categories — ${gaps.length} gap${gaps.length !== 1 ? 's' : ''} found.`,
  };

  _gapsResults = data;
  _renderGapsResults(data);
  _renderGapsStatus();
  logActivity(
    `Gap scan — ${gaps.length} gap${gaps.length !== 1 ? 's' : ''} identified`,
    'teal'
  );
}

function _gapPriority(category, covered) {
  const has = c => covered.has(c);

  switch (category) {
    case 'General AI Chat':       return 'high';
    case 'Writing & Content':     return (has('SEO & Marketing') || has('General AI Chat')) ? 'high' : 'medium';
    case 'Research & Search':     return (has('Writing & Content') || has('General AI Chat')) ? 'high' : 'medium';
    case 'Productivity & Notes':  return covered.size >= 3 ? 'high' : 'medium';
    case 'SEO & Marketing':       return has('Writing & Content') ? 'high' : 'medium';
    case 'Audio & Transcription': return (has('Productivity & Notes') || has('Research & Search')) ? 'high' : 'medium';
    case 'Image Generation':      return (has('Writing & Content') || has('SEO & Marketing')) ? 'high' : 'medium';
    case 'Data & Analytics':      return (has('Coding Assistant') || has('Research & Search')) ? 'high' : 'low';
    case 'Video Creation':        return has('Image Generation') ? 'medium' : 'low';
    case 'Coding Assistant':      return 'medium';
    default:                      return 'medium';
  }
}

function _gapWhyText(category, covered) {
  const has   = c => covered.has(c);
  const count = STATE.stack.length;

  switch (category) {
    case 'General AI Chat':
      return `A general-purpose AI assistant is the foundation of most AI workflows — great for brainstorming, drafting, summarizing, and exploring ideas that don't fit your specialized tools.`;

    case 'Coding Assistant':
      return has('General AI Chat')
        ? `Your chat AI can write code, but a dedicated coding assistant adds IDE integration, inline autocomplete, and codebase-wide context that general chat tools can't match in a real development workflow.`
        : `A coding assistant handles autocomplete, debugging, and code generation directly in your editor — one of the highest-ROI additions for anyone who writes code regularly.`;

    case 'Writing & Content':
      return has('General AI Chat')
        ? `Your chat AI can write, but a dedicated writing tool brings brand voice controls, structured long-form templates, and marketing-specific workflows that general chat wasn't built for.`
        : `AI writing tools cover blog posts, emails, social copy, and more — one of the most broadly useful additions to any AI stack.`;

    case 'Image Generation':
      return (has('Writing & Content') || has('SEO & Marketing'))
        ? `You're creating written content — image generation closes the loop by producing thumbnails, social graphics, and illustrations on demand without a designer.`
        : `Image generation creates visual assets on demand — product mockups, social graphics, and creative work in minutes instead of hours.`;

    case 'Video Creation':
      return has('Image Generation')
        ? `You already generate images — video creation is the natural next step for short-form content, product demos, and social video at scale.`
        : `AI video tools turn scripts or images into short clips in minutes — high-value for social content, product demos, and marketing without video production overhead.`;

    case 'Audio & Transcription':
      return (has('Research & Search') || has('Productivity & Notes'))
        ? `You're already researching and organizing knowledge — audio transcription captures meeting notes, interviews, and voice memos and feeds them directly into that workflow.`
        : `Transcription tools convert meetings, podcasts, and voice notes to searchable text automatically — one of the fastest time-savers in any knowledge-heavy workflow.`;

    case 'Research & Search':
      return has('Writing & Content')
        ? `You're creating content — a dedicated research tool finds and cites live sources far faster than manual searching, turning hours of background research into minutes.`
        : has('General AI Chat')
          ? `Your chat AI reasons well but can't reliably access the live web or cite sources. A dedicated research tool fills that gap when accuracy and recency matter.`
          : `A research AI finds and synthesizes information from the live web with citations — far faster than manual searching for any knowledge-intensive work.`;

    case 'Productivity & Notes':
      return count >= 4
        ? `With ${count} AI tools in your stack, an AI-powered notes tool becomes the connective tissue — capturing ideas, organizing meeting output, and making everything else more useful.`
        : `An AI notes tool organizes your ideas, tasks, and meeting output in one place — it compounds the value of every other tool in your stack over time.`;

    case 'SEO & Marketing':
      return has('Writing & Content')
        ? `You're already creating content — an SEO tool ensures it gets found. Keyword research and content optimization work best layered directly on top of a writing workflow.`
        : `SEO and marketing AI handles keyword research, competitor analysis, and campaign planning — high-leverage for building any online presence.`;

    case 'Data & Analytics':
      return has('Coding Assistant')
        ? `You have coding tools, but a dedicated data AI handles chart generation, business intelligence queries, and dataset summaries without writing code every time.`
        : `Data analytics AI turns spreadsheets and raw data into charts, summaries, and insights — no SQL or Python required.`;

    default:
      return `Adding a ${category} tool would expand your stack into an uncovered area with meaningful new capabilities.`;
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
        <p>${data.summary}</p>
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
  const catStyle  = getCatStyle(gap.category);
  const prio      = gap.priority || 'medium';
  const prioBg    = prio === 'high' ? 'var(--red-dim)'   : prio === 'medium' ? 'var(--amber-dim)' : 'var(--card)';
  const prioColor = prio === 'high' ? 'var(--red)'       : prio === 'medium' ? 'var(--amber)'     : 'var(--text-dim)';

  const costPill = gap.suggested_cost
    ? `<span style="font-size:11px;color:var(--text-dim);margin-left:6px">${gap.suggested_cost}</span>`
    : '';

  return `
    <div class="gap-card">
      <div class="gap-card-bar" style="background:${catStyle.color}"></div>
      <div class="gap-card-body">
        <div class="gap-card-header">
          <span class="gap-category-chip"
            style="background:${catStyle.bg};color:${catStyle.color};border-color:${catStyle.color}44">
            ${gap.category}
          </span>
          <span class="gap-priority-badge" style="background:${prioBg};color:${prioColor}">${prio.toUpperCase()}</span>
        </div>
        <p class="gap-why">${gap.why_it_matters}</p>
        <div class="gap-suggestion">
          <div class="gap-suggestion-text">
            <div class="gap-suggestion-name">${gap.suggested_tool}${costPill}</div>
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


/* ═══════════════════════════════════════════════════════════════════
   COMPARE TOOLS
   ═══════════════════════════════════════════════════════════════════ */

function initCompare() {
  _populateCompareSelects();
  renderCompare();
}

function _populateCompareSelects() {
  const selA = document.getElementById('compare-tool-a');
  const selB = document.getElementById('compare-tool-b');
  if (!selA || !selB) return;

  const optHTML = _buildCompareOptions();

  [selA, selB].forEach(sel => {
    const prev = sel.value;
    sel.innerHTML = `<option value="">Choose a tool…</option>` + optHTML;
    if (prev) sel.value = prev;
  });
}

function _buildCompareOptions() {
  /* Catalog tools grouped by category */
  const byCategory = {};
  CATALOG.forEach(tool => {
    if (!byCategory[tool.category]) byCategory[tool.category] = [];
    byCategory[tool.category].push(
      `<option value="catalog:${tool.id}">${tool.name} — ${tool.costLabel}</option>`
    );
  });

  let html = '';
  _ALL_CATEGORIES.forEach(cat => {
    if (byCategory[cat]) {
      html += `<optgroup label="${cat}">` + byCategory[cat].join('') + `</optgroup>`;
    }
  });

  /* Stack-only custom tools (not in catalog by name) */
  const stackOnly = STATE.stack.filter(
    t => !CATALOG.some(c => c.name.toLowerCase() === t.name.toLowerCase())
  );
  if (stackOnly.length > 0) {
    html += `<optgroup label="My Stack (Custom Tools)">`;
    stackOnly.forEach(t => {
      html += `<option value="stack:${t.id}">${t.name} — ${formatCost(t.cost)}</option>`;
    });
    html += `</optgroup>`;
  }

  return html;
}

function _getToolData(value) {
  if (!value) return null;

  if (value.startsWith('catalog:')) {
    const tool = CATALOG.find(t => t.id === value.replace('catalog:', ''));
    if (!tool) return null;
    return {
      name:        tool.name,
      category:    tool.category,
      cost:        tool.cost,
      costLabel:   tool.costLabel,
      description: tool.description,
      features:    tool.features  || [],
      tags:        tool.tags      || [],
      website:     tool.website   || '',
      source:      'catalog',
    };
  }

  if (value.startsWith('stack:')) {
    const tool = STATE.stack.find(t => t.id === parseInt(value.replace('stack:', '')));
    if (!tool) return null;
    return {
      name:        tool.name,
      category:    tool.category,
      cost:        tool.cost || 0,
      costLabel:   formatCost(tool.cost),
      description: tool.useCase || '',
      features:    tool.features || [],
      tags:        [],
      website:     tool.website || '',
      source:      'stack',
    };
  }

  return null;
}

function renderCompare() {
  const valA = document.getElementById('compare-tool-a')?.value;
  const valB = document.getElementById('compare-tool-b')?.value;
  const el   = document.getElementById('compare-results');
  if (!el) return;

  if (!valA && !valB) {
    el.innerHTML = `
      <div class="compare-empty">
        <div class="compare-empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
        </div>
        <h3>Pick two tools to compare</h3>
        <p>Select Tool A and Tool B from the dropdowns above to see a full side-by-side breakdown.</p>
      </div>`;
    return;
  }

  if (!valA || !valB) {
    el.innerHTML = `
      <div class="compare-empty">
        <div class="compare-empty-icon" style="background:var(--accent-dim);border-color:var(--accent)44">
          <svg fill="none" stroke="var(--accent-lt)" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
        </div>
        <h3>Now pick the second tool</h3>
        <p>One tool selected — choose the second to run the comparison.</p>
      </div>`;
    return;
  }

  if (valA === valB) {
    el.innerHTML = `
      <div class="compare-empty">
        <div class="compare-empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
        </div>
        <h3>Pick two different tools</h3>
        <p>Both dropdowns point to the same tool — choose a different one in Tool B.</p>
      </div>`;
    return;
  }

  const toolA = _getToolData(valA);
  const toolB = _getToolData(valB);
  if (!toolA || !toolB) return;

  el.innerHTML = _buildCompareGrid(toolA, toolB);
  logActivity(`Compared <strong>${toolA.name}</strong> vs <strong>${toolB.name}</strong>`, 'purple');
}

function _buildCompareGrid(a, b) {
  const styleA = getCatStyle(a.category);
  const styleB = getCatStyle(b.category);

  /* Cost badges */
  const costA = a.cost || 0;
  const costB = b.cost || 0;
  let badgeA = '', badgeB = '';
  if      (costA === 0 && costB === 0) { badgeA = '<span class="compare-badge compare-badge-free">Free</span>';   badgeB = '<span class="compare-badge compare-badge-free">Free</span>'; }
  else if (costA === 0)                { badgeA = '<span class="compare-badge compare-badge-value">Free</span>';  badgeB = '<span class="compare-badge compare-badge-pricey">Paid</span>'; }
  else if (costB === 0)                { badgeA = '<span class="compare-badge compare-badge-pricey">Paid</span>'; badgeB = '<span class="compare-badge compare-badge-value">Free</span>'; }
  else if (costA < costB)              { badgeA = '<span class="compare-badge compare-badge-value">Better Value</span>'; }
  else if (costB < costA)              { badgeB = '<span class="compare-badge compare-badge-value">Better Value</span>'; }
  else                                 { badgeA = '<span class="compare-badge compare-badge-same">Same Price</span>'; badgeB = '<span class="compare-badge compare-badge-same">Same Price</span>'; }

  /* Features */
  const featsAHtml = a.features.length
    ? a.features.map(f => `<span class="compare-feat-chip">${f}</span>`).join('')
    : `<span class="compare-none-text">No feature data</span>`;
  const featsBHtml = b.features.length
    ? b.features.map(f => `<span class="compare-feat-chip">${f}</span>`).join('')
    : `<span class="compare-none-text">No feature data</span>`;

  /* Feature count badge */
  const fcA = a.features.length, fcB = b.features.length;
  const fcBadgeA = fcA > 0 ? (fcA > fcB ? `<span class="compare-badge compare-badge-value" style="margin-bottom:8px;display:inline-flex">${fcA} features</span><br>` : `<span style="font-size:11px;color:var(--text-dim);display:block;margin-bottom:6px">${fcA} features</span>`) : '';
  const fcBadgeB = fcB > 0 ? (fcB > fcA ? `<span class="compare-badge compare-badge-value" style="margin-bottom:8px;display:inline-flex">${fcB} features</span><br>` : `<span style="font-size:11px;color:var(--text-dim);display:block;margin-bottom:6px">${fcB} features</span>`) : '';

  /* Tags — highlight shared */
  const sharedTags = a.tags.filter(t => b.tags.includes(t));
  const tagsAHtml  = a.tags.length
    ? a.tags.map(t => `<span class="compare-tag-chip ${sharedTags.includes(t) ? 'shared' : ''}">${t}</span>`).join('')
    : `<span class="compare-none-text">No tags</span>`;
  const tagsBHtml  = b.tags.length
    ? b.tags.map(t => `<span class="compare-tag-chip ${sharedTags.includes(t) ? 'shared' : ''}">${t}</span>`).join('')
    : `<span class="compare-none-text">No tags</span>`;

  /* Category row: note if same */
  const sameCategory = a.category === b.category;
  const sameCatNote  = sameCategory
    ? `<div style="grid-column:1/-1;padding:6px 18px 10px;font-size:11px;color:var(--amber);background:var(--amber-dim);border-top:1px solid var(--border)">
        Same category — these tools likely overlap. See the <button onclick="navigate('overlap')" style="background:none;border:none;color:var(--amber);text-decoration:underline;cursor:pointer;font-size:11px;padding:0">Overlap Detector</button> for details.
       </div>`
    : '';

  /* Website */
  const websiteA = a.website
    ? `<a href="https://${a.website.replace(/^https?:\/\//,'')}" target="_blank" rel="noopener"
         style="color:var(--accent-lt);text-decoration:none;font-size:13px"
         onclick="event.stopPropagation()">${a.website.replace(/^https?:\/\//,'').replace(/\/$/,'')}</a>`
    : `<span class="compare-none-text">—</span>`;
  const websiteB = b.website
    ? `<a href="https://${b.website.replace(/^https?:\/\//,'')}" target="_blank" rel="noopener"
         style="color:var(--accent-lt);text-decoration:none;font-size:13px"
         onclick="event.stopPropagation()">${b.website.replace(/^https?:\/\//,'').replace(/\/$/,'')}</a>`
    : `<span class="compare-none-text">—</span>`;

  return `
    <div class="compare-grid">

      <!-- Tool header row -->
      <div class="compare-row-header">
        <div class="compare-empty-cell"></div>

        <div class="compare-tool-header" style="border-top:3px solid ${styleA.color}">
          <div class="compare-tool-name">${a.name}</div>
          <div class="compare-tool-meta">
            <span style="background:${styleA.bg};color:${styleA.color};border:1px solid ${styleA.color}44;
              padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600">${a.category}</span>
            ${a.source === 'stack' ? '<span style="font-size:10px;color:var(--text-dim);background:var(--surface);padding:2px 7px;border-radius:4px;border:1px solid var(--border)">My Stack</span>' : ''}
          </div>
          <div class="compare-cost-row">
            <span class="compare-cost-value">${a.costLabel}</span>
            ${badgeA}
          </div>
        </div>

        <div class="compare-tool-header" style="border-top:3px solid ${styleB.color}">
          <div class="compare-tool-name">${b.name}</div>
          <div class="compare-tool-meta">
            <span style="background:${styleB.bg};color:${styleB.color};border:1px solid ${styleB.color}44;
              padding:2px 9px;border-radius:20px;font-size:11px;font-weight:600">${b.category}</span>
            ${b.source === 'stack' ? '<span style="font-size:10px;color:var(--text-dim);background:var(--surface);padding:2px 7px;border-radius:4px;border:1px solid var(--border)">My Stack</span>' : ''}
          </div>
          <div class="compare-cost-row">
            <span class="compare-cost-value">${b.costLabel}</span>
            ${badgeB}
          </div>
        </div>
      </div>

      ${sameCatNote}

      <!-- About row -->
      <div class="compare-row">
        <div class="compare-label-cell">About</div>
        <div class="compare-data-cell">${a.description || '<span class="compare-none-text">—</span>'}</div>
        <div class="compare-data-cell">${b.description || '<span class="compare-none-text">—</span>'}</div>
      </div>

      <!-- Features row -->
      <div class="compare-row">
        <div class="compare-label-cell">Features</div>
        <div class="compare-data-cell">${fcBadgeA}<div class="compare-features-list">${featsAHtml}</div></div>
        <div class="compare-data-cell">${fcBadgeB}<div class="compare-features-list">${featsBHtml}</div></div>
      </div>

      <!-- Tags row -->
      <div class="compare-row">
        <div class="compare-label-cell">Tags</div>
        <div class="compare-data-cell"><div class="compare-tags-list">${tagsAHtml}</div></div>
        <div class="compare-data-cell"><div class="compare-tags-list">${tagsBHtml}</div></div>
      </div>

      <!-- Website row -->
      <div class="compare-row">
        <div class="compare-label-cell">Website</div>
        <div class="compare-data-cell">${websiteA}</div>
        <div class="compare-data-cell">${websiteB}</div>
      </div>

    </div>`;
}
