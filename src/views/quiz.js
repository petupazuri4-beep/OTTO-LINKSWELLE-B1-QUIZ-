import { state, setScreen, toggleBookmark, isBookmarked, logWordMistake, updateStreakCount, t, notify } from '../state.js';
import { VOCAB, ICONS } from '../data/vocab.js';
import { SENTENCE_EXERCISES } from '../data/sentenceExercises.js';
import { speak } from '../utils/audio.js';
import { getModeLevelConfig, getSliceForLevel } from '../utils/modeHelper.js';

let speedInterval = null;
let speedSecs = 15;
let isPlayingAudio = false;
let listenPlayCount = {};

// Shuffler
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// Distractor helper
const getDistractors = (correctValue, allPossible, count = 3) => {
  const filtered = allPossible.filter((val) => val !== correctValue);
  return shuffle(filtered).slice(0, count);
};

export function buildQuestions(topicName, mode, level) {
  const fullTopicVocab = VOCAB[topicName] || [];
  const { items, itemsPerLevel } = getModeLevelConfig(topicName, mode);

  let targetList = items;
  if (level) {
    targetList = getSliceForLevel(items, level, itemsPerLevel).slice;
  }
  if (!targetList || targetList.length === 0) {
    targetList = items.length > 0 ? items : fullTopicVocab;
  }
  if (targetList.length === 0) return [];

  // Distractors drawn from entire topic or global vocabulary pool
  let allMeanings = fullTopicVocab.map((w) => w.e);
  if (allMeanings.length < 8) {
    const globalMeanings = Object.values(VOCAB).flatMap((arr) => arr.map((w) => w.e));
    allMeanings = Array.from(new Set([...allMeanings, ...globalMeanings]));
  }

  const generateMeaningsQs = (entries) => {
    return entries.map((w) => {
      const correctOpt = w.e;
      const otherOptions = getDistractors(correctOpt, allMeanings, 3);
      const optionsList = shuffle([correctOpt, ...otherOptions]);
      return {
        type: 'meaning',
        label: state.settings.lang === 'de' ? 'Was bedeutet diese Vokabel?' : 'What does this vocabulary mean?',
        word: w.g,
        sub: w.t === 'n' ? 'noun' : w.t === 'v' ? 'verb' : 'adjective',
        opts: optionsList,
        ans: optionsList.indexOf(correctOpt),
        raw: w,
      };
    });
  };

  const generateArticlesQs = (entries) => {
    const nouns = entries.filter((w) => w.t === 'n' && /^(der|die|das) /i.test(w.g));
    return nouns.map((w) => {
      const article = w.g.split(' ')[0].toLowerCase();
      const nounTerm = w.g.slice(article.length + 1).trim();
      const optionsList = ['der', 'die', 'das'];
      return {
        type: 'article',
        label: state.settings.lang === 'de' ? 'Welcher Artikel gehört dazu?' : 'Which article belongs to this noun?',
        word: `___ ${nounTerm}`,
        sub: w.e,
        opts: optionsList,
        ans: optionsList.indexOf(article),
        raw: w,
      };
    });
  };

  const generateListeningQs = (entries) => {
    return entries.map((w) => {
      const correctOpt = w.e;
      const otherOptions = getDistractors(correctOpt, allMeanings, 3);
      const optionsList = shuffle([correctOpt, ...otherOptions]);
      return {
        type: 'listen',
        label: state.settings.lang === 'de' ? 'Höre zu und wähle die richtige Übersetzung:' : 'Listen and choose correct translation:',
        word: '🎧 Listen',
        sub: state.settings.lang === 'de' ? 'Zuhören' : 'press speaker to voice',
        opts: optionsList,
        ans: optionsList.indexOf(correctOpt),
        raw: w,
        german: w.g,
      };
    });
  };

  const generateWritingQs = (entries) => {
    return entries.map((w) => {
      return {
        type: 'write',
        label: state.settings.lang === 'de' ? 'Tippe die englische Bedeutung:' : 'Type local English translation:',
        word: w.g,
        sub: w.t === 'n' ? 'noun' : w.t === 'v' ? 'verb' : 'adjective',
        opts: [],
        ans: w.e,
        raw: w,
      };
    });
  };

  const generateSentenceQs = (sentenceEntries) => {
    const allDeSentences = Object.values(SENTENCE_EXERCISES).flatMap((arr) => arr.map((s) => s.de));
    const allEnSentences = Object.values(SENTENCE_EXERCISES).flatMap((arr) => arr.map((s) => s.en));
    const qs = [];

    sentenceEntries.forEach((s) => {
      const correctEn = s.en;
      const otherEn = getDistractors(correctEn, allEnSentences, 3);
      const enOptions = shuffle([correctEn, ...otherEn]);

      qs.push({
        type: 'sentence',
        label: state.settings.lang === 'de' ? 'Übersetze diesen deutschen Satz ins Englische:' : 'Translate this German sentence to English:',
        word: s.de,
        sub: `Vocabulary: ${s.wordsUsed.join(', ')}`,
        opts: enOptions,
        ans: enOptions.indexOf(correctEn),
        raw: fullTopicVocab.find((w) => s.wordsUsed.some((wu) => w.g.toLowerCase().includes(wu.toLowerCase()))) || fullTopicVocab[0],
      });

      const correctDe = s.de;
      const otherDe = getDistractors(correctDe, allDeSentences, 3);
      const deOptions = shuffle([correctDe, ...otherDe]);

      qs.push({
        type: 'sentence',
        label: state.settings.lang === 'de' ? 'Übersetze diesen englischen Satz ins Deutsche:' : 'Translate this English sentence to German:',
        word: s.en,
        sub: 'Satzübung',
        opts: deOptions,
        ans: deOptions.indexOf(correctDe),
        raw: fullTopicVocab.find((w) => s.wordsUsed.some((wu) => w.g.toLowerCase().includes(wu.toLowerCase()))) || fullTopicVocab[0],
      });
    });
    return qs;
  };

  switch (mode) {
    case 'meaning':
      return shuffle(generateMeaningsQs(targetList));
    case 'article':
      return shuffle(generateArticlesQs(targetList));
    case 'verb':
      return shuffle(generateMeaningsQs(targetList));
    case 'adjective':
      return shuffle(generateMeaningsQs(targetList));
    case 'speed':
      return shuffle(generateMeaningsQs(targetList)).slice(0, 20);
    case 'write':
      return shuffle(generateWritingQs(targetList)).slice(0, 15);
    case 'listen':
      return shuffle(generateListeningQs(targetList));
    case 'sentence':
      return shuffle(generateSentenceQs(targetList));
    case 'all':
    default: {
      const combined = [
        ...generateMeaningsQs(targetList),
        ...generateArticlesQs(targetList),
        ...generateListeningQs(targetList),
      ];
      return shuffle(combined).slice(0, 30);
    }
  }
}

