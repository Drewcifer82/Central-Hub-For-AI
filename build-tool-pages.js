#!/usr/bin/env node
/* ─── build-tool-pages.js ─────────────────────────────────────────
   Generates static SEO landing pages from catalog-data.js:
     • tools/index.html        — full tool directory
     • tools/<id>.html         — one page per catalog tool
     • sitemap.xml             — regenerated with every URL
   Run after editing catalog-data.js:  node build-tool-pages.js
   ────────────────────────────────────────────────────────────── */

const fs = require('fs');
const path = require('path');

const SITE = 'https://thehubforai.com';
const TODAY = new Date().toISOString().slice(0, 10);
const ROOT = __dirname;
const OUT = path.join(ROOT, 'tools');

/* Load CATALOG from the browser-style data file */
const catalogSrc = fs.readFileSync(path.join(ROOT, 'catalog-data.js'), 'utf8');
const CATALOG = new Function(`${catalogSrc}; return CATALOG;`)();

const esc = s => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* How each category slots into a stack — gives every page a unique,
   genuinely informative paragraph instead of thin boilerplate. */
const CATEGORY_ROLE = {
  'General AI Chat':       'a general-purpose assistant — the conversational core most stacks are built around, handling everyday questions, drafting, and reasoning',
  'Coding Assistant':      'a coding layer — it lives where you write software and pays for itself in development speed',
  'Writing & Content':     'a content layer — purpose-built for producing and polishing written work beyond what a general chatbot offers',
  'Image Generation':      'a visual layer — covering artwork, graphics, and imagery that text-first assistants can\'t produce at the same quality',
  'Video Creation':        'a video layer — one of the newest and fastest-moving categories in any AI stack',
  'Audio & Transcription': 'an audio layer — handling voice, music, or meeting transcription alongside your text tools',
  'Research & Search':     'a research layer — built to find, cite, and synthesize information rather than just generate it',
  'Productivity & Notes':  'a productivity layer — embedding AI directly into the notes and documents you already keep',
  'Data & Analytics':      'a data layer — turning spreadsheets, dashboards, and raw numbers into answers',
  'SEO & Marketing':       'a marketing layer — specialized for growth work like SEO, ads, and campaign copy',
};

const costSentence = t => t.cost === 0
  ? `${t.name} has a free tier, which makes it a low-risk addition — the main cost is the time it takes to learn.`
  : `At ${t.costLabel}, ${t.name} adds $${t.cost}/month to your stack — worth auditing against overlapping subscriptions before you commit.`;

const sameCategory = t => CATALOG.filter(o => o.category === t.category && o.id !== t.id);

