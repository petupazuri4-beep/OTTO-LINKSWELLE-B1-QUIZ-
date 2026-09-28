// Central Native Vanilla JavaScript State Store for Linkswelle B1 Quiz

export const THEMES = [
  {
    id: 'emerald',
    name: 'Goethe Klassik',
    nameDe: 'Goethe Klassik',
    emoji: '🌲',
    styleName: 'Academic Serif',
    styleNameDe: 'Klassische Antiqua',
    fontPairing: 'Playfair Display + Plus Jakarta',
    primary: '#059669',
    accent: '#10b981',
    bgLight: '#ecfdf5',
    border: '#a7f3d0',
    desc: 'Literary serif headings, rich forest emerald & sage surfaces',
    descDe: 'Literarische Serif-Überschriften & feine Smaragd- und Salbeitöne'
  },
  {
    id: 'sapphire',
    name: 'Nordic Sapphire',
    nameDe: 'Nordisch Saphir',
    emoji: '💎',
    styleName: 'Swiss Modern',
    styleNameDe: 'Schweizer Geometrie',
    fontPairing: 'Plus Jakarta + Inter',
    primary: '#2563eb',
    accent: '#3b82f6',
    bgLight: '#eff6ff',
    border: '#bfdbfe',
    desc: 'Ultra-clean Swiss geometric sans, royal oceanic blue & arctic ice',
    descDe: 'Präzise Schweizer Sans-Typografie, Königsblau & arktisches Eis'
  },
  {
    id: 'amber',
    name: 'Cyber Amber',
    nameDe: 'Cyber Bernstein',
    emoji: '⚡',
    styleName: 'Neo-Grotesk Tech',
    styleNameDe: 'Neo-Grotesk Tech',
    fontPairing: 'Space Grotesk + Outfit',
    primary: '#d97706',
    accent: '#f59e0b',
    bgLight: '#fffbeb',
    border: '#fde68a',
    desc: 'Punchy tech neo-grotesk type with radiant honey amber & gold',
    descDe: 'Markante Tech-Typografie mit leuchtendem Honiggold & Bernstein'
  },
  {
    id: 'crimson',
    name: 'Bauhaus Crimson',
    nameDe: 'Bauhaus Karmin',
    emoji: '🌹',
    styleName: 'Weimar Atelier',
    styleNameDe: 'Weimar Atelier',
    fontPairing: 'Outfit + Inter',
    primary: '#e11d48',
    accent: '#f43f5e',
    bgLight: '#fff1f2',
    border: '#fecdd3',
    desc: 'Dynamic geometric display, dramatic ruby crimson & rose accents',
    descDe: 'Kühne geometrische Ästhetik mit tiefem Rubinrot & Beerenblüte'
  },
  {
    id: 'amethyst',
    name: 'Vienna Amethyst',
    nameDe: 'Wiener Amethyst',
    emoji: '🌸',
    styleName: 'Imperial Velvet',
    styleNameDe: 'Kaiserliche Eleganz',
    fontPairing: 'Playfair Display + Outfit',
    primary: '#7c3aed',
    accent: '#8b5cf6',
    bgLight: '#f5f3ff',
    border: '#ddd6fe',
    desc: 'Habsburg coffeehouse elegance, royal violet & soft lavender mist',
    descDe: 'Wiener Kaffeehaus-Flair mit kaiserlichem Violett & Lavendel'
  }
];

export const state = {
  settings: {
    dark: false,
    theme: 'emerald', // 'emerald' | 'sapphire' | 'amber' | 'crimson' | 'amethyst'
    ttsOn: true,
    lang: 'en',
    fontSize: 'md',
    avatar: '🎓',
    userName: 'Learner',
    photoUrl: null,
    dailyGoal: 10,
    cefrLevel: 'B1',
    githubRepo: ''
  },
  progress: {},
  bookmarks: [],
  streak: { count: 0, lastDate: '' },
  activity: {},
  highscores: {},
  missedWords: {},
  srs: {}, // Spaced Repetition System stats by word.g
  
  moduleProgress: {
    exams: 0
  },
  b1ExamProgress: null,
  
  // Navigation & Screens
  tab: 'home', // 'home' | 'stats' | 'exams' | 'search' | 'saved' | 'profile'
  screen: 'home', // 'home' | 'topic' | 'quiz' | 'flashcard'
  selectedTopic: '',
  selectedModeForLevels: null,
  showSettings: false,
  
  // Active Quiz State
  activeQuizMode: 'meaning',
  activeFlashcardLevel: null,
  questions: [],
  currentQuestionIdx: 0,
  answers: [],
  isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true
};

