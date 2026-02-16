/**
 * App Initialisation
 */
document.addEventListener('DOMContentLoaded', async () => {
  await Auth.init();
});

/* ── Global Error Handler ───────────────────────────── */
window.addEventListener('unhandledrejection', (event) => {
  const err = event.reason || {};
  if (err.status === 401) return;
  const message = err.message || 'An unexpected error occurred';
  showToast(message, 'error');
});

/* ── Toast Notifications ─────────────────────────────── */
function showToast(message, type) {
  type = type || 'info';
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ── Loading Overlay ─────────────────────────────────── */
function showLoading() {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.id = 'loadingOverlay';
  overlay.innerHTML = '<div class="spinner" style="width:48px;height:48px;border-width:4px;"></div>';
  document.body.appendChild(overlay);
}

function hideLoading() {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) overlay.remove();
}

/* ── Format Helpers ──────────────────────────────────── */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m + ':' + String(s).padStart(2, '0');
}

function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function getCategoryColor(cat) {
  if (cat === 'NR') return 'var(--gold-400)';
  if (cat === 'DI') return 'var(--blue-400)';
  if (cat === 'LR') return 'var(--purple-400)';
  return 'var(--slate-400)';
}

function getCategoryName(cat) {
  if (cat === 'NR') return 'Numerical Reasoning';
  if (cat === 'DI') return 'Data Interpretation';
  if (cat === 'LR') return 'Logical Reasoning';
  return cat;
}
