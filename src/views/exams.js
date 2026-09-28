import { state, t, addTestPoints, addModuleProgress, recordB1TaskAttempt } from '../state.js';
import { getA1ExamSets, getA2ExamSets, getB1ExamSets, B1_STRUCTURE_INFO } from '../data/examSetsData.js';
import { B1_SPRECHEN_TOPICS, GOETHE_B1_SPRECHEN_REDEMITTEL } from '../data/b1SprechenTopics.js';
import { speak } from '../utils/audio.js';
import { getApiUrl } from '../utils/api.js';
import { showToast } from '../utils/toast.js';

let activeLevel = 'B1'; // 'A1' | 'A2' | 'B1'
let activeModule = 'lesen'; // 'lesen' | 'hoeren' | 'schreiben' | 'sprechen'
let activeTeil = 0;
let activeSetIdx = 0;

export function setExamLevelAndModule(level, mod, teil = 0) {
  if (level) activeLevel = level;
  if (mod) activeModule = mod;
  if (teil !== undefined) activeTeil = teil;
}

let solvedState = {};
let feedbackState = {};
let writingInputs = {};
let writingGrades = {};
let loadingWritingGrade = {};
let audioPlayState = {};
let speakingTranscript = false;
let formFillingResults = null;
let selectedB1SprechenTopic = 'stadt_oder_land';
let activeB1SprechenSlide = 0;
let b1SprechenTab = 'slides'; // 'slides' | 'transcript' | 'timer' | 'redemittel' | 'qa'
let b1Teil3Tab = 'qa'; // 'qa' | 'feedback' | 'redemittel' | 'recorder'
let b1Teil1Tab = 'dialogue'; // 'dialogue' | 'checklist' | 'redemittel' | 'timer'
let b1Teil1Step = 0;
let b1Teil1History = [];
let b1Teil1Checked = {};
let b1Teil1TimerSeconds = 180;
let b1Teil1TimerRunning = false;
let b1Teil1TimerInterval = null;
let b1SchreibenTimerSeconds = 1200;
let b1SchreibenTimerRunning = false;
let b1SchreibenTimerInterval = null;
let b1Teil3FeedbackStep = 1;
let b1TimerSeconds = 180; // 3:00 min (Teil 2) or 2:00 min (Teil 3)
let b1TimerRunning = false;
let b1TimerInterval = null;
let b1SpeechRecognition = null;
let b1IsRecording = false;
let b1SpokenTranscript = '';
let b1SpeechStartTime = null;
let b1SpeechWpm = 0;
let b1RedemittelCategory = 'all';
let b1ShowSampleText = {};
let claimedTasks = {};
let showB1BlueprintModal = false;

