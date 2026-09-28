import { state, t } from '../state.js';
import { startWeakWordsTraining } from './quiz.js';
import { VOCAB } from '../data/vocab.js';

// Icons mapping for topics
const ICONS = {
  "Daily Life & Home": "🏡",
  "Work & Education": "💼",
  "People & Relationships": "👥",
  "Travel & Transportation": "✈️",
  "Communication": "📱",
  "Food & Dining": "🍳",
  "Health & Body": "🏥",
  "Money & Shopping": "💶",
  "Time & Schedule": "📅",
  "Environment & Nature": "🌲",
  "Leisure & Culture": "🎭",
  "Emotions & Opinions": "💭",
  "Technology & Media": "💻",
  "Society & Law": "⚖️",
  "Buildings & Places": "🏙️"
};

export function renderStats(container) {
  const topicsList = Object.keys(VOCAB);

  // Overall Statistics computation
  const getOverallProgressDetails = () => {
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
    return {
      pct: count > 0 ? Math.round(sum / count) : 0,
      quizzesDone: count,
    };
  };

  const stat = getOverallProgressDetails();

  // SM-2 Memory Matrix
  const srsEntries = Object.entries(state.srs || {});
  const now = Date.now();
  let srsDue = 0;
  let srsLearning = 0;
  let srsMature = 0;
  let totalEase = 0;
  let srsCount = 0;

  srsEntries.forEach(([key, rec]) => {
    if (rec && rec.lastReviewed) {
      srsCount++;
      totalEase += rec.ease || 2.5;
      if (rec.nextReview <= now) {
        srsDue++;
      }
      if ((rec.interval || 0) > 6) {
        srsMature++;
      } else {
        srsLearning++;
      }
    }
  });

  const avgEase = srsCount > 0 ? (totalEase / srsCount).toFixed(2) : '2.50';

  // Compute last 28 days list for studies heatmap
  const getHeatmapCells = () => {
    const list = [];
    const nowTime = new Date().setHours(0, 0, 0, 0);
    for (let i = 27; i >= 0; i--) {
      const targetDate = new Date(nowTime - i * 86400000);
      const str = targetDate.toISOString().slice(0, 10);
      const studyPoints = state.activity[str] || 0;
      list.push({ date: str, count: studyPoints });
    }
    return list;
  };

  const heatmapList = getHeatmapCells();
  
  const weakWordsList = Object.values(state.missedWords)
    .sort((a, b) => b.count - a.count);

  container.innerHTML = `
    <div class="mx-auto max-w-lg pb-28">
      <!-- Title Navbar -->
      <div class="sticky top-0 z-10 flex items-center justify-between bg-white px-4 py-4.5 text-slate-900 dark:bg-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800">
        <h2 class="text-base font-extrabold flex items-center gap-1.5 text-slate-900 dark:text-white">
          <span>📊</span> ${t('Study Progress', 'Lernstatistik')}
        </h2>
      </div>

      <div class="p-4 space-y-4">
        <!-- Overall circular card code -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 text-center dark:bg-slate-900 dark:border-slate-850/50 shadow-xs">
          <h3 class="text-xs font-black tracking-wider text-gray-400 dark:text-slate-500 uppercase">
            ${t('OVERALL PROGRESS RATE', 'GESAMTFORTSCHRITT')}
          </h3>
          <div class="mt-4 flex flex-col items-center justify-center">
            <div class="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-emerald-500">
              <span class="text-4xl font-black text-gray-800 dark:text-white">
                ${stat.pct}
                <span class="text-sm font-semibold text-gray-400">%</span>
              </span>
            </div>
            <div class="text-xs font-bold text-gray-500 mt-3 dark:text-slate-400">
              ${stat.quizzesDone} ${t('quizzes completed', 'Tests absolviert')}
            </div>
          </div>
        </div>

        <!-- SM-2 Spaced Repetition Retention Card -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 dark:bg-slate-900 dark:border-slate-850/50 shadow-xs text-left">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-xs font-black tracking-wider text-gray-400 dark:text-slate-500 uppercase flex items-center gap-1.5">
              <span>🧠</span> ${t('SM-2 Memory Retention', 'SM-2 Gedächtnis-Statistik')}
            </h3>
            <span class="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 px-2 py-0.5 rounded-full">
              SM-2 Leitner
            </span>
          </div>
          <div class="grid grid-cols-3 gap-2.5 text-center">
            <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
              <div class="text-xl font-black text-slate-800 dark:text-white">${srsCount}</div>
              <div class="text-[9px] font-bold text-slate-400 uppercase mt-0.5">${t('In Deck', 'Erfasst')}</div>
            </div>
            <div class="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40">
              <div class="text-xl font-black text-amber-600 dark:text-amber-400">${srsDue}</div>
              <div class="text-[9px] font-bold text-amber-700 dark:text-amber-300 uppercase mt-0.5">${t('Due Today', 'Heute fällig')}</div>
            </div>
            <div class="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40">
              <div class="text-xl font-black text-emerald-600 dark:text-emerald-400">${srsMature}</div>
              <div class="text-[9px] font-bold text-emerald-700 dark:text-emerald-300 uppercase mt-0.5">${t('Mature (7d+)', 'Fest im Kopf')}</div>
            </div>
          </div>
          <div class="mt-3 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span>${t('Average Easiness Factor (EF):', 'Durchschnittliche Leichtigkeit (EF):')}</span>
            <span class="font-mono font-bold text-indigo-600 dark:text-indigo-400">${avgEase} (2.50 base)</span>
          </div>
        </div>

        <!-- Charts and bars score card -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 dark:bg-slate-900 dark:border-slate-850/50 shadow-xs">
          <h3 class="text-xs font-black tracking-wider text-gray-400 dark:text-slate-500 uppercase mb-4 text-left">
            ${t('BEST SCORE PER TOPIC', 'BESTER TEST JE KATEGORIE')}
          </h3>
          <div class="space-y-3.5">
            ${topicsList.map((tp) => {
              const bestScore = Object.values(state.progress[tp] || {}).reduce((best, curr) => Math.max(best, curr?.pct || 0), 0);
              let barColor = 'bg-rose-500';
              if (bestScore >= 80) {
                barColor = 'bg-emerald-500';
              } else if (bestScore >= 50) {
                barColor = 'bg-amber-500';
              }
              return `
                <div class="flex items-center gap-3">
                  <span class="w-24 truncate text-right text-xs font-semibold text-gray-500 dark:text-slate-400">
                    ${ICONS[tp] || '📚'} ${tp}
                  </span>
                  <div class="h-4 flex-1 rounded-full bg-gray-100 dark:bg-slate-800 overflow-hidden relative">
                    <div
                      class="h-full rounded-full transition-all duration-500 ${barColor}"
                      style="width: ${bestScore}%"
                    ></div>
                  </div>
                  <span class="w-8 shrink-0 text-left text-xs font-extrabold text-gray-700 dark:text-slate-300">
                    ${bestScore}%
                  </span>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- GitHub Heatmap activity card -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 dark:bg-slate-900 dark:border-slate-850/50 shadow-xs text-left">
          <h3 class="text-xs font-black tracking-wider text-gray-400 dark:text-slate-500 uppercase mb-2">
            ${t('ACTIVITY LOG (Last 28 days)', 'AKTIVITÄTSMETER (Letzte 28 Tage)')}
          </h3>
          <p class="text-[10px] text-gray-400 mt-1 dark:text-slate-450 leading-relaxed mb-4 font-semibold">
            ${t('Visualizing your commitment. Greener cells mark sessions cleared.', 'Farbige Zellen stehen für absolvierte Übungssitzungen am jeweiligen Tag.')}
          </p>
          <div class="grid grid-cols-7 gap-2">
            ${heatmapList.map((cell) => {
              let colorCls = 'bg-gray-100 dark:bg-slate-850';
              if (cell.count > 0) {
                if (cell.count >= 8) colorCls = 'bg-emerald-600 dark:bg-emerald-500';
                else if (cell.count >= 4) colorCls = 'bg-emerald-450 dark:bg-emerald-650';
                else if (cell.count >= 2) colorCls = 'bg-emerald-300 dark:bg-emerald-800';
                else colorCls = 'bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300/10';
              }
              return `
                <div
                  title="${cell.date}: ${cell.count} points"
                  class="aspect-square rounded-md transition duration-150 ${colorCls}"
                ></div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Weak Words checklist helper -->
        <div class="rounded-2xl border border-gray-100 bg-white p-5 dark:bg-slate-900 dark:border-slate-850/50 shadow-xs">
          <div class="flex items-center justify-between border-b border-gray-50 pb-3 dark:border-slate-850">
            <h3 class="text-xs font-black tracking-wider text-gray-400 dark:text-slate-500 uppercase">
              ${t('WEAK WORDS TRACKER', 'SCHWACHE WÖRTER')}
            </h3>
            ${weakWordsList.length > 0 ? `
              <button
                id="train-weak-btn"
                class="rounded-lg bg-orange-600 hover:bg-orange-700 px-3 py-1.5 font-black text-[10px] tracking-wide text-white uppercase active:scale-95 transition cursor-pointer"
              >
                ${t('Train Weak', 'Lernen')}
              </button>
            ` : ''}
          </div>
          <div class="mt-4 space-y-2 text-left">
            ${weakWordsList.length > 0 ? 
              weakWordsList.slice(0, 5).map((w, index) => `
                <div class="flex items-center justify-between rounded-xl bg-gray-50 dark:bg-slate-850/50 p-3 border border-gray-100/50 dark:border-slate-800/50">
                  <div>
                    <div class="text-sm font-black text-slate-800 dark:text-white capitalize">${w.g}</div>
                    <div class="text-xs text-slate-400 dark:text-slate-400 capitalize">${w.e}</div>
                  </div>
                  <span class="rounded-md bg-rose-50 px-2 py-0.5 text-[10px] font-black text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border border-rose-250/25">
                    ${t('Missed', 'Fehler')}: ${index + 1}
                  </span>
                </div>
              `).join('')
            : `
              <div class="py-6 text-center text-xs text-gray-400 dark:text-slate-500 font-semibold">
                ${t('No weak words captured! Clear quizzes to detect mistakes.', 'Keine fehlerhaften Wörter erfasst! Vokabeltests abschließen für Detektion.')}
              </div>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  const trainBtn = container.querySelector('#train-weak-btn');
  if (trainBtn) {
    trainBtn.addEventListener('click', startWeakWordsTraining);
  }
}