// Listeners for reactive re-rendering
const listeners = [];

export function subscribe(listener) {
  listeners.push(listener);
  return () => {
    const idx = listeners.indexOf(listener);
    if (idx > -1) listeners.splice(idx, 1);
  };
}

export function notify() {
  listeners.forEach(fn => fn(state));
}

// Load from LocalStorage
export function loadState() {
  try {
    const darkVal = localStorage.getItem('lw_dark');
    if (darkVal) state.settings.dark = JSON.parse(darkVal);

    const themeVal = localStorage.getItem('lw_theme');
    if (themeVal) {
      const parsedTheme = JSON.parse(themeVal);
      state.settings.theme = THEMES.some(th => th.id === parsedTheme) ? parsedTheme : 'emerald';
    }

    const ttsVal = localStorage.getItem('lw_tts');
    if (ttsVal) state.settings.ttsOn = JSON.parse(ttsVal);

    const langVal = localStorage.getItem('lw_lang');
    if (langVal) state.settings.lang = JSON.parse(langVal);

    const fsVal = localStorage.getItem('lw_fs');
    if (fsVal) state.settings.fontSize = JSON.parse(fsVal);

    const avVal = localStorage.getItem('lw_av');
    if (avVal) state.settings.avatar = JSON.parse(avVal);

    const nameVal = localStorage.getItem('lw_name');
    if (nameVal) state.settings.userName = JSON.parse(nameVal);

    const photoVal = localStorage.getItem('lw_photo');
    if (photoVal) state.settings.photoUrl = JSON.parse(photoVal);

    const goalVal = localStorage.getItem('lw_goal');
    if (goalVal) state.settings.dailyGoal = JSON.parse(goalVal);

    const cefrVal = localStorage.getItem('lw_cefr');
    if (cefrVal) state.settings.cefrLevel = JSON.parse(cefrVal);

    const ghVal = localStorage.getItem('lw_gh_repo');
    if (ghVal) state.settings.githubRepo = JSON.parse(ghVal);

    const progVal = localStorage.getItem('lw_prog');
    if (progVal) state.progress = JSON.parse(progVal);

    const bmVal = localStorage.getItem('lw_bm');
    if (bmVal) state.bookmarks = JSON.parse(bmVal);

    const strkVal = localStorage.getItem('lw_streak');
    if (strkVal) state.streak = JSON.parse(strkVal);

    const actVal = localStorage.getItem('lw_act');
    if (actVal) state.activity = JSON.parse(actVal);

    const hsVal = localStorage.getItem('lw_hs');
    if (hsVal) state.highscores = JSON.parse(hsVal);

    const srsVal = localStorage.getItem('lw_srs');
    if (srsVal) state.srs = JSON.parse(srsVal);

    const missedVal = localStorage.getItem('lw_missed');
    if (missedVal) state.missedWords = JSON.parse(missedVal);

    const modProgVal = localStorage.getItem('lw_mod_prog');
    if (modProgVal) state.moduleProgress = JSON.parse(modProgVal);

    const b1ProgVal = localStorage.getItem('lw_b1_prog');
    if (b1ProgVal) {
      state.b1ExamProgress = JSON.parse(b1ProgVal);
    } else {
      state.b1ExamProgress = JSON.parse(JSON.stringify(DEFAULT_B1_PROGRESS));
    }
  } catch (err) {
    console.warn("Could not load stored states:", err);
  }
  applyThemeAndFont();
}

export function applyThemeAndFont() {
  const isDark = Boolean(state.settings.dark);
  document.documentElement.classList.toggle('dark', isDark);
  document.body.classList.toggle('dark', isDark);

  const currentTheme = THEMES.some(th => th.id === state.settings.theme) ? state.settings.theme : 'emerald';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.body.setAttribute('data-theme', currentTheme);

  const rootFontSize = state.settings.fontSize === 'sm' ? '13px' : state.settings.fontSize === 'lg' ? '17px' : '15px';
  document.documentElement.style.setProperty('--font-size', rootFontSize);
}