export function startQuizRound(modeKey) {
  let mode = modeKey;
  let levelNum = null;
  if (modeKey.includes('_level_')) {
    const parts = modeKey.split('_level_');
    mode = parts[0];
    levelNum = parseInt(parts[1], 10);
  }

  const questions = buildQuestions(state.selectedTopic, mode, levelNum);
  if (!questions || questions.length === 0) {
    console.warn('No questions found for', state.selectedTopic, mode, levelNum);
    return;
  }

  state.questions = questions;
  state.answers = new Array(questions.length).fill(null);
  state.currentQuestionIdx = 0;
  state.activeQuizMode = modeKey;
  listenPlayCount = {};
  setScreen('quiz');
}

export function startWeakWordsTraining() {
  const list = Object.values(state.missedWords);
  const weakList = [...list]
    .sort((a, b) => b.count - a.count)
    .map((item) => {
      const { count, ...word } = item;
      return word;
    })
    .slice(0, 20);

  if (weakList.length === 0) return;
  const allPossible = weakList.map((w) => w.e);
  const compiledQs = weakList.map((w) => {
    const correctOpt = w.e;
    const otherOptions = getDistractors(correctOpt, allPossible, 3);
    const optionsList = shuffle([correctOpt, ...otherOptions]);
    return {
      type: 'meaning',
      label: state.settings.lang === 'de' ? 'Was bedeutet diese fehlerhafte Vokabel?' : 'What does this weak vocabulary word mean?',
      word: w.g,
      sub: w.t === 'n' ? 'noun' : w.t === 'v' ? 'verb' : 'adjective',
      opts: optionsList,
      ans: optionsList.indexOf(correctOpt),
      raw: w,
    };
  });

  state.questions = compiledQs;
  state.answers = new Array(compiledQs.length).fill(null);
  state.currentQuestionIdx = 0;
  state.activeQuizMode = 'meaning';
  state.selectedTopic = 'Weak Words';
  setScreen('quiz');
}

