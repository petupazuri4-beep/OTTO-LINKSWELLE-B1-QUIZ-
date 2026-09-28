import './index.css';
import { state, loadState, subscribe, setTab, notify, t } from './state.js';
import { unlockTTS } from './utils/audio.js';
import { renderHome } from './views/home.js';
import { renderTopic } from './views/topic.js';
import { renderQuiz } from './views/quiz.js';
import { renderFlashcard } from './views/flashcard.js';
import { renderExams } from './views/exams.js';
import { renderSearch } from './views/search.js';
import { renderSaved } from './views/saved.js';
import { renderProfile } from './views/profile.js';
import { renderStats } from './views/stats.js';
import { renderSettings } from './views/settings.js';
import { renderSettingsModal } from './views/settingsModal.js';

// Setup Audio Autoplay Unlock
window.addEventListener('click', unlockTTS, { once: true });
window.addEventListener('touchstart', unlockTTS, { once: true });

// Register Offline Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((reg) => {
        reg.update();
        console.log('[Service Worker] Successfully registered:', reg.scope);
      })
      .catch((err) => {
        console.warn('[Service Worker] Registration issue:', err);
      });
  });
}

// Network connectivity awareness
window.addEventListener('online', () => {
  state.isOnline = true;
  notify();
});
window.addEventListener('offline', () => {
  state.isOnline = false;
  notify();
});

// Load Saved State from storage
loadState();

const app = document.getElementById('app');

function renderApp() {
  const isQuizOrFC = state.screen === 'quiz' || state.screen === 'flashcard';

  app.innerHTML = `
    <div class="relative min-h-screen max-w-lg mx-auto bg-white dark:bg-slate-950 font-sans shadow-2xl transition-colors duration-250">
      <!-- Offline Notice Banner when disconnected -->
      ${!state.isOnline ? `
        <div class="sticky top-0 z-50 bg-amber-500 text-slate-950 px-4 py-1.5 text-xs font-bold flex items-center justify-between shadow-xs">
          <span class="flex items-center gap-1.5">
            <span>⚡</span> ${t('Offline Mode Active: All vocabulary & progress stored locally', 'Offline-Modus aktiv: Alle Vokabeln & Fortschritt sind lokal verfügbar')}
          </span>
          <span class="text-[10px] uppercase font-black tracking-wider bg-black/10 px-2 py-0.5 rounded-full">${t('Offline', 'Offline')}</span>
        </div>
      ` : ''}

      <!-- Active View Container -->
      <main id="main-view" class="min-h-screen"></main>

      <!-- Bottom Navigation Bar (hidden during active quiz or flashcards) -->
      ${!isQuizOrFC ? `
        <nav class="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-gray-200/80 dark:border-slate-800 px-2 py-2 flex items-center z-40 shadow-lg overflow-x-auto no-scrollbar gap-2 shrink-0">
          <button data-tab="home" class="nav-tab-btn flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer shrink-0 ${
            state.tab === 'home' && state.screen === 'home'
              ? 'theme-text font-black scale-105'
              : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-200'
          }">
            <span class="text-lg">🏠</span>
            <span class="text-[9.5px] uppercase font-bold tracking-tight">${t('Home', 'Start')}</span>
          </button>

          <button data-tab="stats" class="nav-tab-btn flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer shrink-0 ${
            state.tab === 'stats' && state.screen === 'home'
              ? 'theme-text font-black scale-105'
              : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-200'
          }">
            <span class="text-lg">📊</span>
            <span class="text-[9.5px] uppercase font-bold tracking-tight">${t('Stats', 'Statistik')}</span>
          </button>

          <button data-tab="exams" class="nav-tab-btn flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer shrink-0 ${
            state.tab === 'exams' && state.screen === 'home'
              ? 'theme-text font-black scale-105'
              : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-200'
          }">
            <span class="text-lg">🎓</span>
            <span class="text-[9.5px] uppercase font-bold tracking-tight">${t('Exams', 'Prüfung')}</span>
          </button>

          <button data-tab="search" class="nav-tab-btn flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer shrink-0 ${
            state.tab === 'search' && state.screen === 'home'
              ? 'theme-text font-black scale-105'
              : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-200'
          }">
            <span class="text-lg">🔍</span>
            <span class="text-[9.5px] uppercase font-bold tracking-tight">${t('Lexicon', 'Lexikon')}</span>
          </button>

          <button data-tab="saved" class="nav-tab-btn flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition cursor-pointer shrink-0 ${
            state.tab === 'saved' && state.screen === 'home'
              ? 'theme-text font-black scale-105'
              : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-200'
          }">
            <span class="text-lg">⭐</span>
            <span class="text-[9.5px] uppercase font-bold tracking-tight">${t('Saved', 'Gemerkt')}</span>
          </button>

          <button data-tab="profile" class="nav-tab-btn flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition cursor-pointer shrink-0 ${
            state.tab === 'profile' && state.screen === 'home'
              ? 'theme-text font-black scale-105'
              : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-200'
          }">
            <span class="text-lg">👤</span>
            <span class="text-[9.5px] uppercase font-bold tracking-tight">${t('Profile', 'Profil')}</span>
          </button>

          <button data-tab="settings" class="nav-tab-btn flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-xl transition cursor-pointer shrink-0 ${
            state.tab === 'settings' && state.screen === 'home'
              ? 'theme-text font-black scale-105'
              : 'text-gray-400 hover:text-slate-700 dark:hover:text-slate-200'
          }">
            <span class="text-lg">⚙️</span>
            <span class="text-[9.5px] uppercase font-bold tracking-tight">${t('Settings', 'Optionen')}</span>
          </button>
        </nav>
      ` : ''}

      <!-- Settings Modal Container -->
      <div id="settings-modal-container" class="${state.showSettings ? '' : 'hidden'}"></div>
    </div>
  `;

  // Mount Views
  const mainView = app.querySelector('#main-view');
  if (state.screen === 'topic') {
    renderTopic(mainView);
  } else if (state.screen === 'quiz') {
    renderQuiz(mainView);
  } else if (state.screen === 'flashcard') {
    renderFlashcard(mainView);
  } else {
    // state.screen === 'home'
    switch (state.tab) {
      case 'exams':
        renderExams(mainView);
        break;
      case 'stats':
        renderStats(mainView);
        break;
      case 'search':
        renderSearch(mainView);
        break;
      case 'saved':
        renderSaved(mainView);
        break;
      case 'profile':
        renderProfile(mainView);
        break;
      case 'settings':
        renderSettings(mainView);
        break;
      case 'home':
      default:
        renderHome(mainView);
        break;
    }
  }

  // Render Settings Modal
  const modalContainer = app.querySelector('#settings-modal-container');
  if (modalContainer && state.showSettings) {
    renderSettingsModal(modalContainer);
  }

  // Attach Navigation Listeners
  app.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      if (tabName) setTab(tabName);
    });
  });
}

// Subscribe to state notifications
subscribe(() => {
  renderApp();
});

// Initial Render
renderApp();
