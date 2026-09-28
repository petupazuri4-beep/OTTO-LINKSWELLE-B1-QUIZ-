import { state, toggleBookmark, isBookmarked, t } from '../state.js';
import { VOCAB } from '../data/vocab.js';
import { speak } from '../utils/audio.js';

let searchQuery = '';
let selectedTypeFilter = 'all'; // 'all' | 'n' | 'v' | 'a'

export function renderSearch(container) {
  const allEntries = [];
  Object.entries(VOCAB).forEach(([topicName, words]) => {
    words.forEach(w => {
      allEntries.push({ ...w, topic: topicName });
    });
  });

  const filtered = allEntries.filter(item => {
    if (selectedTypeFilter !== 'all' && item.t !== selectedTypeFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return item.g.toLowerCase().includes(q) || item.e.toLowerCase().includes(q);
  });

  container.innerHTML = `
    <div class="mx-auto max-w-lg pb-28">
      <!-- Search Header -->
      <div class="sticky top-0 z-10 bg-white px-4 py-4.5 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800">
        <h2 class="text-base font-black tracking-tight flex items-center gap-1.5">
          <span>🔍</span> ${t('B1 Lexicon & Dictionary', 'B1 Wortschatz-Lexikon')}
        </h2>
        <p class="text-[10.5px] text-gray-500 dark:text-slate-400 mt-0.5">
          ${allEntries.length} ${t('curated German vocabulary entries', 'geprüfte B1-Vokabeln')}
        </p>

        <!-- Search Bar -->
        <div class="mt-3 relative">
          <input
            id="search-input-field"
            type="text"
            value="${searchQuery}"
            placeholder="${t('Search German or English term...', 'Deutsch oder Englisch suchen...')}"
            class="w-full rounded-2xl bg-gray-100 dark:bg-slate-800 py-2.5 pl-10 pr-4 text-xs font-semibold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-gray-200 dark:border-slate-700"
          />
          <span class="absolute left-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
          ${searchQuery ? `
            <button id="clear-search-btn" class="absolute right-3 top-2 text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold cursor-pointer">
              ✕
            </button>
          ` : ''}
        </div>

        <!-- Filter Chips -->
        <div class="mt-3 flex gap-1.5 overflow-x-auto no-scrollbar">
          ${[
            { key: 'all', label: t('All', 'Alle') },
            { key: 'n', label: t('Nouns', 'Nomen') },
            { key: 'v', label: t('Verbs', 'Verben') },
            { key: 'a', label: t('Adjectives', 'Adjektive') }
          ].map(f => `
            <button data-filter="${f.key}" class="search-filter-btn px-3 py-1 text-[10.5px] font-bold rounded-full transition cursor-pointer ${
              selectedTypeFilter === f.key
                ? 'theme-bg-primary font-black shadow-xs'
                : 'bg-gray-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-gray-200/80 dark:border-slate-700'
            }">
              ${f.label}
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Results Count -->
      <div class="px-4 py-3 flex justify-between items-center text-[11px] text-gray-500 dark:text-slate-400 font-semibold">
        <span>${t('Found results:', 'Gefundene Wörter:')} ${filtered.length}</span>
        <span>${selectedTypeFilter.toUpperCase()}</span>
      </div>

      <!-- Results List -->
      <div class="px-4 space-y-2">
        ${filtered.slice(0, 80).map(item => `
          <div class="flex items-center justify-between rounded-2xl border border-gray-150 bg-white p-3.5 shadow-xs dark:bg-slate-900 dark:border-slate-800 text-left">
            <div class="flex-1 min-w-0 pr-3">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-black text-slate-900 dark:text-white truncate">${item.g}</h4>
                <span class="rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase ${
                  item.t === 'n' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300' :
                  item.t === 'v' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300' :
                  'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                }">
                  ${item.t === 'n' ? 'noun' : item.t === 'v' ? 'verb' : 'adj'}
                </span>
              </div>
              <p class="text-xs text-gray-500 dark:text-slate-400 mt-0.5 capitalize truncate">${item.e}</p>
              <span class="text-[9.5px] text-slate-400 font-mono">${item.topic}</span>
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button data-speech-text="${item.g}" class="search-audio-btn w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition cursor-pointer">
                🔊
              </button>
              <button data-bookmark-word="${item.g}" class="search-bm-btn w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center transition cursor-pointer text-sm">
                ${isBookmarked(item.g) ? '★' : '☆'}
              </button>
            </div>
          </div>
        `).join('')}

        ${filtered.length > 80 ? `
          <div class="text-center text-xs text-gray-400 py-3 font-semibold">
            ${t(`Showing top 80 of ${filtered.length} entries. Refine search for more.`, `Zeige die ersten 80 von ${filtered.length} Einträgen.`)}
          </div>
        ` : ''}

        ${filtered.length === 0 ? `
          <div class="p-8 text-center text-gray-400">
            <div class="text-3xl mb-2">🔍</div>
            <p class="text-xs font-semibold">${t('No vocabulary matching your search query.', 'Keine passenden Vokabeln gefunden.')}</p>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  // Attach Listeners
  const input = container.querySelector('#search-input-field');
  input?.addEventListener('input', () => {
    searchQuery = input.value;
    renderSearch(container);
    const newInput = container.querySelector('#search-input-field');
    if (newInput) {
      newInput.focus();
      newInput.setSelectionRange(newInput.value.length, newInput.value.length);
    }
  });

  container.querySelector('#clear-search-btn')?.addEventListener('click', () => {
    searchQuery = '';
    renderSearch(container);
  });

  container.querySelectorAll('.search-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedTypeFilter = btn.getAttribute('data-filter');
      renderSearch(container);
    });
  });

  container.querySelectorAll('.search-audio-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-speech-text');
      if (text) speak(text, true);
    });
  });

  container.querySelectorAll('.search-bm-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const wordStr = btn.getAttribute('data-bookmark-word');
      const item = allEntries.find(w => w.g === wordStr);
      if (item) {
        toggleBookmark(item);
        renderSearch(container);
      }
    });
  });
}