export function updateSettings(partial) {
  Object.assign(state.settings, partial);
  try {
    localStorage.setItem('lw_dark', JSON.stringify(state.settings.dark));
    localStorage.setItem('lw_theme', JSON.stringify(state.settings.theme));
    localStorage.setItem('lw_tts', JSON.stringify(state.settings.ttsOn));
    localStorage.setItem('lw_lang', JSON.stringify(state.settings.lang));
    localStorage.setItem('lw_fs', JSON.stringify(state.settings.fontSize));
    localStorage.setItem('lw_av', JSON.stringify(state.settings.avatar));
    localStorage.setItem('lw_name', JSON.stringify(state.settings.userName));
    if (state.settings.photoUrl !== undefined) {
      localStorage.setItem('lw_photo', JSON.stringify(state.settings.photoUrl));
    }
    if (state.settings.dailyGoal !== undefined) {
      localStorage.setItem('lw_goal', JSON.stringify(state.settings.dailyGoal));
    }
    if (state.settings.cefrLevel !== undefined) {
      localStorage.setItem('lw_cefr', JSON.stringify(state.settings.cefrLevel));
    }
    if (state.settings.githubRepo !== undefined) {
      localStorage.setItem('lw_gh_repo', JSON.stringify(state.settings.githubRepo));
    }
  } catch (err) {
    console.error("LocalStorage save error:", err);
  }
  applyThemeAndFont();
  notify();
}

export function toggleBookmark(word) {
  const index = state.bookmarks.findIndex(b => b.g === word.g);
  if (index >= 0) {
    state.bookmarks.splice(index, 1);
  } else {
    state.bookmarks.push(word);
  }
  try {
    localStorage.setItem('lw_bm', JSON.stringify(state.bookmarks));
  } catch {}
  notify();
}

export function isBookmarked(wordStr) {
  return state.bookmarks.some(b => b.g === wordStr);
}

export function logWordMistake(word) {
  const ex = state.missedWords[word.g] || { ...word, count: 0 };
  state.missedWords[word.g] = { ...ex, count: ex.count + 1 };
  try {
    localStorage.setItem('lw_missed', JSON.stringify(state.missedWords));
  } catch {}
}

/**
 * SuperMemo-2 (SM-2) Spaced Repetition Engine
 * Calculates the next repetition count, interval, and easiness factor.
 * Quality ratings:
 * 1 = Again (Blackout / Incorrect)
 * 3 = Hard (Correct with significant difficulty)
 * 4 = Good (Correct with normal effort)
 * 5 = Easy (Instant, effortless recall)
 */
export function calculateNextSM2State(existingRecord, quality) {
  const current = existingRecord || {
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    lapses: 0,
    totalReviews: 0,
    nextReview: 0,
    lastReviewed: 0
  };

  let repetitions = current.repetitions || 0;
  let interval = current.interval || 0;
  let ease = typeof current.ease === 'number' ? current.ease : 2.5;
  let lapses = current.lapses || 0;
  const totalReviews = (current.totalReviews || 0) + 1;

  if (quality < 3) {
    // Failed recall: reset repetition count, schedule for tomorrow
    repetitions = 0;
    interval = 1;
    lapses += 1;
  } else {
    // Successful recall
    if (repetitions === 0) {
      interval = quality === 3 ? 1 : quality === 5 ? 2 : 1;
    } else if (repetitions === 1) {
      interval = quality === 3 ? 3 : quality === 5 ? 8 : 6;
    } else {
      const modifier = quality === 5 ? 1.3 : quality === 3 ? 0.85 : 1.0;
      interval = Math.max(interval + 1, Math.round(interval * ease * modifier));
    }
    repetitions += 1;
  }

  // SM-2 Easiness Factor Formula:
  // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease < 1.3) ease = 1.3;
  ease = Math.round(ease * 100) / 100;

  const lastReviewed = Date.now();
  const nextReview = lastReviewed + (interval * 86400000);

  return {
    ease,
    interval,
    repetitions,
    lapses,
    totalReviews,
    lastReviewed,
    nextReview
  };
}

