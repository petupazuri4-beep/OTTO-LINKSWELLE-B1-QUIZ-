import {
  state,
  setScreen,
  toggleBookmark,
  isBookmarked,
  updateStreakCount,
  updateSRS,
  calculateNextSM2State,
  formatInterval,
  getWordSRSStatus,
  t
} from '../state.js';
import { VOCAB, LEVELS } from '../data/vocab.js';
import { speak } from '../utils/audio.js';
import { startQuizRound } from './quiz.js';
import { getModeLevelConfig, getSliceForLevel } from '../utils/modeHelper.js';

let words = [];
let currentIndex = 0;
let isFlipped = false;
let known = [];
let learning = [];
let sessionCompleted = false;
let showSRSInfo = false;
let sessionRatings = []; // { word, quality, nextInterval, nextEase }
let keyHandlerAttached = false;

export function initFlashcards() {
  const topicName = state.selectedTopic;
  let vocabSrc = [];
  const now = Date.now();

  if (topicName === 'Daily SRS Review') {
    // Collect all words across all topics and prioritize by SM-2 urgency
    const allWords = [];
    Object.values(VOCAB).forEach(list => allWords.push(...list));

    const getUrgencyScore = (w) => {
      const record = state.srs?.[w.g];
      if (!record || !record.lastReviewed) return 50; // New unseen words get high priority
      const overdueByMs = now - record.nextReview;
      if (overdueByMs >= 0) {
        // Overdue words: highest priority, scales with overdue days
        return 100 + (overdueByMs / 86400000) * 10;
      }
      // Not due yet: lower priority based on how far away
      return Math.max(0, 10 - Math.abs(overdueByMs / 86400000));
    };

    allWords.sort((a, b) => getUrgencyScore(b) - getUrgencyScore(a));
    // Pick top 30 due words for daily smart session
    vocabSrc = allWords.slice(0, 30);
  } else if (topicName.startsWith('Level ')) {
    const levelNum = parseInt(topicName.replace('Level ', ''), 10);
    const lvlConfig = LEVELS[levelNum - 1];
    if (lvlConfig) {
      lvlConfig.topics.forEach((tp) => {
        vocabSrc = [...vocabSrc, ...(VOCAB[tp] || [])];
      });
    }
  } else {
    vocabSrc = VOCAB[topicName] || [];
  }

  if (state.activeFlashcardLevel) {
    const { items, itemsPerLevel } = getModeLevelConfig(topicName, 'flashcard');
    const sliced = getSliceForLevel(items, state.activeFlashcardLevel, itemsPerLevel).slice;
    vocabSrc = sliced.length > 0 ? sliced : items;
  }

  if (topicName === 'Daily SRS Review') {
    // Keep most urgent at front with mild randomization for same-tier items
    words = [...vocabSrc];
  } else {
    // In standard topic decks, prioritize due cards first, then new, then future
    const scoredWords = vocabSrc.map(w => {
      const rec = state.srs?.[w.g];
      let priority = 1;
      if (rec && rec.lastReviewed) {
        if (rec.nextReview <= now) priority = 3; // due
        else priority = 0; // future
      } else {
        priority = 2; // new
      }
      return { w, priority, rnd: Math.random() };
    });
    scoredWords.sort((a, b) => b.priority - a.priority || a.rnd - b.rnd);
    words = scoredWords.map(item => item.w);
  }

  currentIndex = 0;
  isFlipped = false;
  known = [];
  learning = [];
  sessionCompleted = false;
  showSRSInfo = false;
  sessionRatings = [];
}

