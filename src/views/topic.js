import { state, setScreen, t, notify } from '../state.js';
import { VOCAB, ICONS, CLS } from '../data/vocab.js';
import { SENTENCE_EXERCISES } from '../data/sentenceExercises.js';
import { startQuizRound } from './quiz.js';
import { getModeLevelConfig, getSliceForLevel, isLevelUnlocked } from '../utils/modeHelper.js';

let selectedModeForLevels = null;

const MODEDESCS = {
  all: { en: 'Mixed questions, double length', de: 'Alle Fragen gemischt' },
  meaning: { en: 'See German, pick English translation', de: 'Deutsch → Englisch wählen' },
  article: { en: 'See noun, choose der / die / das', de: 'der / die / das bestimmen' },
  verb: { en: 'Focus purely on B1 verb definitions', de: 'Verbedeutungen üben' },
  adjective: { en: 'Learn and quiz adjectives', de: 'Adjektivbedeutungen quizzen' },
  speed: { en: 'Rapid-fire test with 15s speed timer', de: '15 Sek. Hektik pro Frage' },
  write: { en: 'Type the meaning (hard mode)', de: 'Bedeutung selbst tippen' },
  listen: { en: 'Listen to spoken word, pick meaning', de: 'Hören & Bedeutung wählen' },
  sentence: { en: 'Translate contextual German sentences', de: 'Sätze interaktiv übersetzen' },
  flashcard: { en: 'SM-2 Spaced Repetition flashcards', de: 'SM-2 Spaced Repetition Karteikarten' }
};

