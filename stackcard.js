/* ─── stackcard.js — Stack Card ── */

function initStackCard() {
  drawStackCard();
}

/* ── Canvas Drawing ── */
function drawStackCard() {
  const canvas = document.getElementById('stack-card-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 1200, H = 630;

  // clear
  ctx.clearRect(0, 0, W, H);

  // background
  ctx.fillStyle = '#08080e';
  ctx.fillRect(0, 0, W, H);

  // subtle top-right glow
  const glow = ctx.createRadialGradient(W, 0, 0, W, 0, 600);
  glow.addColorStop(0, 'rgba(124,109,250,0.07)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // bottom-left teal glow
  const glow2 = ctx.createRadialGradient(0, H, 0, 0, H, 500);
  glow2.addColorStop(0, 'rgba(0,212,170,0.05)');
  glow2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // left accent bar
  const bar = ctx.createLinearGradient(0, 0, 0, H);
  bar.addColorStop(0, '#7c6dfa');
  bar.addColorStop(1, '#00d4aa');
  ctx.fillStyle = bar;
  ctx.fillRect(0, 0, 5, H);

  const PAD_L = 68, PAD_R = 60, PAD_T = 50;

  if (STATE.stack.length === 0) {
    _scDrawEmpty(ctx, W, H, PAD_L, PAD_T);
  } else {
    _scDrawFull(ctx, W, H, PAD_L, PAD_R, PAD_T);
  }
}

function _scDrawEmpty(ctx, W, H, padL, padT) {
  ctx.fillStyle = '#606080';
  ctx.font = '600 11px Inter, system-ui, sans-serif';
  _scTrackedText(ctx, 'CENTRAL HUB FOR AI', padL, padT + 16, 2);

  ctx.fillStyle = '#f0f0ff';
  ctx.font = 'bold 48px Inter, system-ui, sans-serif';
  ctx.fillText('My AI Stack', padL, padT + 76);

  ctx.fillStyle = '#606080';
  ctx.font = '400 17px Inter, system-ui, sans-serif';
  ctx.fillText('Add tools to your stack to generate a shareable card.', padL, padT + 116);

  _scDrawFooter(ctx, W, H, padL, W - 60);
}

function _scDrawFull(ctx, W, H, padL, padR, padT) {
  const stack = STATE.stack;
  const spend = stack.reduce((s, t) => s + (parseFloat(t.cost) || 0), 0);
  const title = (document.getElementById('sc-card-title-input')?.value || '').trim() || 'My AI Stack';

  // logo label
  ctx.fillStyle = '#50506a';
  ctx.font = '600 11px Inter, system-ui, sans-serif';
  _scTrackedText(ctx, 'CENTRAL HUB FOR AI', padL, padT + 14, 2);

  // title
  ctx.fillStyle = '#f0f0ff';
  ctx.font = 'bold 50px Inter, system-ui, sans-serif';
  ctx.fillText(title, padL, padT + 72);

  // subtitle
  ctx.fillStyle = '#9090b0';
  ctx.font = '400 16px Inter, system-ui, sans-serif';
  const spendStr = spend > 0
    ? '$' + (spend % 1 === 0 ? spend : spend.toFixed(2)) + '/mo'
    : 'all free';
  ctx.fillText(`${stack.length} tool${stack.length !== 1 ? 's' : ''}  ·  ${spendStr}`, padL, padT + 110);

  // health grade badge (top right)
  if (typeof _computeHealthScore === 'function') {
    const result = _computeHealthScore();
    const GRADE_COLORS = { A: '#00d4aa', B: '#7c6dfa', C: '#f59e0b', D: '#f97316', F: '#f43f5e' };
    const gc = GRADE_COLORS[result.grade] || '#7c6dfa';
    const cx = W - padR - 50, cy = padT + 68, r = 50;

    // outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.strokeStyle = gc;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // inner fill (dim)
    ctx.beginPath();
    ctx.arc(cx, cy, r - 1, 0, Math.PI * 2);
    ctx.fillStyle = gc + '18';
    ctx.fill();

    // grade letter
    ctx.fillStyle = gc;
    ctx.font = 'bold 40px Inter, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(result.grade, cx, cy + 14);

    // label below
    ctx.fillStyle = '#50506a';
    ctx.font = '500 10px Inter, system-ui, sans-serif';
    ctx.fillText('STACK SCORE', cx, cy + r + 16);
    ctx.textAlign = 'left';
  }

  // sort tools by category so same-category tools cluster
  const sorted = [...stack].sort((a, b) => (a.category || '').localeCompare(b.category || ''));

  // tool chips
  const CHIP_W = 200, CHIP_H = 40, GAP_X = 12, GAP_Y = 10;
  const PER_ROW = 5, MAX_TOOLS = 25;
  const chipStartY = padT + 144;

  sorted.slice(0, MAX_TOOLS).forEach((tool, i) => {
    const col = i % PER_ROW;
    const row = Math.floor(i / PER_ROW);
    const x = padL + col * (CHIP_W + GAP_X);
    const y = chipStartY + row * (CHIP_H + GAP_Y);
    _scDrawChip(ctx, tool, x, y, CHIP_W, CHIP_H);
  });

  // "+N more" label
  if (stack.length > MAX_TOOLS) {
    const lastRow = Math.floor((MAX_TOOLS - 1) / PER_ROW);
    const extraY = chipStartY + (lastRow + 1) * (CHIP_H + GAP_Y) + 16;
    ctx.fillStyle = '#50506a';
    ctx.font = '400 13px Inter, system-ui, sans-serif';
    ctx.fillText(`+${stack.length - MAX_TOOLS} more`, padL, extraY);
  }

  _scDrawFooter(ctx, W, H, padL, W - padR);
}

const _SC_CAT_COLORS = {
  'General AI Chat':       { color: '#7c6dfa', bg: '#2a2550' },
  'Coding Assistant':      { color: '#3b82f6', bg: '#0e1e3d' },
  'Writing & Content':     { color: '#00d4aa', bg: '#0a3330' },
  'Image Generation':      { color: '#ec4899', bg: '#3d0a24' },
  'Video Creation':        { color: '#f97316', bg: '#3d1a06' },
  'Audio & Transcription': { color: '#f59e0b', bg: '#3a2800' },
  'Research & Search':     { color: '#06b6d4', bg: '#062830' },
  'Productivity & Notes':  { color: '#22c55e', bg: '#0a2818' },
  'SEO & Marketing':       { color: '#f43f5e', bg: '#3a0a15' },
  'Data & Analytics':      { color: '#a78bfa', bg: '#200d40' },
  'Other':                 { color: '#606080', bg: '#1a1a26' },
};

function _scDrawChip(ctx, tool, x, y, w, h) {
  const cs = _SC_CAT_COLORS[tool.category] || _SC_CAT_COLORS['Other'];
  const r  = 7;

  // chip bg
  ctx.fillStyle = cs.bg;
  _scRoundRect(ctx, x, y, w, h, r);
  ctx.fill();

  // left accent bar (3px, full height, same radius only left corners)
  ctx.fillStyle = cs.color;
  _scRoundRect(ctx, x, y, 3, h, [r, 0, 0, r]);
  ctx.fill();

  // tool name
  ctx.fillStyle = '#dcdcf0';
  ctx.font = '600 12.5px Inter, system-ui, sans-serif';
  const maxNameW = w - 18 - (tool.cost > 0 ? 28 : 0);
  let name = tool.name;
  while (ctx.measureText(name).width > maxNameW && name.length > 3) {
    name = name.slice(0, -1);
  }
  if (name !== tool.name) name = name.slice(0, -1) + '…';
  ctx.fillText(name, x + 10, y + h / 2 + 4.5);

  // cost label
  if (tool.cost > 0) {
    const n = parseFloat(tool.cost);
    const costStr = '$' + (n % 1 === 0 ? n : n.toFixed(0));
    ctx.fillStyle = '#50506a';
    ctx.font = '400 10px Inter, system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(costStr, x + w - 7, y + h - 8);
    ctx.textAlign = 'left';
  }
}

function _scDrawFooter(ctx, W, H, padL, padR) {
  const lineY = H - 58;

  // gradient line
  const grad = ctx.createLinearGradient(padL, 0, padR, 0);
  grad.addColorStop(0, 'rgba(34,34,58,0)');
  grad.addColorStop(0.25, 'rgba(124,109,250,0.35)');
  grad.addColorStop(0.75, 'rgba(0,212,170,0.35)');
  grad.addColorStop(1, 'rgba(34,34,58,0)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padL, lineY);
  ctx.lineTo(padR, lineY);
  ctx.stroke();

  // URL
  ctx.fillStyle = '#50506a';
  ctx.font = '400 11px Inter, system-ui, sans-serif';
  ctx.fillText('centralhubforai.netlify.app', padL, H - 34);

  // date
  ctx.textAlign = 'right';
  ctx.fillText(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), padR, H - 34);
  ctx.textAlign = 'left';
}

function _scRoundRect(ctx, x, y, w, h, r) {
  const [rtl, rtr, rbr, rbl] = typeof r === 'number' ? [r, r, r, r] : r;
  ctx.beginPath();
  ctx.moveTo(x + rtl, y);
  ctx.lineTo(x + w - rtr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rtr);
  ctx.lineTo(x + w, y + h - rbr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rbr, y + h);
  ctx.lineTo(x + rbl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rbl);
  ctx.lineTo(x, y + rtl);
  ctx.quadraticCurveTo(x, y, x + rtl, y);
  ctx.closePath();
}

function _scTrackedText(ctx, text, x, y, spacing) {
  let cx = x;
  for (const ch of text) {
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
}

/* ── Actions ── */
function downloadStackCard() {
  const canvas = document.getElementById('stack-card-canvas');
  if (!canvas) return;
  const a = document.createElement('a');
  a.href = canvas.toDataURL('image/png');
  a.download = 'my-ai-stack-' + new Date().toISOString().slice(0, 10) + '.png';
  a.click();
  logActivity('Downloaded stack card as PNG', 'teal');
}

async function copyStackCardToClipboard() {
  const canvas = document.getElementById('stack-card-canvas');
  const btn    = document.getElementById('sc-copy-btn');
  if (!canvas) return;

  if (!navigator.clipboard?.write) {
    alert('Clipboard image copy is not supported in this browser. Use Download instead.');
    return;
  }

  try {
    await new Promise((resolve, reject) => {
      canvas.toBlob(async blob => {
        try {
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          resolve();
        } catch(e) { reject(e); }
      });
    });
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => { btn.textContent = orig; }, 2000);
    }
    logActivity('Copied stack card to clipboard', 'teal');
  } catch(e) {
    alert('Could not copy image. Try the Download button instead.');
  }
}
