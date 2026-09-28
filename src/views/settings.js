import { state, updateSettings, t, THEMES, setTab, applyThemeAndFont } from '../state.js';
import { showToast } from '../utils/toast.js';

const AVATARS = ['🎓', '🧑‍🎓', '👩‍💼', '🦊', '🦉', '🦁', '🚀', '☕', '🥨', '🧑‍💻', '👨‍🏫', '👩‍🔬'];

export function renderSettings(container) {
  const currentThemeId = state.settings.theme || 'emerald';
  const activeTheme = THEMES.find(th => th.id === currentThemeId) || THEMES[0];

  container.innerHTML = `
    <div class="mx-auto max-w-lg pb-28 text-left transition-colors duration-150">
      <!-- Settings Header Bar -->
      <div class="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-4 text-slate-900 dark:text-white border-b border-gray-200 dark:border-slate-800 flex items-center justify-between shadow-xs">
        <div class="flex items-center gap-2">
          <span class="text-xl">⚙️</span>
          <div>
            <h2 class="text-base font-black tracking-tight leading-none text-slate-900 dark:text-white">
              ${t('Settings & Preferences', 'Einstellungen & Optionen')}
            </h2>
            <p class="text-[10px] text-gray-500 dark:text-slate-400 mt-0.5 font-medium">
              ${t('Personalize display, audio, themes & goals', 'Passe Anzeige, Audio, Stile & Lernziele an')}
            </p>
          </div>
        </div>
        <button id="settings-to-profile-btn" class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition cursor-pointer">
          <span>👤</span>
          <span>${t('Profile', 'Profil')}</span>
        </button>
      </div>

      <div class="p-4 space-y-4">
        <!-- Profile Identity Card & Quick Status -->
        <div class="rounded-3xl bg-linear-to-br from-slate-50 via-white to-gray-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-5 shadow-xs border border-gray-200/90 dark:border-slate-800 relative overflow-hidden">
          <div class="flex items-center justify-between">
            <span class="text-[9.5px] font-mono font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              ${t('LEARNER IDENTITY', 'LERNER-PROFIL')}
            </span>
            <span class="text-[9.5px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800">
              ${state.settings.cefrLevel || 'B1'} Goethe Standard
            </span>
          </div>

          <div class="mt-4 flex items-center gap-4">
            <div class="relative group">
              <div class="h-16 w-16 rounded-2xl bg-white dark:bg-slate-800 border-2 border-gray-200 dark:border-slate-700 flex items-center justify-center text-3xl overflow-hidden shrink-0 shadow-xs">
                ${state.settings.photoUrl ? `<img src="${state.settings.photoUrl}" class="h-full w-full object-cover" alt="Profile" />` : state.settings.avatar}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                ${t('Your Display Name', 'Dein Name')}
              </label>
              <input
                id="settings-username-input"
                type="text"
                value="${state.settings.userName || 'Learner'}"
                maxlength="32"
                placeholder="${t('Enter your name...', 'Name eingeben...')}"
                class="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
            </div>
          </div>

          <!-- Avatar Emoji Selector -->
          <div class="mt-4 pt-3 border-t border-gray-100 dark:border-slate-800/80">
            <div class="flex items-center justify-between mb-2">
              <label class="text-[10.5px] font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                ${t('Select Emoji Avatar', 'Emoji-Avatar wählen')}
              </label>
              <div class="flex items-center gap-2">
                <input type="file" id="settings-photo-file-input" accept="image/*" class="hidden" />
                <button id="trigger-upload-photo-btn" class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-[10.5px] font-bold text-indigo-700 dark:text-indigo-300 transition cursor-pointer">
                  📷 ${t('Upload Photo', 'Foto hochladen')}
                </button>
                ${state.settings.photoUrl ? `
                  <button id="remove-photo-btn" class="text-[10.5px] text-rose-500 hover:text-rose-600 font-bold hover:underline cursor-pointer">
                    ${t('Remove', 'Entfernen')}
                  </button>
                ` : ''}
              </div>
            </div>
            <div class="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              ${AVATARS.map(av => `
                <button
                  type="button"
                  data-avatar="${av}"
                  class="settings-avatar-btn w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                    state.settings.avatar === av && !state.settings.photoUrl
                      ? 'bg-emerald-100 border-emerald-500 scale-105 shadow-xs ring-2 ring-emerald-500/30'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700/60'
                  }"
                  title="${av}"
                >
                  ${av}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Display & Audio Preferences (Instant Reaction Toggles) -->
        <div class="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-xs border border-gray-200/90 dark:border-slate-800 space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-gray-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>✨</span> ${t('Display & Audio', 'Anzeige & Sprachausgabe')}
          </h3>

          <!-- Dark / Day Mode Toggle -->
          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-200/70 dark:border-slate-700/60">
            <div class="pr-3">
              <div class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>${state.settings.dark ? '🌙' : '☀️'}</span>
                <span>${t('Day / Night Mode', 'Tag- / Nachtmodus')}</span>
              </div>
              <div class="text-[10.5px] text-gray-500 dark:text-gray-400 mt-0.5">
                ${state.settings.dark
                  ? t('Dark mode enabled for low-light practice.', 'Dunkelmodus aktiv für angenehmes Lernen bei Nacht.')
                  : t('Crisp daytime white background enabled.', 'Heller Tagesmodus für optimale Lesbarkeit.')}
              </div>
            </div>
            <button
              id="settings-toggle-dark-btn"
              type="button"
              class="w-12 h-7 rounded-full p-1 transition-all duration-200 cursor-pointer ${
                state.settings.dark ? 'theme-bg-primary justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
              } flex items-center shrink-0 shadow-inner"
              title="${t('Toggle Dark Mode', 'Dunkelmodus umschalten')}"
            >
              <div class="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200"></div>
            </button>
          </div>

          <!-- Spoken Pronunciation (TTS) -->
          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-200/70 dark:border-slate-700/60">
            <div class="pr-3">
              <div class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🔊</span>
                <span>${t('Audio Pronunciation (TTS)', 'Sprachausgabe & Audio (TTS)')}</span>
              </div>
              <div class="text-[10.5px] text-gray-500 dark:text-gray-400 mt-0.5">
                ${state.settings.ttsOn
                  ? t('Auto-pronounce German vocabulary during quizzes.', 'Deutsche Aussprache wird automatisch abgespielt.')
                  : t('Muted. Tap sound icons to play audio manually.', 'Stummgeschaltet. Audio nur bei Antippen abspielen.')}
              </div>
            </div>
            <button
              id="settings-toggle-tts-btn"
              type="button"
              class="w-12 h-7 rounded-full p-1 transition-all duration-200 cursor-pointer ${
                state.settings.ttsOn ? 'theme-bg-primary justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
              } flex items-center shrink-0 shadow-inner"
              title="${t('Toggle Audio TTS', 'Audio Sprachausgabe umschalten')}"
            >
              <div class="w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-200"></div>
            </button>
          </div>

          <!-- Interface Language -->
          <div class="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-200/70 dark:border-slate-700/60 space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🌐</span> ${t('Interface Language', 'Oberflächensprache')}
              </label>
              <span class="text-[10px] font-bold text-gray-400 uppercase">
                ${state.settings.lang === 'de' ? 'Deutsch' : 'English'}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button
                type="button"
                data-lang="en"
                class="settings-lang-btn py-2.5 px-3 rounded-xl border text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                  state.settings.lang === 'en'
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                }"
              >
                <span>🇺🇸</span>
                <span>English</span>
                ${state.settings.lang === 'en' ? '<span class="text-emerald-400 font-black">✓</span>' : ''}
              </button>
              <button
                type="button"
                data-lang="de"
                class="settings-lang-btn py-2.5 px-3 rounded-xl border text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 ${
                  state.settings.lang === 'de'
                    ? 'bg-slate-900 text-white dark:bg-emerald-600 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                }"
              >
                <span>🇩🇪</span>
                <span>Deutsch</span>
                ${state.settings.lang === 'de' ? '<span class="text-emerald-400 font-black">✓</span>' : ''}
              </button>
            </div>
          </div>

          <!-- Typography Sizing -->
          <div class="p-3.5 rounded-2xl bg-gray-50/80 dark:bg-slate-800/60 border border-gray-200/70 dark:border-slate-700/60 space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🔤</span> ${t('Typography Sizing', 'Schriftgröße')}
              </label>
              <span class="text-[10px] font-bold text-gray-400 uppercase">
                ${state.settings.fontSize === 'sm' ? t('Small', 'Klein') : state.settings.fontSize === 'lg' ? t('Large', 'Groß') : t('Medium', 'Mittel')}
              </span>
            </div>
            <div class="grid grid-cols-3 gap-2">
              ${[
                { key: 'sm', label: t('Small', 'Klein'), sub: '13px' },
                { key: 'md', label: t('Medium', 'Mittel'), sub: '15px' },
                { key: 'lg', label: t('Large', 'Groß'), sub: '17px' }
              ].map(f => `
                <button
                  type="button"
                  data-fs="${f.key}"
                  class="settings-fs-btn py-2 px-1 rounded-xl border text-xs font-bold transition cursor-pointer flex flex-col items-center justify-center ${
                    state.settings.fontSize === f.key
                      ? 'bg-slate-900 text-white dark:bg-emerald-600 border-transparent shadow-xs font-black'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                  }"
                >
                  <span>${f.label}</span>
                  <span class="text-[9px] opacity-70">${f.sub}</span>
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Colour Themes Section -->
        <div class="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-xs border border-gray-200/90 dark:border-slate-800 space-y-3">
          <div class="flex items-center justify-between">
            <label class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>🎨</span> ${t(`Bespoke Colour Themes (${THEMES.length})`, `Farb- & Schriftstile (${THEMES.length})`)}
            </label>
            <span class="text-[10.5px] font-black theme-text">
              ${activeTheme.emoji} ${t(activeTheme.name, activeTheme.nameDe)}
            </span>
          </div>
          <p class="text-[11px] text-gray-500 dark:text-slate-400">
            ${t('Instant aesthetic switching with paired typography and color palettes:', 'Sofortige Farbanpassung mit passender Schriftart und Akzentfarben:')}
          </p>

          <div class="grid grid-cols-1 gap-2.5 mt-2">
            ${THEMES.map(th => {
              const isSelected = currentThemeId === th.id;
              return `
                <button
                  type="button"
                  data-theme-id="${th.id}"
                  class="settings-theme-btn p-3 rounded-2xl border text-left transition-all duration-150 cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 shadow-md border-transparent ring-2'
                      : 'bg-gray-50 hover:bg-gray-100/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-gray-200/80 dark:border-slate-700/60'
                  }"
                  style="${isSelected ? `outline: 2px solid ${th.primary}; outline-offset: 1px;` : ''}"
                >
                  <div class="flex items-center gap-3 min-w-0">
                    <span class="text-2xl shrink-0 p-2 rounded-xl" style="background-color: ${th.bgLight};">${th.emoji}</span>
                    <div class="min-w-0">
                      <div class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5 flex-wrap">
                        <span class="truncate">${t(th.name, th.nameDe)}</span>
                        <span class="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          ${t(th.styleName, th.styleNameDe)}
                        </span>
                        ${isSelected ? `
                          <span class="text-[9px] uppercase px-1.5 py-0.5 rounded font-black text-white shrink-0" style="background-color: ${th.primary};">
                            ${t('Active', 'Aktiv')}
                          </span>
                        ` : ''}
                      </div>
                      <div class="text-[10px] text-gray-500 dark:text-slate-400 truncate mt-0.5 font-medium">
                        🔤 ${th.fontPairing} • ${t(th.desc, th.descDe)}
                      </div>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <div class="w-4 h-4 rounded-full shadow-xs border border-white/50" style="background-color: ${th.primary};" title="Primary"></div>
                    <div class="w-3.5 h-3.5 rounded-full shadow-xs border border-white/50" style="background-color: ${th.accent};" title="Accent"></div>
                    ${isSelected ? `
                      <span class="text-sm font-black ml-1" style="color: ${th.primary};">✓</span>
                    ` : ''}
                  </div>
                </button>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Daily Practice Goal & Target CEFR -->
        <div class="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-xs border border-gray-200/90 dark:border-slate-800 space-y-4">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🎯</span> ${t('Daily Practice Goal', 'Tägliches Lernziel')}
              </label>
              <span class="text-[11px] font-black theme-text">
                ${state.settings.dailyGoal || 10} ${t('words / day', 'Wörter / Tag')}
              </span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              ${[5, 10, 15, 25].map(g => `
                <button
                  type="button"
                  data-goal="${g}"
                  class="settings-goal-btn py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer flex flex-col items-center justify-center ${
                    state.settings.dailyGoal === g
                      ? 'bg-slate-900 text-white dark:bg-emerald-600 border-transparent shadow-xs font-black'
                      : 'bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                  }"
                >
                  <span class="text-sm font-black">${g}</span>
                  <span class="text-[9px] uppercase tracking-tight opacity-75">${t('words', 'Wörter')}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Target Level Selector -->
          <div class="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2">
            <div class="flex items-center justify-between">
              <label class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>🏅</span> ${t('Target CEFR Level', 'Ziel-GER-Niveau')}
              </label>
              <span class="text-[10px] font-bold text-gray-400">
                Current: ${state.settings.cefrLevel || 'B1'}
              </span>
            </div>
            <div class="grid grid-cols-4 gap-2">
              ${['A1', 'A2', 'B1', 'B2'].map(lvl => `
                <button
                  type="button"
                  data-cefr="${lvl}"
                  class="settings-cefr-btn py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                    (state.settings.cefrLevel || 'B1') === lvl
                      ? 'bg-emerald-600 text-white border-transparent shadow-xs font-black'
                      : 'bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                  }"
                >
                  ${lvl}
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- GitHub Integration & Version Control -->
        <div class="rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-xs border border-gray-200/90 dark:border-slate-800 space-y-4">
          <div class="flex items-center justify-between">
            <label class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span class="text-base">🐙</span> ${t('GitHub & Version Control', 'GitHub & Versionsverwaltung')}
            </label>
            <span class="text-[9.5px] font-mono font-bold text-gray-500 dark:text-slate-400 bg-gray-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-gray-200 dark:border-slate-700">
              Git • Open Source
            </span>
          </div>

          <p class="text-[11px] text-gray-600 dark:text-slate-400 leading-relaxed">
            ${t(
              'Connect your Goethe B1 German Trainer codebase and learning data to GitHub. You can link your remote repository, copy the terminal push command, or export your full backup.',
              'Verbinde dein Goethe B1 Lernsystem mit GitHub. Du kannst dein GitHub-Repository verlinken, den Push-Befehl kopieren oder ein Backup exportieren.'
            )}
          </p>

          <!-- Repo URL Link Input -->
          <div class="space-y-1.5">
            <label for="settings-github-repo-input" class="block text-[10.5px] font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
              ${t('Your GitHub Repository URL', 'Deine GitHub-Repository-URL')}
            </label>
            <div class="flex gap-2">
              <div class="relative flex-1">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs text-gray-400">
                  🔗
                </span>
                <input
                  id="settings-github-repo-input"
                  type="url"
                  value="${state.settings.githubRepo || ''}"
                  placeholder="https://github.com/username/german-b1-trainer"
                  class="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50/70 dark:bg-slate-800/70 text-xs font-mono font-medium text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-slate-900 dark:focus:ring-emerald-500 shadow-xs"
                />
              </div>
              ${state.settings.githubRepo ? `
                <a
                  href="${state.settings.githubRepo}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-3 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1 shrink-0"
                >
                  <span>↗</span>
                  <span class="hidden sm:inline">${t('Open', 'Öffnen')}</span>
                </a>
              ` : ''}
            </div>
          </div>

          <!-- Quick Actions: Copy Git Push Command & Download Backup -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              id="copy-git-push-btn"
              type="button"
              class="p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>📋</span>
              <span>${t('Copy Git Push Command', 'Git Push-Befehl kopieren')}</span>
            </button>
            <button
              id="export-app-data-btn"
              type="button"
              class="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-black transition cursor-pointer flex items-center justify-center gap-2 shadow-xs"
            >
              <span>💾</span>
              <span>${t('Export Learning Backup (.json)', 'Lernstand exportieren (.json)')}</span>
            </button>
          </div>

          <!-- Step-by-Step Instructions Collapsible Box -->
          <div class="p-3.5 rounded-2xl bg-slate-950 text-slate-200 text-xs font-mono space-y-2 border border-slate-800">
            <div class="flex items-center justify-between text-slate-400 font-bold text-[10.5px]">
              <span>TERMINAL COMMANDS (POWERSHELL / BASH)</span>
              <span class="text-emerald-400 font-mono">READY</span>
            </div>
            <pre id="git-commands-preview" class="overflow-x-auto text-[11px] leading-relaxed text-emerald-400 p-2.5 bg-slate-900 rounded-xl select-all">git init
git add .
git commit -m "feat: linkswelle b1 exam trainer"
git branch -M main
git remote add origin ${state.settings.githubRepo || 'https://github.com/YOUR_USERNAME/YOUR_REPO.git'}
git push -u origin main</pre>
            <p class="text-[10.5px] text-slate-400 font-sans mt-1">
              💡 ${t(
                'Tip: You can also click the top-bar Export / Download ZIP in Google AI Studio to download this project anytime.',
                'Tipp: Du kannst auch jederzeit oben in Google AI Studio auf „Export“ / „Download ZIP“ klicken.'
              )}
            </p>
          </div>
        </div>

        <!-- Offline & Service Worker Engine Details -->
        <div class="rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 p-5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="font-black text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <span>⚡</span> ${t('Offline Engine & Local Storage', 'Offline-Engine & Lokaler Speicher')}
            </span>
            <span class="text-[9.5px] font-mono font-black uppercase bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full">
              ${'serviceWorker' in navigator ? t('Active', 'Aktiv') : t('Local Only', 'Nur Lokal')}
            </span>
          </div>
          <p class="text-[11px] text-emerald-800/90 dark:text-emerald-300/90 leading-relaxed">
            ${t(
              '1,000+ Goethe B1 vocabulary terms, Goethe exam blueprints, and spaced repetition schedules are cached locally on this device.',
              '1.000+ Goethe B1 Vokabeln, Prüfungsaufgaben und SM-2 Wiederholungspläne sind vollständig lokal auf diesem Gerät gespeichert.'
            )}
          </p>
          <div class="pt-1 flex items-center gap-2">
            <button id="settings-refresh-cache-btn" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer">
              🔄 ${t('Update Offline Cache', 'Cache aktualisieren')}
            </button>
            <span id="cache-refresh-status" class="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold hidden">
              ✓ ${t('Updated!', 'Aktualisiert!')}
            </span>
          </div>
        </div>

        <!-- Back to Profile or Home Shortcuts -->
        <div class="pt-2 flex gap-3">
          <button id="settings-go-home-btn" class="flex-1 py-3 bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-black rounded-2xl shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5">
            <span>🏠</span>
            <span>${t('Go to Home', 'Zur Startseite')}</span>
          </button>
          <button id="settings-go-profile-btn" class="flex-1 py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white text-xs font-black rounded-2xl shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5">
            <span>👤</span>
            <span>${t('Go to Profile', 'Zum Profil')}</span>
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach Event Listeners (Snappy, direct, zero-lag!)
  container.querySelector('#settings-to-profile-btn')?.addEventListener('click', () => setTab('profile'));
  container.querySelector('#settings-go-profile-btn')?.addEventListener('click', () => setTab('profile'));
  container.querySelector('#settings-go-home-btn')?.addEventListener('click', () => setTab('home'));

  // Snappy Dark Mode toggle
  container.querySelector('#settings-toggle-dark-btn')?.addEventListener('click', () => {
    updateSettings({ dark: !state.settings.dark });
  });

  // Snappy TTS toggle
  container.querySelector('#settings-toggle-tts-btn')?.addEventListener('click', () => {
    updateSettings({ ttsOn: !state.settings.ttsOn });
  });

  // Snappy Language switch
  container.querySelectorAll('.settings-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      if (lang && lang !== state.settings.lang) {
        updateSettings({ lang });
      }
    });
  });

  // Snappy Font Size switch
  container.querySelectorAll('.settings-fs-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fontSize = btn.getAttribute('data-fs');
      if (fontSize && fontSize !== state.settings.fontSize) {
        updateSettings({ fontSize });
      }
    });
  });

  // Snappy Theme switch
  container.querySelectorAll('.settings-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const themeId = btn.getAttribute('data-theme-id');
      if (themeId && themeId !== state.settings.theme) {
        updateSettings({ theme: themeId });
      }
    });
  });

  // Snappy Daily Goal switch
  container.querySelectorAll('.settings-goal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dailyGoal = parseInt(btn.getAttribute('data-goal'), 10);
      if (dailyGoal && dailyGoal !== state.settings.dailyGoal) {
        updateSettings({ dailyGoal });
      }
    });
  });

  // Snappy CEFR Level switch
  container.querySelectorAll('.settings-cefr-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const cefrLevel = btn.getAttribute('data-cefr');
      if (cefrLevel) {
        updateSettings({ cefrLevel });
      }
    });
  });

  // Username Input - Save on change/blur with live update, never loses focus
  const usernameInput = container.querySelector('#settings-username-input');
  usernameInput?.addEventListener('change', () => {
    const val = usernameInput.value.trim() || 'Learner';
    updateSettings({ userName: val });
  });

  // Avatar selector
  container.querySelectorAll('.settings-avatar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const avatar = btn.getAttribute('data-avatar');
      if (avatar) {
        updateSettings({ avatar, photoUrl: null });
      }
    });
  });

  // Photo upload
  const fileInput = container.querySelector('#settings-photo-file-input');
  container.querySelector('#trigger-upload-photo-btn')?.addEventListener('click', () => {
    fileInput?.click();
  });

  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 120;
        canvas.height = 120;
        const ctx = canvas.getContext('2d');
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, 120, 120);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        updateSettings({ photoUrl: dataUrl });
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  });

  container.querySelector('#remove-photo-btn')?.addEventListener('click', () => {
    updateSettings({ photoUrl: null });
  });

  // GitHub Repository URL Input Listener
  const ghRepoInput = container.querySelector('#settings-github-repo-input');
  ghRepoInput?.addEventListener('input', () => {
    const val = ghRepoInput.value.trim();
    updateSettings({ githubRepo: val });
    const preview = container.querySelector('#git-commands-preview');
    if (preview) {
      preview.textContent = `git init\ngit add .\ngit commit -m "feat: linkswelle b1 exam trainer"\ngit branch -M main\ngit remote add origin ${val || 'https://github.com/YOUR_USERNAME/YOUR_REPO.git'}\ngit push -u origin main`;
    }
  });

  // Copy Git Push Command Button
  container.querySelector('#copy-git-push-btn')?.addEventListener('click', async () => {
    const repoUrl = state.settings.githubRepo || 'https://github.com/YOUR_USERNAME/YOUR_REPO.git';
    const cmd = `git init\ngit add .\ngit commit -m "feat: linkswelle b1 exam trainer"\ngit branch -M main\ngit remote add origin ${repoUrl}\ngit push -u origin main`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(cmd);
      } else {
        const ta = document.createElement('textarea');
        ta.value = cmd;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast(t('Git commands copied to clipboard!', 'Git-Befehle in die Zwischenablage kopiert!'), 'success');
    } catch (e) {
      showToast(t('Failed to copy. Please select the text directly.', 'Kopieren fehlgeschlagen. Bitte markiere den Text direkt.'), 'warning');
    }
  });

  // Export Learning Backup (.json) Button
  container.querySelector('#export-app-data-btn')?.addEventListener('click', () => {
    try {
      const backupData = {
        app: 'Linkswelle Goethe B1 German Trainer',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        settings: state.settings,
        progress: state.progress,
        bookmarks: state.bookmarks,
        highscores: state.highscores,
        srs: state.srs,
        activity: state.activity,
        b1ExamProgress: state.b1ExamProgress
      };
      const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `linkswelle-b1-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(t('Backup exported successfully!', 'Backup erfolgreich heruntergeladen!'), 'success');
    } catch (err) {
      showToast(t('Export failed: ' + err.message, 'Export fehlgeschlagen: ' + err.message), 'error');
    }
  });

  // Service Worker Cache Refresh
  container.querySelector('#settings-refresh-cache-btn')?.addEventListener('click', async () => {
    const statusEl = container.querySelector('#cache-refresh-status');
    if ('serviceWorker' in navigator) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) await reg.update();
      } catch (err) {
        console.warn('SW refresh issue:', err);
      }
    }
    if (statusEl) {
      statusEl.classList.remove('hidden');
      setTimeout(() => statusEl.classList.add('hidden'), 2500);
    }
  });
}