export function renderQuiz(container) {
  const topicName = state.selectedTopic;
  const mode = state.activeQuizMode;
  const questions = state.questions;
  const currentIdx = state.currentQuestionIdx;
  const answers = state.answers;

  const q = questions[currentIdx];
  if (!q) {
    container.innerHTML = `<div class="p-6 text-center">No questions found. <button id="quiz-empty-back" class="mt-4 px-4 py-2 bg-slate-900 text-white rounded-xl">Back</button></div>`;
    container.querySelector('#quiz-empty-back')?.addEventListener('click', () => setScreen('topic'));
    return;
  }

  const chosenOption = answers[currentIdx];
  const totalQs = questions.length;
  const doneQs = answers.filter((ans) => ans !== null).length;
  const pctFinished = Math.round((doneQs / totalQs) * 100);
  const isWrite = q.type === 'write';
  const isListen = q.type === 'listen';
  const hasAnswered = chosenOption !== null;

  const isCorrectChoice = () => {
    if (chosenOption === null) return false;
    if (isWrite) {
      return !String(chosenOption).startsWith('__wrong__');
    }
    return chosenOption === q.ans;
  };

  // Trigger audio on question load
  if (state.settings.ttsOn && !hasAnswered) {
    setTimeout(() => {
      if (isListen) {
        speak(q.german || q.word.replace('🎧 ', ''), true);
      } else if (q.word && !isWrite) {
        if (q.type === 'sentence') {
          const isGermanSentence = q.label.includes('German') || q.label.includes('deutschen');
          if (isGermanSentence) speak(q.word, true);
        } else {
          speak(q.word.replace('___ ', '').trim(), true);
        }
      }
    }, 150);
  }

  // Speed timer logic
  if (mode === 'speed' && !hasAnswered) {
    if (speedInterval) clearInterval(speedInterval);
    speedSecs = 15;
    speedInterval = setInterval(() => {
      speedSecs--;
      const timerEl = document.getElementById('speed-timer-count');
      const barEl = document.getElementById('speed-timer-bar');
      if (timerEl) timerEl.textContent = `${speedSecs}s`;
      if (barEl) {
        barEl.style.width = `${(speedSecs / 15) * 100}%`;
        if (speedSecs <= 5) barEl.className = 'h-full rounded-full transition-all duration-1000 bg-red-500';
      }
      if (speedSecs <= 0) {
        clearInterval(speedInterval);
        handleAnswerChoice(-1, container);
      }
    }, 1000);
  } else if (speedInterval) {
    clearInterval(speedInterval);
  }

  container.innerHTML = `
    <div class="pb-28">
      <!-- Top Navbar -->
      <div class="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-4.5 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800">
        <div class="flex items-center gap-3">
          <button id="quiz-back-btn" class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xl font-bold transition active:scale-95 cursor-pointer" type="button">
            ‹
          </button>
          <div class="flex-1 min-w-0">
            <h2 class="truncate text-base font-extrabold flex items-center gap-1.5 leading-none text-slate-900 dark:text-white">
              <span>${ICONS[topicName] || '📖'}</span> ${topicName}
            </h2>
            <p class="text-[10px] mt-1 uppercase tracking-wider font-extrabold theme-text">
              ${mode.replace('_level_', ' • Level ')}
            </p>
          </div>
        </div>
        <div class="rounded-full bg-gray-100 dark:bg-slate-800 px-3 py-1.5 text-xs font-black text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700">
          ${doneQs}/${totalQs}
        </div>
      </div>

      <div class="p-4">
        <!-- Speed timer bar if in speed mode -->
        ${mode === 'speed' && !hasAnswered ? `
          <div class="mb-4">
            <div class="flex items-center justify-between text-xs font-black tracking-wider mb-1">
              <span class="text-orange-600 dark:text-orange-400">⏱️ SPEED COUNTER</span>
              <span id="speed-timer-count" class="${speedSecs <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-400'}">${speedSecs}s</span>
            </div>
            <div class="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div id="speed-timer-bar" class="h-full rounded-full transition-all duration-1000 ${speedSecs <= 5 ? 'bg-red-500' : speedSecs <= 9 ? 'bg-amber-500' : 'bg-emerald-500'}" style="width: ${(speedSecs / 15) * 100}%"></div>
            </div>
          </div>
        ` : ''}

        <!-- Progress bar -->
        <div class="flex justify-between items-center text-xs text-gray-400 mb-1 font-bold">
          <span>${pctFinished}% Completed</span>
          <span>Question ${currentIdx + 1} of ${totalQs}</span>
        </div>
        <div class="h-1.5 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden mb-4">
          <div class="h-full rounded-full bg-slate-800 dark:bg-emerald-600 transition-all duration-300" style="width: ${pctFinished}%"></div>
        </div>

        <!-- Question Tracker Dots -->
        <div class="flex flex-wrap gap-1.5 mb-5 select-none justify-center">
          ${questions.map((_, i) => {
            const usersAnswer = answers[i];
            let cellStyle = 'border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-gray-400';
            if (i === currentIdx) {
              cellStyle = 'border-slate-900 bg-slate-900 text-white dark:border-emerald-500 dark:bg-emerald-600';
            } else if (usersAnswer !== null) {
              if (usersAnswer === -1 || String(usersAnswer).startsWith('__wrong__')) {
                cellStyle = 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900';
              } else {
                const questionEntry = questions[i];
                const isItemCorrect = usersAnswer === questionEntry.ans;
                cellStyle = isItemCorrect
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900'
                  : 'border-red-300 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900';
              }
            }
            return `
              <button data-idx="${i}" class="quiz-dot-btn flex h-8 w-8 min-w-[32px] items-center justify-center rounded-lg border text-xs font-black transition cursor-pointer active:scale-95 ${cellStyle}" type="button">
                ${i + 1}
              </button>
            `;
          }).join('')}
        </div>

        <!-- Card Container -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs dark:bg-slate-900 dark:border-slate-800">
          <div class="flex items-center justify-between border-b border-gray-100 pb-3 dark:border-slate-800">
            <span class="rounded-lg bg-orange-50 px-2.5 py-1 text-[9.5px] font-black uppercase text-orange-700 dark:bg-orange-950/20 dark:text-orange-400">
              ${q.type} Mode
            </span>
            <div class="flex gap-2">
              ${!isListen ? `
                <button id="quiz-audio-hear-btn" class="rounded-xl border border-gray-150 dark:border-slate-800 bg-gray-50 px-3 py-1.5 text-xs font-black text-gray-600 hover:bg-gray-100 active:scale-95 dark:bg-slate-800 dark:text-slate-300 cursor-pointer" type="button">
                  🔊 Hear
                </button>
              ` : ''}
              ${q.raw ? `
                <button id="quiz-bookmark-toggle-btn" class="flex h-8 w-8 items-center justify-center rounded-xl bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 active:rotate-12 transition cursor-pointer" type="button">
                  ${isBookmarked(q.raw.g) ? '★' : '☆'}
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Listening acoustic pulse if isListen -->
          ${isListen ? `
            <div class="my-6 flex flex-col items-center justify-center gap-3">
              <span class="text-xs text-gray-400 font-extrabold uppercase">
                ${t('Acoustic Sound Playback', 'Aussprache anhören')}
              </span>
              <button id="quiz-listen-playback-btn" class="flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 text-3xl border-2 border-indigo-400 hover:bg-indigo-100 text-indigo-700 transition active:scale-90 dark:bg-slate-800 dark:border-slate-700 dark:text-emerald-400 cursor-pointer" type="button">
                🔊
              </button>
              <div class="text-[10px] text-gray-400 dark:text-slate-500 text-center">
                ${listenPlayCount[currentIdx] ? `Played ${listenPlayCount[currentIdx]} times` : 'Click speaker to listen'}
              </div>
            </div>
          ` : ''}

          <!-- Question prompt -->
          <div class="mt-4">
            <label class="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase">${q.label}</label>
            <h3 class="text-2xl font-black mt-1 text-gray-800 dark:text-gray-100 break-words leading-tight">
              ${isListen ? '🎧 Listening Practice' : q.word}
            </h3>
            ${q.raw && q.raw.g ? `
              <div class="flex gap-1.5 mt-2 flex-wrap text-xs">
                ${q.raw.g.startsWith('der') ? '<span class="rounded-md bg-blue-100 px-2 py-0.5 font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">der</span>' : ''}
                ${q.raw.g.startsWith('die') ? '<span class="rounded-md bg-pink-100 px-2 py-0.5 font-bold text-pink-700 dark:bg-pink-900/30 dark:text-pink-300">die</span>' : ''}
                ${q.raw.g.startsWith('das') ? '<span class="rounded-md bg-emerald-100 px-2 py-0.5 font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">das</span>' : ''}
                <span class="text-gray-400 font-medium italic mt-0.5">${q.sub}</span>
              </div>
            ` : ''}
          </div>

          <!-- Answer options or Input -->
          <div class="mt-6 border-t border-gray-100 pt-4 dark:border-slate-800">
            ${isWrite ? `
              <div class="space-y-3">
                <input
                  id="quiz-write-input"
                  type="text"
                  ${hasAnswered ? 'disabled' : ''}
                  class="w-full rounded-xl border-2 p-3 text-lg font-black text-center outline-none bg-gray-50 dark:bg-slate-800 dark:text-white ${
                    hasAnswered
                      ? isCorrectChoice()
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-800'
                        : 'border-red-400 bg-red-50 dark:bg-red-950/10 text-red-800'
                      : 'border-gray-200 focus:border-slate-900 focus:bg-white dark:border-slate-700 dark:focus:border-emerald-500'
                  }"
                  placeholder="${t('Type English translation...', 'Bedeutung eingeben...')}"
                  value="${chosenOption !== null ? (isCorrectChoice() ? q.ans : chosenOption.replace('__wrong__', '')) : ''}"
                />
                ${!hasAnswered ? `
                  <button id="quiz-check-write-btn" class="w-full rounded-xl bg-slate-900 py-3.5 text-center text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-98 cursor-pointer" type="button">
                    ${t('Check Answer', 'Antwort überprüfen')}
                  </button>
                ` : `
                  <div class="rounded-xl p-3 text-xs font-bold leading-relaxed ${
                    isCorrectChoice()
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
                      : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                  }">
                    ${isCorrectChoice() ? '✓ Correct! Spelling is perfect.' : `✕ Mistake — correct output was: <strong>${q.ans}</strong>`}
                  </div>
                `}
              </div>
            ` : `
              <div class="space-y-2">
                ${q.opts.map((opt, oIdx) => {
                  let optStyle = 'border-gray-150 bg-gray-50/50 hover:bg-gray-100 dark:bg-slate-800/80 hover:dark:bg-slate-800 text-gray-700 dark:text-slate-200';
                  if (hasAnswered || chosenOption === -1) {
                    if (oIdx === q.ans) {
                      optStyle = 'border-emerald-400 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300 font-bold';
                    } else if (oIdx === chosenOption) {
                      optStyle = 'border-red-400 bg-red-50 text-red-800 dark:bg-red-950/30 dark:text-red-300';
                    } else {
                      optStyle = 'opacity-30 border-gray-100 text-gray-300 dark:bg-slate-900 dark:text-slate-600';
                    }
                  }
                  const alphabetPrefix = String.fromCharCode(65 + oIdx);
                  return `
                    <button data-opt-idx="${oIdx}" type="button" ${hasAnswered || chosenOption === -1 ? 'disabled' : ''} class="quiz-option-btn w-full flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-semibold transition duration-150 cursor-pointer ${optStyle}">
                      <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-black text-gray-700 dark:text-slate-200 uppercase">
                        ${hasAnswered && oIdx === q.ans ? '✓' : hasAnswered && oIdx === chosenOption ? '✕' : alphabetPrefix}
                      </span>
                      <span class="leading-snug">${opt}</span>
                    </button>
                  `;
                }).join('')}

                ${chosenOption === -1 ? `
                  <div class="rounded-xl bg-red-50 p-3.5 text-xs font-bold text-red-700 dark:bg-red-950/20 dark:text-red-400">
                    ⚠️ Time is up! Correct meaning: <strong>${q.opts[q.ans]}</strong>
                  </div>
                ` : ''}

                ${hasAnswered && chosenOption !== -1 ? `
                  <div class="rounded-xl p-3.5 text-xs font-bold ${
                    isCorrectChoice() ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400' : 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
                  }">
                    ${isCorrectChoice() ? '✓ Accurate!' : `✕ Incorrect — correct answer: ${q.opts[q.ans]}`}
                  </div>
                ` : ''}
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Bottom Controls -->
      <div class="fixed bottom-0 left-1/2 w-full max-w-lg -translate-x-1/2 border-t border-gray-100 bg-white px-4 py-3 pb-8 shadow-lg dark:bg-slate-900 dark:border-slate-800 flex gap-3 z-30">
        <button id="quiz-prev-btn" type="button" ${currentIdx === 0 ? 'disabled' : ''} class="flex-1 rounded-xl border border-gray-200 bg-gray-50 py-3 text-center text-xs font-bold text-gray-600 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-gray-100 disabled:opacity-30 active:scale-95 transition cursor-pointer">
          ‹ Prev
        </button>
        ${currentIdx + 1 === totalQs ? `
          <button id="quiz-finish-btn" type="button" class="flex-1 rounded-xl bg-slate-900 py-3 text-center text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-95 shadow-sm cursor-pointer">
            ${t('Finish Test ✓', 'Beenden ✓')}
          </button>
        ` : `
          <button id="quiz-next-btn" type="button" class="flex-1 rounded-xl bg-slate-900 py-3 text-center text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-95 shadow-sm cursor-pointer">
            ${t('Next →', 'Weiter →')}
          </button>
        `}
      </div>
    </div>
  `;

  // Attach Event Listeners
  container.querySelector('#quiz-back-btn')?.addEventListener('click', () => {
    if (speedInterval) clearInterval(speedInterval);
    setScreen('topic');
  });

  container.querySelectorAll('.quiz-dot-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      state.currentQuestionIdx = idx;
      renderQuiz(container);
    });
  });

  container.querySelector('#quiz-audio-hear-btn')?.addEventListener('click', () => {
    if (q.type === 'sentence') {
      const isGermanSentence = q.label.includes('German') || q.label.includes('deutschen');
      if (isGermanSentence) {
        speak(q.word, true);
      } else {
        const correctGerman = q.opts[q.ans];
        speak(correctGerman, true);
      }
    } else {
      speak(q.word.replace('___ ', '').trim(), true);
    }
  });

  container.querySelector('#quiz-bookmark-toggle-btn')?.addEventListener('click', () => {
    if (q.raw) {
      toggleBookmark(q.raw);
      renderQuiz(container);
    }
  });

  container.querySelector('#quiz-listen-playback-btn')?.addEventListener('click', () => {
    listenPlayCount[currentIdx] = (listenPlayCount[currentIdx] || 0) + 1;
    speak(q.german || q.word.replace('🎧 ', ''), true);
    renderQuiz(container);
  });

  container.querySelectorAll('.quiz-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const optIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
      handleAnswerChoice(optIdx, container);
    });
  });

  const writeInput = container.querySelector('#quiz-write-input');
  const checkWriteBtn = container.querySelector('#quiz-check-write-btn');
  if (writeInput && checkWriteBtn) {
    const checkWrite = () => {
      const val = writeInput.value.trim();
      if (!val) return;
      handleAnswerSpelling(val, container);
    };
    checkWriteBtn.addEventListener('click', checkWrite);
    writeInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') checkWrite();
    });
  }

  container.querySelector('#quiz-prev-btn')?.addEventListener('click', () => {
    if (state.currentQuestionIdx > 0) {
      state.currentQuestionIdx--;
      renderQuiz(container);
    }
  });

  container.querySelector('#quiz-next-btn')?.addEventListener('click', () => {
    if (state.currentQuestionIdx < state.questions.length - 1) {
      state.currentQuestionIdx++;
      renderQuiz(container);
    }
  });

  container.querySelector('#quiz-finish-btn')?.addEventListener('click', () => {
    finishQuiz(container);
  });
}

