/* ─── nav.js — dynamic sidebar nav from config ─────────────── */

const NAV_CONFIG = [
  {
    section: 'Overview',
    items: [
      {
        page:  'home',
        label: 'Dashboard',
        icon:  `<path d="M3 12L12 3l9 9"/><path d="M9 21V12h6v9"/>`,
      },
      {
        page:  'stack',
        label: 'My Stack',
        icon:  `<rect x="2" y="3" width="20" height="4" rx="1"/>
                <rect x="2" y="10" width="20" height="4" rx="1"/>
                <rect x="2" y="17" width="20" height="4" rx="1"/>`,
        badge: 'stack-count',
      },
      {
        page:  'catalog',
        label: 'Tool Catalog',
        icon:  `<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>`,
      },
      {
        page:  'templates',
        label: 'Stack Templates',
        icon:  `<rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>`,
      },
    ],
  },
  {
    section: 'AI Features',
    items: [
      {
        page:  'overlap',
        label: 'Overlap Detector',
        icon:  `<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6"/>`,
      },
      {
        page:  'gaps',
        label: 'Gap Finder',
        icon:  `<path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/>`,
      },
      {
        page:  'compare',
        label: 'Compare Tools',
        icon:  `<path d="M18 20V10M12 20V4M6 20v-6"/>`,
      },
      {
        page:  'integrations',
        label: 'Integration Map',
        icon:  `<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>`,
      },
      {
        page:  'cost',
        label: 'Cost Optimizer',
        icon:  `<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>`,
      },
      {
        page:  'stackcompare',
        label: 'Stack Compare',
        icon:  `<path d="M18 20V10M12 20V4M6 20v-6"/>`,
      },
    ],
  },
  {
    section: 'Resources',
    items: [
      {
        page:  'promptlibrary',
        label: 'Prompt Library',
        icon:  `<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>`,
      },
      {
        href:   '/tools/',
        label:  'Tool Directory',
        target: '_blank',
        icon:   `<rect x="3" y="3" width="18" height="18" rx="2"/>
                 <path d="M3 9h18M9 21V9"/>`,
      },
      {
        href:   '/blog/',
        label:  'Blog',
        target: '_blank',
        icon:   `<path d="M19 20H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h10l6 6v8a2 2 0 0 1-2 2z"/>
                 <path d="M17 20v-8h-6V4"/>`,
      },
    ],
  },
];

function buildNav() {
  const container = document.getElementById('nav-items-container');
  let html = '';

  NAV_CONFIG.forEach((group, i) => {
    if (i > 0) html += '<div class="nav-divider"></div>';
    html += `<div class="nav-section-label">${group.section}</div>`;

    group.items.forEach(item => {
      if (item.href) {
        html += `
          <a class="nav-item" href="${item.href}" target="${item.target || '_self'}">
            <span class="nav-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                ${item.icon}
              </svg>
            </span>
            ${item.label}
            <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="width:10px;height:10px;margin-left:auto;opacity:0.35;flex-shrink:0">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>`;
      } else {
        const active = item.page === 'home' ? ' active' : '';
        const badge  = item.badge
          ? `<span class="nav-badge" id="${item.badge}">0</span>`
          : '';
        html += `
          <button class="nav-item${active}" onclick="navigate('${item.page}')">
            <span class="nav-icon">
              <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                ${item.icon}
              </svg>
            </span>
            ${item.label}${badge}
          </button>`;
      }
    });
  });

  container.innerHTML = html;
}

buildNav();
