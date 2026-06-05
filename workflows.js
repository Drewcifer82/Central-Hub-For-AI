/* ─── workflows.js — Workflow Builder ── */

const WF_ROLES = {
  'Input':      { color: '#06b6d4', bg: '#062830' },
  'Research':   { color: '#22c55e', bg: '#0a2818' },
  'Draft':      { color: '#7c6dfa', bg: '#2a2550' },
  'Generate':   { color: '#ec4899', bg: '#3d0a24' },
  'Edit':       { color: '#f59e0b', bg: '#3a2800' },
  'Review':     { color: '#f97316', bg: '#3d1a06' },
  'Automate':   { color: '#3b82f6', bg: '#0e1e3d' },
  'Distribute': { color: '#00d4aa', bg: '#0a3330' },
  'Archive':    { color: '#606080', bg: '#1a1a26' },
};

const WF_STATE = {
  workflows: JSON.parse(localStorage.getItem('aiHub_workflows') || '[]'),
  activeId:  null,
  draft:     { name: '', steps: [] },
};

/* ── Init ── */
function initWorkflow() {
  _populateWFDatalist();
  renderWorkflowChain();
  renderSavedWorkflows();
}

function _populateWFDatalist() {
  const dl = document.getElementById('wf-tool-datalist');
  if (!dl) return;
  const names = new Set();
  STATE.stack.forEach(t => names.add(t.name));
  CATALOG.forEach(t => names.add(t.name));
  dl.innerHTML = [...names].sort().map(n => `<option value="${n}">`).join('');
}

/* ── Chain Renderer ── */
function renderWorkflowChain() {
  const el = document.getElementById('workflow-chain');
  if (!el) return;

  const steps = WF_STATE.draft.steps;

  if (steps.length === 0) {
    el.innerHTML = `
      <div class="wf-empty">
        <svg fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
          <path d="M7 12h3M14 12h3"/>
        </svg>
        <h3>No steps yet</h3>
        <p>Add your first step to start building a workflow pipeline.</p>
        <button class="btn btn-primary" onclick="openAddStepModal()">Add First Step</button>
      </div>`;
    return;
  }

  const stepCards = steps.map((step, i) => {
    const role    = WF_ROLES[step.role] || WF_ROLES['Input'];
    const catData = _lookupToolCat(step.toolName);
    const catChip = catData
      ? `<span class="wf-step-cat" style="background:${catData.bg};color:${catData.color};border-color:${catData.color}33">${catData.label}</span>`
      : '';
    const noteHTML = step.note
      ? `<div class="wf-step-note">${step.note}</div>`
      : '';
    const arrow = i < steps.length - 1
      ? `<div class="wf-arrow">
           <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
             <path d="M5 12h14M12 5l7 7-7 7"/>
           </svg>
         </div>`
      : '';

    return `
      <div class="wf-step-card">
        <div class="wf-step-header">
          <div class="wf-step-num">${i + 1}</div>
          <span class="wf-role-badge" style="background:${role.bg};color:${role.color}">${step.role}</span>
        </div>
        <div class="wf-step-tool">${step.toolName}</div>
        ${catChip}
        ${noteHTML}
        <button class="wf-step-remove" onclick="removeWFStep(${i})">✕ Remove</button>
      </div>
      ${arrow}`;
  }).join('');

  el.innerHTML = stepCards + `
    <div class="wf-arrow">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M5 12h14M12 5l7 7-7 7"/>
      </svg>
    </div>
    <div class="wf-add-card" onclick="openAddStepModal()">
      <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12h14"/>
      </svg>
      <span class="wf-add-label">Add Step</span>
    </div>`;
}

function _lookupToolCat(name) {
  const stackTool   = STATE.stack.find(t => t.name.toLowerCase() === name.toLowerCase());
  const catalogTool = CATALOG.find(t => t.name.toLowerCase() === name.toLowerCase());
  const tool = stackTool || catalogTool;
  return tool ? getCatStyle(tool.category) : null;
}

/* ── Add Step Modal ── */
function openAddStepModal() {
  _populateWFDatalist();
  document.getElementById('wf-step-tool').value = '';
  document.getElementById('wf-step-role').value = 'Input';
  document.getElementById('wf-step-note').value = '';
  document.getElementById('addStepModal').classList.add('open');
  setTimeout(() => document.getElementById('wf-step-tool').focus(), 50);
}