export function renderTopic(container) {
  const topicName = state.selectedTopic;
  const vocabList = VOCAB[topicName] || [];
  const topicSentencesList = SENTENCE_EXERCISES[topicName] || [];
  const icon = ICONS[topicName] || '📖';

  const nounCount = vocabList.filter((w) => w.t === 'n' && /^(der|die|das) /i.test(w.g)).length;
  const verbCount = vocabList.filter((w) => w.t === 'v').length;
  const adjCount = vocabList.filter((w) => w.t === 'a').length;

  const modes = [
    { key: 'all', icon: '⚡', name: t('Full Quiz', 'Kombitest'), desc: t(MODEDESCS.all.en, MODEDESCS.all.de), count: vocabList.length * 2, disabled: vocabList.length === 0 },
    { key: 'meaning', icon: '📝', name: t('Meanings', 'Bedeutungen'), desc: t(MODEDESCS.meaning.en, MODEDESCS.meaning.de), count: vocabList.length, disabled: vocabList.length === 0 },
    { key: 'article', icon: '🏷️', name: t('Articles', 'Artikel'), desc: t(MODEDESCS.article.en, MODEDESCS.article.de), count: nounCount, disabled: nounCount === 0 },
    { key: 'verb', icon: '🏃', name: t('Verbs', 'Verben'), desc: t(MODEDESCS.verb.en, MODEDESCS.verb.de), count: verbCount, disabled: verbCount === 0 },
    { key: 'adjective', icon: '🎨', name: t('Adjectives', 'Adjektive'), desc: t(MODEDESCS.adjective.en, MODEDESCS.adjective.de), count: adjCount, disabled: adjCount === 0 },
    { key: 'speed', icon: '⏱️', name: t('Speed Round', 'Schnellrunde'), desc: t(MODEDESCS.speed.en, MODEDESCS.speed.de), count: 20, disabled: vocabList.length === 0 },
    { key: 'write', icon: '✍️', name: t('Writing', 'Schreibübung'), desc: t(MODEDESCS.write.en, MODEDESCS.write.de), count: 15, disabled: vocabList.length === 0 },
    { key: 'listen', icon: '🎧', name: t('Listening', 'Hörverständnis'), desc: t(MODEDESCS.listen.en, MODEDESCS.listen.de), count: vocabList.length, disabled: vocabList.length === 0 },
    { key: 'sentence', icon: '💬', name: t('Sentences', 'Satzübersetzung'), desc: t(MODEDESCS.sentence.en, MODEDESCS.sentence.de), count: topicSentencesList.length * 2, disabled: topicSentencesList.length === 0 },
    { key: 'flashcard', icon: '🗂️', name: t('Flashcards', 'Karteikarten'), desc: t(MODEDESCS.flashcard.en, MODEDESCS.flashcard.de), count: vocabList.length, isFC: true, disabled: vocabList.length === 0 },
  ];

  const activeMode = state.selectedModeForLevels || selectedModeForLevels;

  // If user selected a specific mode, show the robust level ladder
  if (activeMode) {
    const activeModeObj = modes.find((m) => m.key === activeMode);
    const activeModeIcon = activeModeObj?.icon || '⚡';
    const activeModeName = activeModeObj?.name || 'Full Quiz';

    const { items, totalItems, numLevels, itemsPerLevel } = getModeLevelConfig(topicName, activeMode);

    container.innerHTML = `
      <div class="pb-24">
        <!-- Level Selector Title Navbar -->
        <div class="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4.5 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800">
          <button id="topic-level-back-btn" class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xl font-bold transition active:scale-95 cursor-pointer" type="button">
            ‹
          </button>
          <div class="flex-1 min-w-0">
            <h2 class="truncate text-base font-extrabold flex items-center gap-1.5 leading-none text-slate-900 dark:text-white">
              <span>${activeModeIcon}</span> ${activeModeName} • ${t('Levels', 'Stufen')}
            </h2>
            <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">
              ${topicName} • ${numLevels} ${t('Levels', 'Lernstufen')} (${totalItems} ${t('Total', 'Gesamt')})
            </p>
          </div>
        </div>

        <!-- Dashboard explanation text -->
        <div class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 p-5">
          <h3 class="text-sm font-black text-slate-800 dark:text-gray-100 uppercase tracking-wider mb-1.5">
            ${t('UNROLL THE LEVEL LADDER', 'STUFENLEITER MEISTERN')}
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            ${t(
              'Complete each level with at least 70% accuracy to unlock the next level. Let the learning continue!',
              'Erreiche mindestens 70% in jeder Stufe, um die nächste freizuschalten. Viel Erfolg beim Lernen!'
            )}
          </p>
        </div>

        <!-- Levels List -->
        <div class="p-4 space-y-3">
          ${numLevels === 0 ? `
            <div class="p-6 text-center text-sm font-bold text-slate-500 dark:text-slate-400">
              ${t('No items available for this category.', 'Keine Einträge für diese Kategorie verfügbar.')}
            </div>
          ` : Array.from({ length: numLevels }, (_, i) => {
            const levelNum = i + 1;
            const unlocked = isLevelUnlocked(topicName, activeMode, levelNum, state);
            const progressKey = `${activeMode}_level_${levelNum}`;
            const levelProgress = state.progress[topicName]?.[progressKey];
            const pct = levelProgress?.pct || 0;
            const { startIndex, endIndex, count } = getSliceForLevel(items, levelNum, itemsPerLevel);
            
            let stars = '';
            if (levelProgress) {
              if (pct === 100) stars = '⭐⭐⭐';
              else if (pct >= 85) stars = '⭐⭐';
              else if (pct >= 70) stars = '⭐';
            }

            const itemUnitLabel =
              activeMode === 'article'
                ? t('Nouns', 'Nomen')
                : activeMode === 'verb'
                ? t('Verbs', 'Verben')
                : activeMode === 'adjective'
                ? t('Adjectives', 'Adjektive')
                : activeMode === 'flashcard'
                ? t('Cards', 'Karten')
                : activeMode === 'sentence'
                ? t('Sentences', 'Sätze')
                : t('Words', 'Wörter');

            return `
              <div class="rounded-2xl border p-4.5 transition duration-150 relative ${
                unlocked
                  ? 'bg-white border-gray-150 dark:bg-slate-900 dark:border-slate-800 shadow-xs'
                  : 'bg-gray-100/60 dark:bg-slate-950 border-gray-200/40 dark:border-slate-850 opacity-60'
              }">
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0">
                    <h4 class="text-sm font-black text-gray-800 dark:text-gray-100 flex items-center gap-1.5 truncate">
                      <span>${unlocked ? (pct >= 70 ? '✓' : '🔓') : '🔒'}</span> ${t('Level', 'Stufe')} ${levelNum}
                      ${stars ? `<span class="ml-1 text-xs">${stars}</span>` : ''}
                    </h4>
                    <p class="text-[10px] text-gray-400 dark:text-slate-400 mt-1 font-semibold">
                      ${count} ${itemUnitLabel} • (${startIndex + 1} - ${endIndex})
                    </p>
                  </div>
                  <div class="shrink-0">
                    ${unlocked ? `
                      <button data-level="${levelNum}" class="start-level-btn px-4 py-2 text-xs font-black rounded-xl transition active:scale-95 cursor-pointer ${
                        pct >= 70
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/60 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/40'
                          : 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950'
                      }" type="button">
                        ${pct > 0 ? `${pct}% ${t('Retry', 'Erneut')}` : t('Start', 'Lernen')}
                      </button>
                    ` : `
                      <span class="text-xs font-black text-slate-400 dark:text-slate-500">
                        ${t('Locked', 'Gesperrt')}
                      </span>
                    `}
                  </div>
                </div>
                ${levelProgress ? `
                  <div class="mt-3.5 h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500 ${pct >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}" style="width: ${pct}%"></div>
                  </div>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    container.querySelector('#topic-level-back-btn')?.addEventListener('click', () => {
      selectedModeForLevels = null;
      state.selectedModeForLevels = null;
      renderTopic(container);
    });

    container.querySelectorAll('.start-level-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const lvl = parseInt(btn.getAttribute('data-level'), 10);
        state.selectedModeForLevels = activeMode;
        if (activeMode === 'flashcard') {
          state.activeFlashcardLevel = lvl;
          setScreen('flashcard');
        } else {
          startQuizRound(`${activeMode}_level_${lvl}`);
        }
      });
    });

    return;
  }

  // Primary Topic Menu
  const topicProgress = state.progress[topicName] || {};

  container.innerHTML = `
    <div class="pb-24">
      <!-- Title Navbar with Back Trigger -->
      <div class="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4.5 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800">
        <button id="topic-back-btn" class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xl font-bold transition active:scale-95 cursor-pointer" type="button">
          ‹
        </button>
        <div class="flex-1 min-w-0">
          <h2 class="truncate text-base font-extrabold flex items-center gap-1.5 leading-none text-slate-900 dark:text-white">
            <span>${icon}</span> ${topicName}
          </h2>
          <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wide">
            ${vocabList.length} ${t('B1 Vocabulary records', 'B1 Wortschatz')}
          </p>
        </div>
      </div>

      <!-- Info Dashboard Cards -->
      <div class="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 p-5">
        <h3 class="text-base font-extrabold text-gray-800 dark:text-gray-100">${topicName}</h3>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
          ${t('Select a dynamic study mode below to explore progressive levels and master words in this category.', 'Wähle einen Lernmodus, um die Stufenleiter zu erkunden und die Vokabeln dieses Themas spielerisch zu meistern.')}
        </p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span class="rounded-lg bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border border-blue-200/30">
            📘 ${nounCount} ${t('Nouns', 'Nomen')}
          </span>
          <span class="rounded-lg bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/30">
            🏃 ${verbCount} ${t('Verbs', 'Verben')}
          </span>
          <span class="rounded-lg bg-emerald-100 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/30">
            🎨 ${adjCount} ${t('Adjectives', 'Adjektive')}
          </span>
        </div>
      </div>

      <h4 class="px-5 mt-5 mb-2.5 text-xs font-black tracking-wider text-gray-400 dark:text-slate-500 uppercase">
        ${t('CHOOSE TRAINING METHOD', 'MODUS AUSWÄHLEN')}
      </h4>

      <!-- Modes Grid -->
      <div class="grid grid-cols-2 gap-3 px-4">
        ${modes.map((m) => `
          <button data-mode="${m.key}" class="mode-select-btn flex flex-col items-start gap-1 rounded-2xl border text-left p-4.5 transition duration-150 ${
            m.disabled
              ? 'opacity-40 cursor-default bg-gray-50 dark:bg-slate-900 border-gray-200/40 dark:border-slate-850'
              : 'bg-white hover:bg-gray-50 border-gray-150 shadow-xs hover:border-gray-200 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800/80 active:scale-[0.97] cursor-pointer'
          }" type="button" ${m.disabled ? 'disabled' : ''}>
            <div class="text-2xl mb-1.5">${m.icon}</div>
            <div class="text-sm font-extrabold text-gray-800 dark:text-gray-100 leading-tight">${m.name}</div>
            <div class="text-[10px] text-gray-400 dark:text-slate-400 font-medium leading-relaxed my-1 line-clamp-2">${m.desc}</div>
            <span class="mt-2 inline-block rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300">
              ${m.count} ${m.isFC ? t('Cards', 'Karten') : t('Questions', 'Fragen')}
            </span>
          </button>
        `).join('')}
      </div>

      <!-- History Progress Box -->
      ${Object.keys(topicProgress).length > 0 ? `
        <div class="mx-4 mt-6 rounded-2xl border border-gray-150 bg-white p-5 dark:bg-slate-900 dark:border-slate-800">
          <div class="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
            ${t('YOUR THEME HISTORY', 'DEIN LERNVERLAUF')}
          </div>
          <div class="mt-3 divide-y divide-gray-50 dark:divide-slate-800">
            ${Object.entries(topicProgress).map(([mode, result]) => `
              <div class="flex items-center justify-between py-2.5 text-xs first:pt-0 last:pb-0">
                <span class="font-semibold text-gray-600 dark:text-slate-300">
                  ${mode.includes('_level_') ? `${mode.split('_level_')[0]} • ${t('Level', 'Stufe')} ${mode.split('_level_')[1]}` : mode}
                </span>
                <span class="font-bold px-2 py-0.5 rounded-full ${
                  result.pct >= 70
                    ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400'
                }">
                  ${result.correct}/${result.total} • ${result.pct}%
                </span>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    </div>
  `;

  container.querySelector('#topic-back-btn')?.addEventListener('click', () => {
    selectedModeForLevels = null;
    state.selectedModeForLevels = null;
    setScreen('home');
  });

  container.querySelectorAll('.mode-select-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modeKey = btn.getAttribute('data-mode');
      if (modeKey) {
        selectedModeForLevels = modeKey;
        state.selectedModeForLevels = modeKey;
        renderTopic(container);
      }
    });
  });
}
