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
];

function buildNav() {
  const container = document.getElementById('nav-items-container');
  let html = '';

  NAV_CONFIG.forEach((group, i) => {
    if (i > 0) html += '<div class="nav-divider"></div>';
    html += `<div class="nav-section-label">${group.section}</div>`;

    group.items.forEach(item => {
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
    });
  });

  container.innerHTML = html;
}

buildNav();