function closeAddStepModal() {
  document.getElementById('addStepModal').classList.remove('open');
}

function confirmAddWFStep() {
  const toolName = document.getElementById('wf-step-tool').value.trim();
  const role     = document.getElementById('wf-step-role').value;
  const note     = document.getElementById('wf-step-note').value.trim();

  if (!toolName) {
    document.getElementById('wf-step-tool').focus();
    return;
  }

  WF_STATE.draft.steps.push({ toolName, role, note });
  closeAddStepModal();
  renderWorkflowChain();
}

function removeWFStep(index) {
  WF_STATE.draft.steps.splice(index, 1);
  renderWorkflowChain();
}

/* ── Save / Load ── */
function saveWorkflow() {
  const name = document.getElementById('wf-name-input').value.trim() || 'Untitled Workflow';

  if (WF_STATE.draft.steps.length === 0) {
    alert('Add at least one step before saving.');
    return;
  }

  if (WF_STATE.activeId !== null) {
    const idx = WF_STATE.workflows.findIndex(w => w.id === WF_STATE.activeId);
    if (idx >= 0) {
      WF_STATE.workflows[idx] = { id: WF_STATE.activeId, name, steps: [...WF_STATE.draft.steps] };
    }
  } else {
    const wf = { id: Date.now(), name, steps: [...WF_STATE.draft.steps] };
    WF_STATE.workflows.unshift(wf);
    WF_STATE.activeId = wf.id;
  }

  localStorage.setItem('aiHub_workflows', JSON.stringify(WF_STATE.workflows));
  renderSavedWorkflows();
  logActivity(`Saved workflow "<strong>${name}</strong>"`, 'purple');
}

function loadWFWorkflow(id) {
  const wf = WF_STATE.workflows.find(w => w.id === id);
  if (!wf) return;
  WF_STATE.activeId  = wf.id;
  WF_STATE.draft     = { name: wf.name, steps: [...wf.steps] };
  document.getElementById('wf-name-input').value = wf.name;
  renderWorkflowChain();
  renderSavedWorkflows();
}

function newWorkflow() {
  WF_STATE.activeId = null;
  WF_STATE.draft    = { name: '', steps: [] };
  const inp = document.getElementById('wf-name-input');
  if (inp) inp.value = '';
  renderWorkflowChain();
  renderSavedWorkflows();
}

function deleteWFWorkflow(id, event) {
  event.stopPropagation();
  const wf = WF_STATE.workflows.find(w => w.id === id);
  if (!wf) return;
  if (!confirm(`Delete "${wf.name}"?`)) return;
  WF_STATE.workflows = WF_STATE.workflows.filter(w => w.id !== id);
  if (WF_STATE.activeId === id) newWorkflow();
  localStorage.setItem('aiHub_workflows', JSON.stringify(WF_STATE.workflows));
  renderSavedWorkflows();
}

/* ── Saved Workflows ── */
function renderSavedWorkflows() {
  const el = document.getElementById('saved-workflows-section');
  if (!el) return;

  if (WF_STATE.workflows.length === 0) {
    el.innerHTML = '';
    return;
  }

  el.innerHTML = `
    <div style="margin-top:22px">
      <div style="font-size:11px;font-weight:700;color:var(--text-dim);letter-spacing:0.08em;text-transform:uppercase;margin-bottom:10px">Saved Workflows</div>
      <div class="saved-wf-grid">
        ${WF_STATE.workflows.map(wf => {
          const isActive = wf.id === WF_STATE.activeId;
          const stepSummary = wf.steps.length === 0
            ? 'No steps'
            : wf.steps.map(s => s.toolName).slice(0, 4).join(' → ') + (wf.steps.length > 4 ? ' …' : '');
          return `
            <div class="saved-wf-card ${isActive ? 'wf-active' : ''}" onclick="loadWFWorkflow(${wf.id})">
              <div>
                <div class="saved-wf-name">${wf.name}</div>
                <div class="saved-wf-meta">${wf.steps.length} step${wf.steps.length !== 1 ? 's' : ''} · ${stepSummary}</div>
              </div>
              <button class="saved-wf-del" onclick="deleteWFWorkflow(${wf.id}, event)" title="Delete">×</button>
            </div>`;
        }).join('')}
      </div>
    </div>`;
}
