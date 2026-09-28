// Lightweight, accessible non-blocking toast notifications (avoids window.alert inside iframe)

let toastContainer = null;

function getToastContainer() {
  if (typeof document === 'undefined') return null;
  if (!toastContainer || !document.body.contains(toastContainer)) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'app-toast-container';
    toastContainer.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none';
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = 'info', duration = 3500) {
  if (typeof document === 'undefined' || !message) return;
  const container = getToastContainer();
  if (!container) return;

  const toast = document.createElement('div');
  const bgClasses = {
    info: 'bg-slate-900/95 dark:bg-slate-800/95 text-white border-slate-700',
    warning: 'bg-amber-600/95 text-white border-amber-500',
    error: 'bg-rose-600/95 text-white border-rose-500',
    success: 'bg-emerald-600/95 text-white border-emerald-500'
  }[type] || 'bg-slate-900/95 text-white border-slate-700';

  const icon = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '🚨',
    success: '✅'
  }[type] || 'ℹ️';

  toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-sm font-medium backdrop-blur-md transition-all duration-300 transform translate-y-[-10px] opacity-0 pointer-events-auto ${bgClasses}`;
  toast.innerHTML = `
    <span class="text-base select-none">${icon}</span>
    <span class="flex-1 leading-snug">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation in
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-[-10px]', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Auto remove
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-[-10px]', 'opacity-0');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 350);
  }, duration);
}
