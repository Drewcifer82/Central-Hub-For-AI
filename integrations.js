/* ─── integrations.js — Integration Map ── */

/* ═══════════════════════════════════════════════════════════════════
   INTEGRATION DATA  (51 curated tool pairs)
   strength: 'native' | 'strong' | 'possible'
   ═══════════════════════════════════════════════════════════════════ */

const INTEGRATIONS = [

  /* ── Native (same ecosystem / built-in) ──────────────────────── */
  {
    tools: ['ChatGPT', 'DALL-E 3'],
    strength: 'native',
    description: 'DALL-E 3 is built directly into ChatGPT — generate images without leaving the chat interface.',
  },
  {
    tools: ['ChatGPT', 'Sora'],
    strength: 'native',
    description: 'Sora video generation is accessible through the ChatGPT interface — both are part of the OpenAI product suite.',
  },
  {
    tools: ['Claude', 'Claude Code'],
    strength: 'native',
    description: 'Claude Code runs on your Claude subscription — the CLI tool and the web app share the same model and account.',
  },
  {
    tools: ['Notion', 'Notion AI'],
    strength: 'native',
    description: 'Notion AI is built into Notion — generate, rewrite, and summarize content directly inside any doc, database, or wiki.',
  },
  {
    tools: ['Perplexity AI', 'Perplexity Pro'],
    strength: 'native',
    description: 'Perplexity Pro is the premium tier of Perplexity AI — same product, with access to more powerful models and deep research mode.',
  },

  /* ── Strong (official integration / plugin exists) ───────────── */
  {
    tools: ['Jasper', 'Surfer SEO'],
    strength: 'strong',
    description: 'Jasper has a native Surfer SEO integration — optimize AI-generated content for target keywords in real time without leaving Jasper.',
  },
  {
    tools: ['Writesonic', 'Surfer SEO'],
    strength: 'strong',
    description: 'Writesonic\'s SEO article writer integrates with Surfer SEO to grade and optimize content as you write.',
  },
  {
    tools: ['Grammarly', 'ChatGPT'],
    strength: 'strong',
    description: 'Grammarly\'s browser extension runs in the ChatGPT interface — improve your prompts and clean up AI responses before copying them.',
  },
  {
    tools: ['Grammarly', 'Notion'],
    strength: 'strong',
    description: 'Grammarly\'s browser extension works inside Notion — get grammar, tone, and clarity feedback as you write docs and wikis.',
  },
  {
    tools: ['Grammarly', 'Jasper'],
    strength: 'strong',
    description: 'Grammarly\'s extension overlays on Jasper\'s editor — polish AI-generated copy with grammar and tone feedback before publishing.',
  },
  {
    tools: ['Grammarly', 'Writesonic'],
    strength: 'strong',
    description: 'Grammarly runs in Writesonic\'s editor via browser extension — a quick way to QA AI output before it goes live.',
  },
  {
    tools: ['Grammarly', 'Copy.ai'],
    strength: 'strong',
    description: 'Grammarly\'s browser extension works in Copy.ai\'s editor — run grammar and tone checks on marketing copy before use.',
  },
  {
    tools: ['Fireflies.ai', 'Notion'],
    strength: 'strong',
    description: 'Fireflies.ai has an official Notion integration — meeting transcripts and action items are automatically synced to your Notion workspace.',
  },
  {
    tools: ['Fireflies.ai', 'Notion AI'],
    strength: 'strong',
    description: 'Fireflies.ai pushes meeting notes into Notion; Notion AI can then summarize and extract tasks from those transcripts.',
  },
  {
    tools: ['Reclaim.ai', 'Notion'],
    strength: 'strong',
    description: 'Reclaim.ai integrates with Notion tasks — it auto-schedules your Notion to-do list onto your calendar based on priority.',
  },
  {
    tools: ['Motion', 'Notion'],
    strength: 'strong',
    description: 'Motion integrates with Notion to import tasks and projects, then auto-schedules them intelligently across your calendar.',
  },
  {
    tools: ['ElevenLabs', 'HeyGen'],
    strength: 'strong',
    description: 'HeyGen supports ElevenLabs voice clones — use a custom voice trained in ElevenLabs on HeyGen\'s AI video avatars.',
  },
  {
    tools: ['ElevenLabs', 'Synthesia'],
    strength: 'strong',
    description: 'Synthesia accepts custom voice models — pair your ElevenLabs voice clone with Synthesia avatars for fully personalized training videos.',
  },
  {
    tools: ['Semrush', 'Surfer SEO'],
    strength: 'strong',
    description: 'Use Semrush for keyword research and competitor analysis, then Surfer SEO to grade and optimize the actual content — they cover the full SEO workflow.',
  },
  {
    tools: ['Frase', 'Surfer SEO'],
    strength: 'strong',
    description: 'Frase for content briefs and outlines, Surfer SEO for grading the final article — a research-to-publish SEO pipeline.',
  },

  /* ── Possible (workflow complement or indirect connection) ───── */
  {
    tools: ['GitHub Copilot', 'Cursor'],
    strength: 'possible',
    description: 'Both extend VS Code — some developers use GitHub Copilot for inline autocomplete and Cursor\'s agent mode for larger multi-file refactors.',
  },
  {
    tools: ['Cursor', 'Claude Code'],
    strength: 'possible',
    description: 'Cursor handles in-editor AI; Claude Code handles terminal-based agentic tasks — together they cover the full development workflow.',
  },
  {
    tools: ['GitHub Copilot', 'Claude Code'],
    strength: 'possible',
    description: 'GitHub Copilot provides inline suggestions inside the IDE; Claude Code drives complex multi-step tasks from the terminal.',
  },
  {
    tools: ['GitHub Copilot', 'Tabnine'],
    strength: 'possible',
    description: 'Both provide in-IDE completion — Tabnine offers private on-premise deployment for sensitive codebases; Copilot has deeper GitHub repo context.',
  },
  {
    tools: ['Replit AI', 'GitHub Copilot'],
    strength: 'possible',
    description: 'Replit AI for browser-based prototyping and one-click deploys; GitHub Copilot for production development in VS Code — different stages of the build process.',
  },
  {
    tools: ['Midjourney', 'Runway'],
    strength: 'possible',
    description: 'Create a high-quality still image in Midjourney, then animate it in Runway — a popular pipeline for short-form social content.',
  },
  {
    tools: ['Midjourney', 'Pika'],
    strength: 'possible',
    description: 'Generate a hero image in Midjourney, then use Pika\'s image-to-video to animate it into a short clip.',
  },
  {
    tools: ['Midjourney', 'Adobe Firefly'],
    strength: 'possible',
    description: 'Midjourney for creative artistic work; Adobe Firefly for commercially safe assets with direct Photoshop integration.',
  },
  {
    tools: ['DALL-E 3', 'Adobe Firefly'],
    strength: 'possible',
    description: 'DALL-E 3 for flexible ChatGPT-native generation; Adobe Firefly for commercially licensed images and Photoshop workflow.',
  },
  {
    tools: ['Leonardo AI', 'Runway'],
    strength: 'possible',
    description: 'Generate game assets or concept art in Leonardo AI, then animate or post-process them in Runway.',
  },
  {
    tools: ['HeyGen', 'Synthesia'],
    strength: 'possible',
    description: 'Both create AI avatar videos — HeyGen excels at voice cloning and translation; Synthesia focuses on enterprise training with SCORM export.',
  },
  {
    tools: ['Descript', 'ElevenLabs'],
    strength: 'possible',
    description: 'Descript edits audio/video by transcript; ElevenLabs generates custom voice audio — pair them for AI-voiced podcast and video production.',
  },
  {
    tools: ['Otter.ai', 'Fireflies.ai'],
    strength: 'possible',
    description: 'Both transcribe meetings — Otter.ai excels at real-time speaker ID; Fireflies.ai focuses on action items and CRM sync.',
  },
  {
    tools: ['Whisper (OpenAI)', 'Descript'],
    strength: 'possible',
    description: 'Descript uses a Whisper-powered engine internally — for custom workflows, run the Whisper API to pre-transcribe audio before editing in Descript.',
  },
  {
    tools: ['Sora', 'Runway'],
    strength: 'possible',
    description: 'Use Sora to generate high-quality raw video clips, then refine them in Runway with inpainting, motion brush, and background removal.',
  },
  {
    tools: ['Sora', 'Pika'],
    strength: 'possible',
    description: 'Sora for longer cinematic clips; Pika for quick image-to-video animations — combine them in a short-form content production workflow.',
  },
  {
    tools: ['Julius AI', 'Polymer'],
    strength: 'possible',
    description: 'Use Julius AI for conversational data exploration and Polymer to auto-generate shareable dashboards from the same dataset.',
  },
  {
    tools: ['Julius AI', 'Rows'],
    strength: 'possible',
    description: 'Run exploratory analysis in Julius AI, then transfer results to Rows for clean charts and published data reports.',
  },
  {
    tools: ['Tableau + Einstein', 'Rows'],
    strength: 'possible',
    description: 'Use Rows for lightweight spreadsheet analysis and Tableau for enterprise-level BI visualization on the same underlying data.',
  },
  {
    tools: ['Polymer', 'Rows'],
    strength: 'possible',
    description: 'Polymer auto-generates dashboards; Rows provides a collaborative spreadsheet layer with 50+ data source integrations — both visualize data differently.',
  },
  {
    tools: ['Elicit', 'Consensus'],
    strength: 'possible',
    description: 'Elicit extracts data from specific papers; Consensus surfaces scientific consensus across many papers — use both for thorough academic research.',
  },
  {
    tools: ['Elicit', 'ScholarAI'],
    strength: 'possible',
    description: 'Both search academic literature — Elicit focuses on data extraction; ScholarAI generates full literature reviews with citations.',
  },
  {
    tools: ['Perplexity Pro', 'Claude'],
    strength: 'possible',
    description: 'Use Perplexity Pro to surface and cite current web sources, then pass findings to Claude for deep analysis and long-form writing.',
  },
  {
    tools: ['Perplexity AI', 'Elicit'],
    strength: 'possible',
    description: 'Perplexity for fast real-time web research; Elicit for deep dives into peer-reviewed papers — they cover different research contexts.',
  },
  {
    tools: ['Jasper', 'Copy.ai'],
    strength: 'possible',
    description: 'Both are full AI writing platforms — Jasper leans into brand voice and long-form; Copy.ai excels at short-form marketing copy.',
  },
  {
    tools: ['Frase', 'Jasper'],
    strength: 'possible',
    description: 'Use Frase for SEO research and content briefs, then hand off to Jasper for drafting — a popular two-tool SEO content workflow.',
  },
  {
    tools: ['Semrush', 'Frase'],
    strength: 'possible',
    description: 'Semrush for keyword research and competitor data; Frase for turning those keywords into ranked, optimized content.',
  },
  {
    tools: ['Brandwatch', 'Semrush'],
    strength: 'possible',
    description: 'Brandwatch for social sentiment and brand monitoring; Semrush for search visibility — together they map a brand\'s full online presence.',
  },
  {
    tools: ['AdCreative.ai', 'Jasper'],
    strength: 'possible',
    description: 'Write ad copy in Jasper and generate matching visual ad banners in AdCreative.ai — a clean split between copy and creative.',
  },
  {
    tools: ['AdCreative.ai', 'Copy.ai'],
    strength: 'possible',
    description: 'Draft ad copy in Copy.ai, then produce the visual creative in AdCreative.ai — together they cover the full ad production pipeline.',
  },
  {
    tools: ['Notion', 'Obsidian'],
    strength: 'possible',
    description: 'Keep Obsidian for private local notes and Notion for team collaboration — they can serve different parts of a personal knowledge system.',
  },
  {
    tools: ['Reclaim.ai', 'Motion'],
    strength: 'possible',
    description: 'Both auto-schedule your calendar — Reclaim focuses on focus time and habits; Motion handles full project scheduling. Using both is usually redundant.',
  },
  {
    tools: ['Reclaim.ai', 'Obsidian'],
    strength: 'possible',
    description: 'Use Obsidian for deep knowledge work and Reclaim.ai to block protected focus time for it — the tools support the same deep work workflow.',
  },
];