/* ─── Shared page chrome ────────────────────────────────────── */
const BASE_CSS = `
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg:#08080e; --surface:#10101a; --card:#161620; --card-hover:#1c1c2a;
      --border:#22223a; --border-lt:#2e2e4a;
      --accent:#7c6dfa; --accent-lt:#9d92fb; --accent-dim:#2a2550;
      --teal:#00d4aa; --teal-dim:#0a3330; --amber:#f59e0b;
      --text:#e4e4f0; --text-md:#a0a0c0; --text-dim:#606080; --white:#ffffff;
      --radius:12px; --radius-sm:8px;
    }
    html { scroll-behavior: smooth; }
    body { font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif; background:var(--bg); color:var(--text); font-size:15px; line-height:1.7; -webkit-font-smoothing:antialiased; }
    a { color: var(--accent-lt); }
    .accent-bar { height:3px; background:linear-gradient(90deg,var(--accent),var(--teal)); }
    .site-nav { position:sticky; top:0; z-index:100; background:rgba(8,8,14,0.94); backdrop-filter:blur(14px); -webkit-backdrop-filter:blur(14px); border-bottom:1px solid var(--border); padding:0 40px; height:64px; display:flex; align-items:center; justify-content:space-between; }
    .nav-brand { display:flex; align-items:center; gap:10px; text-decoration:none; }
    .nav-brand-icon { width:32px; height:32px; border-radius:8px; overflow:hidden; flex-shrink:0; }
    .nav-brand-icon img { width:32px; height:32px; object-fit:cover; display:block; }
    .nav-brand-text { display:flex; flex-direction:column; line-height:1.25; }
    .nav-brand-text span:first-child { font-size:13px; font-weight:700; color:var(--white); }
    .nav-brand-text span:last-child { font-size:10px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.04em; }
    .nav-center { display:flex; align-items:center; gap:8px; font-size:13px; color:var(--text-dim); }
    .nav-center a { color:var(--text-md); text-decoration:none; transition:color 0.15s; }
    .nav-center a:hover { color:var(--white); }
    .nav-center svg { width:12px; height:12px; opacity:0.4; }
    .nav-current { color:var(--text-dim); }
    .btn-open-app { display:inline-flex; align-items:center; gap:7px; padding:9px 16px; border-radius:var(--radius-sm); font-size:13px; font-weight:600; background:var(--accent); color:#fff; text-decoration:none; transition:background 0.15s; }
    .btn-open-app:hover { background:var(--accent-lt); }
    .btn-open-app svg { width:14px; height:14px; }
    .tool-wrap { max-width:880px; margin:0 auto; padding:48px 24px 64px; }
    .breadcrumbs { font-size:12px; color:var(--text-dim); margin-bottom:24px; }
    .breadcrumbs a { color:var(--text-md); text-decoration:none; }
    .breadcrumbs a:hover { color:var(--white); }
    .cat-badge { display:inline-block; font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--teal); background:var(--teal-dim); border:1px solid var(--teal); border-radius:20px; padding:3px 12px; margin-bottom:16px; }
    h1 { font-size:36px; font-weight:800; color:var(--white); letter-spacing:-0.02em; line-height:1.2; margin-bottom:14px; }
    .tool-tagline { font-size:17px; color:var(--text-md); max-width:640px; margin-bottom:26px; }
    .tool-ctas { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:40px; }
    .facts-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:44px; }
    .fact-card { background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:18px 20px; }
    .fact-label { font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px; }
    .fact-value { font-size:16px; font-weight:700; color:var(--white); word-break:break-word; }
    .fact-value a { color:var(--teal); text-decoration:none; }
    h2 { font-size:22px; font-weight:700; color:var(--white); margin:40px 0 14px; }
    p { color:var(--text-md); margin-bottom:14px; }
    .feature-list { list-style:none; margin:0 0 8px; }
    .feature-list li { display:flex; align-items:flex-start; gap:10px; padding:9px 0; color:var(--text); border-bottom:1px solid var(--border); }
    .feature-list li:last-child { border-bottom:none; }
    .feature-list svg { width:16px; height:16px; color:var(--teal); flex-shrink:0; margin-top:4px; }
    .tag-row { display:flex; flex-wrap:wrap; gap:8px; margin:6px 0 8px; }
    .tag { font-size:12px; color:var(--text-md); background:var(--card); border:1px solid var(--border); border-radius:20px; padding:3px 12px; }
    .alt-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(240px,1fr)); gap:14px; margin-top:6px; }
    .alt-card { display:block; background:var(--card); border:1px solid var(--border); border-radius:var(--radius); padding:18px 20px; text-decoration:none; transition:border-color 0.15s, transform 0.15s; }
    .alt-card:hover { border-color:var(--accent); }
    .alt-card-name { font-size:15px; font-weight:700; color:var(--white); margin-bottom:4px; }
    .alt-card-cost { font-size:12px; font-weight:600; color:var(--teal); margin-bottom:8px; }
    .alt-card-desc { font-size:12.5px; color:var(--text-md); line-height:1.55; }
    .cta-banner { margin-top:52px; background:linear-gradient(135deg,var(--accent-dim) 0%,var(--teal-dim) 100%); border:1px solid var(--border-lt); border-radius:var(--radius); padding:32px 34px; text-align:center; }
    .cta-banner h2 { margin:0 0 10px; }
    .cta-banner p { max-width:520px; margin:0 auto 20px; }
    .blog-footer { background:var(--bg); border-top:1px solid var(--border); padding:28px 40px; display:flex; align-items:center; justify-content:space-between; gap:20px; flex-wrap:wrap; }
    .footer-copy { font-size:12px; color:var(--text-dim); }
    .footer-links { display:flex; align-items:center; gap:20px; }
    .footer-links a { font-size:12px; color:var(--text-dim); text-decoration:none; transition:color 0.15s; }
    .footer-links a:hover { color:var(--text-md); }
    .dir-category { margin-bottom:8px; }
    @media (max-width:768px) {
      .site-nav { padding:0 20px; } .nav-center { display:none; }
      h1 { font-size:28px; } .facts-grid { grid-template-columns:1fr; }
      .blog-footer { padding:24px 20px; flex-direction:column; align-items:flex-start; gap:12px; }
    }`;