export function formatInterval(days) {
  if (!days || days <= 0) return '<1d';
  if (days === 1) return '1d';
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${(days / 365).toFixed(1)}y`;
}

export function getWordSRSStatus(wordStr) {
  const rec = state.srs?.[wordStr];
  if (!rec || !rec.lastReviewed) {
    return {
      status: 'new',
      label: '🌱 New',
      deLabel: '🌱 Neu',
      color: 'emerald',
      daysUntil: 0,
      interval: 0,
      repetitions: 0,
      ease: 2.5
    };
  }
  const now = Date.now();
  const diffMs = rec.nextReview - now;
  const daysUntil = Math.round(diffMs / 86400000);

  if (diffMs <= 0) {
    const overdueDays = Math.abs(daysUntil);
    return {
      status: 'due',
      label: overdueDays > 0 ? `⚠️ Due (-${overdueDays}d)` : `⚡ Due Today`,
      deLabel: overdueDays > 0 ? `⚠️ Fällig (-${overdueDays}T)` : `⚡ Heute fällig`,
      color: 'amber',
      daysUntil,
      interval: rec.interval || 1,
      repetitions: rec.repetitions || 0,
      ease: rec.ease || 2.5
    };
  }
  return {
    status: 'learning',
    label: `🗓️ In ${daysUntil}d`,
    deLabel: `🗓️ In ${daysUntil}T`,
    color: 'blue',
    daysUntil,
    interval: rec.interval || 1,
    repetitions: rec.repetitions || 0,
    ease: rec.ease || 2.5
  };
}

export function updateSRS(word, quality) {
  if (!state.srs) state.srs = {};
  const current = state.srs[word.g];
  const next = calculateNextSM2State(current, quality);
  state.srs[word.g] = next;
  try {
    localStorage.setItem('lw_srs', JSON.stringify(state.srs));
  } catch {}
  return next;
}

export function updateStreakCount() {
  const today = new Date().toISOString().slice(0, 10);
  const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  let count = state.streak.count;
  if (state.streak.lastDate === today) return;
  if (state.streak.lastDate === yest) {
    count += 1;
  } else {
    count = 1;
  }
  state.streak = { count, lastDate: today };
  try {
    localStorage.setItem('lw_streak', JSON.stringify(state.streak));
  } catch {}

  state.activity[today] = (state.activity[today] || 0) + 1;
  try {
    localStorage.setItem('lw_act', JSON.stringify(state.activity));
  } catch {}
}

export function addTestPoints(pts) {
  const key = 'tests|general';
  const current = state.highscores[key] || {
    topic: 'CEFR Tests',
    mode: 'general',
    pct: 0,
    correct: 0,
    total: 100,
    ts: Date.now()
  };
  const nextPct = Math.min(100, current.pct + Math.round(pts / 10));
  state.highscores[key] = {
    ...current,
    pct: nextPct,
    correct: Math.min(100, current.correct + Math.round(pts / 8)),
    ts: Date.now()
  };
  try {
    localStorage.setItem('lw_hs', JSON.stringify(state.highscores));
  } catch {}

  const today = new Date().toISOString().split('T')[0];
  state.activity[today] = (state.activity[today] || 0) + Math.ceil(pts / 15);
  try {
    localStorage.setItem('lw_act', JSON.stringify(state.activity));
  } catch {}
  notify();
}

export function addModuleProgress(moduleId, pts) {
  if (!state.moduleProgress) {
    state.moduleProgress = { exams: 0 };
  }
  const current = state.moduleProgress[moduleId] || 0;
  // Increase progress by pts / 5, max 100%
  const nextPct = Math.min(100, current + Math.round(pts / 5));
  state.moduleProgress[moduleId] = nextPct;
  try {
    localStorage.setItem('lw_mod_prog', JSON.stringify(state.moduleProgress));
  } catch {}
  notify();
}

export function setTab(tabName) {
  state.tab = tabName;
  state.screen = 'home';
  notify();
}

export function setScreen(screenName) {
  state.screen = screenName;
  notify();
}

export const t = (en, de) => (state.settings.lang === 'de' ? de : en);

export const DEFAULT_B1_PROGRESS = {
  lesen: {
    completedTeile: [1, 2],
    totalTeile: 5,
    tasksDone: 6,
    totalTasks: 18,
    scorePct: 75,
    timeSpentMinutes: 35,
    lastPracticed: Date.now() - 3600000 * 4
  },
  hoeren: {
    completedTeile: [1, 2],
    totalTeile: 4,
    tasksDone: 5,
    totalTasks: 15,
    scorePct: 70,
    timeSpentMinutes: 28,
    lastPracticed: Date.now() - 3600000 * 12
  },
  schreiben: {
    completedTeile: [1],
    totalTeile: 3,
    tasksDone: 2,
    totalTasks: 3,
    scorePct: 65,
    timeSpentMinutes: 40,
    lastPracticed: Date.now() - 3600000 * 20
  },
  sprechen: {
    completedTeile: [1, 2, 3],
    totalTeile: 4,
    tasksDone: 4,
    totalTasks: 4,
    scorePct: 85,
    timeSpentMinutes: 48,
    lastPracticed: Date.now() - 3600000 * 1
  }
};

export function getB1ExamMetrics() {
  if (!state.b1ExamProgress) {
    state.b1ExamProgress = JSON.parse(JSON.stringify(DEFAULT_B1_PROGRESS));
  }

  const moduleConfigs = {
    lesen: {
      id: 'lesen',
      name: 'Lesen',
      nameEn: 'Reading',
      icon: '📖',
      color: '#0284c7', // Sky / Cyan
      lightBg: 'bg-sky-50 dark:bg-sky-950/30',
      border: 'border-sky-200 dark:border-sky-800/40',
      text: 'text-sky-700 dark:text-sky-300',
      barColor: 'from-sky-500 to-blue-600',
      officialTime: '65 min',
      officialMarks: '30 pts',
      passMarks: '18/30 pts (60%)',
      teileDesc: [
        { teil: 1, title: 'Teil 1: Private / berufsbezogene E-Mail', pts: '6 pts' },
        { teil: 2, title: 'Teil 2: Zwei Pressetexte / Berichte', pts: '6 pts' },
        { teil: 3, title: 'Teil 3: Anzeigen zuordnen (10 Anzeigen)', pts: '7 pts' },
        { teil: 4, title: 'Teil 4: Leserbriefe & Diskussionsforen', pts: '7 pts' },
        { teil: 5, title: 'Teil 5: Hausordnung / Richtlinie', pts: '4 pts' }
      ]
    },
    hoeren: {
      id: 'hoeren',
      name: 'Hören',
      nameEn: 'Listening',
      icon: '🎧',
      color: '#7c3aed', // Purple
      lightBg: 'bg-purple-50 dark:bg-purple-950/30',
      border: 'border-purple-200 dark:border-purple-800/40',
      text: 'text-purple-700 dark:text-purple-300',
      barColor: 'from-purple-500 to-indigo-600',
      officialTime: '40 min',
      officialMarks: '30 pts',
      passMarks: '18/30 pts (60%)',
      teileDesc: [
        { teil: 1, title: 'Teil 1: 5 Alltagsdialoge / Durchsagen', pts: '10 pts' },
        { teil: 2, title: 'Teil 2: Monolog / Führung / Vortrag', pts: '5 pts' },
        { teil: 3, title: 'Teil 3: Informelles Zweiergespräch', pts: '7 pts' },
        { teil: 4, title: 'Teil 4: Radiodiskussion mit Gästen', pts: '8 pts' }
      ]
    },
    schreiben: {
      id: 'schreiben',
      name: 'Schreiben',
      nameEn: 'Writing',
      icon: '✍️',
      color: '#059669', // Emerald
      lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
      border: 'border-emerald-200 dark:border-emerald-800/40',
      text: 'text-emerald-700 dark:text-emerald-300',
      barColor: 'from-emerald-500 to-teal-600',
      officialTime: '60 min',
      officialMarks: '100 pts',
      passMarks: '60/100 pts (60%)',
      teileDesc: [
        { teil: 1, title: 'Teil 1: Informelle persönliche E-Mail (~80 Wörter)', pts: '40 pts' },
        { teil: 2, title: 'Teil 2: Meinungsäußerung im Forum (~80 Wörter)', pts: '40 pts' },
        { teil: 3, title: 'Teil 3: Formelle Mitteilung / Entschuldigung (~40 Wörter)', pts: '20 pts' }
      ]
    },
    sprechen: {
      id: 'sprechen',
      name: 'Sprechen',
      nameEn: 'Speaking',
      icon: '🗣️',
      color: '#d97706', // Amber
      lightBg: 'bg-amber-50 dark:bg-amber-950/30',
      border: 'border-amber-200 dark:border-amber-800/40',
      text: 'text-amber-700 dark:text-amber-300',
      barColor: 'from-amber-500 to-orange-600',
      officialTime: 'ca. 15 min',
      officialMarks: '100 pts',
      passMarks: '60/100 pts (60%)',
      teileDesc: [
        { teil: 1, title: 'Teil 1: Gemeinsam etwas planen (Zeit/Ort/Aufgaben)', pts: '28 pts' },
        { teil: 2, title: 'Teil 2: Thema präsentieren (5 Folien)', pts: '40 pts' },
        { teil: 3, title: 'Teil 3: Feedback geben & Rückfragen beantworten', pts: '16 pts' },
        { teil: 4, title: 'Aussprache & Redefluss (Flüssigkeit/Intonation)', pts: '16 pts' }
      ]
    }
  };

  const modules = Object.keys(moduleConfigs).map(key => {
    const cfg = moduleConfigs[key];
    const data = state.b1ExamProgress[key] || {
      completedTeile: [],
      totalTeile: cfg.teileDesc.length,
      tasksDone: 0,
      totalTasks: 10,
      scorePct: 0,
      timeSpentMinutes: 0,
      lastPracticed: null
    };

    const totalTeile = cfg.teileDesc.length;
    const completedCount = Array.isArray(data.completedTeile) ? data.completedTeile.length : 0;
    const completionPct = Math.min(100, Math.round((completedCount / totalTeile) * 100));
    const scorePct = data.scorePct || 0;
    const isPassed = scorePct >= 60 && completionPct >= 40;
    const status = isPassed ? 'passed' : completionPct > 0 ? 'in_progress' : 'not_started';

    return {
      ...cfg,
      ...data,
      totalTeile,
      completedCount,
      completionPct,
      scorePct,
      isPassed,
      status
    };
  });

  const totalCompletionSum = modules.reduce((acc, m) => acc + m.completionPct, 0);
  const overallCompletionPct = Math.round(totalCompletionSum / modules.length);

  const totalScoreSum = modules.reduce((acc, m) => acc + m.scorePct, 0);
  const overallAverageScore = Math.round(totalScoreSum / modules.length);

  const modulesPassedCount = modules.filter(m => m.isPassed).length;
  const isB1CertifiedReady = modulesPassedCount === 4;

  let readinessLevel = 'preparing';
  if (isB1CertifiedReady) readinessLevel = 'certified_ready';
  else if (modulesPassedCount >= 2 || overallCompletionPct >= 50) readinessLevel = 'on_track';

  return {
    modules,
    overallCompletionPct,
    overallAverageScore,
    modulesPassedCount,
    totalModulesCount: 4,
    isB1CertifiedReady,
    readinessLevel
  };
}

export function updateB1ModuleProgress(moduleKey, partial) {
  if (!state.b1ExamProgress) {
    state.b1ExamProgress = JSON.parse(JSON.stringify(DEFAULT_B1_PROGRESS));
  }
  if (!state.b1ExamProgress[moduleKey]) {
    state.b1ExamProgress[moduleKey] = {
      completedTeile: [],
      totalTeile: 4,
      tasksDone: 0,
      totalTasks: 10,
      scorePct: 0,
      timeSpentMinutes: 0,
      lastPracticed: Date.now()
    };
  }
  Object.assign(state.b1ExamProgress[moduleKey], partial, { lastPracticed: Date.now() });
  try {
    localStorage.setItem('lw_b1_prog', JSON.stringify(state.b1ExamProgress));
  } catch (err) {
    console.error("Could not save B1 progress:", err);
  }
  notify();
}

export function recordB1TaskAttempt(moduleKey, teilNum, isCorrect, pts = 5) {
  if (!state.b1ExamProgress) {
    state.b1ExamProgress = JSON.parse(JSON.stringify(DEFAULT_B1_PROGRESS));
  }
  const mod = state.b1ExamProgress[moduleKey] || {
    completedTeile: [],
    totalTeile: 4,
    tasksDone: 0,
    totalTasks: 10,
    scorePct: 0,
    timeSpentMinutes: 0,
    lastPracticed: Date.now()
  };

  if (!mod.completedTeile.includes(teilNum)) {
    mod.completedTeile.push(teilNum);
  }
  mod.tasksDone = (mod.tasksDone || 0) + 1;
  if (isCorrect) {
    mod.scorePct = Math.min(100, Math.max(mod.scorePct, Math.round(mod.scorePct * 0.8 + 20)));
  }
  mod.timeSpentMinutes = (mod.timeSpentMinutes || 0) + 3;
  mod.lastPracticed = Date.now();

  state.b1ExamProgress[moduleKey] = mod;
  try {
    localStorage.setItem('lw_b1_prog', JSON.stringify(state.b1ExamProgress));
  } catch {}
  notify();
}

export function resetB1Progress() {
  state.b1ExamProgress = {
    lesen: { completedTeile: [], totalTeile: 5, tasksDone: 0, totalTasks: 18, scorePct: 0, timeSpentMinutes: 0, lastPracticed: null },
    hoeren: { completedTeile: [], totalTeile: 4, tasksDone: 0, totalTasks: 15, scorePct: 0, timeSpentMinutes: 0, lastPracticed: null },
    schreiben: { completedTeile: [], totalTeile: 3, tasksDone: 0, totalTasks: 3, scorePct: 0, timeSpentMinutes: 0, lastPracticed: null },
    sprechen: { completedTeile: [], totalTeile: 4, tasksDone: 0, totalTasks: 4, scorePct: 0, timeSpentMinutes: 0, lastPracticed: null }
  };
  try {
    localStorage.setItem('lw_b1_prog', JSON.stringify(state.b1ExamProgress));
  } catch {}
  notify();
}

export function simulateFullB1Progress() {
  state.b1ExamProgress = {
    lesen: { completedTeile: [1, 2, 3, 4, 5], totalTeile: 5, tasksDone: 18, totalTasks: 18, scorePct: 92, timeSpentMinutes: 65, lastPracticed: Date.now() },
    hoeren: { completedTeile: [1, 2, 3, 4], totalTeile: 4, tasksDone: 15, totalTasks: 15, scorePct: 88, timeSpentMinutes: 40, lastPracticed: Date.now() },
    schreiben: { completedTeile: [1, 2, 3], totalTeile: 3, tasksDone: 3, totalTasks: 3, scorePct: 85, timeSpentMinutes: 60, lastPracticed: Date.now() },
    sprechen: { completedTeile: [1, 2, 3, 4], totalTeile: 4, tasksDone: 4, totalTasks: 4, scorePct: 95, timeSpentMinutes: 45, lastPracticed: Date.now() }
  };
  try {
    localStorage.setItem('lw_b1_prog', JSON.stringify(state.b1ExamProgress));
  } catch {}
  notify();
}

export function restoreBackup(backupData) {
  if (!backupData || typeof backupData !== 'object') {
    throw new Error('Invalid backup data format');
  }
  if (backupData.settings && typeof backupData.settings === 'object') {
    Object.assign(state.settings, backupData.settings);
    updateSettings(backupData.settings);
  }
  if (backupData.progress) {
    state.progress = backupData.progress;
    try { localStorage.setItem('lw_prog', JSON.stringify(state.progress)); } catch {}
  }
  if (backupData.bookmarks) {
    state.bookmarks = backupData.bookmarks;
    try { localStorage.setItem('lw_bm', JSON.stringify(state.bookmarks)); } catch {}
  }
  if (backupData.highscores) {
    state.highscores = backupData.highscores;
    try { localStorage.setItem('lw_hs', JSON.stringify(state.highscores)); } catch {}
  }
  if (backupData.srs) {
    state.srs = backupData.srs;
    try { localStorage.setItem('lw_srs', JSON.stringify(state.srs)); } catch {}
  }
  if (backupData.activity) {
    state.activity = backupData.activity;
    try { localStorage.setItem('lw_act', JSON.stringify(state.activity)); } catch {}
  }
  if (backupData.b1ExamProgress) {
    state.b1ExamProgress = backupData.b1ExamProgress;
    try { localStorage.setItem('lw_b1_prog', JSON.stringify(state.b1ExamProgress)); } catch {}
  }
  applyThemeAndFont();
  notify();
  return true;
}

