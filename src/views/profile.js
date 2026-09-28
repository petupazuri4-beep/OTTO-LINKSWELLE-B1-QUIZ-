import { state, t, getB1ExamMetrics, resetB1Progress, simulateFullB1Progress, setTab } from '../state.js';
import { startWeakWordsTraining } from './quiz.js';
import { setExamLevelAndModule } from './exams.js';

let friends = [
  { name: 'Sarah M.', avatar: '👩‍💼', score: 2450, streak: 12 },
  { name: 'Lukas B.', avatar: '👨‍🎓', score: 1980, streak: 8 },
  { name: 'Elena K.', avatar: '👩‍🔬', score: 1420, streak: 5 }
];

let expandedModules = {};

export function renderProfile(container) {
  const highscoresList = Object.values(state.highscores).sort((a, b) => b.pct - a.pct);
  const missedCount = Object.keys(state.missedWords).length;
  const bestScore = highscoresList.length > 0 ? highscoresList[0].pct : 0;
  const testsTaken = highscoresList.length;

  // Global B1 Exam Metrics
  const b1Metrics = getB1ExamMetrics();
  const radius = 54;
  const circumference = 2 * Math.PI * radius; // ~339.29
  const dashOffset = Math.max(0, circumference - (b1Metrics.overallCompletionPct / 100) * circumference);

  container.innerHTML = `
    <div class="mx-auto max-w-lg pb-28">
      <!-- Profile Header -->
      <div class="sticky top-0 z-10 bg-white px-4 py-4.5 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800 flex items-center justify-between">
        <h2 class="text-base font-black tracking-tight flex items-center gap-1.5 leading-none text-slate-900 dark:text-white">
          <span>👤</span> ${t('Learner Profile', 'Lernprofil')}
        </h2>
        <button id="open-settings-modal-btn" class="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition cursor-pointer">
          ⚙️ ${t('Settings', 'Optionen')}
        </button>
      </div>

      <div class="p-4 space-y-4">
        <!-- Student ID Card -->
        <div class="rounded-3xl bg-white dark:bg-slate-900 p-6 text-slate-900 dark:text-white shadow-xs border border-gray-200 dark:border-slate-800 relative overflow-hidden">
          <div class="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-violet-600/5 blur-2xl pointer-events-none"></div>
          
          <div class="flex items-center justify-between">
            <span class="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
              ${t('GOETHE B1 INSTITUT CARD', 'LINKSWELLE AUSWEIS')}
            </span>
            <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-400/30 text-[9px] font-black uppercase">
              ${state.settings.cefrLevel || 'B1'}
            </span>
          </div>

          <div class="mt-4 flex items-center gap-4">
            <div class="h-16 w-16 rounded-2xl bg-gray-100 dark:bg-white/10 border-2 border-gray-200 dark:border-white/20 flex items-center justify-center text-3xl overflow-hidden shrink-0 shadow-inner">
              ${state.settings.photoUrl ? `<img src="${state.settings.photoUrl}" class="h-full w-full object-cover" />` : state.settings.avatar}
            </div>
            <div>
              <h3 class="text-lg font-black tracking-tight text-slate-900 dark:text-white">${state.settings.userName}</h3>
              <div class="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">ID: LW-B1-${Math.abs(state.settings.userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 1000))}</div>
              <div class="flex gap-2 mt-2">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-400/20 dark:text-amber-300 dark:border-amber-400/30">
                  🔥 ${state.streak.count} ${t('Day Streak', 'Tage Streak')}
                </span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 grid grid-cols-3 gap-2 text-center">
            <div>
              <div class="text-xl font-black text-slate-900 dark:text-white">${bestScore}%</div>
              <div class="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-0.5">${t('Best Score', 'Höchstwert')}</div>
            </div>
            <div>
              <div class="text-xl font-black text-slate-900 dark:text-white">${testsTaken}</div>
              <div class="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-0.5">${t('Tests Taken', 'Tests absolviert')}</div>
            </div>
            <div>
              <div class="text-xl font-black text-slate-900 dark:text-white">${state.bookmarks.length}</div>
              <div class="text-[9px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-0.5">${t('Saved Words', 'Gemerkt')}</div>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- GLOBAL B1 EXAM MODULE PROGRESS TRACKING DASHBOARD               -->
        <!-- ============================================================== -->
        <div class="rounded-3xl bg-white dark:bg-slate-900 p-5 sm:p-6 text-slate-900 dark:text-white shadow-xs border border-gray-200 dark:border-slate-800 text-left relative overflow-hidden space-y-5">
          <!-- Background Glow Accent -->
          <div class="absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>

          <!-- Section Header -->
          <div class="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-400/20 dark:text-amber-300 border border-amber-300/60 dark:border-amber-400/30">
                  ${t('CEFR B1 Goethe Institute Standard', 'Goethe-Zertifikat B1 Prüfungsstandard')}
                </span>
                <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-400/20 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-400/30">
                  Target: ≥ 60%
                </span>
              </div>
              <h3 class="text-lg font-black tracking-tight text-slate-900 dark:text-white mt-1.5 flex items-center gap-2">
                <span>🎓</span> ${t('Global B1 Exam Progress Hub', 'Globales B1 Prüfungs-Dashboard')}
              </h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                ${t(
                  'Track your real completion rate across all 4 independent Goethe B1 exam modules. Candidates must achieve at least 60% in every module.',
                  'Visualisierung der Abschlussquote für alle 4 Goethe-B1-Module. Zum Bestehen sind mindestens 60% in jedem Modul erforderlich.'
                )}
              </p>
            </div>
          </div>

          <!-- Master Hero: Circular Chart + Overall Readiness -->
          <div class="p-4 sm:p-5 rounded-2xl bg-linear-to-br from-slate-50 via-white to-amber-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 border border-gray-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            <!-- Circular Progress Chart -->
            <div class="relative shrink-0 flex items-center justify-center">
              <svg class="w-36 h-36 -rotate-90 transform" viewBox="0 0 130 130">
                <defs>
                  <linearGradient id="b1-circle-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stop-color="#f59e0b" />
                    <stop offset="60%" stop-color="#10b981" />
                    <stop offset="100%" stop-color="#0284c7" />
                  </linearGradient>
                </defs>
                <!-- Background Circle Track -->
                <circle
                  cx="65"
                  cy="65"
                  r="${radius}"
                  fill="transparent"
                  stroke="currentColor"
                  stroke-width="11"
                  class="text-gray-150 dark:text-slate-800"
                />
                <!-- Foreground Animated Progress Arc -->
                <circle
                  cx="65"
                  cy="65"
                  r="${radius}"
                  fill="transparent"
                  stroke="url(#b1-circle-grad)"
                  stroke-width="11"
                  stroke-linecap="round"
                  stroke-dasharray="${circumference}"
                  stroke-dashoffset="${dashOffset}"
                  class="transition-all duration-700 ease-out"
                />
              </svg>

              <!-- Central Circular Readout -->
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center select-none pointer-events-none">
                <span class="text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-none">
                  ${b1Metrics.overallCompletionPct}%
                </span>
                <span class="text-[9.5px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-wider mt-0.5">
                  ${t('B1 Overall', 'B1 Gesamt')}
                </span>
                <span class="text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 bg-amber-100 text-amber-900 dark:bg-amber-400/20 dark:text-amber-300">
                  ${b1Metrics.modulesPassedCount}/4 ${t('Passed', 'Bestanden')}
                </span>
              </div>
            </div>

            <!-- Readiness Status & Quick KPI Summary -->
            <div class="flex-1 w-full space-y-3 text-left">
              <!-- Readiness Banner -->
              <div class="p-3 rounded-xl ${
                b1Metrics.isB1CertifiedReady
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800'
                  : b1Metrics.readinessLevel === 'on_track'
                  ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800'
                  : 'bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700'
              }">
                <div class="flex items-center justify-between">
                  <div class="text-xs font-black uppercase tracking-wide ${
                    b1Metrics.isB1CertifiedReady
                      ? 'text-emerald-900 dark:text-emerald-300'
                      : b1Metrics.readinessLevel === 'on_track'
                      ? 'text-amber-900 dark:text-amber-300'
                      : 'text-slate-800 dark:text-slate-200'
                  }">
                    ${
                      b1Metrics.isB1CertifiedReady
                        ? `🏆 ${t('Goethe B1 Certified Ready!', 'Prüfungsbereit für B1!')}`
                        : b1Metrics.readinessLevel === 'on_track'
                        ? `⚡ ${t('On Track for B1 Certification', 'Auf Zielkurs für B1')}`
                        : `📚 ${t('B1 Preparation Phase', 'Vorbereitungsphase B1')}`
                    }
                  </div>
                  <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    ${b1Metrics.modulesPassedCount} / 4 ${t('Modules ≥60%', 'Module ≥60%')}
                  </span>
                </div>
                <p class="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">
                  ${
                    b1Metrics.isB1CertifiedReady
                      ? t(
                          'Outstanding! All 4 modules exceed the Goethe-Institut 60% requirement. You are primed for the official exam.',
                          'Hervorragend! Alle 4 Module erfüllen die Goethe-Vorgabe von mindestens 60%. Du bist bereit für die Prüfung.'
                        )
                      : b1Metrics.readinessLevel === 'on_track'
                      ? t(
                          `${b1Metrics.modulesPassedCount} of 4 modules meet the passing score. Complete practice for remaining modules to achieve full readiness.`,
                          `${b1Metrics.modulesPassedCount} von 4 Modulen sind bestanden. Schließe die restlichen Module ab, um die volle Prüfungsreife zu erlangen.`
                        )
                      : t(
                          'Practice each module regularly. Goethe requires ≥18/30 in Reading/Listening and ≥60/100 in Writing/Speaking.',
                          'Übe regelmäßig alle 4 Module. Goethe verlangt ≥18/30 in Lesen/Hören und ≥60/100 in Schreiben/Sprechen.'
                        )
                  }
                </p>
              </div>

              <!-- Quick Stats Grid -->
              <div class="grid grid-cols-3 gap-2 text-center pt-1">
                <div class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800">
                  <div class="text-sm font-black text-slate-900 dark:text-white">${b1Metrics.overallAverageScore}%</div>
                  <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">${t('Avg Score', 'Ø Punktzahl')}</div>
                </div>
                <div class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800">
                  <div class="text-sm font-black text-slate-900 dark:text-white">60%</div>
                  <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">${t('Goethe Bar', 'Bestehensgrenze')}</div>
                </div>
                <div class="p-2 rounded-xl bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800">
                  <div class="text-sm font-black text-emerald-600 dark:text-emerald-400">${b1Metrics.modulesPassedCount}/4</div>
                  <div class="text-[9px] uppercase tracking-wider text-slate-400 font-bold mt-0.5">${t('Pass Rate', 'Erfolgsquote')}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Module Progress Cards (Sprechen, Hören, Schreiben, Lesen) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                📊 ${t('4 B1 EXAMINATION MODULES', 'DIE 4 B1 PRÜFUNGSMODULE')}
              </h4>
              <span class="text-[10px] text-slate-400 font-bold">
                ${t('Interactive Completion Rates', 'Interaktiver Modulfortschritt')}
              </span>
            </div>

            <div class="grid grid-cols-1 gap-3">
              ${b1Metrics.modules.map((mod) => {
                const isExpanded = Boolean(expandedModules[mod.id]);
                const miniRadius = 14;
                const miniCircumference = 2 * Math.PI * miniRadius; // ~87.96
                const miniDashOffset = Math.max(0, miniCircumference - (mod.completionPct / 100) * miniCircumference);

                return `
                  <div class="rounded-2xl border ${mod.border} bg-white dark:bg-slate-950 p-4 shadow-xs transition hover:shadow-sm">
                    <!-- Top Row: Icon, Title, Mini Circular Gauge & Status Pill -->
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-3">
                        <!-- Mini Circular Progress Gauge -->
                        <div class="relative w-10 h-10 shrink-0 flex items-center justify-center">
                          <svg class="w-10 h-10 -rotate-90 transform" viewBox="0 0 36 36">
                            <circle
                              cx="18"
                              cy="18"
                              r="${miniRadius}"
                              fill="transparent"
                              stroke="currentColor"
                              stroke-width="3.5"
                              class="text-gray-150 dark:text-slate-800"
                            />
                            <circle
                              cx="18"
                              cy="18"
                              r="${miniRadius}"
                              fill="transparent"
                              stroke="${mod.color}"
                              stroke-width="3.5"
                              stroke-linecap="round"
                              stroke-dasharray="${miniCircumference}"
                              stroke-dashoffset="${miniDashOffset}"
                              class="transition-all duration-500 ease-out"
                            />
                          </svg>
                          <span class="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-800 dark:text-slate-200">
                            ${mod.completionPct}%
                          </span>
                        </div>

                        <div>
                          <div class="flex items-center gap-1.5">
                            <span class="text-base">${mod.icon}</span>
                            <span class="text-sm font-black text-slate-900 dark:text-white">
                              ${t(mod.nameEn, mod.name)}
                            </span>
                            <span class="text-[10px] text-slate-400 font-bold uppercase">
                              (${mod.name})
                            </span>
                          </div>
                          <div class="text-[10.5px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                            ${mod.officialTime} • ${mod.officialMarks} • ${mod.completedCount}/${mod.totalTeile} ${t('parts complete', 'Teile erledigt')}
                          </div>
                        </div>
                      </div>

                      <!-- Status Badge -->
                      <div>
                        ${
                          mod.isPassed
                            ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                                <span>✓</span> ${t('Passed', 'Bestanden')} (${mod.scorePct}%)
                              </span>`
                            : mod.completionPct > 0
                            ? `<span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-300 dark:border-amber-800 flex items-center gap-1">
                                <span>⏳</span> ${t('In Progress', 'In Arbeit')} (${mod.scorePct}%)
                              </span>`
                            : `<span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                ⚪ ${t('Not Started', 'Nicht begonnen')}
                              </span>`
                        }
                      </div>
                    </div>

                    <!-- Progress Bar with Goethe 60% Marker -->
                    <div class="mt-3.5 space-y-1">
                      <div class="flex justify-between text-[10.5px] font-bold text-slate-500 dark:text-slate-400">
                        <span>${t('Completion Rate', 'Abschlussquote')}: <strong class="text-slate-900 dark:text-white">${mod.completionPct}%</strong></span>
                        <span>${t('Accuracy', 'Genauigkeit')}: <strong class="text-slate-900 dark:text-white">${mod.scorePct}%</strong></span>
                      </div>
                      
                      <div class="relative h-3 w-full rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden">
                        <!-- Progress Fill -->
                        <div
                          class="h-full rounded-full bg-linear-to-r ${mod.barColor} transition-all duration-500 ease-out"
                          style="width: ${mod.completionPct}%"
                        ></div>
                        <!-- 60% Goethe Threshold Indicator Line -->
                        <div
                          class="absolute top-0 bottom-0 w-0.5 bg-slate-400 dark:bg-slate-500 z-10 pointer-events-none"
                          style="left: 60%"
                          title="Goethe 60% Passing Mark"
                        ></div>
                      </div>

                      <div class="relative flex justify-between text-[9px] text-slate-400 font-mono pt-0.5">
                        <span>0%</span>
                        <span class="font-bold text-amber-700 dark:text-amber-400" style="margin-left: 20px;">
                          ▲ 60% ${t('Goethe Pass Threshold', 'Bestehensgrenze')}
                        </span>
                        <span>100%</span>
                      </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-3 pt-3 border-t border-gray-100 dark:border-slate-800/80 flex items-center justify-between gap-2 flex-wrap">
                      <button
                        data-mod="${mod.id}"
                        class="b1-toggle-details-btn text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 cursor-pointer transition"
                      >
                        <span>${isExpanded ? '▼' : '▶'}</span>
                        ${isExpanded ? t('Hide Blueprint', 'Aufbau verbergen') : t('View Official Teile', 'Prüfungsteile ansehen')}
                      </button>

                      <button
                        data-mod="${mod.id}"
                        class="b1-launch-mod-btn px-3 py-1.5 rounded-xl bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 text-xs font-black hover:opacity-90 active:scale-95 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <span>${mod.icon}</span>
                        ${t(`Practice ${mod.nameEn}`, `${mod.name} üben`)} ➔
                      </button>
                    </div>

                    <!-- Collapsible Blueprint Accordion -->
                    ${
                      isExpanded
                        ? `
                          <div class="mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-slate-800 space-y-2">
                            <div class="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                              ${t('OFFICIAL GOETHE BLUEPRINT SPECIFICATION', 'OFFIZIELLE GOETHE-TEILE AUFSTELLUNG')}
                            </div>
                            <div class="space-y-1.5">
                              ${mod.teileDesc.map((td) => {
                                const isDone = mod.completedTeile.includes(td.teil);
                                return `
                                  <div class="flex items-center justify-between p-2 rounded-xl text-xs ${
                                    isDone
                                      ? 'bg-emerald-50/70 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40'
                                      : 'bg-gray-50 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-gray-150/60 dark:border-slate-800'
                                  }">
                                    <div class="flex items-center gap-2">
                                      <span>${isDone ? '✅' : '⚪'}</span>
                                      <span class="font-bold text-slate-800 dark:text-slate-200">${td.title}</span>
                                    </div>
                                    <span class="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">
                                      ${td.pts}
                                    </span>
                                  </div>
                                `;
                              }).join('')}
                            </div>
                          </div>
                        `
                        : ''
                    }
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Bottom Dashboard Toolbar: Quick Simulator & Reset Controls -->
          <div class="pt-3 border-t border-gray-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div class="flex items-center gap-2">
              <button
                id="b1-simulate-full-btn"
                class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-800 text-[11px] font-black transition cursor-pointer"
                title="${t('Simulate 100% completion across all 4 modules', '100% Abschluss für alle 4 Module simulieren')}"
              >
                ⚡ ${t('Simulate 100% Pass', '100% Simulation')}
              </button>
              <button
                id="b1-reset-prog-btn"
                class="px-3 py-1.5 rounded-xl bg-gray-100 text-slate-600 hover:bg-gray-200 dark:bg-slate-800 dark:text-slate-400 text-[11px] font-bold transition cursor-pointer"
                title="${t('Reset all B1 progress back to 0%', 'B1-Fortschritt auf 0% zurücksetzen')}"
              >
                🔄 ${t('Reset Progress', 'Fortschritt zurücksetzen')}
              </button>
            </div>

            <button
              id="b1-open-exam-suite-btn"
              class="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            >
              <span>🎓</span> ${t('Open B1 Exam Suite', 'B1-Prüfungsportal öffnen')}
            </button>
          </div>
        </div>

        <!-- Weak Words Training Launcher -->
        ${missedCount > 0 ? `
          <div class="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 dark:bg-rose-950/20 dark:border-rose-900/30 flex items-center justify-between text-left">
            <div>
              <h4 class="text-xs font-black text-rose-800 dark:text-rose-300 uppercase tracking-wide">
                🎯 ${t('WEAK WORDS TRAINER', 'SCHWÄCHEN-TRAINER')}
              </h4>
              <p class="text-xs text-rose-700 dark:text-rose-400 mt-0.5 font-medium">
                ${missedCount} ${t('vocabulary items need review.', 'Wörter wurden fehlerhaft beantwortet.')}
              </p>
            </div>
            <button id="start-weak-words-btn" class="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-black rounded-xl shadow cursor-pointer transition shrink-0">
              ${t('Practice Now', 'Jetzt üben')}
            </button>
          </div>
        ` : ''}

        <!-- Friends Leaderboard -->
        <div class="rounded-3xl border border-gray-150 bg-white p-5 shadow-xs dark:bg-slate-900 dark:border-slate-800 text-left space-y-3">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              🏆 ${t('FRIENDS LEAGUE', 'FREUNDES-LIGA')}
            </h4>
            <span class="text-[10px] text-gray-400 font-bold">Weekly Rank</span>
          </div>

          <div class="space-y-2">
            <!-- User Rank Row -->
            <div class="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/30">
              <div class="flex items-center gap-3">
                <span class="text-xs font-black text-emerald-700 dark:text-emerald-400">#1</span>
                <div class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-sm shadow-xs">
                  ${state.settings.photoUrl ? `<img src="${state.settings.photoUrl}" class="h-full w-full rounded-full object-cover" />` : state.settings.avatar}
                </div>
                <div>
                  <div class="text-xs font-black text-slate-900 dark:text-white">${state.settings.userName} (You)</div>
                  <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">🔥 ${state.streak.count} days</div>
                </div>
              </div>
              <div class="text-xs font-black text-emerald-700 dark:text-emerald-400">
                ${testsTaken * 120 + state.streak.count * 50} pts
              </div>
            </div>

            <!-- Friends Rows -->
            ${friends.map((f, i) => `
              <div class="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-150/60 dark:border-slate-800/80">
                <div class="flex items-center gap-3">
                  <span class="text-xs font-bold text-gray-400">#${i + 2}</span>
                  <div class="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-sm shadow-xs">
                    ${f.avatar}
                  </div>
                  <div>
                    <div class="text-xs font-bold text-slate-800 dark:text-slate-200">${f.name}</div>
                    <div class="text-[10px] text-gray-400">🔥 ${f.streak} days</div>
                  </div>
                </div>
                <div class="text-xs font-bold text-gray-600 dark:text-slate-400">
                  ${f.score} pts
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Add Friend Input -->
          <div class="pt-2 flex gap-2">
            <input
              id="new-friend-name-input"
              type="text"
              placeholder="${t('Add study partner name...', 'Lernpartner hinzufügen...')}"
              class="flex-1 p-2 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white focus:outline-none"
            />
            <button id="add-friend-btn" class="px-3 py-2 bg-slate-900 dark:bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer transition">
              + Add
            </button>
          </div>
        </div>

        <!-- High Scores List -->
        <div class="rounded-3xl border border-gray-150 bg-white p-5 shadow-xs dark:bg-slate-900 dark:border-slate-800 text-left space-y-3">
          <h4 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
            🏅 ${t('RECORDED HIGH SCORES', 'BESTENLISTE')}
          </h4>

          ${highscoresList.length > 0 ? `
            <div class="space-y-2">
              ${highscoresList.slice(0, 8).map((hs, i) => `
                <div class="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-950 border border-gray-150/60 dark:border-slate-800 text-xs">
                  <div class="flex items-center gap-2 min-w-0">
                    <span class="text-base">${i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : '🎖️'}</span>
                    <div class="truncate">
                      <div class="font-bold text-slate-900 dark:text-white truncate">${hs.topic}</div>
                      <div class="text-[10px] text-gray-400 capitalize">${hs.mode.replace('_level_', ' Level ')}</div>
                    </div>
                  </div>
                  <span class="font-black px-2.5 py-1 rounded-lg ${
                    hs.pct >= 70
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                  }">
                    ${hs.pct}%
                  </span>
                </div>
              `).join('')}
            </div>
          ` : `
            <div class="p-6 text-center text-xs text-gray-400 font-semibold">
              ${t('Complete quiz topics to record top exam scores here!', 'Schließe Quizze ab, um Rekorde hier zu verewigen!')}
            </div>
          `}
        </div>
      </div>
    </div>
  `;

  // Attach Listeners
  container.querySelector('#open-settings-modal-btn')?.addEventListener('click', () => {
    setTab('settings');
  });

  container.querySelector('#start-weak-words-btn')?.addEventListener('click', () => {
    startWeakWordsTraining();
  });

  // B1 Exam Module Launch Buttons
  container.querySelectorAll('.b1-launch-mod-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modId = btn.getAttribute('data-mod');
      setExamLevelAndModule('B1', modId, 0);
      setTab('exams');
    });
  });

  // B1 Exam Blueprint Toggle Buttons
  container.querySelectorAll('.b1-toggle-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const modId = btn.getAttribute('data-mod');
      expandedModules[modId] = !expandedModules[modId];
      renderProfile(container);
    });
  });

  // B1 Simulate Full Pass
  container.querySelector('#b1-simulate-full-btn')?.addEventListener('click', () => {
    simulateFullB1Progress();
    renderProfile(container);
  });

  // B1 Reset Progress
  container.querySelector('#b1-reset-prog-btn')?.addEventListener('click', () => {
    resetB1Progress();
    renderProfile(container);
  });

  // Open B1 Exam Suite
  container.querySelector('#b1-open-exam-suite-btn')?.addEventListener('click', () => {
    setExamLevelAndModule('B1', 'lesen', 0);
    setTab('exams');
  });

  const friendInput = container.querySelector('#new-friend-name-input');
  container.querySelector('#add-friend-btn')?.addEventListener('click', () => {
    if (!friendInput) return;
    const name = friendInput.value.trim();
    if (!name) return;
    const avatars = ['🧑‍💻', '👩‍🎓', '👨‍🏫', '👩‍⚕️', '🧑‍🎨'];
    friends.push({
      name,
      avatar: avatars[Math.floor(Math.random() * avatars.length)],
      score: Math.floor(Math.random() * 1000) + 500,
      streak: Math.floor(Math.random() * 7) + 1
    });
    renderProfile(container);
  });
}