const nav = current => `
  <div class="accent-bar"></div>
  <nav class="site-nav">
    <a href="/" class="nav-brand">
      <div class="nav-brand-icon"><img src="/favicon.png" alt="Central Hub For AI" /></div>
      <div class="nav-brand-text"><span>Central Hub For AI</span><span>AI Stack Manager</span></div>
    </a>
    <div class="nav-center">
      <a href="/">Home</a>
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
      <a href="/tools/">AI Tools</a>
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
      <span class="nav-current">${esc(current)}</span>
    </div>
    <div class="nav-right">
      <a href="/" class="btn-open-app">
        <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/></svg>
        Open App
      </a>
    </div>
  </nav>`;

const footer = `
  <footer class="blog-footer">
    <span class="footer-copy">© 2026 Central Hub For AI. All rights reserved.</span>
    <div class="footer-links">
      <a href="/">App</a>
      <a href="/tools/">AI Tools</a>
      <a href="/blog/">Blog</a>
      <a href="/features.html">Features</a>
    </div>
  </footer>`;

const head = ({ title, description, canonical, jsonLd }) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${canonical}" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <script async src="https://plausible.io/js/pa-EtH8vuczGqq2FwpnEkaNS.js"></script>
  <script>window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()</script>
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:site_name" content="Central Hub For AI" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:image" content="${SITE}/og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${SITE}/og-image.jpg" />
  ${jsonLd.map(o => `<script type="application/ld+json">\n  ${JSON.stringify(o, null, 2).replace(/\n/g, '\n  ')}\n  </script>`).join('\n  ')}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>${BASE_CSS}
  </style>
  <link rel="stylesheet" href="/neon.css" />
</head>`;

const checkIcon = `<svg fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;

/* ─── Per-tool page ─────────────────────────────────────────── */
function toolPage(t) {
  const url = `${SITE}/tools/${t.id}.html`;
  const alts = sameCategory(t);
  const title = `${t.name} — Pricing, Features & Alternatives (${t.costLabel}) | Central Hub For AI`;
  const description = `${t.name} (${t.costLabel}): ${t.description} Compare ${t.name} with ${alts.length} alternatives and see how it fits your AI stack.`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: t.name,
      description: t.description,
      url: `https://${t.website}`,
      applicationCategory: t.category,
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: String(t.cost), priceCurrency: 'USD' },
      featureList: t.features,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/tools/` },
        { '@type': 'ListItem', position: 3, name: t.name, item: url },
      ],
    },
  ];

  const altCards = alts.map(a => `
        <a class="alt-card" href="/tools/${a.id}.html">
          <div class="alt-card-name">${esc(a.name)}</div>
          <div class="alt-card-cost">${esc(a.costLabel)}</div>
          <div class="alt-card-desc">${esc(a.description)}</div>
        </a>`).join('');

  return `${head({ title, description, canonical: url, jsonLd })}
<body>
${nav(t.name)}

  <main class="tool-wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / <a href="/tools/">AI Tools</a> / ${esc(t.name)}</div>
    <span class="cat-badge">${esc(t.category)}</span>
    <h1>${esc(t.name)}</h1>
    <p class="tool-tagline">${esc(t.description)}</p>
    <div class="tool-ctas">
      <a class="btn-open-app" href="https://${esc(t.website)}" rel="noopener" target="_blank">Visit ${esc(t.name)} ↗</a>
      <a class="btn-open-app" style="background:transparent;border:1px solid var(--border-lt);color:var(--text-md)" href="/">Add to My AI Stack — Free</a>
    </div>

    <div class="facts-grid">
      <div class="fact-card"><div class="fact-label">Pricing</div><div class="fact-value">${esc(t.costLabel)}</div></div>
      <div class="fact-card"><div class="fact-label">Category</div><div class="fact-value">${esc(t.category)}</div></div>
      <div class="fact-card"><div class="fact-label">Website</div><div class="fact-value"><a href="https://${esc(t.website)}" rel="noopener" target="_blank">${esc(t.website)}</a></div></div>
    </div>

    <h2>Key features of ${esc(t.name)}</h2>
    <ul class="feature-list">
      ${t.features.map(f => `<li>${checkIcon}${esc(f)}</li>`).join('\n      ')}
    </ul>
    <div class="tag-row">${t.tags.map(tag => `<span class="tag">${esc(tag)}</span>`).join('')}</div>

    <h2>How ${esc(t.name)} fits in an AI stack</h2>
    <p>In a well-built AI toolkit, ${esc(t.name)} works as ${CATEGORY_ROLE[t.category] || 'a specialized layer'}. ${esc(costSentence(t))}</p>
    <p>Before adding it, check what you already pay for: tools in the same category often overlap heavily, and stacking two of them rarely doubles your output. The free <a href="/">Central Hub For AI stack manager</a> can flag overlaps with ${esc(t.name)} and show what a swap would save.</p>

    ${alts.length ? `<h2>${esc(t.category)} alternatives to ${esc(t.name)}</h2>
    <div class="alt-grid">${altCards}
    </div>` : ''}

    <div class="cta-banner">
      <h2>Is ${esc(t.name)} right for your stack?</h2>
      <p>Build your AI stack free — compare ${esc(t.name)} side-by-side with ${alts.length} alternatives, detect overlaps, and optimize what you spend.</p>
      <a class="btn-open-app" href="/">Open the Stack Manager</a>
    </div>
  </main>