function handleAnswerChoice(optIdx, container) {
  if (state.answers[state.currentQuestionIdx] !== null) return;
  if (speedInterval) clearInterval(speedInterval);
  state.answers[state.currentQuestionIdx] = optIdx;

  const activeQ = state.questions[state.currentQuestionIdx];
  if (optIdx !== activeQ.ans && activeQ.raw) {
    logWordMistake(activeQ.raw);
  }
  renderQuiz(container);
}

function handleAnswerSpelling(typedText, container) {
  if (state.answers[state.currentQuestionIdx] !== null) return;
  const activeQ = state.questions[state.currentQuestionIdx];
  const userSpelled = typedText.trim().toLowerCase();
  const correctSpelling = String(activeQ.ans).trim().toLowerCase();

  const isCorrect =
    userSpelled === correctSpelling ||
    userSpelled === correctSpelling.replace(/^the /i, '') ||
    (correctSpelling.includes(userSpelled) && userSpelled.length > 3);

  state.answers[state.currentQuestionIdx] = isCorrect ? activeQ.ans : `__wrong__${typedText}`;

  if (!isCorrect && activeQ.raw) {
    logWordMistake(activeQ.raw);
  }
  renderQuiz(container);
}

function finishQuiz(container) {
  if (speedInterval) clearInterval(speedInterval);
  const total = state.questions.length;
  const correctCount = state.answers.filter((ans, idx) => {
    if (ans === null || ans === -1) return false;
    if (typeof ans === 'string' && ans.startsWith('__wrong__')) return false;
    return ans === state.questions[idx].ans;
  }).length;
  const pct = Math.round((correctCount / total) * 100);

  if (state.selectedTopic !== 'Weak Words') {
    if (!state.progress[state.selectedTopic]) state.progress[state.selectedTopic] = {};
    state.progress[state.selectedTopic][state.activeQuizMode] = {
      correct: correctCount,
      total,
      pct,
      ts: Date.now()
    };
    try {
      localStorage.setItem('lw_prog', JSON.stringify(state.progress));
    } catch {}

    const hsKey = `${state.selectedTopic}|${state.activeQuizMode}`;
    const storedHs = state.highscores[hsKey];
    if (!storedHs || pct > storedHs.pct) {
      state.highscores[hsKey] = {
        topic: state.selectedTopic,
        mode: state.activeQuizMode,
        pct,
        correct: correctCount,
        total,
        ts: Date.now()
      };
      try {
        localStorage.setItem('lw_hs', JSON.stringify(state.highscores));
      } catch {}
    }
  }

  updateStreakCount();

  // Render Completion Screen
  container.innerHTML = `
    <div class="pb-24">
      <div class="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-4.5 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800">
        <button id="quiz-result-back-btn" class="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 text-xl font-bold transition active:scale-95 cursor-pointer" type="button">
          ‹
        </button>
        <div class="flex-1 min-w-0">
          <h2 class="truncate text-base font-extrabold text-slate-900 dark:text-white">${t('Test Completed', 'Test abgeschlossen')}</h2>
        </div>
      </div>

      <div class="mx-auto max-w-md p-6 text-center">
        <div class="text-sm font-extrabold tracking-widest text-slate-400 uppercase mb-2">
          ${state.selectedTopic}
        </div>
        <div class="text-6xl font-black text-slate-800 dark:text-white tracking-tight">
          ${pct}%
        </div>
        <div class="text-base font-semibold text-slate-500 dark:text-slate-400 mt-2">
          ${pct >= 85 ? t('Legendary progress! 🌟', 'Exzellente Arbeit! 🌟') : pct >= 70 ? t('Well done! Passed with honors 🚀', 'Klasse! Bestanden 🚀') : t('Keep reviewing to build confidence! 💪', 'Bleib dran und wiederhole die Wörter! 💪')}
        </div>

        <div class="grid grid-cols-2 gap-4 mt-6">
          <div class="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 p-4 border border-emerald-100 dark:border-emerald-900/30">
            <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">${correctCount}</div>
            <div class="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 tracking-wide mt-1 uppercase">${t('Correct', 'Richtig')}</div>
          </div>
          <div class="rounded-2xl bg-rose-50 dark:bg-rose-950/20 p-4 border border-rose-100 dark:border-rose-900/30">
            <div class="text-2xl font-black text-rose-600 dark:text-rose-400">${total - correctCount}</div>
            <div class="text-[11px] font-bold text-rose-700 dark:text-rose-400 tracking-wide mt-1 uppercase">${t('Mistakes', 'Fehler')}</div>
          </div>
        </div>

        <div class="mt-8 space-y-2">
          ${(() => {
            if (state.activeQuizMode && state.activeQuizMode.includes('_level_')) {
              const parts = state.activeQuizMode.split('_level_');
              const mode = parts[0];
              const lvl = parseInt(parts[1], 10);
              const { numLevels } = getModeLevelConfig(state.selectedTopic, mode);
              if (pct >= 70 && lvl < numLevels) {
                return `
                  <button id="quiz-next-level-btn" class="w-full rounded-xl theme-bg-primary py-3.5 text-center text-sm font-black text-white transition active:scale-98 shadow-sm cursor-pointer" type="button">
                    🚀 ${t('Next Level →', 'Nächste Stufe →')} (${t('Level', 'Stufe')} ${lvl + 1})
                  </button>
                `;
              }
            }
            return '';
          })()}
          <button id="quiz-retry-btn" class="w-full rounded-xl bg-slate-900 py-3.5 text-center text-sm font-bold text-white transition hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-700 active:scale-98 cursor-pointer" type="button">
            ${t('Retry Quiz', 'Erneut versuchen')}
          </button>
          <button id="quiz-back-topic-btn" class="w-full rounded-xl border border-gray-200 bg-white py-3.5 text-center text-sm font-bold text-gray-700 hover:bg-gray-50 transition active:scale-98 dark:bg-slate-900 dark:border-slate-800 dark:text-white cursor-pointer" type="button">
            ${t('Back to Topic', 'Zurück zum Thema')}
          </button>
        </div>
      </div>
    </div>
  `;

  const returnToTopic = () => {
    if (state.activeQuizMode && state.activeQuizMode.includes('_level_')) {
      state.selectedModeForLevels = state.activeQuizMode.split('_level_')[0];
    }
    setScreen('topic');
  };

  container.querySelector('#quiz-result-back-btn')?.addEventListener('click', returnToTopic);
  container.querySelector('#quiz-back-topic-btn')?.addEventListener('click', returnToTopic);
  container.querySelector('#quiz-next-level-btn')?.addEventListener('click', () => {
    if (state.activeQuizMode && state.activeQuizMode.includes('_level_')) {
      const parts = state.activeQuizMode.split('_level_');
      const mode = parts[0];
      const lvl = parseInt(parts[1], 10);
      startQuizRound(`${mode}_level_${lvl + 1}`);
    }
  });
  container.querySelector('#quiz-retry-btn')?.addEventListener('click', () => {
    startQuizRound(state.activeQuizMode);
  });
}