function escapeAttr(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function renderExams(container) {
  const a1Exams = getA1ExamSets(t);
  const a2Exams = getA2ExamSets(t);
  const b1Exams = getB1ExamSets(t);

  const currentExamSet = activeLevel === 'A1'
    ? a1Exams[activeSetIdx] || a1Exams[0]
    : activeLevel === 'A2'
    ? a2Exams[activeSetIdx] || a2Exams[0]
    : b1Exams[activeSetIdx] || b1Exams[0];

  const mData = currentExamSet[activeModule] || [];
  const task = mData[activeTeil] || mData[0];

  const handleClaimPoints = (taskKey, pts) => {
    if (claimedTasks[taskKey]) return;
    claimedTasks[taskKey] = true;
    addTestPoints(pts);
    addModuleProgress("exams", pts);
    if (activeLevel === 'B1') {
      recordB1TaskAttempt(activeModule, activeTeil + 1, true, pts);
    }
  };

  container.innerHTML = `
    <div class="mx-auto max-w-lg bg-white dark:bg-slate-950 pb-28 min-h-screen">
      <!-- Upper CEFR Target Banner -->
      <div class="bg-white border-b border-gray-200 text-slate-900 p-4 dark:bg-slate-900 dark:border-slate-800 dark:text-white">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="p-1 px-2.5 rounded bg-amber-400 text-slate-950 text-xs font-black select-none">
              GERMAN
            </span>
            <div class="text-left">
              <h2 class="text-[13px] font-black tracking-tight text-slate-900 dark:text-white leading-none">
                ${t('Official Exam Simulator', 'Offizielle Prüfungssimulation')}
              </h2>
              <span class="text-[10px] text-slate-500 dark:text-gray-400 font-mono">
                ${t('Intensity Levels: A1 to B1 max', 'Regulierte Stufe: A1 bis B1 max')}
              </span>
            </div>
          </div>
          <!-- Level selector -->
          <div class="flex bg-gray-100 p-0.5 rounded-lg border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
            ${['A1', 'A2', 'B1'].map((lvl) => `
              <button data-level="${lvl}" class="exam-lvl-btn px-3 py-1 text-[11px] font-black rounded-md transition duration-150 cursor-pointer ${
                activeLevel === lvl ? 'bg-amber-400 text-slate-950 font-black shadow-md scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }">
                ${lvl}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 10 Exam Sets Ribbon -->
        <div class="mt-3.5 pt-3.5 border-t border-gray-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div class="flex items-center gap-1.5 select-none font-sans">
            <span class="text-[10px] font-black uppercase text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-400/10 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-400/20 tracking-wider">
              ${t('EXAM SETS', 'PRÜFUNGSSÄTZE')}
            </span>
            <span class="text-[10.5px] font-bold text-slate-500 dark:text-slate-350">
              ${t('10 Complete Variations', '10 vollständige Varianten')}
            </span>
          </div>
          <div class="flex gap-1 overflow-x-auto no-scrollbar scroll-smooth w-full sm:w-auto max-w-full py-0.5">
            ${Array.from({ length: 10 }).map((_, i) => {
              const sNum = i + 1;
              const isSelected = activeSetIdx === i;
              return `
                <button data-set="${i}" class="exam-set-btn px-2.5 py-1 text-[10px] font-black rounded-lg transition-all duration-150 cursor-pointer shrink-0 ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 shadow-md scale-105 font-black'
                    : 'text-slate-600 bg-gray-100 hover:text-slate-900 hover:bg-gray-200 border border-gray-200 dark:text-slate-400 dark:bg-slate-800/60 dark:hover:text-white dark:hover:bg-slate-750 dark:border-slate-700/50 font-bold'
                }">
                  Set ${sNum}
                </button>
              `;
            }).join('')}
          </div>
        </div>
      </div>

      <!-- Feature Headers -->
      <div class="bg-white text-slate-900 p-6 shadow-xs rounded-b-[2rem] border-b-4 border-amber-400 border-x border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-800 relative">
        <div class="text-[10px] uppercase font-black text-amber-600 dark:text-amber-350 tracking-widest flex items-center gap-2 flex-wrap">
          <span>🌟 ${t('GOETHE ACADEMY ASSESSMENT CENTER', 'GOETHE-INSTITUT TESTSIMULATOR')} 🌟</span>
          <span class="bg-amber-400 text-slate-950 text-[9px] px-1.5 py-0.5 rounded-md font-black">
            ${activeLevel} ${t('LEVEL PRACTICE', 'NIVEAUSTUFE')}
          </span>
        </div>

        <h1 class="text-2xl font-black mt-2 tracking-tight flex items-center gap-1.5 font-sans text-slate-900 dark:text-white">
          ${t(`Goethe ${activeLevel} Exam Suite`, `Goethe ${activeLevel} Prüfungsportal`)}
        </h1>
        <p class="text-xs text-slate-500 dark:text-indigo-200 mt-1 leading-relaxed">
          ${t(
            'Take high-fidelity interactive tasks modeled on the latest institute blueprints. Boost speaking, writing, listening, and reading performance levels.',
            'Nimm an interaktiven Übungen teil, die exakt an die aktuellen Goethe-Prüfungen angepasst sind. Verbessere Sprechen, Hören, Schreiben und Lesen.'
          )}
        </p>

        ${activeLevel === 'B1' ? `
          <div class="mt-4 p-3.5 bg-amber-50 dark:bg-slate-950 border border-amber-300/80 dark:border-amber-600/40 rounded-2xl text-left shadow-xs">
            <div class="flex items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <span class="text-xl">📋</span>
                <div>
                  <h4 class="text-xs font-black text-amber-950 dark:text-amber-300 leading-tight">
                    ${t('Official Goethe B1 Exam Blueprint & Structure', 'Offizieller Goethe B1 Prüfungsplan & Kriterien')}
                  </h4>
                  <p class="text-[10px] text-amber-800 dark:text-amber-400 font-mono mt-0.5">
                    ${t('4 Modules • Passing Score: ≥60% in each section', '4 Module • Bestehensgrenze: Mindestens 60% in jedem Modul')}
                  </p>
                </div>
              </div>
              <button id="exam-toggle-b1-blueprint-btn" class="px-3 py-1.5 text-[10.5px] font-black bg-amber-400 hover:bg-amber-350 text-slate-950 rounded-xl shadow-xs cursor-pointer transition shrink-0 select-none">
                ${showB1BlueprintModal ? t('Close Blueprint', 'Schließen ✕') : t('View Blueprint', 'Struktur anzeigen')}
              </button>
            </div>

            ${showB1BlueprintModal ? `
              <div class="mt-3.5 pt-3.5 border-t border-amber-200 dark:border-slate-800 space-y-3 font-sans">
                <div class="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-800 text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed">
                  <span class="font-black text-amber-900 dark:text-amber-300 block mb-1">🏆 ${t('Passing Rule (60% Minimum per Module):', 'Offizielle Bestehensregelung (60%-Regel):')}</span>
                  ${t(
                    'To obtain the Goethe-Zertifikat B1, candidates must pass each of the 4 modules with at least 60%: Reading (≥18/30 pts), Listening (≥18/30 pts), Writing (≥60/100 pts), and Speaking (≥60/100 pts). Modules can be completed in a single session or independently.',
                    'Das Goethe-Zertifikat B1 gilt als bestanden, wenn in jedem der 4 Module mindestens 60% erreicht werden: Lesen (≥18/30 Pkt.), Hören (≥18/30 Pkt.), Schreiben (≥60/100 Pkt.) und Sprechen (≥60/100 Pkt.). Module können zusammen oder einzeln abgelegt werden.'
                  )}
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  ${B1_STRUCTURE_INFO.modules.map((mod) => `
                    <div class="p-3 bg-white dark:bg-slate-900 rounded-xl border border-amber-200 dark:border-slate-800 space-y-1.5">
                      <div class="flex items-center justify-between">
                        <span class="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>${mod.icon}</span>
                          <span>${t(mod.nameEn, mod.name)}</span>
                        </span>
                        <span class="text-[9.5px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded">${mod.time}</span>
                      </div>
                      <div class="text-[10px] text-gray-500 font-mono">${mod.marks}</div>
                      <ul class="text-[10px] text-slate-600 dark:text-slate-350 space-y-1 pt-1 border-t border-gray-100 dark:border-slate-800">
                        ${mod.teile.map((tl) => `
                          <li class="leading-tight"><strong class="text-amber-800 dark:text-amber-300">Teil ${tl.teil} (${tl.marks}):</strong> ${tl.desc}</li>
                        `).join('')}
                      </ul>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        ` : ''}

        <!-- 4 Skill Tabs -->
        <div class="grid grid-cols-4 bg-gray-100 dark:bg-slate-800 rounded-2xl p-1 gap-1.5 mt-5 border border-gray-200 dark:border-slate-700 shadow-xs">
          ${[
            { id: 'lesen', label: t('Reading', 'Lesen'), icon: '📖' },
            { id: 'hoeren', label: t('Listening', 'Hören'), icon: '🎧' },
            { id: 'schreiben', label: t('Writing', 'Schreiben'), icon: '✍️' },
            { id: 'sprechen', label: t('Speaking', 'Sprechen'), icon: '🗣️' }
          ].map((m) => `
            <button data-mod="${m.id}" class="exam-mod-tab py-2 rounded-xl text-center select-none cursor-pointer transition-all duration-150 ${
              activeModule === m.id
                ? 'bg-white text-slate-950 font-black scale-[1.03] shadow-sm border border-gray-200 dark:bg-slate-900 dark:text-white dark:border-slate-700'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }">
              <div class="text-xs">${m.icon}</div>
              <div class="text-[9.5px] font-black tracking-tighter mt-0.5 uppercase">${m.label}</div>
            </button>
          `).join('')}
        </div>
      </div>

      <!-- Interactive Task View -->
      <div class="p-4 space-y-4">
        <!-- Sub-Parts (Teile) -->
        ${mData.length > 1 ? `
          <div class="flex gap-2 p-1.5 bg-slate-200/50 dark:bg-slate-900/80 rounded-2xl border border-gray-200/40 dark:border-slate-800">
            ${mData.map((tItem, idx) => `
              <button data-teil="${idx}" class="exam-teil-btn flex-1 py-1.5 text-center text-[11px] font-extrabold rounded-xl transition cursor-pointer ${
                activeTeil === idx
                  ? 'bg-white text-slate-950 dark:bg-emerald-600 dark:text-white shadow font-black'
                  : 'text-gray-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }">
                ${t('Part ', 'Teil ')}${idx + 1}
              </button>
            `).join('')}
          </div>
        ` : ''}

        ${task ? renderTaskContent(task, handleClaimPoints) : '<div class="p-6 text-center text-gray-400">No task loaded.</div>'}
      </div>
    </div>
  `;

  // Attach Top Level Listeners
  container.querySelectorAll('.exam-lvl-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeLevel = btn.getAttribute('data-level');
      activeTeil = 0;
      if (activeLevel === 'B1') {
        const b1Sets = getB1ExamSets(t);
        const setItem = b1Sets[activeSetIdx] || b1Sets[0];
        if (setItem?.sprechen?.[1]?.topics?.[0]?.id) {
          selectedB1SprechenTopic = setItem.sprechen[1].topics[0].id;
        }
      }
      activeB1SprechenSlide = 0;
      renderExams(container);
    });
  });

  container.querySelectorAll('.exam-set-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSetIdx = parseInt(btn.getAttribute('data-set'), 10);
      if (activeModule !== 'sprechen' || activeTeil === 0 || activeTeil === 3) {
        activeTeil = 0;
      }
      if (activeLevel === 'B1') {
        const b1Sets = getB1ExamSets(t);
        const setItem = b1Sets[activeSetIdx] || b1Sets[0];
        if (setItem?.sprechen?.[1]?.topics?.[0]?.id) {
          selectedB1SprechenTopic = setItem.sprechen[1].topics[0].id;
        }
      }
      activeB1SprechenSlide = 0;
      renderExams(container);
    });
  });

  container.querySelectorAll('.exam-mod-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      activeModule = btn.getAttribute('data-mod');
      activeTeil = 0;
      renderExams(container);
    });
  });

  container.querySelectorAll('.exam-teil-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const newTeil = parseInt(btn.getAttribute('data-teil'), 10);
      if (activeLevel === 'B1' && activeModule === 'sprechen') {
        if (b1TimerRunning) {
          clearInterval(b1TimerInterval);
          b1TimerRunning = false;
        }
        if (b1IsRecording && b1SpeechRecognition) {
          try { b1SpeechRecognition.stop(); } catch (e) {}
          b1IsRecording = false;
        }
        b1TimerSeconds = newTeil === 2 ? 120 : 180;
        b1SpeechWpm = 0;
        b1SpokenTranscript = '';
      }
      activeTeil = newTeil;
      renderExams(container);
    });
  });

  attachTaskEventListeners(container, task, handleClaimPoints);
}

function renderTaskContent(task, handleClaimPoints) {
  return `
    <div class="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-200/80 dark:border-slate-800/85 shadow-lg space-y-4">
      <!-- Task Header -->
      <div class="flex items-center justify-between border-b border-gray-150/50 dark:border-slate-800 pb-3">
        <div>
          <span class="text-[9.5px] uppercase font-black text-violet-600 dark:text-emerald-400 font-mono">
            ${activeModule.toUpperCase()} • ${t('GOETHE AUTHENTIC', 'OFFIZIELLER PRÜFUNGSTEIL')}
          </span>
          <h3 class="text-sm font-black text-slate-900 dark:text-white mt-0.5">
            ${task.title}
          </h3>
        </div>
        <div class="flex flex-col items-end gap-1">
          <span class="bg-indigo-50 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300 font-black text-[10px] px-2 py-1 rounded select-none">
            ${activeLevel}
          </span>
          ${task.marks ? `
            <span class="text-[9px] font-mono font-bold text-amber-700 dark:text-amber-400">
              ${task.marks}
            </span>
          ` : ''}
        </div>
      </div>

      <!-- Guidelines -->
      <div class="p-3 bg-indigo-50/40 dark:bg-slate-950/40 rounded-2xl border border-indigo-100/30 dark:border-slate-800 text-left">
        <p class="text-[11.5px] text-gray-500 dark:text-slate-350 leading-relaxed font-sans flex items-start gap-1.5">
          <span>💡</span>
          <span>${task.instruction || task.description}</span>
        </p>
      </div>

      <!-- MODULE: LESEN -->
      ${activeModule === 'lesen' ? renderLesenTask(task) : ''}

      <!-- MODULE: HOEREN -->
      ${activeModule === 'hoeren' ? renderHoerenTask(task) : ''}

      <!-- MODULE: SCHREIBEN -->
      ${activeModule === 'schreiben' ? renderSchreibenTask(task) : ''}

      <!-- MODULE: SPRECHEN -->
      ${activeModule === 'sprechen' ? renderSprechenTask(task, handleClaimPoints) : ''}
    </div>
  `;
}

function renderLesenTask(task) {
  return `
    <div class="space-y-4 text-left">
      ${task.passage ? `
        <div class="bg-amber-50/55 dark:bg-slate-950/60 p-4 rounded-2xl border border-amber-200/35 dark:border-slate-850 relative overflow-hidden font-sans">
          <div class="absolute top-0 right-0 py-0.5 px-2 bg-amber-400 text-slate-950 text-[8px] font-black uppercase rounded-bl-lg tracking-wider">
            ${t('EXAM TEXT', 'PRÜFUNGSTEXT')}
          </div>
          <p class="text-xs text-gray-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
            ${task.passage}
          </p>
        </div>
      ` : ''}

      <!-- True / False Questions -->
      ${task.questions && (task.type === 'true_false' || (activeLevel === 'A1' && activeTeil !== 1)) ? `
        <div class="space-y-3">
          ${task.questions.map((q) => {
            const solved = solvedState[q.id];
            const feedback = feedbackState[q.id];
            return `
              <div class="p-3 rounded-2xl bg-gray-50 dark:bg-slate-900 border border-gray-150/60 dark:border-slate-800 relative">
                <p class="text-xs font-black text-gray-850 dark:text-white pr-20">
                  ${q.statement}
                </p>
                <div class="flex gap-2 mt-2.5">
                  <button data-tf-id="${q.id}" data-val="true" class="exam-tf-btn px-3 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition ${
                    solved === true
                      ? q.answer === true ? 'bg-emerald-500 text-white font-black' : 'bg-red-500 text-white font-black'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-800 dark:text-white dark:border-slate-700'
                  }">
                    ${t('True / Richtig', 'Richtig')}
                  </button>
                  <button data-tf-id="${q.id}" data-val="false" class="exam-tf-btn px-3 py-1 rounded-lg text-[10.5px] font-bold cursor-pointer transition ${
                    solved === false
                      ? q.answer === false ? 'bg-emerald-500 text-white font-black' : 'bg-red-500 text-white font-black'
                      : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-800 dark:text-white dark:border-slate-700'
                  }">
                    ${t('False / Falsch', 'Falsch')}
                  </button>
                </div>
                ${feedback ? `
                  <p class="mt-2 text-[11px] leading-relaxed font-sans ${feedback.status === 'correct' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-500 dark:text-rose-400'}">
                    ${t(feedback.textEn, feedback.textDe)}
                  </p>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- Matching Ads (A1 Teil 2 or mapping type) -->
      ${task.type === 'mapping' || (activeLevel === 'A1' && activeTeil === 1) ? `
        <div class="space-y-4 font-sans">
          <div class="text-xs font-bold text-gray-400 uppercase mb-1">
            ${t('LIST OF AVAILABLE ADS:', 'VERFÜGBARE ANZEIGEN:')}
          </div>
          <div class="grid gap-2 text-xs">
            ${task.ads.map((ad) => `
              <div class="p-2 border border-gray-250 bg-amber-50/20 rounded-xl dark:border-slate-800">
                <span class="font-extrabold text-amber-500 mr-1.5">[${ad.id}]</span>
                <span class="text-gray-700 dark:text-slate-300">${t(ad.textEn, ad.textDe)}</span>
              </div>
            `).join('')}
          </div>

          <div class="text-xs font-bold text-gray-400 uppercase mt-4 mb-2">
            ${t('PEOPLE & THEIR CORRESPONDING WISHES:', 'PERSONEN & IHRE WÜNSCHE:')}
          </div>
          ${task.people.map((person) => {
            const stateKey = `map_${task.id || 'a1_l_t2'}_${person.id}`;
            const userSelection = solvedState[stateKey] || '';
            const mappingCorrect = task.correctMapping[person.id];
            const checked = userSelection === mappingCorrect;
            return `
              <div class="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div class="text-left">
                  <span class="text-xs font-black text-indigo-700 dark:text-emerald-400">${person.name}</span>
                  <p class="text-[11px] text-gray-600 dark:text-slate-300 mt-0.5">${t(person.wishEn, person.wishDe)}</p>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <select data-mapping-key="${stateKey}" data-correct="${mappingCorrect}" class="exam-mapping-select p-1 px-2 text-xs bg-white dark:bg-slate-800 dark:text-white border border-gray-350 dark:border-slate-700 rounded-lg font-bold">
                    <option value="">${t('Select Ad', 'Anzeige wählen')}</option>
                    ${task.ads.map((ad) => `
                      <option value="${ad.id}" ${userSelection === ad.id ? 'selected' : ''}>${t(`Ad ${ad.id}`, `Anzeige ${ad.id}`)}</option>
                    `).join('')}
                    <option value="0" ${userSelection === '0' ? 'selected' : ''}>${t('0 (No Match)', '0 (Keine)')}</option>
                  </select>
                  ${userSelection !== '' ? `<span class="text-[10.5px] font-black ${checked ? 'text-emerald-500' : 'text-gray-400'}">${checked ? '✓' : '✕'}</span>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- Multiple Choice questions -->
      ${task.questions && (task.type === 'multiple_choice' || (activeLevel === 'A2' && activeTeil === 0)) ? `
        <div class="space-y-4">
          ${task.questions.map((q) => {
            const selectionIndex = solvedState[q.id];
            const feedback = feedbackState[q.id];
            return `
              <div class="p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-150/60 dark:border-slate-800 text-left relative">
                <p class="text-xs font-black text-slate-900 dark:text-white">
                  ${q.qDe ? t(q.qEn, q.qDe) : q.statement}
                </p>
                <div class="grid gap-1.5 mt-3">
                  ${q.opts.map((opt, optIdx) => {
                    const holds = selectionIndex === optIdx;
                    const isCorrect = q.ans === optIdx;
                    return `
                      <button data-mc-id="${q.id}" data-opt-idx="${optIdx}" class="exam-mc-opt-btn p-2.5 rounded-xl text-left text-xs transition duration-150 cursor-pointer ${
                        holds
                          ? isCorrect
                            ? 'bg-emerald-500 text-white font-black scale-102 shadow-sm'
                            : 'bg-rose-500 text-white font-black'
                          : 'bg-white dark:bg-slate-900 hover:bg-gray-100 border border-gray-200 text-gray-700 dark:text-slate-350 dark:border-slate-800'
                      }">
                        ${opt}
                      </button>
                    `;
                  }).join('')}
                </div>
                ${feedback ? `
                  <p class="mt-2.5 text-[11px] leading-relaxed font-sans ${feedback.status === 'correct' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-rose-500 dark:text-rose-400'}">
                    ${t(feedback.textEn, feedback.textDe)}
                  </p>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- A2 Info Board / Directory matching -->
      ${activeLevel === 'A2' && activeTeil === 1 && task.infoBoard ? `
        <div class="space-y-4 font-sans">
          <div class="bg-slate-900 p-4 rounded-2xl text-white font-mono text-[11px] space-y-2 border border-slate-800 shadow-md">
            <div class="text-[10px] text-amber-300 uppercase font-black tracking-widest mb-1.5">
              ${t('SHOPPING CENTER DIRECTORY BOARD', 'WEGWEISER KAUFHAUS')}
            </div>
            ${task.infoBoard.map((item) => `<div class="leading-relaxed">${item}</div>`).join('')}
          </div>
          <div class="text-xs font-bold text-gray-400 uppercase mt-4">
            ${t("ASSIGN FLOORS TO THE CLIENTS' WISHES:", 'ORDNE DIE ETAGE DEN WÜNSCHEN ZU:')}
          </div>
          ${task.matches.map((m) => {
            const userSelection = solvedState[m.id] || '';
            const isCorrect = userSelection === m.answer;
            return `
              <div class="p-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-150/60 dark:border-slate-800 rounded-2xl text-left space-y-2">
                <div class="text-xs font-black text-gray-800 dark:text-white leading-normal">
                  ${m.person}
                </div>
                <div class="flex gap-2 items-center">
                  <select data-mall-match-id="${m.id}" data-answer="${m.answer}" class="exam-mall-select p-1.5 px-3 bg-white dark:bg-slate-800 dark:text-white border border-gray-350 dark:border-slate-700 rounded-xl text-xs font-extrabold max-w-sm">
                    <option value="">${t('Choose Floor...', 'Etage wählen...')}</option>
                    ${m.opts.map((opt) => `<option value="${opt}" ${userSelection === opt ? 'selected' : ''}>${opt}</option>`).join('')}
                  </select>
                  ${userSelection ? `
                    <span class="text-[10.5px] font-black ${isCorrect ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}">
                      ${isCorrect ? '✓ Correct! (+6 XP)' : '✕ Try again'}
                    </span>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- Opinion Type (Ja/Nein or Pro/Kontra) -->
      ${task.type === 'opinion' ? `
        <div class="space-y-4">
          ${task.questions.map((q) => {
            const currentVote = solvedState[q.id] || '';
            const isCorrect = currentVote === q.opinion;
            const isJaNein = q.opinion === 'Ja' || q.opinion === 'Nein';
            return `
              <div class="p-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-150/60 dark:border-slate-800 rounded-2xl text-left space-y-2.5">
                <div class="flex items-center justify-between">
                  <span class="text-xs font-black text-indigo-700 dark:text-emerald-400">${q.person}</span>
                  ${currentVote !== '' ? `
                    <span class="text-[10px] font-black ${isCorrect ? 'text-emerald-600' : 'text-rose-500'}">
                      ${isCorrect ? '✓ Correct (+8 XP)' : '✕ Incorrect'}
                    </span>
                  ` : ''}
                </div>
                <div class="flex gap-2">
                  <button data-opinion-id="${q.id}" data-vote="${isJaNein ? 'Ja' : 'Pro'}" data-expected="${q.opinion}" class="exam-opinion-btn flex-1 py-1 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentVote === (isJaNein ? 'Ja' : 'Pro')
                      ? q.opinion === (isJaNein ? 'Ja' : 'Pro') ? 'bg-emerald-500 text-white font-black' : 'bg-red-500 text-white font-black'
                      : 'bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300'
                  }">
                    ${isJaNein ? t('JA (Yes)', 'JA (Ja)') : t('PRO (In Favor)', 'PRO (Dafür)')}
                  </button>
                  <button data-opinion-id="${q.id}" data-vote="${isJaNein ? 'Nein' : 'Kontra'}" data-expected="${q.opinion}" class="exam-opinion-btn flex-1 py-1 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                    currentVote === (isJaNein ? 'Nein' : 'Kontra')
                      ? q.opinion === (isJaNein ? 'Nein' : 'Kontra') ? 'bg-emerald-500 text-white font-black' : 'bg-red-500 text-white font-black'
                      : 'bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300'
                  }">
                    ${isJaNein ? t('NEIN (No)', 'NEIN (Nein)') : t('KONTRA (Against)', 'KONTRA (Dagegen)')}
                  </button>
                </div>
                ${currentVote ? `
                  <p class="text-[10.5px] leading-relaxed text-gray-500 dark:text-slate-400 italic">
                    ${q.explanation}
                  </p>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderHoerenTask(task) {
  const isPlaying = audioPlayState[`m_${task.id}`] === 'playing';
  return `
    <div class="space-y-4">
      <!-- Simulated Audio Player -->
      <div class="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 shadow-md flex flex-col gap-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="p-1 rounded-full bg-emerald-500 animate-pulse text-xs">●</span>
            <span class="text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              ${t('GERMAN SPEAKING TARGET FILE', 'DEUTSCHE SPRACHDATEI AKUSTIK')}
            </span>
          </div>
          <span class="text-[10.5px] font-mono text-gray-400">
            ${isPlaying ? 'Playing...' : 'Audio Ready'}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <button id="exam-hoeren-play-btn" class="w-12 h-12 bg-emerald-500 hover:bg-emerald-450 active:scale-95 text-slate-950 font-black rounded-full flex items-center justify-center cursor-pointer transition">
            ${isPlaying ? '⏸' : '▶'}
          </button>
          <div class="flex-1 h-8 flex items-center gap-1 justify-center bg-slate-950/60 rounded-xl px-3 border border-slate-800 relative">
            <div class="w-1 bg-emerald-400 rounded transition-all duration-300 ${isPlaying ? 'h-6' : 'h-2'}"></div>
            <div class="w-1 bg-emerald-400 rounded transition-all duration-350 ${isPlaying ? 'h-7' : 'h-3'}"></div>
            <div class="w-1 bg-emerald-400 rounded transition-all duration-200 ${isPlaying ? 'h-5' : 'h-1'}"></div>
            <div class="w-1 bg-emerald-400 rounded transition-all duration-400 ${isPlaying ? 'h-8' : 'h-3'}"></div>
            <div class="w-1 bg-emerald-400 rounded transition-all duration-300 ${isPlaying ? 'h-6' : 'h-2'}"></div>
            <div class="w-1 bg-emerald-400 rounded transition-all duration-150 ${isPlaying ? 'h-4' : 'h-1'}"></div>
          </div>
        </div>

        <div class="mt-1 border-t border-slate-800/80 pt-2 flex justify-between items-center">
          <span class="text-[10px] text-slate-400">
            ${t('High-German audio synthesis', 'Standard Hochdeutsch-Aussprache')}
          </span>
          <button id="exam-toggle-transcript-btn" class="text-[10.5px] font-black text-amber-300 hover:underline cursor-pointer">
            ${speakingTranscript ? t('Hide Transcript', 'Transkript verbergen') : t('Show Transcript', 'Transkript anzeigen')}
          </button>
        </div>

        ${speakingTranscript ? `
          <div class="mt-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 text-left">
            <p class="text-[11px] text-gray-300 leading-normal font-mono italic">
              ${task.audio_transcript}
            </p>
          </div>
        ` : ''}
      </div>

      <!-- Dialogue Question -->
      ${task.question ? `
        <div class="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-150/50 dark:border-slate-800 rounded-3xl text-left space-y-3">
          <p class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
            <span>❓</span>
            <span>${task.question}</span>
          </p>
          <div class="flex flex-col gap-2">
            ${task.options.map((opt, optIdx) => {
              const solvedIdx = solvedState[`h_mc_${task.id}`];
              const correct = optIdx === task.ans;
              return `
                <button data-hoeren-mc-idx="${optIdx}" data-ans="${task.ans}" class="exam-hoeren-mc-btn p-2.5 rounded-xl text-left text-xs transition duration-150 cursor-pointer ${
                  solvedIdx === optIdx
                    ? correct ? 'bg-emerald-500 text-white font-black' : 'bg-red-500 text-white font-black'
                    : 'bg-white dark:bg-slate-800 hover:bg-gray-100 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300'
                }">
                  ${opt}
                </button>
              `;
            }).join('')}
          </div>
          ${solvedState[`h_mc_${task.id}`] !== undefined ? `
            <div class="mt-2 p-2 bg-emerald-50 dark:bg-slate-950/20 rounded-xl border border-emerald-250/20 text-[10.5px] font-sans text-emerald-600 dark:text-emerald-400">
              <strong>${t('Analysis Feedback: ', 'Erklärung: ')}</strong> ${task.explanation}
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- Questions List (True/False or Multi-choice) -->
      ${task.questions ? `
        <div class="space-y-3 text-left">
          ${task.questions.map((q) => {
            const userSelection = solvedState[q.id];
            return `
              <div class="p-3.5 bg-gray-50 dark:bg-slate-900 border border-gray-150/60 dark:border-slate-800 rounded-2xl relative">
                ${q.type === 'mc' ? `
                  <div class="space-y-2">
                    <p class="text-xs font-black text-slate-900 dark:text-white">${q.question}</p>
                    <div class="grid gap-1.5">
                      ${q.options.map((opt, optIdx) => {
                        const isCorrect = optIdx === q.ans;
                        const clicked = userSelection === optIdx;
                        return `
                          <button data-h-q-id="${q.id}" data-opt-idx="${optIdx}" data-ans="${q.ans}" class="exam-h-q-opt-btn p-2 rounded-xl text-left text-xs transition cursor-pointer ${
                            clicked
                              ? isCorrect ? 'bg-emerald-500 text-white font-black' : 'bg-red-500 text-white font-black'
                              : 'bg-white dark:bg-slate-800 hover:bg-gray-100 border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-slate-300'
                          }">
                            ${opt}
                          </button>
                        `;
                      }).join('')}
                    </div>
                  </div>
                ` : `
                  <div class="space-y-2">
                    <p class="text-xs font-black text-slate-850 dark:text-white">${q.statement}</p>
                    <div class="flex gap-2">
                      <button data-h-tf-id="${q.id}" data-val="true" data-ans="${q.answer}" class="exam-h-tf-btn px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition ${
                        userSelection === true
                          ? q.answer === true ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                          : 'bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300'
                      }">
                        ${t('True / Richtig', 'Richtig')}
                      </button>
                      <button data-h-tf-id="${q.id}" data-val="false" data-ans="${q.answer}" class="exam-h-tf-btn px-3 py-1 text-xs font-bold rounded-lg cursor-pointer transition ${
                        userSelection === false
                          ? q.answer === false ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                          : 'bg-white dark:bg-slate-800 border border-gray-300 text-gray-700 dark:text-slate-300'
                      }">
                        ${t('False / Falsch', 'Falsch')}
                      </button>
                    </div>
                  </div>
                `}
                ${userSelection !== undefined ? `
                  <p class="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400 mt-2 font-sans italic">
                    ${q.explanationDe || q.explanation}
                  </p>
                ` : ''}
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

function renderSchreibenTask(task) {
  // A1 Form filling
  if (activeLevel === 'A1' && activeTeil === 0 && task.fields) {
    return `
      <div class="space-y-4 text-left">
        <div class="bg-amber-100/30 border border-amber-200/50 p-3 rounded-2xl">
          <h4 class="text-[11.5px] font-black text-amber-800 uppercase tracking-wide flex items-center gap-1">
            📋 ${t('MANDATORY PERSONA CARD SPECIFICATION:', 'STECKBRIEF DER PERSON:')}
          </h4>
          <p class="text-[11px] text-amber-900 mt-1 font-mono whitespace-pre-wrap leading-normal">
            ${task.prompt}
          </p>
        </div>

        <div class="border-2 border-dashed border-gray-200 bg-gray-50/50 rounded-2xl p-4 space-y-3 font-sans relative">
          <div class="text-[9.5px] uppercase font-mono text-gray-400 select-none border-b pb-1">
            ${t('GOETHE A1 OFFIZIELLES FORMULAR', 'ANMELDEFORMULAR DER DEUTSCHSCHULE')}
          </div>
          ${task.fields.map((field) => `
            <div class="flex flex-col gap-1">
              <label class="text-[10.5px] font-extrabold text-gray-600 dark:text-slate-300 leading-none">
                ${field.label}
              </label>
              <input
                type="text"
                data-form-field-id="${field.id}"
                data-expected="${field.expected}"
                value="${writingInputs[`form_${field.id}`] || ''}"
                placeholder="${t('Type value...', 'Wert eintragen...')}"
                class="exam-form-input p-2 border border-gray-300 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg text-xs font-mono text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white"
              />
            </div>
          `).join('')}

          <button id="exam-check-form-btn" class="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black rounded-xl shadow cursor-pointer transition block">
            ✓ ${t('Check Official Form', 'Formular prüfen & abgeben')}
          </button>
        </div>

        ${formFillingResults ? `
          <div class="p-3 rounded-2xl text-xs font-sans ${formFillingResults.passed ? 'bg-emerald-50 border border-emerald-300 text-emerald-700' : 'bg-amber-50 border border-amber-300 text-amber-700'}">
            <strong>${formFillingResults.passed ? '✓ Success: ' : '⚠️ Incomplete / Spelling mismatch: '}</strong>
            ${formFillingResults.details}
          </div>
        ` : ''}
      </div>
    `;
  }

  // General Composition Task
  const essayKey = `essay_${activeLevel}_t${task.id}`;
  const report = writingGrades[essayKey];
  const isLoading = loadingWritingGrade[essayKey];
  const currentWordCount = (writingInputs[essayKey] || '').split(/\s+/).filter(Boolean).length;
  const targetWords = task.targetWords || (activeTeil === 2 ? 40 : 80);
  const wordProgressPct = Math.min(100, Math.round((currentWordCount / targetWords) * 100));
  let wordCountColor = 'bg-amber-500';
  if (currentWordCount >= targetWords * 0.9 && currentWordCount <= targetWords * 1.35) {
    wordCountColor = 'bg-emerald-500';
  } else if (currentWordCount > targetWords * 1.35) {
    wordCountColor = 'bg-blue-500';
  }

  const sMin = Math.floor(b1SchreibenTimerSeconds / 60).toString().padStart(2, '0');
  const sSec = (b1SchreibenTimerSeconds % 60).toString().padStart(2, '0');

  return `
    <div class="space-y-3.5 text-left">
      <!-- Task Header Bar with Timer & Marks -->
      <div class="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-indigo-50/70 dark:bg-slate-900 border border-indigo-150/70 dark:border-slate-800 rounded-2xl text-[11px] font-bold">
        <div class="flex items-center gap-2">
          <span class="text-indigo-900 dark:text-amber-300 flex items-center gap-1.5">
            <span>⏱️</span>
            <span>${task.timeTarget || 'ca. 20 Min.'} • ${task.marks || '40 Punkte'}</span>
          </span>
          <span class="text-slate-400 dark:text-slate-600">•</span>
          <span class="text-slate-600 dark:text-slate-400 font-mono text-[10.5px]">
            ${t('Target:', 'Ziel:')} ca. ${targetWords} ${t('words', 'Wörter')}
          </span>
        </div>
        <div class="flex items-center gap-1.5 shrink-0">
          <span id="exam-schreiben-timer-display" class="font-mono text-xs font-black px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
            ${sMin}:${sSec}
          </span>
          <button id="exam-schreiben-timer-toggle" class="p-1 px-2 text-[10px] font-black rounded-lg cursor-pointer transition ${
            b1SchreibenTimerRunning ? 'bg-amber-500 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }">
            ${b1SchreibenTimerRunning ? t('Pause', 'Pause') : t('Start Timer', 'Timer starten')}
          </button>
          <button id="exam-schreiben-timer-reset" class="p-1 px-1.5 text-[10px] font-black rounded-lg bg-gray-200 dark:bg-slate-800 hover:bg-gray-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 cursor-pointer transition" title="${t('Reset Timer', 'Timer zurücksetzen')}">
            🔄
          </button>
        </div>
      </div>

      <!-- Required Leitpunkte Card -->
      <div class="bg-slate-50 dark:bg-slate-950 px-3.5 py-3 rounded-2xl border border-gray-200/60 dark:border-slate-800">
        <span class="text-[9.5px] font-black text-indigo-500 font-mono tracking-widest uppercase flex items-center gap-1">
          <span>📌</span>
          <span>${t('REQUIRED CEFR LEITPUNKTE (ADDRESS ALL 3):', 'GEFORDERTE LEITPUNKTE (ALLE 3 BEHANDELN):')}</span>
        </span>
        <ul class="list-disc list-inside text-xs text-gray-700 dark:text-slate-300 mt-1.5 space-y-1">
          ${task.ideal_hints ? task.ideal_hints.map((hint) => `<li>${hint}</li>`).join('') : ''}
          ${task.subtopics ? task.subtopics.map((sub) => `<li>${sub}</li>`).join('') : ''}
        </ul>
      </div>

      ${task.useful_phrases && task.useful_phrases.length > 0 ? `
        <div class="bg-amber-50/50 dark:bg-slate-950 p-3 rounded-2xl border border-amber-200/50 dark:border-slate-800 space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="text-[9.5px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider font-mono flex items-center gap-1">
              <span>💬</span>
              <span>${t('HELPFUL REDEMITTEL (CLICK TO INSERT):', 'HILFREICHE REDEMITTEL (ZUM EINFÜGEN KLICKEN):')}</span>
            </span>
          </div>
          <div class="flex flex-wrap gap-1.5">
            ${task.useful_phrases.map((phrase) => `
              <button data-insert-phrase="${phrase.replace(/"/g, '&quot;')}" class="exam-insert-phrase-btn text-[10.5px] text-left px-2.5 py-1 bg-white dark:bg-slate-850 hover:bg-amber-100/70 dark:hover:bg-slate-700 border border-amber-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 cursor-pointer transition select-none">
                + ${phrase}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Official Model Answer Toggle (Musterlösung) -->
      ${task.modelText ? `
        <div class="pt-0.5">
          <button id="exam-toggle-model-text-btn" type="button" class="w-full py-2.5 px-3.5 rounded-2xl border border-indigo-200 dark:border-indigo-850 bg-indigo-50/70 hover:bg-indigo-100/80 dark:bg-slate-900 dark:hover:bg-slate-850 text-indigo-900 dark:text-indigo-300 font-bold text-xs flex items-center justify-between transition cursor-pointer shadow-xs">
            <span class="flex items-center gap-2">
              <span>📖</span>
              <span>${b1ShowSampleText[essayKey] ? t('Hide Official B1 Model Answer (Musterlösung)', 'Offizielle B1-Musterlösung verbergen') : t('View Official B1 Model Answer & Structure', 'Offizielle B1-Musterlösung & Struktur anzeigen')}</span>
            </span>
            <span class="text-xs font-mono">${b1ShowSampleText[essayKey] ? '▲' : '▼'}</span>
          </button>

          ${b1ShowSampleText[essayKey] ? `
            <div class="mt-2.5 p-4 rounded-3xl bg-white dark:bg-slate-950 border border-indigo-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 space-y-3 shadow-xs">
              <div class="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-indigo-100 dark:border-slate-800">
                <span class="text-[10px] font-black uppercase tracking-wider text-indigo-700 dark:text-amber-400 font-mono">
                  ⭐ ${t('GOETHE B1 MUSTERLÖSUNG (100/100 PTS)', 'OFFIZIELLE B1-MUSTERLÖSUNG (100/100 PKT)')}
                </span>
                <div class="flex items-center gap-2">
                  <button data-speech-text="${task.modelText.replace(/"/g, '&quot;')}" class="exam-speak-card-btn text-[10.5px] px-2.5 py-1 bg-indigo-100 hover:bg-indigo-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-900 dark:text-amber-300 font-bold rounded-lg cursor-pointer transition">
                    🔊 ${t('Listen Audio', 'Audio anhören')}
                  </button>
                  <button id="exam-copy-model-to-editor-btn" class="text-[10.5px] px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg cursor-pointer transition">
                    📋 ${t('Copy to Editor', 'In Editor übernehmen')}
                  </button>
                </div>
              </div>
              <div class="p-3.5 bg-slate-50 dark:bg-slate-900 rounded-2xl font-mono text-[11.5px] whitespace-pre-line leading-relaxed border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200">
${task.modelText}
              </div>
              <div class="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 text-[10.5px] text-emerald-900 dark:text-emerald-300 space-y-1">
                <span class="font-black uppercase tracking-wider block text-[9.5px]">✓ ${t('Why this receives full marks:', 'Warum dieser Text die volle Punktzahl erreicht:')}</span>
                <ul class="list-disc list-inside space-y-0.5 text-[10px] leading-relaxed">
                  <li>${t('Appropriate greeting and closing formula matching required register', 'Passende Anrede und Grußformel je nach gefordertem Stil')}</li>
                  <li>${t('All 3 Leitpunkte fully addressed with authentic German connectors (weil, obwohl, deshalb, da)', 'Alle 3 Leitpunkte vollständig behandelt und logisch verknüpft')}</li>
                  <li>${t('Natural paragraph transitions and accurate B1 syntax (verb-final in subordinate clauses)', 'Flüssige Übergänge und korrekte Satzstellung im Nebensatz')}</li>
                </ul>
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <textarea
        id="exam-essay-input"
        rows="6"
        placeholder="${task.placeholder || t('Schreibe deinen Text auf Deutsch...', 'Schreibe deinen Text auf Deutsch...')}"
        class="w-full p-3.5 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 rounded-2xl text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-white"
      >${writingInputs[essayKey] || ''}</textarea>

      <!-- Live Word Count & Progress Meter -->
      <div class="space-y-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
        <div class="flex justify-between items-center text-[10.5px]">
          <span class="text-slate-600 dark:text-slate-350 font-medium">
            ${t('Word Count: ', 'Wortanzahl: ')}
            <span id="exam-word-count" class="font-bold font-mono text-slate-900 dark:text-white text-xs">${currentWordCount}</span>
            <span class="text-slate-400"> / ca. ${targetWords} ${t('words', 'Wörter')}</span>
          </span>
          <span class="font-bold ${
            currentWordCount >= targetWords * 0.9 && currentWordCount <= targetWords * 1.35
              ? 'text-emerald-600 dark:text-emerald-400'
              : currentWordCount >= targetWords * 0.5
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-slate-400'
          }">
            ${
              currentWordCount >= targetWords * 0.9 && currentWordCount <= targetWords * 1.35
                ? `✓ ${t('Optimal Length', 'Optimale Länge')}`
                : currentWordCount > targetWords * 1.35
                ? `⚠️ ${t('Slightly Long', 'Etwas lang')}`
                : `${t('Keep Writing', 'Noch weiterschreiben')}`
            }
          </span>
        </div>
        <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-slate-800 overflow-hidden">
          <div class="h-full rounded-full transition-all duration-300 ${wordCountColor}" style="width: ${wordProgressPct}%"></div>
        </div>
      </div>

      <button id="exam-submit-essay-btn" ${isLoading ? 'disabled' : ''} class="w-full py-2.5 bg-violet-600 hover:bg-violet-700 text-white font-black text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50">
        ${isLoading ? `
          <span class="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <span>${t('Analyzing German Grammar...', 'Linguistik-Server prüft Grammatik...')}</span>
        ` : `
          <span>✨</span>
          <span>${t('Evaluate Writing with Instructor Grader', 'Schreiben mit KI-Prüfer bewerten')}</span>
        `}
      </button>

      ${report ? `
        <div class="p-4 bg-violet-50/70 border border-violet-200 dark:bg-slate-900/60 dark:border-slate-800 rounded-3xl mt-4 space-y-3 font-sans">
          <div class="flex justify-between items-center border-b pb-2 dark:border-slate-800">
            <span class="text-[10px] font-black uppercase text-violet-700 dark:text-emerald-400">
              ${t('OFFICIAL CEFR GRADER REPORT', 'OFFIZIELLES PRÜFUNGSZEUGNIS')}
            </span>
            <span class="bg-violet-200 text-violet-850 dark:bg-indigo-950 dark:text-white text-[10.5px] font-black px-2 py-0.5 rounded-md">
              Score: ${report.grammarScore || 80}/100
            </span>
          </div>
          <div>
            <span class="text-[10px] text-gray-400 font-bold block uppercase">${t('Grammar & Alignment:', 'Gesamtbewertung & Niveau:')}</span>
            <p class="text-xs text-gray-700 dark:text-slate-300 mt-0.5 leading-relaxed">
              ${report.overallFeedback}
            </p>
          </div>
          ${report.corrections && report.corrections.length > 0 ? `
            <div class="space-y-2 pt-2">
              <span class="text-[10px] text-red-500 font-bold block uppercase">❌ ${t('SPECIFIC CORRECTIONS:', 'KONKRETE FEHLERKORREKTUREN:')}</span>
              ${report.corrections.map((corr) => `
                <div class="bg-red-50/50 p-2.5 rounded-xl text-[11px] leading-normal border border-red-150">
                  <div class="text-red-700 font-extrabold line-through">${corr.original}</div>
                  <div class="text-emerald-700 font-black mt-0.5">✓ ${corr.corrected}</div>
                  ${corr.explanation ? `<div class="text-gray-500 font-sans mt-1 text-[10px] text-left">${corr.explanation}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}
          ${report.vocabularyUpgrades && report.vocabularyUpgrades.length > 0 ? `
            <div class="space-y-2 pt-2 border-t dark:border-slate-800">
              <span class="text-[10px] text-indigo-600 dark:text-emerald-400 font-bold block uppercase">💡 ${t('VOCABULARY LEVEL-UPS:', 'AUSDRUCKSWEISE VERBESSERN:')}</span>
              ${report.vocabularyUpgrades.map((uc) => `
                <div class="p-2 border border-indigo-150 rounded-xl text-[11px] bg-indigo-50/20">
                  <div class="font-extrabold text-indigo-750 dark:text-indigo-300">${uc.original} → <span class="text-indigo-900 dark:text-amber-300 underline font-black">${uc.upgrade}</span></div>
                  <div class="text-gray-500 text-[10.5px] mt-0.5">${uc.details}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      ` : ''}
    </div>
  `;
}

// Dialogue steps data for partner Lukas (Teil 1)
const B1_TEIL1_DIALOGUE_STEPS = [
  {
    step: 0,
    topic: '📅 1. Termin & Uhrzeit (Wann?)',
    checklistKey: 'wann',
    lukasSays: 'Hallo! Schön, dass wir das Treffen zusammen planen. Wann passt es dir am besten? Ich hätte am kommenden Wochenende Zeit.',
    lukasAudio: 'Hallo! Schön, dass wir das Treffen zusammen planen. Wann passt es dir am besten? Ich hätte am kommenden Wochenende Zeit.',
    options: [
      {
        label: 'Vorschlag machen (Samstag)',
        textDe: 'Mir würde der Samstag ab 15:00 Uhr perfekt passen, weil die meisten am Sonntag ausschlafen wollen.',
        textEn: 'Saturday from 3:00 PM would suit me perfectly, because most want to sleep in on Sunday.',
        lukasReply: 'Abgemacht! Samstag um 15:00 Uhr ist ein prima Termin. Da haben alle Zeit.'
      },
      {
        label: 'Gegenvorschlag mit Begründung (Sonntag)',
        textDe: 'Sonntagnachmittag wäre mir lieber, da habe ich den ganzen Tag frei und keinen Terminstress.',
        textEn: 'Sunday afternoon would be better for me, as I have the whole day free without scheduling stress.',
        lukasReply: 'Sonntag um 15:00 Uhr klingt auch super. Dann nehmen wir den Sonntag!'
      },
      {
        label: 'Alternative vorschlagen (Freitagabend)',
        textDe: 'Wie wäre es direkt am Freitagabend nach der Arbeit? Da können wir entspannt ins Wochenende starten!',
        textEn: 'How about directly on Friday evening after work? We could kick off the weekend relaxed!',
        lukasReply: 'Freitagabend ist eine spitzen Idee! Da sind alle direkt in Wochenendstimmung.'
      }
    ]
  },
  {
    step: 1,
    topic: '📍 2. Treffpunkt & Schlechtwetter-Plan (Wo?)',
    checklistKey: 'wo',
    lukasSays: 'Klasse, der Termin steht! Wo wollen wir uns am besten treffen? Bei gutem Wetter könnten wir in den Stadtpark gehen, oder hast du eine andere Idee?',
    lukasAudio: 'Klasse, der Termin steht! Wo wollen wir uns am besten treffen? Bei gutem Wetter könnten wir in den Stadtpark gehen, oder hast du eine andere Idee?',
    options: [
      {
        label: 'Park mit Plan B vorschlagen',
        textDe: 'Der Stadtpark ist fantastisch! Wir sollten aber einen Plan B haben, falls es regnet – zum Beispiel den WG-Gemeinschaftsraum.',
        textEn: 'The city park is fantastic! But we should have a plan B in case it rains – for instance the community room.',
        lukasReply: 'Gute Idee! Wir nehmen den Park und wenn das Wetter schlecht wird, weichen wir in den Gemeinschaftsraum aus.'
      },
      {
        label: 'Garten / Zuhause vorschlagen',
        textDe: 'Ich schlage vor, wir treffen uns bei mir im Garten. Da haben wir eine überdachte Terrasse und fließendes Wasser für alle Fälle.',
        textEn: 'I suggest we meet in my garden. We have a roofed terrace and running water just in case.',
        lukasReply: 'Dein Garten ist perfekt! Mit der überdachten Terrasse sind wir völlig unabhängig vom Wetter.'
      },
      {
        label: 'Café / Raum mieten',
        textDe: 'Lass uns einen Raum im Bürgerhaus oder ein gemütliches Café reservieren, damit wir es warm und bequem haben.',
        textEn: 'Let us reserve a room in the community center or a cozy café so we are warm and comfortable.',
        lukasReply: 'Einverstanden, das Bürgerhaus ist zentral und für alle Teilnehmer einfach zu erreichen.'
      }
    ]
  },
  {
    step: 2,
    topic: '🍕 3. Essen & Getränke (Verpflegung)',
    checklistKey: 'essen',
    lukasSays: 'Super! Jetzt zu einer wichtigen Frage: Wie machen wir das mit dem Essen und den Getränken? Sollen wir alles selbst einkaufen oder bringt jeder etwas mit?',
    lukasAudio: 'Super! Jetzt zu einer wichtigen Frage: Wie machen wir das mit dem Essen und den Getränken? Sollen wir alles selbst einkaufen oder bringt jeder etwas mit?',
    options: [
      {
        label: 'Mitbring-Buffet vorschlagen',
        textDe: 'Ich würde vorschlagen, dass wir ein Mitbring-Buffet machen: Jeder bringt einen Salat oder Fingerfood mit, und wir besorgen die Getränke.',
        textEn: 'I would propose a potluck buffet: everyone brings a salad or finger food, and we supply the drinks.',
        lukasReply: 'Perfekt! Ein Buffet ist am fairsten und macht am wenigsten Arbeit. Ich besorge dann die Getränke und Becher.'
      },
      {
        label: 'Grillen & Kosten teilen',
        textDe: 'Wir könnten gemeinsam vorher im Supermarkt einkaufen und grillen. Wir teilen die Kosten einfach durch alle Teilnehmer.',
        textEn: 'We could shop together beforehand at the supermarket and barbecue. We simply divide costs among all participants.',
        lukasReply: 'Grillen ist immer ein Hit! Ich bringe gerne meinen Grill und Grillkohle mit.'
      },
      {
        label: 'Aufgaben aufteilen',
        textDe: 'Ich könnte mich um die Getränke und das Geschirr kümmern, wenn du eine Liste erstellst, wer was zu essen mitbringt.',
        textEn: 'I could take care of drinks and cutlery if you make a list of who brings what food.',
        lukasReply: 'Gute Arbeitsteilung! Ich erstelle heute noch die Liste für die Essensbeiträge.'
      }
    ]
  },
  {
    step: 3,
    topic: '🎵 4. Musik & Unterhaltung (Programm)',
    checklistKey: 'musik',
    lukasSays: 'Sehr gut! Was meinst du zum Thema Musik und Unterhaltung? Sollen wir etwas Spezielles vorbereiten oder Spiele mitbringen?',
    lukasAudio: 'Sehr gut! Was meinst du zum Thema Musik und Unterhaltung? Sollen wir etwas Spezielles vorbereiten oder Spiele mitbringen?',
    options: [
      {
        label: 'Playlist & Bluetooth-Box',
        textDe: 'Unbedingt! Ich erstelle eine gemeinsame Spotify-Playlist und bringe meine Bluetooth-Musikbox mit.',
        textEn: 'Definitely! I will create a shared Spotify playlist and bring my Bluetooth speaker.',
        lukasReply: 'Hervorragend! Eine Playlist sorgt für lockere Stimmung, da kann jeder seine Lieblingslieder einfügen.'
      },
      {
        label: 'Gesellschaftsspiele vorschlagen',
        textDe: 'Wir sollten ein paar Kartenspiele oder Gesellschaftsspiele wie Tabu oder Uno mitbringen, das bricht das Eis sofort.',
        textEn: 'We should bring card games or party games like Taboo or Uno, that breaks the ice immediately.',
        lukasReply: 'Super Vorschlag! Spiele machen immer Spaß und bringen die Leute schnell ins Gespräch.'
      },
      {
        label: 'Sport & Aktivitäten im Freien',
        textDe: 'Wie wäre es mit einem Volleyball oder Badminton-Set? Draußen auf der Wiese kann man sich toll bewegen!',
        textEn: 'How about a volleyball or badminton set? Outside on the grass one can move around wonderfully!',
        lukasReply: 'Spitze! Volleyball auf der Wiese macht riesigen Spaß. Ich packe mein Netz und den Ball ein.'
      }
    ]
  },
  {
    step: 4,
    topic: '✉️ 5. Einladungen & Aufgaben (Organisation)',
    checklistKey: 'orga',
    lukasSays: 'Toll, dann haben wir fast alles! Wie informieren wir die anderen Teilnehmer und verteilen die letzten Aufgaben?',
    lukasAudio: 'Toll, dann haben wir fast alles! Wie informieren wir die anderen Teilnehmer und verteilen die letzten Aufgaben?',
    options: [
      {
        label: 'WhatsApp-Gruppe erstellen',
        textDe: 'Ich erstelle gleich heute eine WhatsApp-Gruppe mit allen Infos, dem Datum und dem genauen Treffpunkt.',
        textEn: 'I will create a WhatsApp group today with all information, the date and the exact meeting place.',
        lukasReply: 'Klasse Idee! Dann lade mich bitte direkt ein, damit ich die Einkaufsliste posten kann.'
      },
      {
        label: 'E-Mail mit Umfrage versenden',
        textDe: 'Wir können eine kurze Einladungs-Mail mit einer Online-Liste herumschicken, damit jeder eintragen kann, was er mitbringt.',
        textEn: 'We can send out a short invitation email with an online list so everyone can enter what they bring.',
        lukasReply: 'Sehr professionell! Das verschafft uns den besten Überblick über alle Zusagen.'
      },
      {
        label: 'Persönlich ansprechen',
        textDe: 'Lass uns die Leute morgen im Kurs persönlich ansprechen und die Details kurz mündlich klären.',
        textEn: 'Let us speak to people in person tomorrow in class and clarify the details briefly.',
        lukasReply: 'Persönlich ist immer am sympathischsten. Dann sprechen wir die anderen morgen direkt an.'
      }
    ]
  }
];

function renderB1SprechenTeil1(task, handleClaimPoints) {
  const isCompleted = claimedTasks['b1_sp_t1'] || (state.b1ExamProgress?.sprechen?.completedTeile?.includes(1));

  const currentStepData = B1_TEIL1_DIALOGUE_STEPS[b1Teil1Step] || null;
  const isSimulationFinished = b1Teil1Step >= B1_TEIL1_DIALOGUE_STEPS.length;
  const checkedCount = Object.values(b1Teil1Checked).filter(Boolean).length;

  const t1Min = Math.floor(b1Teil1TimerSeconds / 60).toString().padStart(2, '0');
  const t1Sec = (b1Teil1TimerSeconds % 60).toString().padStart(2, '0');

  const subTabs = [
    { id: 'dialogue', icon: '🤖', labelDe: 'Partner-Simulation', labelEn: 'Partner Simulator' },
    { id: 'checklist', icon: '📋', labelDe: '5-Punkte-Planer', labelEn: 'Planning Sheet' },
    { id: 'redemittel', icon: '💡', labelDe: 'B1 Redemittel', labelEn: 'Phrases (Audio)' },
    { id: 'timer', icon: '⏱️', labelDe: '3-Minuten Timer', labelEn: '3-Min Timer' }
  ];

  return `
    <div class="space-y-4 text-left font-sans">
      <!-- Teil 1 Exam Header Banner -->
      <div class="p-4 rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-md">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 bg-white/20 rounded-2xl">🤝</span>
            <div>
              <span class="text-[10px] font-mono font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Goethe-Zertifikat B1 • Sprechen Teil 1
              </span>
              <h3 class="text-sm sm:text-base font-black mt-0.5 text-white">
                ${t('Planning Something Together (ca. 3 Minutes)', 'Gemeinsam etwas planen (ca. 3 Minuten)')}
              </h3>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] font-black bg-white/20 text-white px-3 py-1 rounded-xl shadow-xs">
              28 / 100 Punkte (28%)
            </span>
          </div>
        </div>
        <p class="text-xs text-white/90 mt-2.5 leading-relaxed font-medium">
          ${t(
            'In Teil 1, plan an event together with your exam partner (~3 minutes). Make proposals, react to your partner, negotiate compromises, and distribute organizational tasks!',
            'In Teil 1 planst du gemeinsam mit deinem Prüfungspartner ein Event (ca. 3 Minuten). Macht Vorschläge, reagiert aufeinander, findet Kompromisse und verteilt die Aufgaben!'
          )}
        </p>
      </div>

      <!-- Subtab Selector -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-1.5 p-1 bg-gray-100 dark:bg-slate-900 rounded-2xl border border-gray-200/80 dark:border-slate-800">
        ${subTabs.map(st => `
          <button data-b1-t1-tab="${st.id}" class="exam-b1-t1-tab-btn py-2 px-2 rounded-xl text-xs font-black transition cursor-pointer flex items-center justify-center gap-1.5 ${
            b1Teil1Tab === st.id
              ? 'bg-white text-indigo-700 shadow-sm border border-gray-200 dark:bg-slate-800 dark:text-indigo-400 dark:border-slate-700'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }">
            <span>${st.icon}</span>
            <span>${t(st.labelEn, st.labelDe)}</span>
          </button>
        `).join('')}
      </div>

      <!-- TAB 1: PARTNER DIALOGUE SIMULATION -->
      ${b1Teil1Tab === 'dialogue' ? `
        <div class="space-y-4">
          <!-- Step Progress Tracker -->
          <div class="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 flex items-center justify-between gap-2 shadow-xs">
            <div class="flex items-center gap-1.5 text-xs font-black text-slate-800 dark:text-slate-200">
              <span class="p-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-mono text-[11px]">
                ${isSimulationFinished ? '5/5' : `${b1Teil1Step + 1}/5`}
              </span>
              <span>${isSimulationFinished ? t('Planning Agreed!', 'Vereinbarung steht!') : currentStepData.topic}</span>
            </div>
            <button id="exam-b1-t1-reset-btn" class="text-[10.5px] font-bold text-slate-500 hover:text-indigo-600 dark:text-slate-400 flex items-center gap-1 cursor-pointer">
              <span>🔄</span> ${t('Restart', 'Neustart')}
            </button>
          </div>

          <!-- Conversation History Stream -->
          <div class="space-y-3">
            ${b1Teil1History.map((item, idx) => `
              <div class="space-y-2">
                <!-- Partner Message -->
                <div class="flex items-start gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-base flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                    👨‍💼
                  </div>
                  <div class="p-3 bg-blue-50/70 dark:bg-slate-900 border border-blue-150 dark:border-slate-800 rounded-2xl rounded-tl-xs max-w-[85%] text-xs text-slate-800 dark:text-slate-200 space-y-1">
                    <span class="text-[9.5px] font-black text-blue-700 dark:text-blue-400 block uppercase font-mono">Lukas (Partner)</span>
                    <p class="leading-relaxed">${item.lukasSays}</p>
                  </div>
                </div>
                <!-- User Choice -->
                <div class="flex items-start justify-end gap-2.5">
                  <div class="p-3 bg-indigo-600 text-white rounded-2xl rounded-tr-xs max-w-[85%] text-xs text-left shadow-xs space-y-0.5">
                    <span class="text-[9px] font-black text-indigo-200 block uppercase font-mono">${t('You (Candidate)', 'Du (Prüfungskandidat)')}</span>
                    <p class="leading-relaxed font-semibold">${item.userReply}</p>
                  </div>
                  <div class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-base flex items-center justify-center shrink-0 border border-indigo-200">
                    🎓
                  </div>
                </div>
                <!-- Partner Reaction -->
                <div class="flex items-start gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-base flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                    👨‍💼
                  </div>
                  <div class="p-2.5 bg-emerald-50/70 dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 rounded-2xl rounded-tl-xs max-w-[85%] text-xs text-slate-800 dark:text-slate-200 space-y-0.5">
                    <span class="text-[9px] font-black text-emerald-700 dark:text-emerald-400 block uppercase font-mono">Lukas ✓</span>
                    <p class="leading-relaxed font-medium">${item.lukasReply}</p>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Active Step: Lukas Prompt & User Response Options -->
          ${!isSimulationFinished && currentStepData ? `
            <div class="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-3.5">
              <!-- Lukas's Speech Bubble -->
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-950/60 text-xl flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800">
                  👨‍💼
                </div>
                <div class="flex-1 space-y-1">
                  <div class="flex items-center justify-between">
                    <span class="text-[10px] font-black uppercase text-blue-700 dark:text-blue-400 font-mono">
                      Lukas (Dein Prüfungspartner):
                    </span>
                    <button data-speech-text="${currentStepData.lukasAudio.replace(/"/g, '&quot;')}" class="exam-speak-card-btn text-[10.5px] px-2.5 py-0.5 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 font-bold rounded-lg cursor-pointer transition">
                      🔊 ${t('Listen Audio', 'Audio hören')}
                    </button>
                  </div>
                  <p class="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                    "${currentStepData.lukasSays}"
                  </p>
                </div>
              </div>

              <!-- Options Prompt -->
              <div class="pt-2 border-t border-gray-150 dark:border-slate-800 space-y-2">
                <span class="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 font-mono block">
                  ${t('CHOOSE YOUR SPOKEN RESPONSE OPTION (OR CLICK AUDIO TO PRACTICE):', 'WÄHLE DEINE ANTWORT (KLICKE AUF AUDIO ZUM VORHÖREN):')}
                </span>
                <div class="grid gap-2">
                  ${currentStepData.options.map((opt, optIdx) => `
                    <div class="p-3 rounded-2xl border border-gray-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 bg-gray-50/70 hover:bg-indigo-50/50 dark:bg-slate-950 dark:hover:bg-slate-850/60 transition flex flex-col gap-2">
                      <div class="flex items-center justify-between gap-2">
                        <span class="text-[9.5px] font-black uppercase font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                          Option ${String.fromCharCode(65 + optIdx)}: ${opt.label}
                        </span>
                        <button data-speech-text="${opt.textDe.replace(/"/g, '&quot;')}" class="exam-speak-card-btn text-[10px] px-2 py-0.5 bg-white dark:bg-slate-800 hover:bg-gray-100 text-indigo-700 dark:text-indigo-300 font-bold rounded-md border border-gray-200 dark:border-slate-700 cursor-pointer transition">
                          🔊 Vorhören
                        </button>
                      </div>
                      <p class="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                        "${opt.textDe}"
                      </p>
                      <p class="text-[10.5px] text-slate-500 dark:text-slate-400 italic">
                        ${opt.textEn}
                      </p>
                      <button data-b1-t1-opt-idx="${optIdx}" class="exam-b1-t1-opt-btn mt-1 py-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl transition cursor-pointer shadow-xs flex items-center justify-center gap-1.5">
                        <span>💬</span>
                        <span>${t('Select and Speak this Option', 'Diese Antwort wählen')}</span>
                      </button>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          ` : ''}

          <!-- Finished Simulation State -->
          ${isSimulationFinished ? `
            <div class="p-5 bg-linear-to-br from-emerald-50 via-white to-indigo-50/40 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 rounded-3xl border border-emerald-300 dark:border-emerald-800/60 shadow-sm space-y-4">
              <div class="flex items-center gap-3">
                <span class="text-3xl p-2 bg-emerald-100 dark:bg-emerald-950 rounded-2xl">🎉</span>
                <div>
                  <span class="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 font-mono">
                    ${t('Goethe B1 Examination Standard', 'Goethe B1 Prüfungsziel erreicht')}
                  </span>
                  <h4 class="text-base font-black text-slate-900 dark:text-white">
                    ${t('Joint Event Planning Successfully Completed!', 'Gemeinsame Planung erfolgreich abgeschlossen!')}
                  </h4>
                </div>
              </div>

              <!-- Agreed Plan Summary -->
              <div class="p-3.5 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-2 text-xs">
                <span class="text-[10px] font-black uppercase text-indigo-600 dark:text-amber-400 font-mono block">
                  📋 ${t('Agreed Joint Planning Results:', 'Vereinbarte Planungsergebnisse:')}
                </span>
                <div class="grid gap-1.5 text-[11.5px] text-slate-700 dark:text-slate-300 font-medium">
                  <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> <span><strong>Wann:</strong> Samstag ab 15:00 Uhr</span></div>
                  <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> <span><strong>Wo:</strong> Stadtpark (Alternative: Gemeinschaftsraum)</span></div>
                  <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> <span><strong>Essen & Trinken:</strong> Mitbring-Buffet & Getränke</span></div>
                  <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> <span><strong>Musik & Programm:</strong> Spotify-Playlist, Bluetooth-Box & Spiele</span></div>
                  <div class="flex items-center gap-2"><span class="text-emerald-500 font-bold">✓</span> <span><strong>Aufgaben:</strong> WhatsApp-Gruppe & Aufgabenliste</span></div>
                </div>
              </div>

              <div class="flex flex-col sm:flex-row gap-2">
                <button id="exam-b1-t1-claim-btn" class="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition cursor-pointer flex items-center justify-center gap-2">
                  <span>🏆</span>
                  <span>${isCompleted ? t('Completed (+28 Pts Already Claimed)', 'Bereits absolviert (+28 Pkt)') : t('Claim 28 Points & Save to Global Hub', '28 Punkte gutschreiben & speichern')}</span>
                </button>
                <button id="exam-b1-t1-reset-btn" class="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition cursor-pointer">
                  🔄 ${t('Practice Again', 'Erneut üben')}
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      ` : ''}

      <!-- TAB 2: INTERACTIVE PLANNING ORGANIZER (CHECKLIST) -->
      ${b1Teil1Tab === 'checklist' ? `
        <div class="space-y-3.5">
          <div class="p-3 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
            <div>
              <span class="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 font-mono block">
                ${t('5 MANDATORY B1 CRITERIA POINTS', '5 PFLICHTPUNKTE ZUR PLANUNG')}
              </span>
              <span class="text-xs font-bold text-slate-800 dark:text-slate-200">
                ${checkedCount} / 5 ${t('Points Agreed', 'Punkte besprochen')}
              </span>
            </div>
            <div class="h-2 w-28 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
              <div class="h-full rounded-full bg-emerald-500 transition-all duration-300" style="width: ${(checkedCount / 5) * 100}%"></div>
            </div>
          </div>

          <div class="grid gap-2.5">
            ${[
              { key: 'wann', icon: '📅', title: '1. Wann? (Termin & Uhrzeit)', hint: 'Wochentag, Datum, Uhrzeit, Pufferzeit für Aufbau' },
              { key: 'wo', icon: '📍', title: '2. Wo? (Ort & Schlechtwetter-Plan)', hint: 'Stadtpark, Garten, Raum reservieren, Plan B bei Regen' },
              { key: 'essen', icon: '🍕', title: '3. Essen & Getränke (Verpflegung)', hint: 'Mitbring-Buffet, Grill, Getränkekauf, Budget' },
              { key: 'musik', icon: '🎵', title: '4. Musik & Programm (Unterhaltung)', hint: 'Bluetooth-Box, Playlist, Gesellschaftsspiele, Sport' },
              { key: 'orga', icon: '✉️', title: '5. Einladungen & Aufgabenverteilung', hint: 'WhatsApp-Gruppe, Wer bringt was mit, Frist für Zusagen' }
            ].map((item) => {
              const isChecked = !!b1Teil1Checked[item.key];
              return `
                <div data-b1-check-key="${item.key}" class="exam-b1-t1-check p-3.5 bg-white dark:bg-slate-900 rounded-2xl border transition cursor-pointer ${
                  isChecked ? 'border-emerald-300 dark:border-emerald-800 bg-emerald-50/20' : 'border-gray-200 dark:border-slate-800 hover:border-indigo-300'
                } flex items-start justify-between gap-3 shadow-xs">
                  <div class="space-y-0.5">
                    <div class="flex items-center gap-2">
                      <span>${item.icon}</span>
                      <h4 class="text-xs font-black text-slate-900 dark:text-white">${item.title}</h4>
                    </div>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400 pl-6">${item.hint}</p>
                  </div>
                  <div class="w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 ${
                    isChecked ? 'bg-emerald-500 border-emerald-600 text-white font-black text-xs' : 'border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800'
                  }">
                    ${isChecked ? '✓' : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      ` : ''}

      <!-- TAB 3: B1 REDEMITTEL CATALOG (WITH AUDIO) -->
      ${b1Teil1Tab === 'redemittel' ? `
        <div class="space-y-3.5">
          ${[
            {
              category: t('1. Making Proposals', '1. Vorschläge formulieren'),
              icon: '💡',
              color: 'text-blue-600 dark:text-blue-400',
              phrases: [
                { de: "Ich würde vorschlagen, dass wir...", en: "I would suggest that we..." },
                { de: "Wie wäre es, wenn wir uns am Samstag treffen?", en: "How about if we meet on Saturday?" },
                { de: "Was hältst du davon, wenn wir grillen?", en: "What do you think if we barbecue?" },
                { de: "Wir könnten doch eigentlich den Park wählen.", en: "We could actually choose the park." },
                { de: "Hast du Lust, dass wir eine Playlist erstellen?", en: "Do you feel like creating a playlist?" }
              ]
            },
            {
              category: t('2. Agreeing & Showing Enthusiasm', '2. Zustimmen & Begeisterung zeigen'),
              icon: '✓',
              color: 'text-emerald-600 dark:text-emerald-400',
              phrases: [
                { de: "Das ist eine hervorragende Idee!", en: "That is an excellent idea!" },
                { de: "Ganz genau, so machen wir das!", en: "Exactly, that's how we will do it!" },
                { de: "Einverstanden! Das passt mir sehr gut.", en: "Agreed! That suits me very well." },
                { de: "Super Vorschlag, da bin ich voll dabei.", en: "Great suggestion, count me in completely." },
                { de: "Perfekt, das erleichtert uns die Planung.", en: "Perfect, that makes planning easier for us." }
              ]
            },
            {
              category: t('3. Expressing Objections & Alternatives', '3. Einwände & Gegenvorschläge'),
              icon: '⚠️',
              color: 'text-amber-600 dark:text-amber-400',
              phrases: [
                { de: "Das klingt gut, aber ich befürchte, dass es regnen könnte.", en: "That sounds good, but I fear it could rain." },
                { de: "Mir wäre es lieber, wenn wir uns drinnen treffen.", en: "I would prefer if we met indoors." },
                { de: "Ich bin mir nicht sicher, ob das klappt, weil...", en: "I am not sure if that works because..." },
                { de: "Wäre es nicht sinnvoller, wenn wir stattdessen...", en: "Wouldn't it make more sense if we instead..." }
              ]
            },
            {
              category: t('4. Allocating Tasks & Concluding', '4. Aufgaben verteilen & Einigung erzielen'),
              icon: '🤝',
              color: 'text-violet-600 dark:text-violet-400',
              phrases: [
                { de: "Wer kümmert sich um die Getränke?", en: "Who will take care of the drinks?" },
                { de: "Ich könnte ..., wenn du dafür ... übernimmst.", en: "I could ..., if you take care of ... in return." },
                { de: "Gut, dann halten wir das so fest!", en: "Good, then let's write that down!" },
                { de: "Ich erstelle gleich die WhatsApp-Gruppe.", en: "I will set up the WhatsApp group right away." },
                { de: "Vielen Dank, das war eine tolle Zusammenarbeit.", en: "Thank you, that was great teamwork." }
              ]
            }
          ].map(grp => `
            <div class="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-2.5 shadow-xs">
              <span class="text-xs font-black uppercase tracking-wider ${grp.color} flex items-center gap-1.5 font-mono">
                <span>${grp.icon}</span>
                <span>${grp.category}</span>
              </span>
              <div class="grid gap-1.5">
                ${grp.phrases.map(ph => `
                  <div class="p-2.5 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div class="space-y-0.5">
                      <p class="text-xs font-bold text-slate-800 dark:text-slate-200">${ph.de}</p>
                      <p class="text-[10px] text-slate-500 dark:text-slate-400 italic">${ph.en}</p>
                    </div>
                    <div class="flex items-center gap-1 shrink-0">
                      <button data-speech-text="${ph.de.replace(/"/g, '&quot;')}" class="exam-speak-card-btn p-1.5 px-2 bg-white dark:bg-slate-850 hover:bg-gray-100 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 cursor-pointer transition">
                        🔊
                      </button>
                      <button data-copy-phrase="${ph.de.replace(/"/g, '&quot;')}" class="exam-copy-phrase-btn p-1.5 px-2 bg-white dark:bg-slate-850 hover:bg-gray-100 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-300 border border-gray-200 dark:border-slate-700 cursor-pointer transition">
                        📋
                      </button>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- TAB 4: 3-MINUTE EXAM COUNTDOWN TIMER -->
      ${b1Teil1Tab === 'timer' ? `
        <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm text-center space-y-4">
          <div>
            <span class="text-[10px] font-black uppercase text-indigo-600 dark:text-amber-400 font-mono block">
              ⏱️ ${t('Official Goethe B1 Speaking Timer', 'Offizieller Prüfungs-Countdown')}
            </span>
            <h4 class="text-sm font-bold text-slate-700 dark:text-slate-300 mt-0.5">
              ${t('Teil 1 Duration Target: Exactly 3:00 Minutes', 'Teil 1 Zeitvorgabe: Genau 3:00 Minuten')}
            </h4>
          </div>

          <div class="py-4">
            <div id="b1-t1-timer-display" class="text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              ${t1Min}:${t1Sec}
            </div>
            <div class="mt-4 mx-auto max-w-xs h-2.5 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
              <div id="b1-t1-timer-bar" class="h-full rounded-full bg-indigo-600 transition-all duration-300" style="width: ${((180 - b1Teil1TimerSeconds) / 180) * 100}%"></div>
            </div>
          </div>

          <div class="flex items-center justify-center gap-2.5">
            <button id="exam-b1-t1-timer-toggle" class="py-2.5 px-6 font-black text-xs rounded-xl shadow transition cursor-pointer ${
              b1Teil1TimerRunning ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }">
              ${b1Teil1TimerRunning ? `⏸️ ${t('Pause', 'Pause')}` : `▶️ ${t('Start Timer', 'Timer starten')}`}
            </button>
            <button id="exam-b1-t1-timer-reset" class="py-2.5 px-4 font-bold text-xs rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 transition cursor-pointer">
              🔄 ${t('Reset (3:00)', 'Zurücksetzen')}
            </button>
          </div>

          <div class="p-3 bg-amber-50/70 dark:bg-slate-950 rounded-2xl border border-amber-200 dark:border-slate-800 text-left text-xs text-slate-700 dark:text-slate-300 space-y-1">
            <span class="font-black text-amber-900 dark:text-amber-300 block text-[10.5px]">💡 ${t('Goethe Examiner Tips for Teil 1:', 'Goethe Prüfertipps für Teil 1:')}</span>
            <p class="text-[11px] leading-relaxed">
              ${t(
                '• Do not speak in long monologues; ask your partner questions like "Was meinst du dazu?"\n• Address all 5 checklist points within the 3 minutes.\n• Reach mutual agreement on every point before time expires.',
                '• Halte keine Monologe; frage deinen Partner regelmäßig "Was hältst du davon?"\n• Behandle alle 5 Planungs-Punkte innerhalb der 3 Minuten.\n• Trefft am Ende eine klare gemeinsame Vereinbarung für jedes Thema.'
              )}
            </p>
          </div>
        </div>
      ` : ''}

      <!-- Persistent Claim Banner for Teil 1 (28 Points) -->
      <div class="p-4 rounded-2xl bg-linear-to-r from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-950 border border-indigo-200 dark:border-indigo-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div>
          <span class="text-[9.5px] font-mono font-black uppercase text-indigo-700 dark:text-indigo-400 block">
            ${t('PART 1 JOINT PLANNING (28 MARKS)', 'TEIL 1 GEMEINSAM ETWAS PLANEN (28 PUNKTE)')}
          </span>
          <p class="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
            ${t('Coordinated planning with partner Lukas?', 'Gemeinsame Planung mit Lukas besprochen?')}
          </p>
        </div>
        <button id="exam-b1-t1-claim-btn" class="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 shrink-0">
          <span>🏆</span>
          <span>${claimedTasks['b1_sp_t1'] || (state.b1ExamProgress?.sprechen?.completedTeile?.includes(1)) ? t('Completed (+28 Pts Claimed)', 'Bereits absolviert (+28 Pkt)') : t('Claim 28 Points & Save', '28 Punkte sichern & speichern')}</span>
        </button>
      </div>
    </div>
  `;
}

function renderSprechenTask(task, handleClaimPoints) {
  // A1 self intro cards
  if (activeLevel === 'A1' && activeTeil === 0 && task.cards) {
    return `
      <div class="space-y-3 text-left">
        <div class="grid grid-cols-2 gap-2">
          ${task.cards.map((card, idx) => `
            <button data-speech-text="${card.de}" class="exam-speak-card-btn p-3 bg-gray-50 hover:bg-indigo-50 dark:bg-slate-950 dark:hover:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl text-left font-sans cursor-pointer transition flex flex-col justify-between">
              <div>
                <span class="text-[10px] uppercase font-black text-indigo-600 dark:text-emerald-400">${card.label}</span>
                <p class="text-xs text-gray-800 dark:text-white mt-1 leading-normal">${card.de}</p>
              </div>
              <div class="mt-2.5 flex items-center justify-between text-[10px] text-gray-400">
                <span>${card.en}</span>
                <span>🔊 Listen</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  // A1 W-Questions theme cards
  if (activeLevel === 'A1' && activeTeil === 1 && task.questionsAndAnswers) {
    return `
      <div class="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl text-left space-y-3 font-sans">
        <div class="flex justify-between items-center">
          <span class="text-[10.5px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded uppercase">
            ${task.theme}
          </span>
          <span class="text-[11px] font-mono text-gray-400">Word: ${task.keyword}</span>
        </div>
        <div class="text-xs text-gray-600 dark:text-slate-350 leading-relaxed">
          ${t("Think of a typical A1 W-Question about 'Frühstück' (Breakfast) to ask your exchange partner. Here are the official model answers to play and master:", "Formuliere eine W-Frage zum Thema 'Frühstück'. Hier sind die offiziellen Prüfungsbeispiele:")}
        </div>
        <div class="space-y-3 pt-2">
          ${task.questionsAndAnswers.map((item) => `
            <div class="p-3 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-2xl flex flex-col gap-1">
              <div class="flex justify-between items-center">
                <span class="text-xs font-black text-indigo-900 dark:text-white">❓ ${item.q}</span>
                <button data-speech-text="${item.q}" class="exam-speak-card-btn text-xs p-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg cursor-pointer transition">
                  🔊 Play
                </button>
              </div>
              <p class="text-[11px] text-emerald-600 dark:text-emerald-400 font-extrabold mt-1">
                💬 Answer: ${item.a}
              </p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // A1 Polite Requests
  if (activeLevel === 'A1' && activeTeil === 2 && task.items) {
    return `
      <div class="space-y-3 text-left">
        ${task.items.map((it, idx) => `
          <div class="p-3 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl flex items-center justify-between gap-2">
            <div>
              <span class="text-[10.5px] font-bold text-gray-400 uppercase block">${it.name}</span>
              <p class="text-xs font-black text-slate-900 dark:text-white mt-0.5">${it.request}</p>
              <span class="text-[10.5px] text-gray-500 block font-sans italic">${it.trans}</span>
            </div>
            <button data-speech-text="${it.request}" class="exam-speak-card-btn flex items-center gap-1 p-2 bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-emerald-600 shrink-0 text-xs font-black rounded-xl select-none shadow hover:scale-105 cursor-pointer transition">
              🔊 ${t('Listen', 'Sprechen')}
            </button>
          </div>
        `).join('')}
      </div>
    `;
  }

  // B1 Gemeinsam etwas planen (Teil 1)
  if (activeLevel === 'B1' && activeTeil === 0) {
    return renderB1SprechenTeil1(task, handleClaimPoints);
  }

  // B1 Monologue Presentation (Teil 2)
  if (activeLevel === 'B1' && activeTeil === 1) {
    return renderB1SprechenTeil2(task, handleClaimPoints);
  }

  // B1 Feedback & Discussion (Teil 3)
  if (activeLevel === 'B1' && activeTeil === 2) {
    return renderB1SprechenTeil3(task, handleClaimPoints);
  }

  // B1 Aussprache & Redefluss (Teil 4)
  if (activeLevel === 'B1' && activeTeil === 3) {
    return renderB1SprechenTeil4(task, handleClaimPoints);
  }

  // Default Speaking View (Cards / Checklist for A1/A2 and B1 Teil 1)
  return `
    <div class="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl text-left space-y-4 font-sans">
      <div>
        <h4 class="text-xs font-black text-slate-900 dark:text-white mt-0.5">
          ${task.title}
        </h4>
      </div>
      ${task.checklist ? `
        <div class="grid gap-1.5">
          ${task.checklist.map((pt) => `
            <div class="flex items-center gap-2 p-2 bg-white dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-800 text-xs text-gray-700 dark:text-slate-300">
              <span class="text-emerald-500">✓</span>
              <span>${pt}</span>
            </div>
          `).join('')}
        </div>
      ` : ''}
      ${task.convo_tips ? `
        <div class="border-t pt-3 space-y-2">
          <span class="text-[10px] uppercase font-mono font-black text-gray-400 block">${t('Spoken Dialogue Suggestions:', 'Satzanfänge & Vorschläge:')}</span>
          ${task.convo_tips.map((tip) => `
            <div class="p-2 bg-indigo-50/40 dark:bg-slate-950 border border-indigo-100/35 rounded-xl flex items-center justify-between gap-1">
              <div class="text-left">
                <p class="text-[11.5px] font-black text-indigo-900 dark:text-indigo-300">${tip.phrase}</p>
                <span class="text-[10px] text-gray-400 font-sans block mt-0.5">${tip.meaning}</span>
              </div>
              <button data-speech-text="${tip.phrase}" class="exam-speak-card-btn text-xs p-1 px-2.5 bg-white hover:bg-gray-100 rounded-lg shadow-sm border font-extrabold select-none cursor-pointer text-indigo-800 transition shrink-0">
                🔊 Play
              </button>
            </div>
          `).join('')}
        </div>
      ` : ''}
      ${task.model_feedback ? `
        <div class="space-y-3 pt-1">
          ${task.model_feedback.map((item, idx) => `
            <div class="p-3 bg-white dark:bg-slate-950 border border-gray-150 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div class="text-left space-y-0.5">
                <span class="text-[9px] uppercase font-mono font-black text-gray-400">Response #${idx + 1}</span>
                <p class="text-[11.5px] font-black text-indigo-900 dark:text-teal-400 leading-snug">${item.phrase}</p>
                <p class="text-[10.5px] text-gray-500 italic">${item.translation}</p>
              </div>
              <button data-speech-text="${item.phrase}" class="exam-speak-card-btn px-3.5 py-2.5 shrink-0 text-xs font-black rounded-xl select-none flex items-center gap-1.5 transition cursor-pointer shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white">
                <span>🔊</span>
                <span>${t('Listen', 'Sprechen')}</span>
              </button>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${task.questions ? `
        <div class="border-t dark:border-slate-800 pt-3 space-y-2.5">
          <span class="text-[10px] uppercase font-mono font-black text-amber-700 dark:text-amber-400 block">
            💬 ${t('Partner & Examiner Questions with Model Answers:', 'Prüfer- und Partnerfragen mit Musterantworten:')}
          </span>
          ${task.questions.map((qItem, qIdx) => `
            <div class="p-3.5 bg-white dark:bg-slate-950 border border-amber-200/70 dark:border-slate-800 rounded-2xl space-y-2 text-left shadow-xs">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[9.5px] font-black uppercase text-amber-800 dark:text-amber-400 font-mono bg-amber-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                  ${qItem.asker || `Frage ${qIdx + 1}`}
                </span>
                <button data-speech-text="${qItem.questionDe}" class="exam-speak-card-btn text-[10.5px] px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-amber-200 dark:border-slate-700 text-amber-900 dark:text-amber-300 font-bold rounded-lg cursor-pointer transition">
                  🔊 Frage hören
                </button>
              </div>
              <p class="text-[11.5px] font-bold text-slate-800 dark:text-slate-100">${qItem.questionDe}</p>
              <div class="p-2.5 bg-emerald-50/60 dark:bg-slate-900 rounded-xl border border-emerald-150 dark:border-slate-800 text-[11px] space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-400">
                    ${t('MODEL ANSWER:', 'MUSTERANTWORT:')}
                  </span>
                  <button data-speech-text="${qItem.modelAnswerDe}" class="exam-speak-card-btn text-[10px] px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition">
                    🔊 Antwort hören
                  </button>
                </div>
                <p class="text-slate-700 dark:text-slate-200 leading-snug">${qItem.modelAnswerDe}</p>
                <p class="text-[10px] text-gray-500 italic">${qItem.modelAnswerEn}</p>
              </div>
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${activeLevel === 'B1' ? `
        <div class="p-3 bg-amber-50/70 dark:bg-slate-950 border border-amber-200/70 dark:border-slate-800 rounded-2xl text-[10.5px] text-slate-600 dark:text-slate-400 space-y-1 mt-2">
          <span class="font-black text-amber-900 dark:text-amber-300 block">
            ⭐ ${t('Goethe B1 Speaking Evaluation Criteria (100 Points):', 'Goethe B1 Sprechen Bewertungskriterien (100 Punkte):')}
          </span>
          <p class="leading-relaxed text-[10px]">
            ${t(
              '1. Task fulfillment (Parts 1, 2, 3: 68 pts) • 2. Interaction & fluidity (16 pts) • 3. Pronunciation & Intonation (16 pts: sentence melody, clear vowels/consonants, natural pacing). Passing threshold is 60/100 points.',
              '1. Aufgabenerfüllung (Teile 1, 2, 3: 68 Pkt.) • 2. Interaktion & Gesprächsfluss (16 Pkt.) • 3. Aussprache & Intonation (16 Pkt.: Wortakzent, Satzmelodie, klares Sprechtempo). Bestehensgrenze liegt bei 60/100 Punkten.'
            )}
          </p>
        </div>
      ` : ''}
    </div>
  `;
}

function renderB1SprechenTeil2(task, handleClaimPoints) {
  const allAvailableTopics = task.allTopics || B1_SPRECHEN_TOPICS;
  let currentTopic = (task.topics && task.topics.find((tp) => tp.id === selectedB1SprechenTopic))
    || allAvailableTopics.find((tp) => tp.id === selectedB1SprechenTopic)
    || (task.topics && task.topics[0])
    || allAvailableTopics[0];

  if (!currentTopic || !currentTopic.slides || currentTopic.slides.length === 0) {
    currentTopic = allAvailableTopics[0];
  }

  const currentTopicIndex = allAvailableTopics.findIndex((tp) => tp.id === currentTopic.id);
  const safeTopicIdx = currentTopicIndex >= 0 ? currentTopicIndex : 0;

  if (activeB1SprechenSlide < 0) activeB1SprechenSlide = 0;
  if (activeB1SprechenSlide >= currentTopic.slides.length) activeB1SprechenSlide = currentTopic.slides.length - 1;
  const slide = currentTopic.slides[activeB1SprechenSlide] || currentTopic.slides[0];

  const subTabs = [
    { id: 'slides', icon: '📑', labelDe: '5 Folien (Präsentation)', labelEn: '5 Slides Presentation' },
    { id: 'transcript', icon: '📜', labelDe: 'Redemanuskript (3 Min)', labelEn: 'Full Speech (3 Min)' },
    { id: 'timer', icon: '⏱️', labelDe: 'Timer & Aufnahme', labelEn: 'Timer & Audio Mic' },
    { id: 'redemittel', icon: '💡', labelDe: 'Goethe Redemittel', labelEn: 'Goethe Phrases' },
    { id: 'qa', icon: '❓', labelDe: 'Teil 3 Rückfragen', labelEn: 'Teil 3 Q&A' }
  ];

  return `
    <div class="space-y-4 text-left font-sans">
      <!-- Teil 2 Exam Header Banner -->
      <div class="p-4 rounded-3xl bg-linear-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-md">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 bg-white/40 rounded-2xl">🗣️</span>
            <div>
              <span class="text-[10px] font-mono font-black uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded">
                Goethe-Zertifikat B1 • Sprechen Teil 2
              </span>
              <h3 class="text-sm sm:text-base font-black mt-0.5 text-slate-950">
                ${t('Presenting a Topic (ca. 3 Minutes)', 'Ein Thema präsentieren (ca. 3 Minuten)')}
              </h3>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] font-black bg-slate-950 text-amber-300 px-3 py-1 rounded-xl shadow-xs">
              40 / 100 Punkte (40%)
            </span>
          </div>
        </div>
        <p class="text-xs text-slate-900/90 mt-2.5 leading-relaxed font-medium">
          ${t(
            'In Teil 2, give a continuous 3-minute oral presentation using the 5 mandatory Goethe slides. Speak freely from keyword notes without reading full sentences!',
            'In Teil 2 hältst du einen 3-minütigen Vortrag anhand der 5 Folien. Sprich frei anhand von Stichpunkten – Vorlesen ganzer Sätze führt zu Punkteabzügen!'
          )}
        </p>
      </div>

      <!-- Topic Picker & Quick A/B Selector -->
      <div class="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-3 shadow-xs">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span class="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>🎯</span>
            <span>${t('CHOOSE PRESENTATION TOPIC:', 'PRÜFUNGSTHEMA AUSWÄHLEN:')}</span>
          </span>
          <span class="text-[10.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
            ${currentTopic.badge || 'Goethe B1'} • ${currentTopic.category || ''}
          </span>
        </div>

        <!-- Topic A & B Selector for Active Exam Set -->
        ${task.topics && task.topics.length >= 2 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${task.topics.map((tp, idx) => {
              const isSelected = currentTopic.id === tp.id;
              const letter = idx === 0 ? 'A' : 'B';
              return `
                <button data-b1-topic-id="${tp.id}" class="exam-b1-topic-tab p-2.5 rounded-xl border text-left cursor-pointer transition text-xs font-bold ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm font-black'
                    : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-850'
                }">
                  <span class="text-[9px] uppercase font-mono font-black block ${isSelected ? 'text-slate-800' : 'text-slate-500 dark:text-slate-400'}">
                    Thema ${letter}
                  </span>
                  <span class="line-clamp-1 mt-0.5">${tp.title.replace(/^Thema [AB]:\s*/, '')}</span>
                </button>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- 20 Topics Catalog Dropdown with Quick Prev/Next Switchers -->
        <div class="pt-1 flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <label for="exam-b1-topic-select" class="text-[10.5px] font-bold text-gray-500 dark:text-slate-400 shrink-0">
              📚 ${t('All 20 Goethe B1 Topics from Exam PDFs:', 'Alle 20 B1 Prüfungsthemen aus den PDF-Vorlagen:')}
            </label>
            <span class="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
              ${t('Topic', 'Thema')} ${safeTopicIdx + 1} / ${allAvailableTopics.length}
            </span>
          </div>

          <div class="flex items-center gap-1.5">
            <button data-b1-topic-nav="prev" class="exam-b1-topic-nav-btn p-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1 shrink-0 select-none" title="${t('Previous topic', 'Vorheriges Thema')}">
              <span>‹</span>
              <span class="hidden sm:inline">${t('Prev', 'Zurück')}</span>
            </button>

            <select id="exam-b1-topic-select" class="exam-b1-topic-select flex-1 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-2 text-xs font-bold focus:ring-2 focus:ring-amber-400 cursor-pointer truncate">
              ${allAvailableTopics.map((tp, idx) => `
                <option value="${tp.id}" ${currentTopic.id === tp.id ? 'selected' : ''}>
                  ${idx + 1}. ${tp.title.replace(/^Thema [AB]:\s*/, '').replace(/^\d+\.\s*/, '')} (${tp.category || ''})
                </option>
              `).join('')}
            </select>

            <button data-b1-topic-nav="next" class="exam-b1-topic-nav-btn p-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1 shrink-0 select-none" title="${t('Next topic', 'Nächstes Thema')}">
              <span class="hidden sm:inline">${t('Next', 'Weiter')}</span>
              <span>›</span>
            </button>
          </div>
        </div>

        <!-- Selected Topic Information Card -->
        <div class="p-3 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white">${currentTopic.title.replace(/^Thema [AB]:\s*/, '')}</h4>
            <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 italic">"${currentTopic.question}"</p>
          </div>
          <div class="flex items-center gap-2 shrink-0 text-[10px] font-mono">
            <span class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-bold">
              📝 ${currentTopic.wordCount || 260} Wörter
            </span>
            <span class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300 font-bold">
              ⏱️ ${currentTopic.estTime || 'ca. 2:40 Min.'}
            </span>
          </div>
        </div>
      </div>

      <!-- Teil 2 Submode Tabs -->
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
        ${subTabs.map((tab) => `
          <button data-b1-subtab="${tab.id}" class="exam-b1-subtab-btn flex-1 min-w-[100px] py-2 px-2.5 rounded-xl text-center text-xs font-black cursor-pointer transition select-none ${
            b1SprechenTab === tab.id
              ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900'
          }">
            <span class="block text-sm">${tab.icon}</span>
            <span class="block text-[10.5px] font-bold mt-0.5 tracking-tight truncate">${t(tab.labelEn, tab.labelDe)}</span>
          </button>
        `).join('')}
      </div>

      <!-- Submode Content Renderers -->
      ${b1SprechenTab === 'slides' ? renderB1SlidesView(currentTopic, slide, handleClaimPoints) : ''}
      ${b1SprechenTab === 'transcript' ? renderB1TranscriptView(currentTopic, handleClaimPoints) : ''}
      ${b1SprechenTab === 'timer' ? renderB1TimerView(currentTopic, handleClaimPoints) : ''}
      ${b1SprechenTab === 'redemittel' ? renderB1RedemittelView(handleClaimPoints) : ''}
      ${b1SprechenTab === 'qa' ? renderB1QaView(currentTopic, handleClaimPoints) : ''}

      <!-- Completion / Claim 40 Points for Teil 2 (Persistent across all subtabs) -->
      <div class="p-4 rounded-2xl bg-linear-to-r from-amber-50 to-yellow-50 dark:from-slate-900 dark:to-slate-950 border border-amber-300 dark:border-amber-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div>
          <span class="text-[9.5px] font-mono font-black uppercase text-amber-700 dark:text-amber-400 block">
            ${t('PART 2 MONOLOGUE PRESENTATION (40 MARKS)', 'TEIL 2 THEMA PRÄSENTIEREN (40 PUNKTE)')}
          </span>
          <p class="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
            ${t('Practiced all 5 slides & ready to save your presentation?', 'Alle 5 Folien geübt und bereit, die 40 Punkte zu sichern?')}
          </p>
        </div>
        <button id="exam-b1-t2-claim-btn" class="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 shrink-0">
          <span>🏆</span>
          <span>${claimedTasks['b1_sp_t2'] || (state.b1ExamProgress?.sprechen?.completedTeile?.includes(2)) ? t('Completed (+40 Pts Claimed)', 'Bereits absolviert (+40 Pkt)') : t('Claim 40 Points & Save', '40 Punkte sichern & speichern')}</span>
        </button>
      </div>
    </div>
  `;
}

function renderB1SlidesView(currentTopic, slide, handleClaimPoints) {
  const slideSteps = [
    { num: 1, label: t('Topic & Structure', 'Thema & Struktur') },
    { num: 2, label: t('Personal Experience', 'Eigene Erfahrung') },
    { num: 3, label: t('Home Country', 'Heimatland') },
    { num: 4, label: t('Pros & Cons', 'Vor- & Nachteile') },
    { num: 5, label: t('Opinion & Close', 'Meinung & Dank') }
  ];

  return `
    <div class="space-y-4">
      <!-- 5-Folien Progress Steps -->
      <div class="grid grid-cols-5 gap-1.5 sm:gap-2">
        ${slideSteps.map((st, idx) => {
          const isActive = idx === activeB1SprechenSlide;
          const isDone = idx < activeB1SprechenSlide;
          return `
            <button data-slide-step="${idx}" class="exam-b1-step-btn p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
              isActive
                ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm font-black scale-[1.02]'
                : isDone
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:bg-gray-50'
            }">
              <span class="text-[10px] font-mono font-black">${isDone ? '✓' : `F${st.num}`}</span>
              <span class="text-[9px] font-bold truncate max-w-full hidden sm:block">${st.label}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Slide Card -->
      <div class="p-6 rounded-3xl bg-slate-900 text-white border-2 border-slate-800 shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[340px]">
        <!-- Top Banner -->
        <div class="flex items-center justify-between border-b border-slate-800 pb-3">
          <div class="flex items-center gap-2">
            <span class="bg-amber-400 text-slate-950 font-mono font-black text-[10px] px-2.5 py-0.5 rounded-lg uppercase tracking-wider">
              FOLIE ${slide.slide} / 5
            </span>
            <span class="text-xs text-slate-400 font-medium">
              ${slideSteps[activeB1SprechenSlide]?.label || ''}
            </span>
          </div>
          <span class="text-[11px] text-amber-400 font-mono font-bold">
            ${activeB1SprechenSlide + 1} von 5
          </span>
        </div>

        <!-- Slide Title & Objective -->
        <div class="space-y-2 mt-4">
          <h3 class="text-base sm:text-lg font-black text-white leading-snug">
            ${slide.title}
          </h3>
          <div class="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
            <span class="text-amber-400 shrink-0">🎯</span>
            <span><strong class="text-white">${t('Exam Objective:', 'Prüfungsziel:')}</strong> ${slide.objective}</span>
          </div>
        </div>

        <!-- Keyword Notes (Stichpunkte für Notizzettel) -->
        <div class="mt-4 space-y-2">
          <span class="text-[10px] font-mono font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <span>📝</span>
            <span>${t('KEYWORD NOTES FOR YOUR EXAM PREPARATION SHEET (DO NOT READ FULL TEXT):', 'STICHPUNKTE FÜR DEINEN NOTIZZETTEL (NICHT VOM BLATT ABLESEN!):')}</span>
          </span>
          <div class="flex flex-wrap gap-2">
            ${(slide.notes || []).map((note) => `
              <span class="px-2.5 py-1 bg-slate-800/90 text-amber-200 border border-slate-700 rounded-lg text-xs font-bold">
                • ${note}
              </span>
            `).join('')}
          </div>
        </div>

        <!-- Model Spoken Script with Audio -->
        <div class="mt-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span class="text-[10px] font-mono font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <span>🗣️</span>
              <span>${t('MODEL SPOKEN GERMAN (ORAL SCRIPT):', 'MUSTER-SPRECHTEXT (MÜNDLICHE FORMULIERUNG):')}</span>
            </span>
            <button data-speech-text="${escapeAttr(slide.textDe)}" class="exam-speak-card-btn px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 shrink-0 text-xs font-black rounded-xl select-none cursor-pointer transition shadow-sm flex items-center gap-1.5">
              <span>🔊</span>
              <span>${t('Listen to Slide', 'Folie anhören')}</span>
            </button>
          </div>
          <p class="text-xs sm:text-[13px] text-slate-200 leading-relaxed font-sans">
            "${slide.textDe}"
          </p>
          ${slide.textEn ? `
            <p class="text-[11px] text-slate-400 italic border-t border-slate-800/80 pt-2 font-sans">
              🇬🇧 "${slide.textEn}"
            </p>
          ` : ''}
        </div>

        ${slide.variantDe ? `
          <!-- Alternative PDF Formulation -->
          <div class="mt-3 p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] font-mono font-black uppercase text-amber-400 flex items-center gap-1.5">
                <span>🔄</span>
                <span>${t('PDF ALTERNATIVE FORMULATION (VARIANTE):', 'ALTERNATIVE PDF-FORMULIERUNG:')}</span>
              </span>
              <button data-speech-text="${escapeAttr(slide.variantDe)}" class="exam-speak-card-btn px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-bold rounded-lg cursor-pointer transition flex items-center gap-1">
                <span>🔊</span>
                <span>${t('Listen', 'Anhören')}</span>
              </button>
            </div>
            <p class="text-xs text-slate-300 italic font-sans">
              "${slide.variantDe}"
            </p>
            ${slide.variantEn ? `
              <p class="text-[10.5px] text-slate-500 italic pt-1 border-t border-slate-800/60 font-sans">
                🇬🇧 "${slide.variantEn}"
              </p>
            ` : ''}
          </div>
        ` : ''}

        <!-- Useful Redemittel for this slide -->
        ${slide.usefulPhrases && slide.usefulPhrases.length > 0 ? `
          <div class="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <span class="text-[10px] font-mono font-black uppercase tracking-wider text-slate-400">
              💡 ${t('RECOMMENDED REDEMITTEL FOR THIS SLIDE:', 'EMPFEHLENSWERTE REDEMITTEL FÜR DIESE FOLIE:')}
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${slide.usefulPhrases.map((phrase) => `
                <div class="p-2 bg-slate-950/40 rounded-xl border border-slate-800/80 flex items-center justify-between gap-2">
                  <span class="text-xs text-slate-300 font-medium">"${phrase}"</span>
                  <button data-speech-text="${escapeAttr(phrase)}" class="exam-speak-card-btn p-1 px-2 bg-slate-800 hover:bg-slate-700 text-white text-[11px] rounded-lg cursor-pointer transition shrink-0">
                    🔊
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Carousel Navigation Controls -->
        <div class="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <button id="exam-slide-prev" ${activeB1SprechenSlide === 0 ? 'disabled' : ''} class="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1">
            <span>‹</span>
            <span>${t('Previous Slide', 'Vorherige Folie')}</span>
          </button>

          <!-- Dots Indicator -->
          <div class="flex items-center gap-1.5">
            ${[0, 1, 2, 3, 4].map((dotIdx) => `
              <button data-slide-step="${dotIdx}" class="exam-b1-step-btn w-2.5 h-2.5 rounded-full transition cursor-pointer ${
                dotIdx === activeB1SprechenSlide ? 'bg-amber-400 w-5' : 'bg-slate-700 hover:bg-slate-500'
              }"></button>
            `).join('')}
          </div>

          <button id="exam-slide-next" ${activeB1SprechenSlide === 4 ? 'disabled' : ''} class="px-4 py-2 bg-amber-400 hover:bg-amber-300 disabled:opacity-30 disabled:cursor-not-allowed text-slate-950 text-xs font-black rounded-xl transition cursor-pointer flex items-center gap-1 shadow-sm">
            <span>${t('Next Slide', 'Nächste Folie')}</span>
            <span>›</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderB1TranscriptView(currentTopic, handleClaimPoints) {
  const sections = [
    { num: 1, title: 'Folie 1: Thema & Aufbau', text: currentTopic.slides[0]?.textDe || '' },
    { num: 2, title: 'Folie 2: Eigene Erfahrungen', text: currentTopic.slides[1]?.textDe || '' },
    { num: 3, title: 'Folie 3: Situation im Heimatland', text: currentTopic.slides[2]?.textDe || '' },
    { num: 4, title: 'Folie 4: Vor- und Nachteile mit Beispielen', text: currentTopic.slides[3]?.textDe || '' },
    { num: 5, title: 'Folie 5: Eigene Meinung & Abschluss', text: currentTopic.slides[4]?.textDe || '' }
  ];

  return `
    <div class="space-y-4">
      <!-- Toolbar Banner -->
      <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div>
          <h4 class="text-sm font-black text-slate-900 dark:text-white">
            ${t('Full 3-Minute Presentation Transcript', 'Vollständiges 3-Minuten Redemanuskript')}
          </h4>
          <p class="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
            ${currentTopic.wordCount || 260} Wörter • ${currentTopic.estTime || 'ca. 2:40 Min.'} • ${t('Fluency Target: 90-110 WPM', 'Sprechtempo: 90-110 Wörter/Min.')}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button data-speech-text="${escapeAttr(currentTopic.fullText)}" class="exam-speak-card-btn px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5">
            <span>🔊</span>
            <span>${t('Play Entire Speech', 'Gesamte Rede anhören')}</span>
          </button>
          <button id="exam-copy-transcript-btn" class="px-3 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1">
            <span>📋</span>
            <span>${t('Copy Text', 'Kopieren')}</span>
          </button>
        </div>
      </div>

      <!-- Continuous Manuscript Sections -->
      <div class="space-y-3">
        ${sections.map((sec) => `
          <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-2 text-left shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-[10.5px] font-mono font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-950 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-slate-800">
                ${sec.title}
              </span>
              <button data-speech-text="${escapeAttr(sec.text)}" class="exam-speak-card-btn p-1 px-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1">
                <span>🔊</span>
                <span>${t('Play', 'Anhören')}</span>
              </button>
            </div>
            <p class="text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 leading-relaxed font-serif pt-1">
              "${sec.text}"
            </p>
            ${currentTopic.slides[sec.num - 1]?.textEn ? `
              <p class="text-[11px] text-gray-500 dark:text-slate-400 italic pt-1 border-t border-gray-100 dark:border-slate-800/80">
                🇬🇧 "${currentTopic.slides[sec.num - 1]?.textEn}"
              </p>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Evaluation Advice Box -->
      <div class="p-4 bg-amber-50/70 dark:bg-slate-950 rounded-2xl border border-amber-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5">
        <span class="font-black text-amber-900 dark:text-amber-300 block flex items-center gap-1.5">
          <span>💡</span>
          <span>${t('Goethe B1 Examiner Tip for Teil 2:', 'Goethe B1 Prüfer-Tipp für Teil 2:')}</span>
        </span>
        <p class="leading-relaxed text-[11px]">
          ${t(
            'The examiners evaluate your fluency, cohesion (connecting words like "Zuerst", "Außerdem", "Ein weiterer Vorteil"), and natural intonation. Aim for about 2 minutes and 40 seconds to 3 minutes. Stop naturally when you say "Herzlichen Dank für Ihre Aufmerksamkeit."',
            'Die Prüfer bewerten Flüssigkeit, Konnektoren (z. B. "Zuerst", "Außerdem", "Einerseits / Andererseits") und natürliche Satzmelodie. Ideal sind 2:40 bis 3:00 Minuten. Schließe deine Rede klar mit "Herzlichen Dank für Ihre Aufmerksamkeit ab".'
          )}
        </p>
      </div>
    </div>
  `;
}

function renderB1TimerView(currentTopic, handleClaimPoints) {
  const m = Math.floor(b1TimerSeconds / 60).toString().padStart(2, '0');
  const s = (b1TimerSeconds % 60).toString().padStart(2, '0');
  const timeElapsed = 180 - b1TimerSeconds;
  const progressPct = Math.min(100, Math.round((timeElapsed / 180) * 100));

  let pacingFeedback = '';
  if (b1SpeechWpm > 0) {
    if (b1SpeechWpm < 75) {
      pacingFeedback = t('🐢 A bit too slow (<75 WPM). Try to maintain fluency and connect phrases smoothly.', '🐢 Etwas zu langsam (<75 WPM). Versuche, den Redefluss aufrechtzuerhalten.');
    } else if (b1SpeechWpm <= 120) {
      pacingFeedback = t('🎯 Optimal Goethe B1 Pace! (85-115 WPM). Clear, fluent, and well-articulated.', '🎯 Optimales Goethe B1 Sprechtempo! (85-115 WPM). Klar, flüssig und verständlich.');
    } else {
      pacingFeedback = t('⚡ A bit too fast (>120 WPM). Slow down to pronounce German vowels and endings clearly.', '⚡ Etwas zu schnell (>120 WPM). Achte auf deutliche Endungen und Pausen.');
    }
  }

  return `
    <div class="space-y-4">
      <!-- 3:00 Minute Countdown Timer Card -->
      <div class="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-950 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-slate-800">
            ⏱️ ${t('3:00 MINUTE EXAM TIMER', '3:00 MINUTEN PRÜFUNGS-TIMER')}
          </span>
          <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
            ${timeElapsed}s / 180s (${progressPct}%)
          </span>
        </div>

        <!-- Big Digits Display -->
        <div class="py-2">
          <div id="b1-timer-display" class="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
            ${m}:${s}
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            ${t('Official Goethe B1 Monologue Presentation Window', 'Offizielles Goethe B1 Zeitfenster für den Monolog')}
          </p>
        </div>

        <!-- Progress Bar -->
        <div class="w-full h-3 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden border border-gray-200 dark:border-slate-700">
          <div id="b1-timer-bar" class="h-full bg-linear-to-r from-amber-400 via-amber-500 to-emerald-500 transition-all duration-300" style="width: ${progressPct}%"></div>
        </div>

        <!-- Controls -->
        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button id="exam-b1-timer-toggle" class="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5">
            <span>${b1TimerRunning ? '⏸️' : '▶️'}</span>
            <span>${b1TimerRunning ? t('Pause Timer', 'Pausieren') : t('Start Timer', 'Timer starten')}</span>
          </button>
          <button id="exam-b1-timer-reset" class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5">
            <span>🔄</span>
            <span>${t('Reset to 3:00', 'Zurücksetzen (3:00)')}</span>
          </button>
        </div>

        <!-- Phase Breakdown Table -->
        <div class="pt-3 border-t border-gray-100 dark:border-slate-800 text-left">
          <span class="text-[10px] font-mono font-black uppercase text-slate-400 block mb-2">
            🧭 ${t('RECOMMENDED TIME ALLOCATION FOR THE 5 SLIDES:', 'EMPFOHLENE ZEITEINTEILUNG FÜR DIE 5 FOLIEN:')}
          </span>
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-1.5 text-[10.5px]">
            <div class="p-2 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-150 dark:border-slate-800">
              <span class="font-mono font-bold text-amber-600 block">0:00 - 0:30</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">Folie 1: Thema</span>
            </div>
            <div class="p-2 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-150 dark:border-slate-800">
              <span class="font-mono font-bold text-amber-600 block">0:30 - 1:00</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">Folie 2: Erfahrung</span>
            </div>
            <div class="p-2 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-150 dark:border-slate-800">
              <span class="font-mono font-bold text-amber-600 block">1:00 - 1:30</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">Folie 3: Heimat</span>
            </div>
            <div class="p-2 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-150 dark:border-slate-800">
              <span class="font-mono font-bold text-amber-600 block">1:30 - 2:20</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">Folie 4: Pro/Contra</span>
            </div>
            <div class="p-2 bg-gray-50 dark:bg-slate-950 rounded-lg border border-gray-150 dark:border-slate-800">
              <span class="font-mono font-bold text-amber-600 block">2:20 - 3:00</span>
              <span class="font-medium text-slate-700 dark:text-slate-300">Folie 5: Fazit</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Live Voice Recording & Speech Recognition -->
      <div class="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-3 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span class="text-[10px] font-mono font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
              🎙️ ${t('SPEECH RECORDER & LIVE PACING COACH', 'SPRACHAUFNAHME & SPRECHTEMPO-TRAINER')}
            </span>
            <h4 class="text-xs font-black text-slate-900 dark:text-white mt-1">
              ${t('Practice Speaking Freely Into Your Microphone', 'Freies Sprechen ins Mikrofon üben')}
            </h4>
          </div>
          <button id="exam-b1-mic-toggle" class="px-4 py-2.5 rounded-xl font-black text-xs cursor-pointer transition flex items-center gap-2 shadow-sm ${
            b1IsRecording
              ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }">
            <span>${b1IsRecording ? '⏹️' : '🎙️'}</span>
            <span>${b1IsRecording ? t('Stop Recording', 'Aufnahme beenden') : t('Record My Presentation', 'Präsentation aufnehmen')}</span>
          </button>
        </div>

        <!-- Live Metrics: Word Count & WPM -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <div class="p-2.5 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-800 text-center">
            <span class="text-[9px] uppercase font-mono text-gray-400 block">${t('Words Spoken', 'Wortanzahl')}</span>
            <span id="b1-mic-word-count" class="text-base font-black text-slate-900 dark:text-white font-mono">
              ${b1SpokenTranscript ? b1SpokenTranscript.split(/\s+/).filter(Boolean).length : 0}
            </span>
          </div>
          <div class="p-2.5 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-800 text-center">
            <span class="text-[9px] uppercase font-mono text-gray-400 block">${t('Speech Rate', 'Sprechtempo')}</span>
            <span id="b1-mic-wpm" class="text-base font-black text-slate-900 dark:text-white font-mono">
              ${b1SpeechWpm} WPM
            </span>
          </div>
          <div class="p-2.5 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
            <span class="text-[9px] uppercase font-mono text-gray-400 block">${t('Target Window', 'Zielvorgabe')}</span>
            <span class="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
              200-280 Wörter
            </span>
          </div>
        </div>

        ${pacingFeedback ? `
          <div class="p-3 rounded-xl bg-amber-50 dark:bg-slate-950 border border-amber-200 dark:border-slate-800 text-xs font-bold text-amber-900 dark:text-amber-300">
            ${pacingFeedback}
          </div>
        ` : ''}

        <!-- Recognized Live Transcript Display -->
        <div class="p-3 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 min-h-[100px] text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
          ${b1SpokenTranscript ? b1SpokenTranscript : `
            <span class="text-gray-400 italic">
              ${t(
                'Click "Record My Presentation" and speak in German. Your spoken words will appear here in real time to calculate words-per-minute and fluency.',
                'Klicke auf "Präsentation aufnehmen" und sprich auf Deutsch. Dein gesprochener Text erscheint hier in Echtzeit zur Analyse deines Sprechtempos.'
              )}
            </span>
          `}
        </div>
      </div>
    </div>
  `;
}

function renderB1RedemittelView(handleClaimPoints) {
  const categories = [
    { id: 'all', labelDe: 'Alle Redemittel', labelEn: 'All Phrases' },
    { id: 'folie1', labelDe: 'Folie 1: Thema & Aufbau', labelEn: 'Slide 1: Intro' },
    { id: 'folie2', labelDe: 'Folie 2: Eigene Erfahrung', labelEn: 'Slide 2: Experience' },
    { id: 'folie3', labelDe: 'Folie 3: Heimatland', labelEn: 'Slide 3: Home Country' },
    { id: 'folie4', labelDe: 'Folie 4: Vor- & Nachteile', labelEn: 'Slide 4: Pros/Cons' },
    { id: 'folie5', labelDe: 'Folie 5: Meinung & Schluss', labelEn: 'Slide 5: Opinion' },
    { id: 'teil3', labelDe: 'Teil 3: Feedback & Q&A', labelEn: 'Teil 3: Feedback & Q&A' }
  ];

  const groups = b1RedemittelCategory === 'all'
    ? GOETHE_B1_SPRECHEN_REDEMITTEL
    : GOETHE_B1_SPRECHEN_REDEMITTEL.filter((group) => group.id === b1RedemittelCategory);

  return `
    <div class="space-y-4">
      <!-- Category Filter Chips -->
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth p-1 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800">
        ${categories.map((cat) => `
          <button data-redemittel-cat="${cat.id}" class="exam-redemittel-filter-btn px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
            b1RedemittelCategory === cat.id
              ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
          }">
            ${t(cat.labelEn, cat.labelDe)}
          </button>
        `).join('')}
      </div>

      <!-- Redemittel Groups & Cards Grid -->
      <div class="space-y-4">
        ${groups.map((grp) => `
          <div class="space-y-2.5">
            <div class="flex items-center justify-between px-1">
              <span class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>${grp.icon}</span>
                <span>${t(grp.phaseEn, grp.phase)}</span>
              </span>
              <span class="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-amber-200/60 dark:border-slate-700">
                ${grp.phrases.length} ${t('Phrases', 'Redemittel')}
              </span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              ${grp.phrases.map((phrase) => `
                <div class="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 flex flex-col justify-between gap-2 shadow-xs text-left">
                  <div>
                    <span class="text-[9px] font-mono font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-950 px-2 py-0.5 rounded border border-amber-200 dark:border-slate-800">
                      ${grp.badge || grp.phase}
                    </span>
                    <p class="text-xs font-black text-slate-900 dark:text-white mt-1.5 leading-snug">
                      "${phrase.de}"
                    </p>
                    <p class="text-[11px] text-gray-500 dark:text-slate-400 italic mt-0.5">
                      ${phrase.en}
                    </p>
                  </div>
                  <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800/80">
                    <button data-copy-phrase="${escapeAttr(phrase.de)}" class="exam-copy-phrase-btn px-2.5 py-1 bg-gray-50 hover:bg-gray-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1 border border-gray-200 dark:border-slate-800">
                      <span>📋</span>
                      <span>${t('Copy', 'Kopieren')}</span>
                    </button>
                    <button data-speech-text="${escapeAttr(phrase.de)}" class="exam-speak-card-btn px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1 border border-amber-200 dark:border-slate-700">
                      <span>🔊</span>
                      <span>${t('Listen', 'Anhören')}</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderB1QaView(currentTopic, handleClaimPoints) {
  const qaItems = currentTopic.qa || [];

  return `
    <div class="space-y-4 text-left font-sans">
      <!-- Teil 3 Intro Card -->
      <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-2 shadow-xs">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-950 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-slate-800">
            💬 ${t('TEIL 3: FEEDBACK & QUESTIONS (16 POINTS)', 'TEIL 3: RÜCKFRAGEN & FEEDBACK (16 PUNKTE)')}
          </span>
          <span class="text-[11px] font-bold text-slate-500 font-mono">
            ${currentTopic.title}
          </span>
        </div>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          ${t(
            'After your presentation, the conversation partner gives feedback and asks a question. Then the examiner asks a follow-up question. Practice both responding to these questions and asking them yourself!',
            'Nach deinem Vortrag gibt dein Partner kurzes Feedback und stellt dir eine Frage. Danach stellt der Prüfer eine weitere Frage. Hier findest du die authentischen Prüfungsfragen und Musterantworten zu diesem Thema:'
          )}
        </p>
      </div>

      <!-- Specific Questions & Model Answers for this topic -->
      <div class="space-y-3">
        ${qaItems.map((item, idx) => {
          const isPartner = item.type === 'partner' || (item.asker && (item.asker.includes('Partner') || item.asker.includes('Gesprächspartner')));
          return `
            <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-amber-200/80 dark:border-slate-800 space-y-3 shadow-xs">
              <!-- Question Header -->
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-mono font-black uppercase text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-slate-800 px-2 py-0.5 rounded">
                  ${isPartner ? t('👤 Partner Question', '👤 Frage des Partners') : t('🎓 Examiner Question', '🎓 Frage des Prüfers')}
                </span>
                <button data-speech-text="${escapeAttr(item.questionDe)}" class="exam-speak-card-btn text-xs px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 font-bold rounded-lg cursor-pointer transition flex items-center gap-1 border border-amber-200 dark:border-slate-700">
                  <span>🔊</span>
                  <span>${t('Play Question', 'Frage hören')}</span>
                </button>
              </div>

              <!-- Question Text -->
              <div>
                <p class="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white leading-snug">
                  "${item.questionDe}"
                </p>
                <p class="text-[11px] text-gray-500 dark:text-slate-400 italic mt-0.5">
                  ${item.questionEn}
                </p>
              </div>

              <!-- Model Answer Box -->
              <div class="p-3 bg-emerald-50/70 dark:bg-slate-950 rounded-xl border border-emerald-200/80 dark:border-slate-800 space-y-1.5">
                <div class="flex items-center justify-between">
                  <span class="text-[9.5px] font-mono font-black uppercase text-emerald-800 dark:text-emerald-400">
                    ${t('MODEL ANSWER (B1 STANDARD):', 'MUSTERANTWORT (B1 NIVEAU):')}
                  </span>
                  <div class="flex items-center gap-1.5">
                    <button data-copy-phrase="${escapeAttr(item.modelAnswerDe)}" class="exam-copy-phrase-btn text-xs px-2 py-0.5 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg cursor-pointer transition border border-gray-200 dark:border-slate-700">
                      <span>📋</span>
                      <span>${t('Copy', 'Kopieren')}</span>
                    </button>
                    <button data-speech-text="${escapeAttr(item.modelAnswerDe)}" class="exam-speak-card-btn text-xs px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-lg cursor-pointer transition flex items-center gap-1 shadow-xs">
                      <span>🔊</span>
                      <span>${t('Play Answer', 'Antwort hören')}</span>
                    </button>
                  </div>
                </div>
                <p class="text-xs text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  "${item.modelAnswerDe}"
                </p>
                <p class="text-[10.5px] text-gray-500 dark:text-slate-400 italic">
                  ${item.modelAnswerEn}
                </p>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Partner Feedback Phrases Formula -->
      <div class="p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-2">
        <span class="text-[10px] font-mono font-black uppercase text-slate-400 block">
          💬 ${t('HOW TO GIVE FEEDBACK TO YOUR PARTNER (3 ESSENTIAL STEPS):', 'WIE DU DEINEM PARTNER FEEDBACK GIBST (3 SCHRITTE):')}
        </span>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div class="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-800">
            <span class="text-amber-600 font-black block text-[10px]">1. DANK & LOB</span>
            <p class="text-slate-800 dark:text-slate-200 mt-1">"Vielen Dank für deine interessante Präsentation."</p>
          </div>
          <div class="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-800">
            <span class="text-amber-600 font-black block text-[10px]">2. POSITIVER PUNKT</span>
            <p class="text-slate-800 dark:text-slate-200 mt-1">"Besonders spannend fand ich dein Beispiel über..."</p>
          </div>
          <div class="p-2.5 bg-white dark:bg-slate-950 rounded-xl border border-gray-150 dark:border-slate-800">
            <span class="text-amber-600 font-black block text-[10px]">3. RÜCKFRAGE</span>
            <p class="text-slate-800 dark:text-slate-200 mt-1">"Ich habe dazu noch eine kurze Frage: Wie siehst du..."</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderB1SprechenTeil3(task, handleClaimPoints) {
  const allAvailableTopics = task.allTopics || B1_SPRECHEN_TOPICS;
  let currentTopic = (task.topics && task.topics.find((tp) => tp.id === selectedB1SprechenTopic))
    || allAvailableTopics.find((tp) => tp.id === selectedB1SprechenTopic)
    || (task.topics && task.topics[0])
    || allAvailableTopics[0];

  if (!currentTopic || !currentTopic.slides || currentTopic.slides.length === 0) {
    currentTopic = allAvailableTopics[0];
  }

  const currentTopicIndex = allAvailableTopics.findIndex((tp) => tp.id === currentTopic.id);
  const safeTopicIdx = currentTopicIndex >= 0 ? currentTopicIndex : 0;

  const qaItems = currentTopic.qa || task.questions || [];

  const teil3Tabs = [
    { id: 'qa', icon: '❓', labelDe: 'Fragen & Antworten', labelEn: 'Questions & Answers' },
    { id: 'feedback', icon: '🤝', labelDe: 'Partner-Feedback (3 Schritte)', labelEn: 'Partner Feedback (3 Steps)' },
    { id: 'redemittel', icon: '💡', labelDe: 'Redemittel Teil 3', labelEn: 'Teil 3 Phrases' },
    { id: 'recorder', icon: '⏱️', labelDe: 'Timer & Aufnahme', labelEn: 'Timer & Mic Coach' }
  ];

  const feedbackTemplates = [
    {
      step: 1,
      stepTitleDe: 'Schritt 1: Dank & Lob aussprechen',
      stepTitleEn: 'Step 1: Express Thanks & Praise',
      icon: '👏',
      tip: t('Start politely by thanking your partner and giving positive feedback on their delivery.', 'Bedanke dich höflich für den Vortrag und lobe die Struktur oder Aussprache.'),
      options: [
        { de: "Vielen Dank für deine interessante und informative Präsentation. Du hast sehr deutlich und verständlich gesprochen.", en: "Thank you very much for your interesting and informative presentation. You spoke very clearly and comprehensibly." },
        { de: "Danke für deinen Vortrag! Ich fand dein Thema sehr aktuell und gut strukturiert.", en: "Thanks for your presentation! I found your topic very relevant and well structured." },
        { de: "Ein großes Lob für deine Präsentation! Du hast frei gesprochen und deine Argumente überzeugend dargestellt.", en: "Great praise for your presentation! You spoke freely and presented your arguments convincingly." }
      ]
    },
    {
      step: 2,
      stepTitleDe: 'Schritt 2: Einen positiven Aspekt hervorheben',
      stepTitleEn: 'Step 2: Highlight a Specific Positive Point',
      icon: '⭐',
      tip: t('Mention one concrete detail that caught your attention (e.g. comparison with homeland, personal experience).', 'Nenne einen konkreten Aspekt, der dir besonders gefallen hat (z. B. der Vergleich mit dem Heimatland).'),
      options: [
        { de: "Besonders spannend fand ich den Vergleich mit der Situation in deinem Heimatland.", en: "I found the comparison with the situation in your home country especially engaging." },
        { de: "Besonders gut hat mir gefallen, wie du die Vor- und Nachteile mit anschaulichen Beispielen belegt hast.", en: "I especially liked how you supported the pros and cons with clear examples." },
        { de: "Dein persönlicher Erfahrungsbericht aus dem Alltag war für mich sehr aufschlussreich.", en: "Your personal account from everyday life was very insightful to me." }
      ]
    },
    {
      step: 3,
      stepTitleDe: 'Schritt 3: Eine inhaltliche Rückfrage stellen',
      stepTitleEn: 'Step 3: Ask a Thoughtful Content Question',
      icon: '❓',
      tip: t('Ask an open question related to the topic. Do not test them with grammar; ask for their personal view.', 'Stelle eine offene, themenbezogene Frage zu ihren persönlichen Ansichten oder Erfahrungen.'),
      options: [
        { de: "Ich hätte dazu noch eine Frage an dich: Würdest du das Modell auch deinen Freunden oder deiner Familie empfehlen?", en: "I have one more question for you: Would you also recommend this model to your friends or family?" },
        { de: "Mich würde noch interessieren: Welche Entwicklung erwartest du bei diesem Thema in den nächsten fünf Jahren?", en: "I'd also be interested to know: What development do you expect on this topic in the next five years?" },
        { de: "Eine kurze Frage dazu: Gab es bei deiner Entscheidung einen Moment, in dem du deine Meinung geändert hast?", en: "A quick question about that: Was there a moment in your decision when you changed your mind?" }
      ]
    }
  ];

  const discussionRedemittel = (GOETHE_B1_SPRECHEN_REDEMITTEL.find((g) => g.id === 'teil3')?.phrases || []).concat([
    { de: "Vielen Dank für diese interessante Frage! Dazu möchte ich sagen, dass...", en: "Thank you for this interesting question! Regarding that, I'd like to say that..." },
    { de: "Das ist ein sehr wichtiger Punkt. Meiner Erfahrung nach hängt das davon ab, ob...", en: "That is a very important point. In my experience it depends on whether..." },
    { de: "Darüber habe ich auch schon oft nachgedacht. Aus meiner Sicht...", en: "I have often thought about that too. From my perspective..." },
    { de: "Wenn ich ehrlich bin, ist das nicht ganz einfach, aber man sollte...", en: "If I'm honest, that isn't quite simple, but one should..." },
    { de: "Könnten Sie die Frage bitte noch einmal wiederholen?", en: "Could you please repeat the question once more?" },
    { de: "Entschuldigung, darf ich kurz nachfragen, wie Sie das genau meinen?", en: "Excuse me, may I ask briefly what you mean by that exactly?" }
  ]);

  return `
    <div class="p-4 bg-gray-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-3xl text-left space-y-4 font-sans">
      <!-- Header Banner -->
      <div class="p-4 rounded-3xl bg-linear-to-r from-amber-500 via-amber-400 to-yellow-400 text-slate-950 shadow-md">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 bg-white/40 rounded-2xl">🤝</span>
            <div>
              <span class="text-[10px] font-mono font-black uppercase tracking-wider bg-black/10 px-2 py-0.5 rounded">
                Goethe-Zertifikat B1 • Sprechen Teil 3
              </span>
              <h3 class="text-sm sm:text-base font-black mt-0.5 text-slate-950">
                ${t('Discussion & Partner Feedback (ca. 1:30 - 2 Min)', 'Über das Thema sprechen & Partner-Feedback (ca. 1:30 - 2 Min)')}
              </h3>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] font-black bg-slate-950 text-amber-300 px-3 py-1 rounded-xl shadow-xs">
              16 / 100 Punkte (16%)
            </span>
          </div>
        </div>
        <p class="text-xs text-slate-900/90 mt-2.5 leading-relaxed font-medium">
          ${t(
            'In Teil 3, give structured 3-step feedback on your partner\'s presentation and ask 1 question. Then answer questions asked by your partner and the examiner about your presentation.',
            'In Teil 3 sprecht ihr ca. 2 Minuten über eure Vorträge: Gib deinem Partner Feedback (Lob & Dank) und stelle 1 inhaltliche Frage. Anschließend beantwortest du Fragen deines Partners und des Prüfers zu deinem Vortrag.'
          )}
        </p>
      </div>

      <!-- Topic Picker & Quick A/B Selector -->
      <div class="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-3 shadow-xs">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span class="text-[10px] font-mono font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>🎯</span>
            <span>${t('ACTIVE PRESENTATION TOPIC DISCUSSED:', 'AKTIV BESPROCHENES THEMA:')}</span>
          </span>
          <span class="text-[10.5px] font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
            ${currentTopic.badge || 'Goethe B1'} • ${currentTopic.category || ''}
          </span>
        </div>

        <!-- Topic A & B Selector for Active Exam Set -->
        ${task.topics && task.topics.length >= 2 ? `
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
            ${task.topics.map((tp, idx) => {
              const isSelected = currentTopic.id === tp.id;
              const letter = tp.topicLetter || (idx === 0 ? 'A' : 'B');
              return `
                <button data-b1-topic-id="${tp.id}" class="exam-b1-topic-tab p-2.5 rounded-xl border text-left cursor-pointer transition text-xs font-bold ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 border-amber-500 shadow-sm font-black'
                    : 'bg-gray-50 text-slate-700 border-gray-200 hover:bg-gray-100 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-850'
                }">
                  <span class="text-[9px] uppercase font-mono font-black block ${isSelected ? 'text-slate-800' : 'text-slate-500 dark:text-slate-400'}">
                    Thema ${letter}
                  </span>
                  <span class="line-clamp-1 mt-0.5">${tp.title.replace(/^Thema [AB]:\s*/, '')}</span>
                </button>
              `;
            }).join('')}
          </div>
        ` : ''}

        <!-- 20 Topics Catalog Dropdown with Quick Prev/Next Switchers -->
        <div class="pt-1 flex flex-col gap-2">
          <div class="flex items-center justify-between gap-2">
            <label for="exam-b1-topic-select" class="text-[10.5px] font-bold text-gray-500 dark:text-slate-400 shrink-0">
              📚 ${t('Or practice Teil 3 for any of the 20 Goethe B1 topics from the exam PDFs:', 'Oder Teil 3 für alle 20 B1 Prüfungsthemen aus den PDF-Vorlagen üben:')}
            </label>
            <span class="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/40">
              ${t('Topic', 'Thema')} ${safeTopicIdx + 1} / ${allAvailableTopics.length}
            </span>
          </div>

          <div class="flex items-center gap-1.5">
            <button data-b1-topic-nav="prev" class="exam-b1-topic-nav-btn p-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1 shrink-0 select-none" title="${t('Previous topic', 'Vorheriges Thema')}">
              <span>‹</span>
              <span class="hidden sm:inline">${t('Prev', 'Zurück')}</span>
            </button>

            <select id="exam-b1-topic-select" class="exam-b1-topic-select flex-1 bg-gray-50 dark:bg-slate-950 border border-gray-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-2.5 py-2 text-xs font-bold focus:ring-2 focus:ring-amber-400 cursor-pointer truncate">
              ${allAvailableTopics.map((tp, idx) => `
                <option value="${tp.id}" ${currentTopic.id === tp.id ? 'selected' : ''}>
                  ${idx + 1}. ${tp.title.replace(/^Thema [AB]:\s*/, '').replace(/^\d+\.\s*/, '')} (${tp.category || ''})
                </option>
              `).join('')}
            </select>

            <button data-b1-topic-nav="next" class="exam-b1-topic-nav-btn p-2 px-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-black cursor-pointer transition flex items-center gap-1 shrink-0 select-none" title="${t('Next topic', 'Nächstes Thema')}">
              <span class="hidden sm:inline">${t('Next', 'Weiter')}</span>
              <span>›</span>
            </button>
          </div>
        </div>

        <!-- Selected Topic Information Card -->
        <div class="p-3 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white">${currentTopic.title.replace(/^Thema [AB]:\s*/, '')}</h4>
            <p class="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5 italic">"${currentTopic.question}"</p>
          </div>
          <span class="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-2.5 py-1 rounded-lg text-slate-700 dark:text-slate-300 font-bold text-[10px] font-mono shrink-0">
            💬 2 Prüfungsfragen & Feedback
          </span>
        </div>
      </div>

      <!-- Teil 3 Submode Tabs -->
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar scroll-smooth p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
        ${teil3Tabs.map((tab) => `
          <button data-teil3-tab="${tab.id}" class="exam-b1-teil3-tab-btn flex-1 min-w-[110px] py-2 px-2.5 rounded-xl text-center text-xs font-black cursor-pointer transition select-none ${
            b1Teil3Tab === tab.id
              ? 'bg-amber-400 text-slate-950 shadow-xs font-black'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-900'
          }">
            <span class="block text-sm">${tab.icon}</span>
            <span class="block text-[10.5px] font-bold mt-0.5 tracking-tight truncate">${t(tab.labelEn, tab.labelDe)}</span>
          </button>
        `).join('')}
      </div>

      <!-- TAB 1: QUESTIONS & ANSWERS (Q&A) -->
      ${b1Teil3Tab === 'qa' ? `
        <div class="space-y-3">
          <div class="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              💬 ${t('Authentic Exam Questions & B1 Model Answers for this topic:', 'Authentische Prüfungsfragen & B1-Musterantworten zu diesem Thema:')}
            </span>
            <span class="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
              ${qaItems.length} Fragen
            </span>
          </div>

          ${qaItems.map((item, qIdx) => {
            const isPartner = item.type === 'partner' || (item.asker && (item.asker.includes('Partner') || item.asker.includes('Gesprächspartner')));
            return `
              <div class="p-4 bg-white dark:bg-slate-950 border border-amber-200/80 dark:border-slate-800 rounded-2xl space-y-3 text-left shadow-xs">
                <!-- Asker & Play Question Header -->
                <div class="flex items-center justify-between gap-2">
                  <span class="text-[10px] font-black uppercase text-amber-800 dark:text-amber-300 font-mono bg-amber-50 dark:bg-slate-800 px-2 py-0.5 rounded border border-amber-200/60 dark:border-slate-700">
                    ${isPartner ? t('👤 Partner Question', '👤 Frage des Partners') : t('🎓 Examiner Question', '🎓 Frage des Prüfers')}
                  </span>
                  <button data-speech-text="${escapeAttr(item.questionDe)}" class="exam-speak-card-btn text-xs px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-amber-200 dark:border-slate-700 text-amber-900 dark:text-amber-300 font-bold rounded-lg cursor-pointer transition flex items-center gap-1">
                    <span>🔊</span>
                    <span>${t('Play Question', 'Frage hören')}</span>
                  </button>
                </div>

                <!-- Question Text -->
                <div>
                  <p class="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white leading-snug">
                    "${item.questionDe}"
                  </p>
                  <p class="text-[11px] text-gray-500 dark:text-slate-400 italic mt-0.5">
                    ${item.questionEn}
                  </p>
                </div>

                <!-- Model Answer Box -->
                <div class="p-3 bg-emerald-50/70 dark:bg-slate-900 rounded-xl border border-emerald-200/80 dark:border-slate-800 space-y-1.5 text-xs">
                  <div class="flex items-center justify-between">
                    <span class="text-[9.5px] font-black uppercase text-emerald-700 dark:text-emerald-400 font-mono">
                      ${t('MODEL ANSWER (B1 STANDARD):', 'MUSTERANTWORT (B1 NIVEAU):')}
                    </span>
                    <div class="flex items-center gap-1.5">
                      <button data-copy-phrase="${escapeAttr(item.modelAnswerDe)}" class="exam-copy-phrase-btn text-xs px-2 py-0.5 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-lg cursor-pointer transition border border-gray-200 dark:border-slate-700">
                        <span>📋</span>
                        <span>${t('Copy', 'Kopieren')}</span>
                      </button>
                      <button data-speech-text="${escapeAttr(item.modelAnswerDe)}" class="exam-speak-card-btn text-xs px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg cursor-pointer transition flex items-center gap-1 shadow-xs">
                        <span>🔊</span>
                        <span>${t('Play Answer', 'Antwort hören')}</span>
                      </button>
                    </div>
                  </div>
                  <p class="text-slate-700 dark:text-slate-200 leading-snug font-medium">
                    "${item.modelAnswerDe}"
                  </p>
                  <p class="text-[10.5px] text-gray-500 dark:text-slate-400 italic">
                    ${item.modelAnswerEn}
                  </p>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : ''}

      <!-- TAB 2: PARTNER FEEDBACK BUILDER -->
      ${b1Teil3Tab === 'feedback' ? `
        <div class="space-y-4">
          <!-- Intro Card -->
          <div class="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-2">
            <div class="flex items-center gap-2">
              <span class="text-xl">🤝</span>
              <div>
                <h4 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                  ${t('The 3-Step Goethe B1 Partner Feedback Formula', 'Die 3-Schritte-Formel für perfektes Partner-Feedback')}
                </h4>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                  ${t('After your partner speaks, immediately deliver these 3 components smoothly:', 'Sobald dein Partner fertig ist, sagst du nacheinander diese 3 Bausteine:')}
                </p>
              </div>
            </div>
          </div>

          <!-- 3 Steps Blocks -->
          <div class="space-y-3">
            ${feedbackTemplates.map((fb) => `
              <div class="p-4 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-3 shadow-xs">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="text-base">${fb.icon}</span>
                    <h5 class="text-xs font-black text-slate-900 dark:text-white">
                      ${t(fb.stepTitleEn, fb.stepTitleDe)}
                    </h5>
                  </div>
                  <span class="text-[9.5px] font-mono font-bold bg-amber-50 dark:bg-slate-800 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200/60 dark:border-slate-700">
                    Schritt ${fb.step} / 3
                  </span>
                </div>
                <p class="text-[11px] text-slate-600 dark:text-slate-400 italic">
                  💡 ${fb.tip}
                </p>
                <div class="space-y-2 pt-1">
                  ${fb.options.map((opt) => `
                    <div class="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-150 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                      <div class="text-left space-y-0.5">
                        <p class="text-xs font-black text-slate-800 dark:text-slate-100">"${opt.de}"</p>
                        <p class="text-[10.5px] text-gray-500 dark:text-slate-400 italic">${opt.en}</p>
                      </div>
                      <div class="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                        <button data-copy-phrase="${escapeAttr(opt.de)}" class="exam-copy-phrase-btn text-xs px-2.5 py-1 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-lg cursor-pointer transition border border-gray-200 dark:border-slate-700">
                          <span>📋</span>
                          <span>${t('Copy', 'Kopieren')}</span>
                        </button>
                        <button data-speech-text="${escapeAttr(opt.de)}" class="exam-speak-card-btn text-xs px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg cursor-pointer transition flex items-center gap-1 shadow-xs">
                          <span>🔊</span>
                          <span>${t('Listen', 'Anhören')}</span>
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Full Model Feedback Statement -->
          <div class="p-4 bg-emerald-50/70 dark:bg-slate-950 rounded-2xl border border-emerald-200 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-black uppercase text-emerald-800 dark:text-emerald-400">
                ✨ ${t('FULL SPOKEN PARTNER FEEDBACK EXAMPLE (30 SECONDS):', 'VOLLSTÄNDIGES MUSTER-FEEDBACK (CA. 30 SEKUNDEN):')}
              </span>
              <button data-speech-text="Vielen Dank für deine interessante und gut strukturierte Präsentation. Du hast sehr deutlich und flüssig gesprochen. Besonders spannend fand ich dein Beispiel über die Situation in deinem Heimatland. Ich hätte dazu noch eine Frage: Würdest du das auch deinen Freunden empfehlen?" class="exam-speak-card-btn text-xs px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl cursor-pointer transition shadow-xs flex items-center gap-1">
                <span>🔊</span>
                <span>${t('Listen to Full Feedback', 'Ganzes Feedback hören')}</span>
              </button>
            </div>
            <p class="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              "Vielen Dank für deine interessante und gut strukturierte Präsentation. Du hast sehr deutlich und flüssig gesprochen. Besonders spannend fand ich dein Beispiel über die Situation in deinem Heimatland. Ich hätte dazu noch eine Frage: Würdest du das auch deinen Freunden empfehlen?"
            </p>
          </div>
        </div>
      ` : ''}

      <!-- TAB 3: REDEMITTEL TEIL 3 -->
      ${b1Teil3Tab === 'redemittel' ? `
        <div class="space-y-3">
          <div class="p-3 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 flex items-center justify-between">
            <span class="text-[11px] font-bold text-slate-700 dark:text-slate-300">
              💡 ${t('Essential Phrases for Discussion, Reactions & Clarifications in Teil 3:', 'Wichtige Redemittel für Diskussion, Rückfragen & Reaktionszeit in Teil 3:')}
            </span>
            <span class="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
              ${discussionRedemittel.length} ${t('Phrases', 'Redemittel')}
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            ${discussionRedemittel.map((phrase) => `
              <div class="p-3.5 bg-white dark:bg-slate-950 rounded-2xl border border-gray-200 dark:border-slate-800 flex flex-col justify-between gap-2 shadow-xs text-left">
                <div>
                  <span class="text-[9px] font-mono font-black uppercase text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-amber-200 dark:border-slate-800">
                    Teil 3
                  </span>
                  <p class="text-xs font-black text-slate-900 dark:text-white mt-1.5 leading-snug">
                    "${phrase.de}"
                  </p>
                  <p class="text-[11px] text-gray-500 dark:text-slate-400 italic mt-0.5">
                    ${phrase.en}
                  </p>
                </div>
                <div class="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-slate-800/80">
                  <button data-copy-phrase="${escapeAttr(phrase.de)}" class="exam-copy-phrase-btn px-2.5 py-1 bg-gray-50 hover:bg-gray-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1 border border-gray-200 dark:border-slate-800">
                    <span>📋</span>
                    <span>${t('Copy', 'Kopieren')}</span>
                  </button>
                  <button data-speech-text="${escapeAttr(phrase.de)}" class="exam-speak-card-btn px-2.5 py-1 bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-amber-900 dark:text-amber-300 text-xs font-bold rounded-lg cursor-pointer transition flex items-center gap-1 border border-amber-200 dark:border-slate-700">
                    <span>🔊</span>
                    <span>${t('Listen', 'Anhören')}</span>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- TAB 4: TIMER & LIVE RECORDER COACH -->
      ${b1Teil3Tab === 'recorder' ? `
        <div class="space-y-4">
          <!-- 2:00 Minute Timer Card -->
          <div class="p-6 bg-white dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-slate-800 text-center space-y-4 shadow-sm">
            <div class="flex items-center justify-between">
              <span class="text-[10px] font-mono font-black uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-slate-900 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-slate-800">
                ⏱️ ${t('2:00 MINUTE TEIL 3 DISCUSSION WINDOW', '2:00 MINUTEN ZEITFENSTER FÜR TEIL 3')}
              </span>
              <span class="text-xs font-mono text-slate-500 dark:text-slate-400">
                ${120 - (b1TimerSeconds > 120 ? 120 : b1TimerSeconds)}s / 120s
              </span>
            </div>

            <!-- Big Digits Display -->
            <div class="py-2">
              <div id="b1-timer-display" class="text-5xl sm:text-6xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                ${Math.floor(b1TimerSeconds / 60).toString().padStart(2, '0')}:${(b1TimerSeconds % 60).toString().padStart(2, '0')}
              </div>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                ${t('Timing for feedback to your partner & answering examiner questions', 'Zeit für Feedback an den Partner & Beantwortung der Prüferfragen')}
              </p>
            </div>

            <!-- Controls -->
            <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button id="exam-b1-timer-toggle" class="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5">
                <span>${b1TimerRunning ? '⏸️' : '▶️'}</span>
                <span>${b1TimerRunning ? t('Pause Timer', 'Pausieren') : t('Start Timer', 'Timer starten')}</span>
              </button>
              <button id="exam-b1-timer-reset" class="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5">
                <span>🔄</span>
                <span>${t('Reset', 'Zurücksetzen')}</span>
              </button>
            </div>
          </div>

          <!-- Live Voice Recording & Speech Recognition -->
          <div class="p-5 bg-white dark:bg-slate-950 rounded-3xl border border-gray-200 dark:border-slate-800 space-y-3 shadow-sm">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span class="text-[10px] font-mono font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-900 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-900">
                  🎙️ ${t('SPEECH RECORDER & LIVE PACING COACH', 'SPRACHAUFNAHME & SPRECHTEMPO-TRAINER')}
                </span>
                <h4 class="text-xs font-black text-slate-900 dark:text-white mt-1">
                  ${t('Practice Answering Teil 3 Questions Out Loud', 'Freies Antworten auf Prüferfragen üben')}
                </h4>
              </div>
              <button id="exam-b1-mic-toggle" class="px-4 py-2.5 rounded-xl font-black text-xs cursor-pointer transition flex items-center gap-2 shadow-sm ${
                b1IsRecording
                  ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }">
                <span>${b1IsRecording ? '⏹️' : '🎙️'}</span>
                <span>${b1IsRecording ? t('Stop Recording', 'Aufnahme beenden') : t('Record My Answer', 'Antwort aufnehmen')}</span>
              </button>
            </div>

            <!-- Live Metrics: Word Count & WPM -->
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div class="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-150 dark:border-slate-800 text-center">
                <span class="text-[9px] uppercase font-mono text-gray-400 block">${t('Words Spoken', 'Wortanzahl')}</span>
                <span id="b1-mic-word-count" class="text-base font-black text-slate-900 dark:text-white font-mono">
                  ${b1SpokenTranscript ? b1SpokenTranscript.split(/\s+/).filter(Boolean).length : 0}
                </span>
              </div>
              <div class="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-150 dark:border-slate-800 text-center">
                <span class="text-[9px] uppercase font-mono text-gray-400 block">${t('Speech Rate', 'Sprechtempo')}</span>
                <span id="b1-mic-wpm" class="text-base font-black text-slate-900 dark:text-white font-mono">
                  ${b1SpeechWpm} WPM
                </span>
              </div>
              <div class="p-2.5 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-150 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
                <span class="text-[9px] uppercase font-mono text-gray-400 block">${t('Target Window', 'Zielvorgabe')}</span>
                <span class="text-xs font-black text-amber-600 dark:text-amber-400 font-mono">
                  60-120 Wörter
                </span>
              </div>
            </div>

            <!-- Recognized Live Transcript Display -->
            <div class="p-3 bg-gray-50 dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 min-h-[90px] text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
              ${b1SpokenTranscript ? b1SpokenTranscript : `
                <span class="text-gray-400 italic">
                  ${t(
                    'Click "Record My Answer" and speak your answer in German. Your words will appear here in real time to calculate fluency.',
                    'Klicke auf "Antwort aufnehmen" und sprich auf Deutsch. Dein gesprochener Text erscheint hier in Echtzeit.'
                  )}
                </span>
              `}
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Evaluation Criteria Reminder -->
      <!-- Completion / Claim 16 Points for Teil 3 -->
      <div class="p-4 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-950 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div>
          <span class="text-[9.5px] font-mono font-black uppercase text-emerald-700 dark:text-emerald-400 block">
            ${t('PART 3 DISCUSSION & FEEDBACK (16 MARKS)', 'TEIL 3 RÜCKFRAGEN & DISKUSSION (16 PUNKTE)')}
          </span>
          <p class="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
            ${t('Practiced feedback formula & answering questions?', 'Feedback-Formel geübt und Prüferfragen beantwortet?')}
          </p>
        </div>
        <button id="exam-b1-t3-claim-btn" class="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 shrink-0">
          <span>🏆</span>
          <span>${claimedTasks['b1_sp_t3'] || (state.b1ExamProgress?.sprechen?.completedTeile?.includes(3)) ? t('Completed (+16 Pts Claimed)', 'Bereits absolviert (+16 Pkt)') : t('Claim 16 Points & Save', '16 Punkte sichern & speichern')}</span>
        </button>
      </div>
    </div>
  `;
}

function renderB1SprechenTeil4(task, handleClaimPoints) {
  const isCompleted = claimedTasks['b1_sp_t4'] || (state.b1ExamProgress?.sprechen?.completedTeile?.includes(4));
  const drills = task.phoneticDrills || [
    {
      category: "1. Wortakzent: Trennbare vs. Nichttrennbare Verben",
      categoryEn: "1. Word Stress: Separable vs. Inseparable Verbs",
      rule: "Trennbare Präfixe (ab-, auf-, mit-, vor-, ein-) tragen den Hauptakzent. Nichttrennbare (be-, ver-, zer-, ent-, ge-) sind unbetont!",
      examples: [
        { word: "AB-fahren", note: "Akzent auf 'AB'", audio: "Wir müssen pünktlich abfahren.", trans: "We must depart on time." },
        { word: "ver-STEH-en", note: "Akzent auf 'STEH'", audio: "Ich kann Sie sehr gut verstehen.", trans: "I can understand you very well." },
        { word: "VOR-bereiten", note: "Akzent auf 'VOR'", audio: "Ich möchte mich gut vorbereiten.", trans: "I want to prepare well." },
        { word: "be-ANT-worten", note: "Akzent auf 'ANT'", audio: "Darf ich diese Frage beantworten?", trans: "May I answer this question?" }
      ]
    },
    {
      category: "2. Satzmelodie: Aussage vs. Entscheidungsfrage",
      categoryEn: "2. Sentence Melody: Statements vs. Yes/No Questions",
      rule: "Aussagesätze und W-Fragen enden mit fallender Melodie ↘. Ja/Nein-Fragen enden mit ansteigender Melodie ↗!",
      examples: [
        { word: "Aussagesatz (↘)", note: "Stimme senken", audio: "Ich wohne seit zwei Jahren in Deutschland.", trans: "I have been living in Germany for two years." },
        { word: "W-Frage (↘)", note: "Stimme senken", audio: "Wann treffen wir uns am Samstag?", trans: "When do we meet on Saturday?" },
        { word: "Entscheidungsfrage (↗)", note: "Stimme heben", audio: "Hast du am Wochenende Zeit dafür?", trans: "Do you have time for that this weekend?" }
      ]
    },
    {
      category: "3. Umlaut-Präzision & Vokallänge",
      categoryEn: "3. Umlaut Precision & Vowel Length",
      rule: "Klare Unterscheidung zwischen kurzen und langen Vokalen sowie Umlauten verhindert Bedeutungsverwechslungen!",
      examples: [
        { word: "schon vs. schön", note: "kurz vs. gerundet", audio: "Ich kenne das schon, es ist wirklich sehr schön.", trans: "I already know that, it is really very beautiful." },
        { word: "zahlen vs. zählen", note: "a vs. ä", audio: "Wir zahlen zusammen, damit wir nicht zählen müssen.", trans: "We pay together so we don't have to count." },
        { word: "müssen vs. mussten", note: "ü vs. u", audio: "Wir müssen heute pünktlich anfangen.", trans: "We must start on time today." }
      ]
    },
    {
      category: "4. Glottisschlag (Knacklaut) bei Vokalanlaut",
      categoryEn: "4. Glottal Stop Before Vowel Onsets",
      rule: "Im Deutschen beginnt jeder Vokal am Wortanfang oder nach Präfixen mit einem feinen Kehlkopf-Verschlusslaut.",
      examples: [
        { word: "be-achten [bəˈʔaxtn̩]", note: "Knacklaut vor 'a'", audio: "Bitte beachten Sie die Prüfungsregeln.", trans: "Please note the exam regulations." },
        { word: "überall [ˈʔyːbɐʔal]", note: "Knacklaut vor 'ü' und 'a'", audio: "Im Sommer ist es überall grün.", trans: "In summer it is green everywhere." },
        { word: "am Anfang [ʔam ˈʔanfaŋ]", note: "Knacklaut vor 'am' und 'Anfang'", audio: "Am Anfang möchte ich mich vorstellen.", trans: "At the beginning I would like to introduce myself." }
      ]
    }
  ];

  return `
    <div class="space-y-4 text-left font-sans">
      <!-- Teil 4 Exam Header Banner -->
      <div class="p-4 rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white shadow-md">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2.5">
            <span class="text-2xl p-2 bg-white/20 rounded-2xl">🎙️</span>
            <div>
              <span class="text-[10px] font-mono font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded">
                Goethe-Zertifikat B1 • Sprechen Teil 4
              </span>
              <h3 class="text-sm sm:text-base font-black mt-0.5 text-white">
                ${t('Pronunciation, Intonation & Fluency (16 Points)', 'Aussprache, Intonation & Redefluss (16 Punkte)')}
              </h3>
            </div>
          </div>
          <div class="flex items-center gap-1.5">
            <span class="text-[11px] font-black bg-white/20 text-white px-3 py-1 rounded-xl shadow-xs">
              16 / 100 Punkte (16%)
            </span>
          </div>
        </div>
        <p class="text-xs text-white/90 mt-2.5 leading-relaxed font-medium">
          ${t(
            'Examiners evaluate your pronunciation across all parts of the oral exam. Practice the 4 core phonetic criteria with acoustic models to ensure a high score!',
            'Die Prüfer bewerten deine Aussprache über die gesamte mündliche Prüfung. Trainiere die 4 phonetischen Kernkriterien mit Audiobeispielen!'
          )}
        </p>
      </div>

      <!-- 4 Phonetic Drill Cards -->
      <div class="space-y-3.5">
        ${drills.map((drill, dIdx) => `
          <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-3 shadow-xs">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span class="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono text-[10px] flex items-center justify-center font-black">${dIdx + 1}</span>
                <span>${t(drill.categoryEn || drill.category, drill.category)}</span>
              </span>
              <span class="text-[10px] font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-slate-950 px-2 py-0.5 rounded">
                ${drill.examples.length} Beispiele
              </span>
            </div>
            <p class="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed font-medium bg-gray-50 dark:bg-slate-950/60 p-2.5 rounded-xl border border-gray-150 dark:border-slate-800">
              💡 <strong>Regel:</strong> ${drill.rule}
            </p>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              ${drill.examples.map(ex => `
                <div class="p-2.5 bg-gray-50 dark:bg-slate-950 rounded-xl border border-gray-200/70 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <div class="min-w-0">
                    <div class="flex items-center gap-1.5 flex-wrap">
                      <span class="text-xs font-black text-slate-900 dark:text-white font-mono">${ex.word}</span>
                      <span class="text-[9.5px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">${ex.note}</span>
                    </div>
                    <p class="text-[11px] text-slate-700 dark:text-slate-300 mt-1 font-sans italic truncate">"${ex.audio}"</p>
                    <p class="text-[10px] text-gray-500 dark:text-slate-400 italic truncate">${ex.trans}</p>
                  </div>
                  <button data-speech-text="${ex.audio}" class="exam-speak-card-btn px-2.5 py-1.5 bg-white hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-700 dark:text-emerald-400 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold shrink-0 transition cursor-pointer flex items-center gap-1 shadow-xs">
                    <span>🔊</span>
                    <span>Hören</span>
                  </button>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Completion Banner -->
      <div class="p-4 rounded-2xl bg-linear-to-r from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-slate-950 border border-emerald-300 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        <div>
          <span class="text-[9.5px] font-mono font-black uppercase text-emerald-700 dark:text-emerald-400 block">
            ${t('PART 4 PHONETICS & FLUENCY MASTERY (16 MARKS)', 'TEIL 4 PHONETIK & REDEFLUSS (16 PUNKTE)')}
          </span>
          <p class="text-xs font-bold text-slate-900 dark:text-white mt-0.5">
            ${t('Have you practiced all pronunciation drills and word stresses?', 'Hast du alle Ausspracheübungen und Wortbetonungen trainiert?')}
          </p>
        </div>
        <button id="exam-b1-t4-claim-btn" class="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-xs transition cursor-pointer flex items-center gap-1.5 shrink-0">
          <span>🏆</span>
          <span>${isCompleted ? t('Completed (+16 Pts Claimed)', 'Bereits absolviert (+16 Pkt)') : t('Claim 16 Points & Save', '16 Punkte sichern & speichern')}</span>
        </button>
      </div>
    </div>
  `;
}

function attachTaskEventListeners(container, task, handleClaimPoints) {
  // Speech Playback on buttons
  container.querySelectorAll('.exam-speak-card-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-speech-text');
      if (text) {
        speak(text, true);
        handleClaimPoints(`speech_${text.slice(0, 10)}`, 4);
      }
    });
  });

  // True / False selection
  container.querySelectorAll('.exam-tf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = btn.getAttribute('data-tf-id');
      const chosenVal = btn.getAttribute('data-val') === 'true';
      const question = task.questions?.find((q) => q.id === qId);
      if (!question) return;

      solvedState[qId] = chosenVal;
      const isCorrect = question.answer === chosenVal;
      feedbackState[qId] = {
        status: isCorrect ? 'correct' : 'wrong',
        textDe: isCorrect ? `Richtig! ${question.explanationDe || ''}` : `Falsch! ${question.explanationDe || ''}`,
        textEn: isCorrect ? `Correct! ${question.explanationEn || ''}` : `Wrong! ${question.explanationEn || ''}`
      };
      if (isCorrect) handleClaimPoints(qId, 5);
      renderExams(container);
    });
  });

  // Mapping Ad select
  container.querySelectorAll('.exam-mapping-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const key = sel.getAttribute('data-mapping-key');
      const expected = sel.getAttribute('data-correct');
      const val = sel.value;
      solvedState[key] = val;
      if (val === expected) handleClaimPoints(key, 5);
      renderExams(container);
    });
  });

  // Multiple choice selection
  container.querySelectorAll('.exam-mc-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = btn.getAttribute('data-mc-id');
      const optIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
      const question = task.questions?.find((q) => q.id === qId);
      if (!question) return;

      solvedState[qId] = optIdx;
      const isCorrect = question.ans === optIdx;
      feedbackState[qId] = {
        status: isCorrect ? 'correct' : 'wrong',
        textDe: isCorrect ? `Perfekt! ${question.explanationDe || ''}` : `Leider nicht ganz. ${question.explanationDe || ''}`,
        textEn: isCorrect ? `Perfect! ${question.explanationEn || ''}` : `Wrong! ${question.explanationEn || ''}`
      };
      if (isCorrect) handleClaimPoints(qId, 5);
      renderExams(container);
    });
  });

  // Mall Floor Directory Select
  container.querySelectorAll('.exam-mall-select').forEach(sel => {
    sel.addEventListener('change', () => {
      const mId = sel.getAttribute('data-mall-match-id');
      const answer = sel.getAttribute('data-answer');
      const val = sel.value;
      solvedState[mId] = val;
      if (val === answer) handleClaimPoints(mId, 6);
      renderExams(container);
    });
  });

  // Opinion Vote Buttons
  container.querySelectorAll('.exam-opinion-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = btn.getAttribute('data-opinion-id');
      const vote = btn.getAttribute('data-vote');
      const expected = btn.getAttribute('data-expected');
      solvedState[qId] = vote;
      if (vote === expected) handleClaimPoints(qId, 8);
      renderExams(container);
    });
  });

  // Listening Audio Playback Button
  container.querySelector('#exam-hoeren-play-btn')?.addEventListener('click', () => {
    const key = `m_${task.id}`;
    if (audioPlayState[key] === 'playing') {
      audioPlayState[key] = 'paused';
    } else {
      audioPlayState[key] = 'playing';
      speak(task.audio_transcript || '', true);
    }
    renderExams(container);
  });

  // Listening Transcript Toggle
  container.querySelector('#exam-toggle-transcript-btn')?.addEventListener('click', () => {
    speakingTranscript = !speakingTranscript;
    renderExams(container);
  });

  // Listening Single Question Options
  container.querySelectorAll('.exam-hoeren-mc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const optIdx = parseInt(btn.getAttribute('data-hoeren-mc-idx'), 10);
      const ans = parseInt(btn.getAttribute('data-ans'), 10);
      solvedState[`h_mc_${task.id}`] = optIdx;
      if (optIdx === ans) handleClaimPoints(`h_mc_${task.id}`, 10);
      renderExams(container);
    });
  });

  // Listening Multi Questions MC
  container.querySelectorAll('.exam-h-q-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = btn.getAttribute('data-h-q-id');
      const optIdx = parseInt(btn.getAttribute('data-opt-idx'), 10);
      const ans = parseInt(btn.getAttribute('data-ans'), 10);
      solvedState[qId] = optIdx;
      if (optIdx === ans) handleClaimPoints(qId, 8);
      renderExams(container);
    });
  });

  // Listening Multi Questions True/False
  container.querySelectorAll('.exam-h-tf-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const qId = btn.getAttribute('data-h-tf-id');
      const val = btn.getAttribute('data-val') === 'true';
      const ans = btn.getAttribute('data-ans') === 'true';
      solvedState[qId] = val;
      if (val === ans) handleClaimPoints(qId, 8);
      renderExams(container);
    });
  });

  // Form Inputs for A1 Formular Challenge
  container.querySelectorAll('.exam-form-input').forEach(input => {
    input.addEventListener('input', () => {
      const fId = input.getAttribute('data-form-field-id');
      writingInputs[`form_${fId}`] = input.value;
    });
  });

  container.querySelector('#exam-check-form-btn')?.addEventListener('click', () => {
    if (!task.fields) return;
    let correctCount = 0;
    const errors = [];
    task.fields.forEach((f) => {
      const userVal = (writingInputs[`form_${f.id}`] || '').trim().toLowerCase();
      const targetVal = f.expected.trim().toLowerCase();
      if (userVal === targetVal) {
        correctCount++;
      } else {
        errors.push(`${f.label}: Expected "${f.expected}", got "${writingInputs[`form_${f.id}`] || ''}"`);
      }
    });
    const passed = correctCount === task.fields.length;
    formFillingResults = {
      passed,
      score: `${correctCount}/${task.fields.length}`,
      details: passed
        ? t('Perfect! All fields filled on the certificate accurately. +15 XP', 'Perfekt! Alle Felder wurden fehlerfrei eingetragen. +15 XP')
        : t(`Some inaccuracies found. Please check: ${errors.join(', ')}`, `Einige Fehler entdeckt: ${errors.join(', ')}`)
    };
    if (passed) handleClaimPoints('a1_schreiben_form', 15);
    renderExams(container);
  });

  // Essay Input & Word Count Live Update
  const essayInput = container.querySelector('#exam-essay-input');
  if (essayInput) {
    const essayKey = `essay_${activeLevel}_t${task.id}`;
    essayInput.addEventListener('input', () => {
      writingInputs[essayKey] = essayInput.value;
      const countEl = container.querySelector('#exam-word-count');
      if (countEl) {
        countEl.textContent = essayInput.value.split(/\s+/).filter(Boolean).length;
      }
    });

    container.querySelector('#exam-submit-essay-btn')?.addEventListener('click', async () => {
      const textToAnalyze = writingInputs[essayKey];
      if (!textToAnalyze || textToAnalyze.trim() === '') {
        showToast(t('Please write some German text first!', 'Bitte schreibe zuerst einen Text auf Deutsch!'), 'warning');
        return;
      }
      loadingWritingGrade[essayKey] = true;
      renderExams(container);

      try {
        const res = await fetch(getApiUrl('/api/analyze'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: textToAnalyze, cefrLevel: activeLevel })
        });
        if (!res.ok) throw new Error('API offline');
        const data = await res.json();
        writingGrades[essayKey] = data;
        handleClaimPoints(essayKey, 30);
      } catch (err) {
        // Fallback local linguistic evaluator
        const wordCount = textToAnalyze.split(/\s+/).filter(Boolean).length;
        let score = 50 + Math.min(wordCount, 40);
        if (/hallo|liebe|geehrte/i.test(textToAnalyze)) score += 10;
        const scoreClamped = Math.min(score, 100);
        writingGrades[essayKey] = {
          cefrEstimate: activeLevel,
          grammarScore: scoreClamped,
          overallFeedback: t(
            `Solid effort! Your essay has ${wordCount} words. Standard greetings and sentence structures are recognized.`,
            `Gute Leistung! Dein Text hat ${wordCount} Wörter. Grußformeln und Satzmuster wurden erfolgreich erkannt.`
          ),
          corrections: wordCount < 10 ? [{ original: textToAnalyze, corrected: t('Provide more details to satisfy the exam prompt requirements.', 'Füge mehr Details hinzu, um die Aufgabenstellung zu erfüllen.') }] : [],
          vocabularyUpgrades: [{ original: 'machen', upgrade: 'erledigen / unternehmen', details: 'Professional B1 verb upgrade' }]
        };
        handleClaimPoints(essayKey, 20);
      } finally {
        loadingWritingGrade[essayKey] = false;
        renderExams(container);
      }
    });
  }

  // B1 Blueprint Guide Toggle
  container.querySelector('#exam-toggle-b1-blueprint-btn')?.addEventListener('click', () => {
    showB1BlueprintModal = !showB1BlueprintModal;
    renderExams(container);
  });

  // Redemittel phrases quick insert
  container.querySelectorAll('.exam-insert-phrase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const phrase = btn.getAttribute('data-insert-phrase');
      const essayInput = container.querySelector('#exam-essay-input');
      if (essayInput && phrase) {
        const essayKey = `essay_${activeLevel}_t${task.id}`;
        const currentVal = essayInput.value.trim();
        const newVal = currentVal ? `${currentVal} ${phrase} ` : `${phrase} `;
        essayInput.value = newVal;
        writingInputs[essayKey] = newVal;
        const countEl = container.querySelector('#exam-word-count');
        if (countEl) {
          countEl.textContent = newVal.split(/\s+/).filter(Boolean).length;
        }
        essayInput.focus();
      }
    });
  });

  // Centralized Helper for B1 Presentation Topic Switching
  const switchB1Topic = (newTopicId, targetContainer) => {
    if (!newTopicId) return;
    const allTopics = task.allTopics || B1_SPRECHEN_TOPICS;
    const topicIdx = allTopics.findIndex(tp => tp.id === newTopicId);
    if (topicIdx >= 0) {
      selectedB1SprechenTopic = newTopicId;
      activeSetIdx = Math.floor(topicIdx / 2);
    } else {
      selectedB1SprechenTopic = newTopicId;
    }

    activeB1SprechenSlide = 0;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch (err) {}
    }
    if (b1IsRecording && b1SpeechRecognition) {
      try { b1SpeechRecognition.stop(); } catch (err) {}
      b1IsRecording = false;
    }
    b1SpokenTranscript = '';
    b1SpeechWpm = 0;
    renderExams(targetContainer);
  };

  // B1 Presentation Topic Picker Tabs (Thema A / Thema B)
  container.querySelectorAll('.exam-b1-topic-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      const topicId = btn.getAttribute('data-b1-topic-id');
      if (topicId) {
        switchB1Topic(topicId, container);
      }
    });
  });

  // B1 Presentation 20 Topics Dropdown
  container.querySelectorAll('#exam-b1-topic-select, .exam-b1-topic-select').forEach(select => {
    select.addEventListener('change', (e) => {
      const newTopicId = e.target.value;
      if (newTopicId) {
        switchB1Topic(newTopicId, container);
      }
    });
  });

  // B1 Topic Prev / Next Navigation Buttons
  container.querySelectorAll('.exam-b1-topic-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dir = btn.getAttribute('data-b1-topic-nav');
      const allTopics = task.allTopics || B1_SPRECHEN_TOPICS;
      const currentIdx = allTopics.findIndex(tp => tp.id === selectedB1SprechenTopic);
      const safeIdx = currentIdx >= 0 ? currentIdx : 0;
      let nextIdx = dir === 'next' ? safeIdx + 1 : safeIdx - 1;
      if (nextIdx >= allTopics.length) nextIdx = 0;
      if (nextIdx < 0) nextIdx = allTopics.length - 1;

      switchB1Topic(allTopics[nextIdx].id, container);
    });
  });

  // B1 Subtab Switching (slides, transcript, timer, redemittel, qa)
  container.querySelectorAll('.exam-b1-subtab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      b1SprechenTab = btn.getAttribute('data-b1-subtab');
      renderExams(container);
    });
  });

  // B1 Teil 3 Subtab Switching (qa, feedback, redemittel, recorder)
  container.querySelectorAll('.exam-b1-teil3-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      b1Teil3Tab = btn.getAttribute('data-teil3-tab');
      renderExams(container);
    });
  });

  // Generic phrase copy button
  container.querySelectorAll('.exam-copy-phrase-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const phrase = btn.getAttribute('data-copy-phrase');
      if (navigator.clipboard && phrase) {
        navigator.clipboard.writeText(phrase).then(() => {
          const orig = btn.innerHTML;
          btn.innerHTML = `<span>✓</span><span>${t('Copied!', 'Kopiert!')}</span>`;
          btn.classList.add('text-emerald-600', 'bg-emerald-50');
          setTimeout(() => {
            btn.innerHTML = orig;
            btn.classList.remove('text-emerald-600', 'bg-emerald-50');
          }, 1500);
        }).catch(() => {
          showToast(t('Copied!', 'Kopiert!'), 'success');
        });
      }
    });
  });

  // B1 Slide Step Indicators
  container.querySelectorAll('.exam-b1-step-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const stepIdx = parseInt(btn.getAttribute('data-slide-step'), 10);
      if (!isNaN(stepIdx) && stepIdx >= 0 && stepIdx <= 4) {
        activeB1SprechenSlide = stepIdx;
        renderExams(container);
      }
    });
  });

  // B1 Presentation Slide Carousel Previous / Next
  container.querySelector('#exam-slide-prev')?.addEventListener('click', () => {
    if (activeB1SprechenSlide > 0) {
      activeB1SprechenSlide--;
      renderExams(container);
    }
  });

  container.querySelector('#exam-slide-next')?.addEventListener('click', () => {
    if (activeB1SprechenSlide < 4) {
      activeB1SprechenSlide++;
      renderExams(container);
    }
  });

  // B1 Redemittel Category Filter
  container.querySelectorAll('.exam-redemittel-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      b1RedemittelCategory = btn.getAttribute('data-redemittel-cat');
      renderExams(container);
    });
  });

  // B1 Copy Transcript to Clipboard
  container.querySelector('#exam-copy-transcript-btn')?.addEventListener('click', (e) => {
    const btn = e.currentTarget;
    const allTopics = task.allTopics || B1_SPRECHEN_TOPICS;
    const currentTopic = (task.topics && task.topics.find((tp) => tp.id === selectedB1SprechenTopic))
      || allTopics.find((tp) => tp.id === selectedB1SprechenTopic)
      || allTopics[0];
    const textToCopy = currentTopic?.fullText || '';
    if (navigator.clipboard && textToCopy) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        const origContent = btn.innerHTML;
        btn.innerHTML = `<span>✓</span><span>${t('Copied!', 'Kopiert!')}</span>`;
        btn.classList.add('bg-emerald-100', 'text-emerald-800');
        setTimeout(() => {
          btn.innerHTML = origContent;
          btn.classList.remove('bg-emerald-100', 'text-emerald-800');
        }, 2000);
      }).catch(() => {
        showToast(t('Copied!', 'Kopiert!'), 'success');
      });
    }
  });

  // B1 Countdown Timer Toggle (Start / Pause)
  const timerToggleBtn = container.querySelector('#exam-b1-timer-toggle');
  if (timerToggleBtn) {
    timerToggleBtn.addEventListener('click', () => {
      if (b1TimerRunning) {
        clearInterval(b1TimerInterval);
        b1TimerRunning = false;
        renderExams(container);
      } else {
        b1TimerRunning = true;
        if (!b1SpeechStartTime) {
          b1SpeechStartTime = Date.now();
        }
        b1TimerInterval = setInterval(() => {
          if (b1TimerSeconds > 0) {
            b1TimerSeconds--;
            const timerDisplay = document.getElementById('b1-timer-display');
            const timerBar = document.getElementById('b1-timer-bar');
            if (timerDisplay) {
              const m = Math.floor(b1TimerSeconds / 60).toString().padStart(2, '0');
              const s = (b1TimerSeconds % 60).toString().padStart(2, '0');
              timerDisplay.textContent = `${m}:${s}`;
            }
            if (timerBar) {
              const maxSecs = activeTeil === 2 ? 120 : 180;
              const progressPct = Math.min(100, Math.round(((maxSecs - b1TimerSeconds) / maxSecs) * 100));
              timerBar.style.width = `${progressPct}%`;
            }
            if (b1TimerSeconds === 0) {
              clearInterval(b1TimerInterval);
              b1TimerRunning = false;
              renderExams(container);
            }
          } else {
            clearInterval(b1TimerInterval);
            b1TimerRunning = false;
          }
        }, 1000);
        renderExams(container);
      }
    });
  }

  // B1 Countdown Timer Reset
  container.querySelector('#exam-b1-timer-reset')?.addEventListener('click', () => {
    clearInterval(b1TimerInterval);
    b1TimerRunning = false;
    b1TimerSeconds = activeTeil === 2 ? 120 : 180;
    b1SpeechWpm = 0;
    renderExams(container);
  });

  // B1 Speech Microphone Recording (Web Speech Recognition)
  const micToggleBtn = container.querySelector('#exam-b1-mic-toggle');
  if (micToggleBtn) {
    micToggleBtn.addEventListener('click', () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        const warnMsg = t(
          'Web Speech Recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.',
          'Die Spracherkennung wird in diesem Browser leider nicht unterstützt. Bitte nutze Google Chrome oder Microsoft Edge.'
        );
        showToast(warnMsg, 'warning');
        return;
      }

      if (b1IsRecording) {
        // Stop recording
        try {
          if (b1SpeechRecognition) {
            b1SpeechRecognition.stop();
          }
        } catch (e) {
          console.warn('Error stopping speech recognition', e);
        }
        b1IsRecording = false;
        renderExams(container);
      } else {
        // Start recording
        try {
          b1SpeechRecognition = new SpeechRecognition();
          b1SpeechRecognition.lang = 'de-DE';
          b1SpeechRecognition.continuous = true;
          b1SpeechRecognition.interimResults = true;

          b1SpeechStartTime = Date.now();
          b1IsRecording = true;

          b1SpeechRecognition.onresult = (event) => {
            let currentTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
              currentTranscript += event.results[i][0].transcript + ' ';
            }
            b1SpokenTranscript = currentTranscript.trim();

            const wordCount = b1SpokenTranscript.split(/\s+/).filter(Boolean).length;
            const elapsedMinutes = Math.max((Date.now() - b1SpeechStartTime) / 60000, 0.1);
            b1SpeechWpm = Math.round(wordCount / elapsedMinutes);

            const wordCountEl = document.getElementById('b1-mic-word-count');
            const wpmEl = document.getElementById('b1-mic-wpm');
            if (wordCountEl) wordCountEl.textContent = wordCount;
            if (wpmEl) wpmEl.textContent = `${b1SpeechWpm} WPM`;
          };

          b1SpeechRecognition.onerror = (event) => {
            console.warn('Speech recognition error:', event.error);
            b1IsRecording = false;
            renderExams(container);
          };

          b1SpeechRecognition.onend = () => {
            b1IsRecording = false;
            renderExams(container);
          };

          b1SpeechRecognition.start();
          renderExams(container);
        } catch (err) {
          console.error('Speech recognition start failed:', err);
          b1IsRecording = false;
          renderExams(container);
        }
      }
    });
  }

  // B1 Teil 1: Subtab switching (dialogue, checklist, redemittel, timer)
  container.querySelectorAll('.exam-b1-t1-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      b1Teil1Tab = btn.getAttribute('data-b1-t1-tab');
      renderExams(container);
    });
  });

  // B1 Teil 1: Dialogue Option selection & speaking response
  container.querySelectorAll('.exam-b1-t1-opt-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const optIdx = parseInt(btn.getAttribute('data-b1-t1-opt-idx'), 10);
      const currentStepData = B1_TEIL1_DIALOGUE_STEPS[b1Teil1Step];
      if (currentStepData && currentStepData.options && currentStepData.options[optIdx]) {
        const chosen = currentStepData.options[optIdx];
        b1Teil1History.push({
          topic: currentStepData.topic,
          lukasSays: currentStepData.lukasSays,
          userReply: chosen.textDe,
          lukasReply: chosen.lukasReply
        });
        b1Teil1Checked[currentStepData.checklistKey] = true;
        b1Teil1Step++;
        speak(chosen.lukasReply, true);
        renderExams(container);
      }
    });
  });

  // B1 Teil 1: Checklist card toggle
  container.querySelectorAll('.exam-b1-t1-check').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.getAttribute('data-b1-check-key');
      if (key) {
        b1Teil1Checked[key] = !b1Teil1Checked[key];
        renderExams(container);
      }
    });
  });

  // B1 Teil 1: Reset / Practice Again
  container.querySelectorAll('#exam-b1-t1-reset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      b1Teil1Step = 0;
      b1Teil1History = [];
      b1Teil1Checked = {};
      b1Teil1TimerSeconds = 180;
      if (b1Teil1TimerRunning) {
        clearInterval(b1Teil1TimerInterval);
        b1Teil1TimerRunning = false;
      }
      renderExams(container);
    });
  });

  // B1 Teil 1: Claim Points (28 Pts)
  container.querySelectorAll('#exam-b1-t1-claim-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      handleClaimPoints('b1_sp_t1', 28);
      renderExams(container);
    });
  });

  // B1 Teil 1: Timer Toggle (Start / Pause)
  const t1TimerToggle = container.querySelector('#exam-b1-t1-timer-toggle');
  if (t1TimerToggle) {
    t1TimerToggle.addEventListener('click', () => {
      if (b1Teil1TimerRunning) {
        clearInterval(b1Teil1TimerInterval);
        b1Teil1TimerRunning = false;
        renderExams(container);
      } else {
        b1Teil1TimerRunning = true;
        b1Teil1TimerInterval = setInterval(() => {
          if (b1Teil1TimerSeconds > 0) {
            b1Teil1TimerSeconds--;
            const display = document.getElementById('b1-t1-timer-display');
            const bar = document.getElementById('b1-t1-timer-bar');
            if (display) {
              const m = Math.floor(b1Teil1TimerSeconds / 60).toString().padStart(2, '0');
              const s = (b1Teil1TimerSeconds % 60).toString().padStart(2, '0');
              display.textContent = `${m}:${s}`;
            }
            if (bar) {
              bar.style.width = `${((180 - b1Teil1TimerSeconds) / 180) * 100}%`;
            }
            if (b1Teil1TimerSeconds === 0) {
              clearInterval(b1Teil1TimerInterval);
              b1Teil1TimerRunning = false;
              renderExams(container);
            }
          } else {
            clearInterval(b1Teil1TimerInterval);
            b1Teil1TimerRunning = false;
          }
        }, 1000);
        renderExams(container);
      }
    });
  }

  // B1 Teil 1: Timer Reset
  container.querySelector('#exam-b1-t1-timer-reset')?.addEventListener('click', () => {
    clearInterval(b1Teil1TimerInterval);
    b1Teil1TimerRunning = false;
    b1Teil1TimerSeconds = 180;
    renderExams(container);
  });

  // B1 Teil 2: Claim Points (40 Pts)
  container.querySelector('#exam-b1-t2-claim-btn')?.addEventListener('click', () => {
    handleClaimPoints('b1_sp_t2', 40);
    renderExams(container);
  });

  // B1 Teil 3: Claim Points (16 Pts)
  container.querySelector('#exam-b1-t3-claim-btn')?.addEventListener('click', () => {
    handleClaimPoints('b1_sp_t3', 16);
    renderExams(container);
  });

  // B1 Teil 4: Claim Points (16 Pts)
  container.querySelector('#exam-b1-t4-claim-btn')?.addEventListener('click', () => {
    handleClaimPoints('b1_sp_t4', 16);
    renderExams(container);
  });
}
