import { state, setTab, setScreen, toggleBookmark, isBookmarked, t, updateSettings } from '../state.js';
import { VOCAB, ICONS, CLS } from '../data/vocab.js';
import { speak } from '../utils/audio.js';
import { renderSettingsModal } from './settingsModal.js';

export function renderHome(container) {
  const allWords = Object.values(VOCAB).flat();
  const dateNum = new Date().setHours(0, 0, 0, 0);
  const wodIndex = allWords.length > 0 ? Math.floor(dateNum / 86400000) % allWords.length : 0;
  const wod = allWords[wodIndex] || { g: 'der Alltag', e: 'everyday life', t: 'n' };

  const totalWordsCount = allWords.length;
  const activeTopicsCount = Object.keys(VOCAB).length;

  let sum = 0;
  let count = 0;
  Object.values(state.progress).forEach((topicObj) => {
    Object.values(topicObj).forEach((modeObj) => {
      if (modeObj) {
        sum += modeObj.pct;
        count++;
      }
    });
  });
  const overallPct = count > 0 ? Math.round(sum / count) : 0;

  const todayKey = new Date().toISOString().split('T')[0];
  const todayActivity = state.activity[todayKey] || 0;
  const dailyGoal = state.settings.dailyGoal || 10;
  const dailyGoalPct = Math.min(100, Math.round((todayActivity / dailyGoal) * 100));

  const topicsList = Object.keys(VOCAB);

  container.innerHTML = `
    <div class="pb-24">
      <!-- Header Hero -->
      <div class="bg-white px-6 py-6 text-slate-900 border-b border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-800">
        <div class="flex items-center justify-between">
          <div class="text-xs font-black tracking-wider uppercase theme-text">
            ${t('LINKSWELLE INSTITUT', 'LINKSWELLE INSTITUT')}
          </div>
          <!-- Quick Daytime Visibility / Dark Mode & Themes Shortcut -->
          <div class="flex items-center gap-1.5">
            <button id="home-quick-dark-toggle" class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer" title="${state.settings.dark ? t('Switch to daytime white background', 'Zu weißem Tagesmodus wechseln') : t('Switch to night dark mode', 'Zu dunklem Nachtmodus wechseln')}">
              <span>${state.settings.dark ? '☀️' : '🌙'}</span>
              <span class="text-[10px] hidden sm:inline font-bold">${state.settings.dark ? t('Day Mode', 'Tagmodus') : t('Dark Mode', 'Dunkel')}</span>
            </button>
            <button id="home-quick-settings-btn" class="flex items-center justify-center w-7 h-7 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xs transition cursor-pointer" title="${t('5 Colour Themes in Settings', '5 Farbthemen in den Einstellungen')}">
              🎨
            </button>
          </div>
        </div>
        <h1 class="mt-1.5 text-2xl font-black tracking-tight text-slate-900 dark:text-white">${t('B1 Wortschatz Quiz', 'B1 Wortschatz Quiz')}</h1>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">${t('Premium Vocabulary • 100% Offline Compatible', 'B1 Wortschatz • Komplett offline')}</p>

        <!-- Stats Chips -->
        <div class="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
          <span class="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-300 border border-gray-200/80 dark:border-slate-700/60">
            📚 ${totalWordsCount} ${t('words', 'Wörter')}
          </span>
          <span class="flex items-center gap-1 rounded-full bg-gray-100 dark:bg-slate-800 px-3 py-1 text-slate-700 dark:text-slate-300 border border-gray-200/80 dark:border-slate-700/60">
            📂 ${activeTopicsCount} ${t('topics', 'Themen')}
          </span>
          <span class="flex items-center gap-1 rounded-full theme-badge px-3 py-1 font-extrabold">
            📊 ${overallPct}% ${t('avg', 'Ø')}
          </span>
          <span class="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/40 px-3 py-1 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/60">
            🔥 ${state.streak.count} ${t('days', 'Tage')}
          </span>
        </div>
      </div>

      <!-- Profile Summary Banner -->
      <div id="home-profile-btn" class="flex items-center justify-between border-y border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3.5 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-2xl border border-violet-200 dark:bg-violet-950/30 dark:border-violet-800 overflow-hidden shrink-0">
            ${state.settings.photoUrl ? `<img src="${state.settings.photoUrl}" alt="Avatar" class="h-full w-full object-cover" />` : state.settings.avatar}
          </div>
          <div>
            <div class="font-extrabold text-sm text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
              <span>${state.settings.userName}</span>
              <span class="px-1.5 py-0.5 rounded-sm bg-violet-50 dark:bg-violet-950/40 text-[9px] font-black text-violet-600 dark:text-violet-400 border border-violet-100/30">
                ${state.settings.cefrLevel || 'B1'}
              </span>
            </div>
            <div class="text-[11px] text-gray-400 dark:text-slate-400 mt-0.5">
              ${state.streak.count > 0 ? t('Keep maintaining your streak!', 'Behalte deinen Streak bei!') : t('Study today to start a streak!', 'Heute lernen und Streak beginnen!')}
            </div>
          </div>
        </div>
        <div class="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-extrabold text-sm">
          <span>🔥</span> ${state.streak.count}
        </div>
      </div>

      <!-- Daily Practice Goal -->
      <div class="m-4">
        <div class="rounded-2xl border border-gray-150 bg-white p-4 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div class="flex justify-between items-center">
            <span class="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase">
              🎯 ${t('DAILY PRACTICE GOAL', 'TÄGLICHES ZIEL')}
            </span>
            <span class="text-xs font-black text-gray-700 dark:text-slate-200">
              ${Math.min(dailyGoal, todayActivity)} / ${dailyGoal}
            </span>
          </div>
          <div class="mt-3">
            <div class="h-2 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
              <div class="h-full rounded-full bg-emerald-500 transition-all duration-500" style="width: ${dailyGoalPct}%"></div>
            </div>
          </div>
          <p class="text-[10.5px] text-slate-400 mt-2 font-semibold">
            ${todayActivity >= dailyGoal ? t('✨ Daily target accomplished! Excellent work.', '✨ Tagesziel erreicht! Hervorragende Arbeit.') : t(`Complete ${dailyGoal - todayActivity} more rounds today!`, `Absolviere heute noch ${dailyGoal - todayActivity} Runden!`)}
          </p>
        </div>
      </div>

      <!-- Word of the Day Widget -->
      <div class="mx-4 mb-5 rounded-2xl bg-white p-5 text-slate-900 shadow-xs dark:bg-slate-900 dark:text-white border border-gray-200 dark:border-slate-800">
        <div class="text-[10px] font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">
          ⭐ ${t('WORD OF THE DAY', 'WORT DES TAGES')}
        </div>
        <div class="mt-2 text-2xl font-black text-slate-900 dark:text-white">${wod.g}</div>
        <div class="text-sm text-slate-500 dark:text-slate-300 mt-1 capitalize">
          ${wod.t === 'n' ? `${t('noun', 'Nomen')}` : wod.t === 'v' ? `${t('verb', 'Verb')}` : `${t('adjective', 'Adjektiv')}`} • ${wod.e}
        </div>
        <div class="mt-4 flex gap-2">
          <button id="wod-audio-btn" class="flex-1 rounded-xl bg-gray-50 border border-gray-200 dark:bg-slate-800 dark:border-slate-700 py-2 text-center text-xs font-extrabold text-slate-700 dark:text-white transition hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 cursor-pointer" type="button">
            🔊 ${t('Hear Speech', 'Aussprache hören')}
          </button>
          <button id="wod-bookmark-btn" class="flex-1 rounded-xl bg-gray-50 border border-gray-200 dark:bg-slate-800 dark:border-slate-700 py-2 text-center text-xs font-extrabold text-slate-700 dark:text-white transition hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 cursor-pointer" type="button">
            ${isBookmarked(wod.g) ? '★ ' + t('Saved', 'Gemerkt') : '☆ ' + t('Save Word', 'Wort merken')}
          </button>
        </div>
      </div>

      <!-- Vocabulary Topics -->
      <div class="px-4 mt-2">
        <h3 class="mb-3 px-2 text-xs font-black tracking-wider text-gray-400 dark:text-slate-500 uppercase">
          ${t('VOCABULARY TOPICS', 'THEMENGEBIETE')}
        </h3>
        <div class="space-y-2.5">
          ${topicsList.map((topic, index) => {
            const list = VOCAB[topic] || [];
            const count = list.length;
            const icon = ICONS[topic] || '📖';
            const colors = CLS[index % CLS.length] || 'bg-gray-50 text-gray-700';
            const topicProgress = state.progress[topic] || {};
            const bestScore = Object.values(topicProgress).reduce(
              (best, current) => Math.max(best, current?.pct || 0),
              0
            );
            return `
              <div data-topic="${topic}" class="topic-item-card flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-xs hover:border-gray-200 dark:bg-slate-900 dark:border-slate-800/80 hover:bg-gray-50 dark:hover:bg-slate-800/50 cursor-pointer transition active:scale-[0.99]">
                <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl ${colors}">
                  ${icon}
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <h4 class="truncate text-sm font-bold text-gray-800 dark:text-gray-100">${topic}</h4>
                    <span class="text-[10px] font-bold text-gray-400 dark:text-slate-500">
                      ${bestScore > 0 ? `${bestScore}%` : ''}
                    </span>
                  </div>
                  <div class="text-[11px] text-gray-400 dark:text-slate-400 mt-0.5">
                    ${count} ${t('B1 word entries', 'B1 Wortschatz-Einträge')}
                  </div>
                  <div class="mt-2 h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                    <div class="h-full rounded-full bg-emerald-500 dark:bg-emerald-600 transition-all duration-500" style="width: ${bestScore}%"></div>
                  </div>
                </div>
                <div class="text-gray-300 dark:text-slate-600 font-extrabold text-lg">›</div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners
  container.querySelector('#home-quick-dark-toggle')?.addEventListener('click', () => {
    updateSettings({ dark: !state.settings.dark });
  });

  container.querySelector('#home-quick-settings-btn')?.addEventListener('click', () => {
    setTab('settings');
  });

  container.querySelector('#home-profile-btn')?.addEventListener('click', () => setTab('profile'));

  container.querySelector('#wod-audio-btn')?.addEventListener('click', () => {
    speak(wod.g, state.settings.ttsOn);
  });

  container.querySelector('#wod-bookmark-btn')?.addEventListener('click', () => {
    toggleBookmark(wod);
  });

  container.querySelectorAll('.topic-item-card').forEach(el => {
    el.addEventListener('click', () => {
      const topic = el.getAttribute('data-topic');
      if (topic) {
        state.selectedTopic = topic;
        state.activeFlashcardLevel = null;
        setScreen('topic');
      }
    });
  });
}