${footer}
</body>
</html>
`;
}

/* ─── Directory index ───────────────────────────────────────── */
function indexPage() {
  const url = `${SITE}/tools/`;
  const categories = [...new Set(CATALOG.map(t => t.category))];
  const title = `AI Tool Directory — ${CATALOG.length} Tools Compared by Price & Features | Central Hub For AI`;
  const description = `Browse ${CATALOG.length} AI tools across ${categories.length} categories — chat assistants, coding, images, video, research and more. Real pricing, key features, and alternatives for every tool.`;

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: CATALOG.length,
        itemListElement: CATALOG.map((t, i) => ({
          '@type': 'ListItem', position: i + 1, name: t.name, url: `${SITE}/tools/${t.id}.html`,
        })),
      },
    },
  ];

  const sections = categories.map(cat => {
    const tools = CATALOG.filter(t => t.category === cat);
    return `
    <section class="dir-category">
      <h2>${esc(cat)}</h2>
      <div class="alt-grid">
        ${tools.map(t => `<a class="alt-card" href="/tools/${t.id}.html">
          <div class="alt-card-name">${esc(t.name)}</div>
          <div class="alt-card-cost">${esc(t.costLabel)}</div>
          <div class="alt-card-desc">${esc(t.description)}</div>
        </a>`).join('\n        ')}
      </div>
    </section>`;
  }).join('\n');

  return `${head({ title, description, canonical: url, jsonLd })}
<body>
${nav('All Tools')}

  <main class="tool-wrap">
    <div class="breadcrumbs"><a href="/">Home</a> / AI Tools</div>
    <span class="cat-badge">${CATALOG.length} tools · ${categories.length} categories</span>
    <h1>AI Tool Directory</h1>
    <p class="tool-tagline">Every tool in the Central Hub For AI catalog — real pricing, key features, and same-category alternatives. Add any of them to your own stack with the free <a href="/">stack manager</a>.</p>
${sections}
    <div class="cta-banner">
      <h2>Stop paying for overlapping AI tools</h2>
      <p>Build your stack from these ${CATALOG.length} tools, then let the overlap detector and cost optimizer show you what to keep and what to cut.</p>
      <a class="btn-open-app" href="/">Open the Stack Manager</a>
    </div>
  </main>
${footer}
</body>
</html>
`;
}

/* ─── Sitemap ───────────────────────────────────────────────── */
function sitemap() {
  const entry = (loc, lastmod, changefreq, priority) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  const urls = [
    entry(`${SITE}/`, TODAY, 'weekly', '1.0'),
    entry(`${SITE}/features.html`, TODAY, 'monthly', '0.9'),
    entry(`${SITE}/blog/`, '2026-06-09', 'weekly', '0.8'),
    entry(`${SITE}/blog/what-is-ai-stacking.html`, '2026-06-09', 'monthly', '0.8'),
    entry(`${SITE}/tools/`, TODAY, 'weekly', '0.9'),
    ...CATALOG.map(t => entry(`${SITE}/tools/${t.id}.html`, TODAY, 'monthly', '0.7')),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`;
}

/* ─── Write everything ──────────────────────────────────────── */
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), indexPage());
CATALOG.forEach(t => fs.writeFileSync(path.join(OUT, `${t.id}.html`), toolPage(t)));
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap());

console.log(`Generated tools/index.html + ${CATALOG.length} tool pages, rebuilt sitemap.xml (${CATALOG.length + 5} URLs).`);
