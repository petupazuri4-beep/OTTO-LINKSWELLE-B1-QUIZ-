import { state, toggleBookmark, t } from '../state.js';
import { speak } from '../utils/audio.js';

export function renderSaved(container) {
  const bookmarks = state.bookmarks || [];

  container.innerHTML = `
    <div class="mx-auto max-w-lg pb-28">
      <!-- Saved Header -->
      <div class="sticky top-0 z-10 bg-white px-4 py-4.5 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 class="text-base font-black tracking-tight flex items-center gap-1.5 leading-none">
            <span>⭐</span> ${t('Saved Words', 'Gemerkt')}
          </h2>
          <p class="text-[10.5px] text-gray-500 dark:text-slate-400 mt-1">
            ${bookmarks.length} ${t('personal review bookmarks', 'gespeicherte Vokabeln')}
          </p>
        </div>
        ${bookmarks.length > 0 ? `
          <button id="export-sheet-btn" class="px-3 py-1.5 theme-bg-primary text-xs font-black rounded-xl shadow cursor-pointer transition active:scale-95">
            📥 ${t('Export Sheet', 'Druckbogen')}
          </button>
        ` : ''}
      </div>

      <!-- Bookmarks List -->
      <div class="p-4 space-y-2.5">
        ${bookmarks.map((w, idx) => `
          <div class="flex items-center justify-between rounded-2xl border border-gray-150 bg-white p-4 shadow-xs dark:bg-slate-900 dark:border-slate-800 text-left">
            <div class="flex-1 min-w-0 pr-3">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-black text-slate-900 dark:text-white truncate">${w.g}</h4>
                <span class="rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                  w.t === 'n' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' :
                  w.t === 'v' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                }">
                  ${w.t === 'n' ? 'noun' : w.t === 'v' ? 'verb' : 'adj'}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-0.5 capitalize truncate">${w.e}</p>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button data-speech-text="${w.g}" class="saved-audio-btn w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition cursor-pointer">
                🔊
              </button>
              <button data-remove-idx="${idx}" class="saved-remove-btn w-9 h-9 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center justify-center transition cursor-pointer text-xs font-bold">
                ✕
              </button>
            </div>
          </div>
        `).join('')}

        ${bookmarks.length === 0 ? `
          <div class="p-12 text-center text-gray-400">
            <div class="text-4xl mb-3">⭐</div>
            <h3 class="text-sm font-black text-gray-700 dark:text-slate-300 mb-1">
              ${t('No saved words yet', 'Noch keine Vokabeln gemerkt')}
            </h3>
            <p class="text-xs max-w-xs mx-auto leading-relaxed">
              ${t(
                'Bookmark words during quizzes, in the Word of the Day card, or via the search lexicon to review them anytime offline.',
                'Klicke beim Lernen auf den Stern, um schwierige Vokabeln hier für gezieltes Wiederholen zu speichern.'
              )}
            </p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Attach Listeners
  container.querySelectorAll('.saved-audio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-speech-text');
      if (text) speak(text, true);
    });
  });

  container.querySelectorAll('.saved-remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-remove-idx'), 10);
      state.bookmarks.splice(idx, 1);
      try {
        localStorage.setItem('lw_bm', JSON.stringify(state.bookmarks));
      } catch {}
      renderSaved(container);
    });
  });

  container.querySelector('#export-sheet-btn')?.addEventListener('click', () => {
    exportPrintableSheet(bookmarks);
  });
}

function exportPrintableSheet(bookmarks) {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="utf-8">
      <title>Linkswelle B1 Wortschatz - Lernblatt</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; margin: 40px; color: #1e293b; }
        h1 { font-size: 24px; font-weight: 800; border-bottom: 2px solid #0f172a; padding-bottom: 8px; margin-bottom: 4px; }
        .meta { color: #64748b; font-size: 12px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; font-size: 14px; }
        th { background: #f8fafc; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
        .tag { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
        .noun { background: #dbeafe; color: #1d4ed8; }
        .verb { background: #fef3c7; color: #b45309; }
        .adj { background: #d1fae5; color: #047857; }
        @media print { body { margin: 20px; } }
      </style>
    </head>
    <body>
      <h1>Linkswelle B1 Wortschatz • Vokabel-Lernblatt</h1>
      <div class="meta">Erstellt am ${new Date().toLocaleDateString('de-DE')} • ${bookmarks.length} Vokabeln</div>
      <table>
        <thead>
          <tr>
            <th style="width: 8%;">Nr.</th>
            <th style="width: 45%;">Deutsches Wort</th>
            <th style="width: 15%;">Wortart</th>
            <th style="width: 32%;">Englische Übersetzung</th>
          </tr>
        </thead>
        <tbody>
          ${bookmarks.map((w, i) => `
            <tr>
              <td>${i + 1}</td>
              <td><strong>${w.g}</strong></td>
              <td><span class="tag ${w.t === 'n' ? 'noun' : w.t === 'v' ? 'verb' : 'adj'}">${w.t === 'n' ? 'Nomen' : w.t === 'v' ? 'Verb' : 'Adjektiv'}</span></td>
              <td>${w.e}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `B1_Wortschatz_Lernblatt_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