/* ═══════════════════════════════════════════════════════════════════
   STATE & HELPERS
   ═══════════════════════════════════════════════════════════════════ */

let _integrationResults = null;

function _stackNames() {
  return new Set(STATE.stack.map(t => t.name.toLowerCase()));
}

function _stackToolByName(name) {
  return STATE.stack.find(t => t.name.toLowerCase() === name.toLowerCase()) || null;
}


/* ═══════════════════════════════════════════════════════════════════
   INIT / IDLE
   ═══════════════════════════════════════════════════════════════════ */

function initIntegrations() {
  _renderIntegrationStatus();
  if (_integrationResults) {
    _renderIntegrationResults(_integrationResults);
  } else {
    _renderIntegrationIdle();
  }
}

function _renderIntegrationStatus() {
  const el = document.getElementById('integration-status-bar');
  if (!el) return;
  const count = STATE.stack.length;
  el.innerHTML = `
    <div class="overlap-status">
      <div class="overlap-status-item">
        <span class="overlap-status-num">${count}</span>
        <span class="overlap-status-label">tool${count !== 1 ? 's' : ''} in stack</span>
      </div>
      <div class="overlap-status-item">
        <span class="overlap-status-num" style="color:var(--teal)">${INTEGRATIONS.length}</span>
        <span class="overlap-status-label">integration pairs in database</span>
      </div>
    </div>`;
}