function handleGlobalKeydown(e) {
  if (state.screen !== 'flashcard' || sessionCompleted) return;

  // Space or Enter: Flip card
  if (e.code === 'Space' || e.key === 'Enter') {
    e.preventDefault();
    const trigger = document.getElementById('fc-card-trigger');
    if (trigger) trigger.click();
    return;
  }

  // Hotkeys 1, 2, 3, 4 when flipped
  if (isFlipped) {
    if (e.key === '1') {
      e.preventDefault();
      document.getElementById('fc-srs-again-btn')?.click();
    } else if (e.key === '2') {
      e.preventDefault();
      document.getElementById('fc-srs-hard-btn')?.click();
    } else if (e.key === '3') {
      e.preventDefault();
      document.getElementById('fc-srs-good-btn')?.click();
    } else if (e.key === '4') {
      e.preventDefault();
      document.getElementById('fc-srs-easy-btn')?.click();
    }
  }
}

function setupKeyboardListeners() {
  if (!keyHandlerAttached) {
    window.addEventListener('keydown', handleGlobalKeydown);
    keyHandlerAttached = true;
  }
}

export function renderFlashcard(container) {
  setupKeyboardListeners();

  if (words.length === 0) {
    initFlashcards();
  }

  const topicName = state.selectedTopic;
  const total = words.length;
  const currentWord = words[currentIndex] || null;

  // SESSION COMPLETED / STATS SCREEN
  if (sessionCompleted || !currentWord) {
    const doneCount = known.length;
    const learnCount = learning.length;
    const totalRated = doneCount + learnCount || 1;
    const progressPct = Math.round((doneCount / totalRated) * 100);

    const counts = { again: 0, hard: 0, good: 0, easy: 0 };
    sessionRatings.forEach(r => {
      if (r.quality === 1) counts.again++;
      else if (r.quality === 3) counts.hard++;
      else if (r.quality === 4) counts.good++;
      else if (r.quality === 5) counts.easy++;
    });

    // Schedule projections
    let dueTomorrow = 0;
    let dueFewDays = 0;
    let dueWeekPlus = 0;
    sessionRatings.forEach(r => {
      if (r.nextInterval <= 1) dueTomorrow++;
      else if (r.nextInterval <= 6) dueFewDays++;
      else dueWeekPlus++;
    });

    container.innerHTML = `
      <div class="pb-24">
        <div class="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4.5 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800">
          <button id="fc-finish-back" class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xl font-bold transition active:scale-95 cursor-pointer" type="button">
            ‹
          </button>
          <div class="flex-1 min-w-0">
            <h2 class="truncate text-base font-extrabold flex items-center gap-2 text-slate-900 dark:text-white">
              <span>🧠</span> ${t('SM-2 Review Session Complete', 'SM-2 Wiederholung abgeschlossen')}
            </h2>
          </div>
        </div>

        <div class="mx-auto max-w-md p-6 text-center">
          <div class="text-xs font-black tracking-widest text-indigo-400 uppercase mb-2">
            ${topicName} • ${t('Spaced Repetition', 'Spaced Repetition')}
          </div>
          
          <div class="text-6xl font-black text-slate-800 dark:text-white tracking-tight">
            ${progressPct}%
          </div>
          
          <div class="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 uppercase tracking-wide">
            ${t('Memory Retention Rate', 'Gedächtnis-Erinnerungsrate')}
          </div>

          <!-- Rating Breakdown Pills -->
          <div class="grid grid-cols-4 gap-2 mt-6">
            <div class="rounded-xl bg-rose-50 dark:bg-rose-950/30 p-2.5 border border-rose-200/50 dark:border-rose-900/40">
              <div class="text-lg font-black text-rose-600 dark:text-rose-400">${counts.again}</div>
              <div class="text-[9px] font-black text-rose-700 dark:text-rose-300 uppercase">${t('Again', 'Nochmal')}</div>
            </div>
            <div class="rounded-xl bg-amber-50 dark:bg-amber-950/30 p-2.5 border border-amber-200/50 dark:border-amber-900/40">
              <div class="text-lg font-black text-amber-600 dark:text-amber-400">${counts.hard}</div>
              <div class="text-[9px] font-black text-amber-700 dark:text-amber-300 uppercase">${t('Hard', 'Schwer')}</div>
            </div>
            <div class="rounded-xl bg-emerald-50 dark:bg-emerald-950/30 p-2.5 border border-emerald-200/50 dark:border-emerald-900/40">
              <div class="text-lg font-black text-emerald-600 dark:text-emerald-400">${counts.good}</div>
              <div class="text-[9px] font-black text-emerald-700 dark:text-emerald-300 uppercase">${t('Good', 'Gut')}</div>
            </div>
            <div class="rounded-xl bg-sky-50 dark:bg-sky-950/30 p-2.5 border border-sky-200/50 dark:border-sky-900/40">
              <div class="text-lg font-black text-sky-600 dark:text-sky-400">${counts.easy}</div>
              <div class="text-[9px] font-black text-sky-700 dark:text-sky-300 uppercase">${t('Easy', 'Einfach')}</div>
            </div>
          </div>

          <!-- Future Review Schedule Forecast Card -->
          <div class="mt-6 rounded-2xl bg-white dark:bg-slate-900 p-4 border border-slate-100 dark:border-slate-800 text-left shadow-xs">
            <div class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>📅 ${t('Scheduled Review Timeline', 'Geplanter Wiederholungszeitplan')}</span>
              <span class="text-[10px] text-indigo-500 font-bold font-mono">SM-2 Algorithm</span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1">
              ${t('Next intervals automatically calculated from your recall accuracy and easiness factor.', 'Nächste Intervalle automatisch nach Treffsicherheit und Leichtigkeit berechnet.')}
            </p>
            <div class="mt-3 space-y-2 text-xs font-semibold">
              <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span class="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                  <span class="w-2 h-2 rounded-full bg-rose-500"></span> ${t('Tomorrow (<24h)', 'Morgen (<24 Std.)')}
                </span>
                <span class="font-black font-mono text-slate-700 dark:text-slate-300">${dueTomorrow} ${t('cards', 'Karten')}</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span class="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                  <span class="w-2 h-2 rounded-full bg-amber-500"></span> ${t('In 2–6 Days', 'In 2–6 Tagen')}
                </span>
                <span class="font-black font-mono text-slate-700 dark:text-slate-300">${dueFewDays} ${t('cards', 'Karten')}</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span> ${t('In 1+ Week', 'In 1+ Woche')}
                </span>
                <span class="font-black font-mono text-slate-700 dark:text-slate-300">${dueWeekPlus} ${t('cards', 'Karten')}</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-7 space-y-2.5">
            ${(() => {
              if (state.activeFlashcardLevel && pct >= 70) {
                const { numLevels } = getModeLevelConfig(state.selectedTopic, 'flashcard');
                if (state.activeFlashcardLevel < numLevels) {
                  return `
                    <button id="fc-next-level-btn" class="w-full rounded-2xl theme-bg-primary py-3.5 text-center text-sm font-black text-white transition active:scale-98 shadow-sm cursor-pointer" type="button">
                      🚀 ${t('Next Flashcard Level →', 'Nächste Karteikarten-Stufe →')} (${t('Level', 'Stufe')} ${state.activeFlashcardLevel + 1})
                    </button>
                  `;
                }
              }
              return '';
            })()}
            ${learnCount > 0 ? `
              <button id="fc-review-learning-btn" class="w-full rounded-2xl bg-rose-600 py-3.5 text-center text-sm font-extrabold text-white transition hover:bg-rose-700 active:scale-98 shadow-sm cursor-pointer" type="button">
                ↻ ${t(`Re-test Lapsed Cards (${learnCount})`, `Vergessene Karten wiederholen (${learnCount})`)}
              </button>
            ` : ''}
            <button id="fc-restart-full-btn" class="w-full rounded-2xl bg-slate-900 py-3.5 text-center text-sm font-extrabold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-98 cursor-pointer" type="button">
              ${t('Practice Deck Again', 'Deck erneut üben')}
            </button>
            <button id="fc-goto-quiz-btn" class="w-full rounded-2xl border border-gray-200 bg-white py-3.5 text-center text-sm font-bold text-gray-700 hover:bg-gray-50 transition active:scale-98 dark:bg-slate-900 dark:border-slate-800 dark:text-white cursor-pointer" type="button">
              ${t('Take Meaning Quiz', 'Bedeutungstest starten')}
            </button>
            <button id="fc-back-modes-btn" class="w-full rounded-2xl bg-gray-100 py-3 text-center text-xs font-bold text-gray-500 hover:bg-gray-200 transition dark:bg-slate-800 dark:text-slate-400 cursor-pointer" type="button">
              ← ${t('Return to Topics', 'Zurück zu Themen')}
            </button>
          </div>
        </div>
      </div>
    `;

    const returnToTopicView = () => {
      if (state.activeFlashcardLevel) {
        state.selectedModeForLevels = 'flashcard';
      }
      setScreen('topic');
    };

    container.querySelector('#fc-finish-back')?.addEventListener('click', returnToTopicView);
    container.querySelector('#fc-back-modes-btn')?.addEventListener('click', returnToTopicView);
    container.querySelector('#fc-next-level-btn')?.addEventListener('click', () => {
      if (state.activeFlashcardLevel) {
        state.activeFlashcardLevel += 1;
        initFlashcards();
        renderFlashcard(container);
      }
    });

    container.querySelector('#fc-restart-full-btn')?.addEventListener('click', () => {
      initFlashcards();
      renderFlashcard(container);
    });

    container.querySelector('#fc-review-learning-btn')?.addEventListener('click', () => {
      words = [...learning];
      currentIndex = 0;
      isFlipped = false;
      known = [];
      learning = [];
      sessionCompleted = false;
      sessionRatings = [];
      renderFlashcard(container);
    });

    container.querySelector('#fc-goto-quiz-btn')?.addEventListener('click', () => {
      startQuizRound('meaning');
    });

    return;
  }

  // ACTIVE CARD SCREEN
  const currentRecord = state.srs?.[currentWord.g];
  const srsStatus = getWordSRSStatus(currentWord.g);

  // Projected next review intervals for each of the 4 SM-2 response options
  const previewAgain = calculateNextSM2State(currentRecord, 1);
  const previewHard  = calculateNextSM2State(currentRecord, 3);
  const previewGood  = calculateNextSM2State(currentRecord, 4);
  const previewEasy  = calculateNextSM2State(currentRecord, 5);

  const curEase = currentRecord?.ease ? Math.round(currentRecord.ease * 100) : 250;
  const curRep = currentRecord?.repetitions || 0;
  const curInterval = currentRecord?.interval || 0;
  const curLapses = currentRecord?.lapses || 0;

  container.innerHTML = `
    <div class="pb-24">
      <!-- Title Navbar -->
      <div class="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-4 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <button id="fc-back-btn" class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xl font-bold transition active:scale-95 cursor-pointer" type="button">
            ‹
          </button>
          <div class="flex-1 min-w-0">
            <h2 class="truncate text-base font-extrabold flex items-center gap-1.5 leading-none text-slate-900 dark:text-white">
              <span>🧠</span> ${t('SM-2 Flashcards', 'SM-2 Karteikarten')}
            </h2>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-extrabold text-indigo-600 dark:text-cyan-400">
              ${topicName}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button id="fc-srs-toggle-info-btn" class="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[10px] font-bold text-slate-700 border border-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 dark:border-slate-700 transition cursor-pointer" type="button">
            📊 SM-2
          </button>
          <div class="rounded-full bg-gray-100 dark:bg-slate-800 px-3 py-1 text-xs font-black text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
            ${currentIndex + 1}/${total}
          </div>
        </div>
      </div>

      <div class="p-5 select-none max-w-md mx-auto">
        <!-- Progress Bar & Status Badges -->
        <div class="flex items-center justify-between text-xs font-bold mb-3">
          <div class="flex items-center gap-1.5">
            <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-${srsStatus.color}-100 text-${srsStatus.color}-800 dark:bg-${srsStatus.color}-950/40 dark:text-${srsStatus.color}-300 border border-${srsStatus.color}-300/30">
              ${state.settings.lang === 'de' ? srsStatus.deLabel : srsStatus.label}
            </span>
            ${curRep > 0 ? `
              <span class="text-[10px] font-mono text-slate-400 dark:text-slate-500 font-bold">
                Rep: ${curRep} • ${curInterval}d
              </span>
            ` : ''}
          </div>
          <div class="text-[11px] text-gray-400 dark:text-slate-400 font-extrabold">
            <span class="text-emerald-500 font-black">${known.length}</span> ${t('known', 'gewusst')} • 
            <span class="text-rose-500 font-black">${learning.length}</span> ${t('learning', 'lernend')}
          </div>
        </div>

        <!-- Optional SRS Detailed Diagnostics Modal/Card -->
        ${showSRSInfo ? `
          <div class="mb-4 rounded-2xl bg-indigo-50 dark:bg-slate-900 p-4 border border-indigo-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-xs">
            <div class="flex items-center justify-between font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider text-[10px]">
              <span>SM-2 Memory Profile for "${currentWord.g}"</span>
              <button id="fc-close-info-btn" class="text-slate-400 hover:text-slate-600 font-bold cursor-pointer">✕</button>
            </div>
            <div class="grid grid-cols-2 gap-2 mt-2.5 text-[11px]">
              <div class="p-2 rounded-xl bg-white dark:bg-slate-950 border border-indigo-50 dark:border-slate-800/80">
                <div class="text-gray-400 text-[10px] uppercase font-bold">${t('Easiness Factor', 'Leichtigkeit (EF)')}</div>
                <div class="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">${(curEase / 100).toFixed(2)} (${curEase}%)</div>
              </div>
              <div class="p-2 rounded-xl bg-white dark:bg-slate-950 border border-indigo-50 dark:border-slate-800/80">
                <div class="text-gray-400 text-[10px] uppercase font-bold">${t('Current Interval', 'Aktuelles Intervall')}</div>
                <div class="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">${curInterval} ${t('days', 'Tage')}</div>
              </div>
              <div class="p-2 rounded-xl bg-white dark:bg-slate-950 border border-indigo-50 dark:border-slate-800/80">
                <div class="text-gray-400 text-[10px] uppercase font-bold">${t('Consecutive Success', 'Erfolgreiche Serie')}</div>
                <div class="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm mt-0.5">${curRep} ${t('times', 'Mal')}</div>
              </div>
              <div class="p-2 rounded-xl bg-white dark:bg-slate-950 border border-indigo-50 dark:border-slate-800/80">
                <div class="text-gray-400 text-[10px] uppercase font-bold">${t('Memory Lapses', 'Fehlversuche')}</div>
                <div class="font-mono font-black text-rose-600 dark:text-rose-400 text-sm mt-0.5">${curLapses}</div>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- 3D Flashcard -->
        <div class="fc-scene h-[250px] w-full cursor-pointer" id="fc-card-trigger">
          <div class="fc-card w-full h-full relative ${isFlipped ? 'flipped' : ''}">
            <!-- CARD FRONT -->
            <div class="fc-front rounded-3xl border border-gray-200 bg-white p-6 shadow-md dark:bg-slate-900 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <div class="w-full flex items-center justify-between text-[10px] font-black tracking-widest text-slate-400 uppercase">
                <span>GERMAN</span>
                <span class="text-indigo-500 font-mono">${currentIndex + 1} / ${total}</span>
              </div>
              
              <h3 class="text-3xl font-black tracking-tight text-slate-800 dark:text-white mt-4 break-words">
                ${currentWord.g}
              </h3>
              
              <!-- Grammatical Gender & Category Tags -->
              <div class="mt-4 flex gap-1 text-[11px] font-extrabold uppercase">
                ${currentWord.g.startsWith('der ') ? '<span class="rounded-full bg-blue-100 text-blue-700 px-3 py-0.5 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/20">der</span>' : ''}
                ${currentWord.g.startsWith('die ') ? '<span class="rounded-full bg-pink-100 text-pink-700 px-3 py-0.5 dark:bg-pink-950/40 dark:text-pink-300 border border-pink-200/20">die</span>' : ''}
                ${currentWord.g.startsWith('das ') ? '<span class="rounded-full bg-emerald-100 text-emerald-700 px-3 py-0.5 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-900/20">das</span>' : ''}
                <span class="text-gray-400 px-3 py-0.5 lowercase italic font-medium">
                  ${currentWord.t === 'n' ? 'noun' : currentWord.t === 'v' ? 'verb' : 'adjective'}
                </span>
              </div>

              <div class="mt-auto flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-500 dark:text-cyan-400 uppercase tracking-wider animate-pulse">
                <span>↷</span> ${t('Tap to reveal translation (Space)', 'Tippen zum Aufdecken (Leertaste)')}
              </div>
            </div>

            <!-- CARD BACK -->
            <div class="fc-back rounded-3xl border-2 border-indigo-100 bg-white p-6 shadow-xl dark:bg-slate-900 dark:border-slate-800 flex flex-col items-center justify-center text-center">
              <span class="text-[9px] font-black tracking-widest text-indigo-600 dark:text-indigo-400 uppercase">Meaning (English)</span>
              <h3 class="text-2xl font-black text-slate-900 dark:text-white mt-2 capitalize leading-snug">
                ${currentWord.e}
              </h3>
              <div class="text-xs text-slate-500 dark:text-slate-400 font-bold tracking-tight lowercase min-h-5 mt-1.5 select-all font-mono">
                ${currentWord.g}
              </div>
              <div class="mt-auto text-[9.5px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <span>🔊</span> ${t('Spoken Audio Synthesized', 'Audio vorgelesen')}
              </div>
            </div>
          </div>
        </div>

        <!-- Micro action buttons -->
        <div class="mt-4 flex justify-center gap-3">
          <button id="fc-hear-btn" class="flex items-center gap-1.5 text-xs font-black bg-white rounded-xl border border-gray-200 px-4 py-2 hover:bg-gray-50 active:scale-95 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-white cursor-pointer shadow-2xs" type="button">
            🔊 ${t('Pronounce', 'Aussprache')}
          </button>
          <button id="fc-bookmark-btn" class="flex items-center gap-1.5 text-xs font-black bg-white rounded-xl border border-gray-200 px-4 py-2 hover:bg-gray-50 active:scale-95 text-slate-700 dark:bg-slate-900 dark:border-slate-800 dark:text-white cursor-pointer shadow-2xs" type="button">
            ${isBookmarked(currentWord.g) ? '★ ' + t('Saved', 'Gemerkt') : '☆ ' + t('Save', 'Merken')}
          </button>
        </div>

        <!-- SM-2 Recall Performance Rating Controls -->
        <div class="mt-6">
          ${!isFlipped ? `
            <button id="fc-reveal-btn" class="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white py-4 text-center text-sm font-black transition active:scale-98 shadow-md cursor-pointer flex items-center justify-center gap-2" type="button">
              <span>↷</span> ${t('Flip Card to Rate Recall', 'Karte umdrehen zum Bewerten')}
            </button>
          ` : `
            <div class="space-y-2">
              <div class="text-[10px] font-black text-center uppercase tracking-widest text-slate-400 mb-1">
                ${t('Rate your recall (SM-2 Scheduling)', 'Erinnerung bewerten (SM-2 Zeitplan)')}
              </div>
              <div class="grid grid-cols-4 gap-2">
                <!-- 1. AGAIN (q=1) -->
                <button id="fc-srs-again-btn" class="group flex flex-col items-center justify-center rounded-2xl border border-rose-300 bg-rose-50 p-2.5 text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/40 active:scale-95 transition cursor-pointer shadow-2xs" type="button" title="Forgot word or blackout (Key: 1)">
                  <span class="text-xs font-black">✕ ${t('Again', 'Wieder')}</span>
                  <span class="mt-1 text-[11px] font-mono font-extrabold bg-rose-200/70 dark:bg-rose-900/60 px-2 py-0.5 rounded-full text-rose-900 dark:text-rose-200">
                    ${formatInterval(previewAgain.interval)}
                  </span>
                  <span class="text-[8px] font-bold text-rose-400 mt-1">[1]</span>
                </button>

                <!-- 2. HARD (q=3) -->
                <button id="fc-srs-hard-btn" class="group flex flex-col items-center justify-center rounded-2xl border border-amber-300 bg-amber-50 p-2.5 text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/40 active:scale-95 transition cursor-pointer shadow-2xs" type="button" title="Recalled with effort (Key: 2)">
                  <span class="text-xs font-black">⚡ ${t('Hard', 'Schwer')}</span>
                  <span class="mt-1 text-[11px] font-mono font-extrabold bg-amber-200/70 dark:bg-amber-900/60 px-2 py-0.5 rounded-full text-amber-900 dark:text-amber-200">
                    ${formatInterval(previewHard.interval)}
                  </span>
                  <span class="text-[8px] font-bold text-amber-400 mt-1">[2]</span>
                </button>

                <!-- 3. GOOD (q=4) -->
                <button id="fc-srs-good-btn" class="group flex flex-col items-center justify-center rounded-2xl border border-emerald-300 bg-emerald-50 p-2.5 text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 active:scale-95 transition cursor-pointer shadow-2xs" type="button" title="Correct recall with normal effort (Key: 3)">
                  <span class="text-xs font-black">✓ ${t('Good', 'Gut')}</span>
                  <span class="mt-1 text-[11px] font-mono font-extrabold bg-emerald-200/70 dark:bg-emerald-900/60 px-2 py-0.5 rounded-full text-emerald-900 dark:text-emerald-200">
                    ${formatInterval(previewGood.interval)}
                  </span>
                  <span class="text-[8px] font-bold text-emerald-400 mt-1">[3]</span>
                </button>

                <!-- 4. EASY (q=5) -->
                <button id="fc-srs-easy-btn" class="group flex flex-col items-center justify-center rounded-2xl border border-sky-300 bg-sky-50 p-2.5 text-sky-800 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/40 active:scale-95 transition cursor-pointer shadow-2xs" type="button" title="Instant, effortless recall (Key: 4)">
                  <span class="text-xs font-black">⭐ ${t('Easy', 'Einfach')}</span>
                  <span class="mt-1 text-[11px] font-mono font-extrabold bg-sky-200/70 dark:bg-sky-900/60 px-2 py-0.5 rounded-full text-sky-900 dark:text-sky-200">
                    ${formatInterval(previewEasy.interval)}
                  </span>
                  <span class="text-[8px] font-bold text-sky-400 mt-1">[4]</span>
                </button>
              </div>
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners
  container.querySelector('#fc-back-btn')?.addEventListener('click', () => setScreen('topic'));

  container.querySelector('#fc-srs-toggle-info-btn')?.addEventListener('click', () => {
    showSRSInfo = !showSRSInfo;
    renderFlashcard(container);
  });

  container.querySelector('#fc-close-info-btn')?.addEventListener('click', () => {
    showSRSInfo = false;
    renderFlashcard(container);
  });

  const flipAction = () => {
    isFlipped = !isFlipped;
    if (isFlipped && currentWord) {
      speak(currentWord.g, state.settings.ttsOn);
    }
    renderFlashcard(container);
  };

  container.querySelector('#fc-card-trigger')?.addEventListener('click', flipAction);
  container.querySelector('#fc-reveal-btn')?.addEventListener('click', flipAction);

  container.querySelector('#fc-hear-btn')?.addEventListener('click', () => {
    if (currentWord) speak(currentWord.g, true);
  });

  container.querySelector('#fc-bookmark-btn')?.addEventListener('click', () => {
    if (currentWord) {
      toggleBookmark(currentWord);
      renderFlashcard(container);
    }
  });

  // SM-2 Performance Rating handlers
  container.querySelector('#fc-srs-again-btn')?.addEventListener('click', () => {
    if (!isFlipped || !currentWord) return;
    const nextState = updateSRS(currentWord, 1);
    learning.push(currentWord);
    sessionRatings.push({
      word: currentWord,
      quality: 1,
      nextInterval: nextState.interval,
      nextEase: nextState.ease
    });
    advanceFlashcard(container);
  });

  container.querySelector('#fc-srs-hard-btn')?.addEventListener('click', () => {
    if (!isFlipped || !currentWord) return;
    const nextState = updateSRS(currentWord, 3);
    known.push(currentWord);
    sessionRatings.push({
      word: currentWord,
      quality: 3,
      nextInterval: nextState.interval,
      nextEase: nextState.ease
    });
    advanceFlashcard(container);
  });

  container.querySelector('#fc-srs-good-btn')?.addEventListener('click', () => {
    if (!isFlipped || !currentWord) return;
    const nextState = updateSRS(currentWord, 4);
    known.push(currentWord);
    sessionRatings.push({
      word: currentWord,
      quality: 4,
      nextInterval: nextState.interval,
      nextEase: nextState.ease
    });
    advanceFlashcard(container);
  });

  container.querySelector('#fc-srs-easy-btn')?.addEventListener('click', () => {
    if (!isFlipped || !currentWord) return;
    const nextState = updateSRS(currentWord, 5);
    known.push(currentWord);
    sessionRatings.push({
      word: currentWord,
      quality: 5,
      nextInterval: nextState.interval,
      nextEase: nextState.ease
    });
    advanceFlashcard(container);
  });
}

function advanceFlashcard(container) {
  const total = words.length;
  if (currentIndex + 1 >= total) {
    const nextKnownCount = known.length;
    const pct = Math.round((nextKnownCount / total) * 100);

    if (state.selectedTopic !== 'Weak Words' && state.selectedTopic !== 'Daily SRS Review') {
      const modeKey = state.activeFlashcardLevel ? `flashcard_level_${state.activeFlashcardLevel}` : 'flashcard';
      if (!state.progress[state.selectedTopic]) state.progress[state.selectedTopic] = {};
      const existing = state.progress[state.selectedTopic][modeKey];
      if (!existing || pct > existing.pct) {
        state.progress[state.selectedTopic][modeKey] = {
          correct: nextKnownCount,
          total,
          pct,
          ts: Date.now()
        };
      }
      try {
        localStorage.setItem('lw_prog', JSON.stringify(state.progress));
      } catch {}

      const hsKey = `${state.selectedTopic}|${modeKey}`;
      const storedHs = state.highscores[hsKey];
      if (!storedHs || pct > storedHs.pct) {
        state.highscores[hsKey] = {
          topic: state.selectedTopic,
          mode: modeKey,
          pct,
          correct: nextKnownCount,
          total,
          ts: Date.now()
        };
        try {
          localStorage.setItem('lw_hs', JSON.stringify(state.highscores));
        } catch {}
      }
    }
    updateStreakCount();
    sessionCompleted = true;
  } else {
    currentIndex++;
    isFlipped = false;
  }
  renderFlashcard(container);
}
