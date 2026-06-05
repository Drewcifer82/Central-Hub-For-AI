/* ─── app.js — shared state, navigation, activity, sidebar ── */

const STATE = {
  stack:    JSON.parse(localStorage.getItem('aiHub_stack')    || '[]'),
  activity: JSON.parse(localStorage.getItem('aiHub_activity') || '[]'),
};

const PAGE_META = {
  home:    { title: 'Dashboard',        sub: "Welcome back — here's your AI stack at a glance" },
  stack:   { title: 'My Stack',         sub: 'All the AI tools you currently use' },
  catalog: { title: 'Tool Catalog',     sub: 'Browse popular AI tools by category' },
  overlap: { title: 'Overlap Detector', sub: 'Find tools in your stack that do the same job' },
  gaps:    { title: 'Gap Finder',       sub: 'Discover tool categories missing from your stack' },
  compare: { title: 'Compare Tools',    sub: 'Side-by-side tool comparison' },
};

/* ── Navigation ── */
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById('page-' + page).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('onclick') === `navigate('${page}')`) item.classList.add('active');
  });

  const meta = PAGE_META[page];
  document.getElementById('topbar-title').textContent = meta.title;
  document.getElementById('topbar-sub').textContent   = meta.sub;

  closeSidebar();
}

/* ── Dashboard Stats ── */
function refreshStats() {
  const count = STATE.stack.length;
  const spend = STATE.stack.reduce((s, t) => s + (parseFloat(t.cost) || 0), 0);

  document.getElementById('stat-tool-count').textContent = count;
  document.getElementById('stack-count').textContent     = count;
  document.getElementById('stat-spend').innerHTML = `$${spend.toFixed(spend % 1 === 0 ? 0 : 2)}<span>/mo</span>`;

  document.getElementById('stat-tool-delta').textContent =
    count === 0 ? 'No tools added yet' : count === 1 ? '1 tool tracked' : `${count} tools tracked`;

  document.getElementById('stat-spend-delta').textContent =
    spend === 0 ? 'Add tools to track costs' : `$${(spend * 12).toFixed(0)}/yr estimated`;
}

/* ── Activity Feed ── */
function logActivity(text, color = 'purple') {
  STATE.activity.unshift({
    text, color,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  });
  if (STATE.activity.length > 20) STATE.activity.pop();
  localStorage.setItem('aiHub_activity', JSON.stringify(STATE.activity));
  renderActivity();
}

function renderActivity() {
  const body = document.getElementById('activity-body');
  if (STATE.activity.length === 0) {
    body.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"/>
          </svg>
        </div>
        <h4>No activity yet</h4>
        <p>Actions like adding tools or running analysis will appear here.</p>
      </div>`;
    return;
  }
  body.innerHTML = `<div class="activity-list">` +
    STATE.activity.slice(0, 8).map(a => `
      <div class="activity-item">
        <div class="activity-dot ${a.color}"></div>
        <div class="activity-text">${a.text}</div>
        <div class="activity-time">${a.time}</div>
      </div>`).join('') +
    `</div>`;
}

/* ── Mobile Sidebar ── */
function toggleSidebar() {
  document.getElementById('sidebar').classList.contains('mobile-open') ? closeSidebar() : openSidebar();
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('mobile-open');
  document.getElementById('sidebarBackdrop').classList.add('show');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('sidebarBackdrop').classList.remove('show');
}

/* ── Modal overlay close ── */
document.getElementById('addToolModal').addEventListener('click', function(e) {
  if (e.target === this) closeAddToolModal();
});

/* ── Init ── */
refreshStats();
renderActivity();