function _renderIntegrationIdle() {
  const el = document.getElementById('integration-results');
  if (!el) return;

  if (STATE.stack.length < 2) {
    el.innerHTML = `
      <div class="overlap-empty">
        <div class="overlap-empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <h3>Not enough tools</h3>
        <p>Add at least 2 tools to your stack, then run the integration map.</p>
        <button class="btn btn-ghost" onclick="navigate('stack')">Go to My Stack</button>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="overlap-empty">
      <div class="overlap-empty-icon" style="background:var(--teal-dim); border-color:var(--teal)44">
        <svg fill="none" stroke="var(--teal)" stroke-width="1.5" viewBox="0 0 24 24">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
        </svg>
      </div>
      <h3>Ready to map</h3>
      <p>Click <strong style="color:var(--text)">Map Integrations</strong> to see how your ${STATE.stack.length} tools connect.</p>
    </div>`;
}


/* ═══════════════════════════════════════════════════════════════════
   RUN
   ═══════════════════════════════════════════════════════════════════ */

function runIntegrationMap() {
  if (STATE.stack.length < 2) { navigate('stack'); return; }

  const names  = _stackNames();
  const found  = INTEGRATIONS.filter(pair => {
    const [a, b] = pair.tools;
    return names.has(a.toLowerCase()) && names.has(b.toLowerCase());
  });

  const order = { native: 0, strong: 1, possible: 2 };
  found.sort((a, b) => order[a.strength] - order[b.strength]);

  const data = {
    pairs: found,
    summary: found.length === 0
      ? `No known integrations found between your ${STATE.stack.length} tools — try adding catalog tools to unlock more matches.`
      : `Found ${found.length} integration${found.length !== 1 ? 's' : ''} across your ${STATE.stack.length}-tool stack.`,
  };

  _integrationResults = data;
  _renderIntegrationResults(data);
  _renderIntegrationStatus();
  logActivity(`Integration map — ${found.length} connection${found.length !== 1 ? 's' : ''} found`, 'teal');
}


/* ═══════════════════════════════════════════════════════════════════
   RENDER
   ═══════════════════════════════════════════════════════════════════ */

function _renderIntegrationResults(data) {
  const el = document.getElementById('integration-results');
  if (!el) return;

  if (!data.pairs || data.pairs.length === 0) {
    el.innerHTML = `
      <div class="overlap-empty">
        <div class="overlap-empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </div>
        <h3>No integrations found</h3>
        <p>${data.summary}</p>
        <p style="font-size:12px;color:var(--text-dim);margin-top:8px">
          We track <strong style="color:var(--text-md)">${INTEGRATIONS.length}</strong> integration pairs —
          add more catalog tools to your stack to find matches.
        </p>
      </div>`;
    return;
  }

  const nativeCount   = data.pairs.filter(p => p.strength === 'native').length;
  const strongCount   = data.pairs.filter(p => p.strength === 'strong').length;
  const possibleCount = data.pairs.filter(p => p.strength === 'possible').length;

  el.innerHTML = `
    <div class="overlap-summary-bar">
      <span class="overlap-summary-text">${data.summary}</span>
      <div class="overlap-summary-chips">
        ${nativeCount   > 0 ? `<span class="overlap-chip" style="background:var(--teal-dim);color:var(--teal)">${nativeCount} native</span>` : ''}
        ${strongCount   > 0 ? `<span class="overlap-chip" style="background:var(--accent-dim);color:var(--accent-lt)">${strongCount} strong</span>` : ''}
        ${possibleCount > 0 ? `<span class="overlap-chip" style="background:var(--card);color:var(--text-dim)">${possibleCount} possible</span>` : ''}
      </div>
    </div>
    <div class="overlap-list">
      ${data.pairs.map(_renderIntegrationCard).join('')}
    </div>`;
}

function _renderIntegrationCard(pair) {
  const isNative = pair.strength === 'native';
  const isStrong = pair.strength === 'strong';
  const color    = isNative ? 'var(--teal)' : isStrong ? 'var(--accent-lt)' : 'var(--text-dim)';
  const colorDim = isNative ? 'var(--teal-dim)' : isStrong ? 'var(--accent-dim)' : 'var(--card)';
  const label    = isNative ? 'NATIVE' : isStrong ? 'STRONG' : 'POSSIBLE';

  const [nameA, nameB] = pair.tools;
  const toolA = _stackToolByName(nameA);
  const toolB = _stackToolByName(nameB);

  const chipStyleA = toolA
    ? `background:${getCatStyle(toolA.category).bg};color:${getCatStyle(toolA.category).color};border-color:${getCatStyle(toolA.category).color}44`
    : `background:var(--card);color:var(--text-md);border-color:var(--border)`;
  const chipStyleB = toolB
    ? `background:${getCatStyle(toolB.category).bg};color:${getCatStyle(toolB.category).color};border-color:${getCatStyle(toolB.category).color}44`
    : `background:var(--card);color:var(--text-md);border-color:var(--border)`;

  const catA = CATALOG.find(c => c.name.toLowerCase() === nameA.toLowerCase());
  const catB = CATALOG.find(c => c.name.toLowerCase() === nameB.toLowerCase());
  const compareBtn = (catA && catB) ? `
    <button class="btn btn-ghost" style="font-size:11px;padding:5px 11px;margin-top:10px"
      onclick="navigateToCompare('catalog:${catA.id}','catalog:${catB.id}')">
      Compare side-by-side →
    </button>` : '';

  return `
    <div class="overlap-group">
      <div class="overlap-group-bar" style="background:${color}"></div>
      <div class="overlap-group-body">
        <div class="overlap-group-header">
          <span class="overlap-severity-badge" style="background:${colorDim};color:${color}">${label}</span>
        </div>
        <div class="overlap-tools-row" style="align-items:center;gap:10px;margin-bottom:10px">
          <span class="overlap-tool-chip" style="${chipStyleA}">${nameA}</span>
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
            style="width:16px;height:16px;color:var(--text-dim);flex-shrink:0">
            <path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>
          </svg>
          <span class="overlap-tool-chip" style="${chipStyleB}">${nameB}</span>
        </div>
        <p class="overlap-reason">${pair.description}</p>
        ${compareBtn}
      </div>
    </div>`;
}

function navigateToCompare(valA, valB) {
  navigate('compare');
  setTimeout(() => {
    const selA = document.getElementById('compare-tool-a');
    const selB = document.getElementById('compare-tool-b');
    if (selA) selA.value = valA;
    if (selB) selB.value = valB;
    renderCompare();
  }, 60);
}
