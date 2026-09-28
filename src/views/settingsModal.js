import { state, updateSettings, t, THEMES } from '../state.js';
import { showToast } from '../utils/toast.js';

const AVATARS = ['🎓', '🧑‍🎓', '👩‍💼', '🦊', '🦉', '🦁', '🚀', '☕', '🥨'];

export function renderSettingsModal(container) {
  const currentThemeId = state.settings.theme || 'emerald';
  const activeTheme = THEMES.find(th => th.id === currentThemeId) || THEMES[0];

  container.innerHTML = `
    <div id="settings-backdrop" class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div class="w-full max-w-md bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-gray-150 dark:border-slate-800 max-h-[90vh] overflow-y-auto text-left space-y-5">
        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-gray-100 dark:border-slate-800 pb-3">
          <h3 class="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>⚙️</span> ${t('Settings & Preferences', 'Einstellungen & Optionen')}
          </h3>
          <button id="close-settings-btn" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-sm font-black text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer">
            ✕
          </button>
        </div>

        <!-- Light & Dark Mode / Day & Night Visibility -->
        <div class="space-y-3">
          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-150/60 dark:border-slate-700/60">
            <div>
              <div class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>${state.settings.dark ? '🌙' : '☀️'}</span>
                <span>${t('Dark Mode (Day / Night)', 'Dunkelmodus (Tag / Nacht)')}</span>
              </div>
              <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                ${state.settings.dark
                  ? t('Dark mode active. Switch off for daytime white background.', 'Dunkelmodus aktiv. Ausschalten für weiße Tagesansicht.')
                  : t('White background active for crisp daytime visibility.', 'Weißer Hintergrund aktiv für klare Sicht bei Tag.')}
              </div>
            </div>
            <button id="toggle-dark-mode-btn" class="w-12 h-7 rounded-full p-1 transition duration-200 cursor-pointer ${
              state.settings.dark ? 'theme-bg-primary justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
            } flex items-center shrink-0">
              <div class="w-5 h-5 rounded-full bg-white shadow-md"></div>
            </button>
          </div>

          <div class="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-150/60 dark:border-slate-700/60">
            <div>
              <div class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🔊</span>
                <span>${t('Speech Synthesizer (TTS)', 'Sprachausgabe (TTS)')}</span>
              </div>
              <div class="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">${t('Spoken German pronunciation', 'Automatische Aussprache bei Fragen')}</div>
            </div>
            <button id="toggle-tts-btn" class="w-12 h-7 rounded-full p-1 transition duration-200 cursor-pointer ${
              state.settings.ttsOn ? 'theme-bg-primary justify-end' : 'bg-gray-300 dark:bg-slate-700 justify-start'
            } flex items-center shrink-0">
              <div class="w-5 h-5 rounded-full bg-white shadow-md"></div>
            </button>
          </div>
        </div>

        <!-- Colour Themes Section (Bespoke Styles & Font Combinations) -->
        <div class="space-y-2 border-t border-gray-100 dark:border-slate-800 pt-4">
          <div class="flex items-center justify-between">
            <label class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <span>🎨</span> ${t(`Themes & Font Styles (${THEMES.length} Designs)`, `Farb- & Schriftstile (${THEMES.length} Designs)`)}
            </label>
            <span class="text-[10.5px] font-black theme-text">
              ${activeTheme.emoji} ${t(activeTheme.name, activeTheme.nameDe)}
            </span>
          </div>
          <p class="text-[10.5px] text-gray-500 dark:text-slate-400">
            ${t(`Choose from ${THEMES.length} bespoke aesthetics with paired display typography, backgrounds, and accent palettes:`, `Wähle aus ${THEMES.length} aufeinander abgestimmten Stilen mit passender Typografie, Hintergründen und Farben:`)}
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

        <!-- Language Switcher -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">${t('App Language', 'App-Sprache')}</label>
          <div class="grid grid-cols-2 gap-2">
            <button data-lang="en" class="settings-lang-btn py-2.5 rounded-xl border text-xs font-black transition cursor-pointer ${
              state.settings.lang === 'en'
                ? 'bg-slate-900 text-white dark:bg-emerald-600 border-transparent shadow-xs'
                : 'bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'
            }">
              🇺🇸 English
            </button>
            <button data-lang="de" class="settings-lang-btn py-2.5 rounded-xl border text-xs font-black transition cursor-pointer ${
              state.settings.lang === 'de'
                ? 'bg-slate-900 text-white dark:bg-emerald-600 border-transparent shadow-xs'
                : 'bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'
            }">
              🇩🇪 Deutsch
            </button>
          </div>
        </div>

        <!-- Font Sizing -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">${t('Typography Size', 'Schriftgröße')}</label>
          <div class="grid grid-cols-3 gap-2">
            ${[
              { key: 'sm', label: t('Small', 'Klein') },
              { key: 'md', label: t('Medium', 'Mittel') },
              { key: 'lg', label: t('Large', 'Groß') }
            ].map(f => `
              <button data-fs="${f.key}" class="settings-fs-btn py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                state.settings.fontSize === f.key
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 border-transparent shadow-xs font-black'
                  : 'bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'
              }">
                ${f.label}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Daily Practice Goal -->
        <div class="space-y-1.5">
          <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">${t('Daily Practice Goal', 'Tägliches Lernziel')}</label>
          <div class="grid grid-cols-4 gap-2">
            ${[5, 10, 15, 25].map(g => `
              <button data-goal="${g}" class="settings-goal-btn py-2 rounded-xl border text-xs font-bold transition cursor-pointer ${
                state.settings.dailyGoal === g
                  ? 'bg-slate-900 text-white dark:bg-emerald-600 border-transparent shadow-xs font-black'
                  : 'bg-gray-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-gray-200 dark:border-slate-700'
              }">
                ${g} ${t('words', 'Wörter')}
              </button>
            `).join('')}
          </div>
        </div>

        <!-- User Profile Configuration -->
        <div class="space-y-3 border-t border-gray-100 dark:border-slate-800 pt-4">
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">${t('Learner Name', 'Name')}</label>
            <input
              id="settings-username-input"
              type="text"
              value="${state.settings.userName}"
              class="w-full p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <!-- Avatar Emoji Selector -->
          <div class="space-y-1">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">${t('Choose Emoji Avatar', 'Emoji-Avatar')}</label>
            <div class="flex gap-2 flex-wrap">
              ${AVATARS.map(av => `
                <button data-avatar="${av}" class="settings-avatar-btn w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition cursor-pointer ${
                  state.settings.avatar === av && !state.settings.photoUrl
                    ? 'bg-emerald-100 border-emerald-500 scale-110 shadow-xs'
                    : 'bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:bg-gray-100'
                }">
                  ${av}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Custom Photo Upload -->
          <div class="space-y-1 pt-1">
            <label class="text-xs font-bold text-slate-400 uppercase tracking-wider">${t('Profile Photo', 'Profilbild hochladen')}</label>
            <div class="flex items-center gap-3">
              <input type="file" id="settings-photo-file-input" accept="image/*" class="hidden" />
              <button id="trigger-upload-photo-btn" class="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition cursor-pointer">
                📷 ${t('Upload Photo', 'Foto wählen')}
              </button>
              ${state.settings.photoUrl ? `
                <button id="remove-photo-btn" class="text-xs text-rose-500 font-bold hover:underline cursor-pointer">
                  ${t('Remove', 'Entfernen')}
                </button>
              ` : ''}
            </div>
          </div>
        </div>

        <!-- GitHub Integration & Version Control -->
        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-slate-800/60 border border-gray-150/60 dark:border-slate-700/60 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>🐙</span> ${t('GitHub & Version Control', 'GitHub & Versionsverwaltung')}
            </span>
            <span class="text-[9px] font-mono font-bold text-gray-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-gray-200 dark:border-slate-600">
              Git
            </span>
          </div>

          <div class="space-y-1">
            <label for="modal-github-repo-input" class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              ${t('Your GitHub Repo URL', 'Deine GitHub-URL')}
            </label>
            <div class="flex gap-1.5">
              <input
                id="modal-github-repo-input"
                type="url"
                value="${state.settings.githubRepo || ''}"
                placeholder="https://github.com/user/repo"
                class="flex-1 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 shadow-xs"
              />
              ${state.settings.githubRepo ? `
                <a
                  href="${state.settings.githubRepo}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="px-2.5 py-1.5 bg-slate-900 dark:bg-slate-700 text-white rounded-xl text-xs font-bold transition flex items-center shrink-0"
                >
                  ↗
                </a>
              ` : ''}
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <button
              id="modal-copy-git-push-btn"
              type="button"
              class="p-2 rounded-xl border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1"
            >
              <span>📋</span>
              <span>${t('Copy Commands', 'Befehle kopieren')}</span>
            </button>
            <button
              id="modal-export-app-data-btn"
              type="button"
              class="p-2 rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-[11px] font-black transition cursor-pointer flex items-center justify-center gap-1"
            >
              <span>💾</span>
              <span>${t('Export Backup', 'Backup exportieren')}</span>
            </button>
          </div>
        </div>

        <!-- Offline & Service Worker Status -->
        <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 text-xs space-y-1.5">
          <div class="flex items-center justify-between">
            <span class="font-extrabold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
              <span>⚡</span> ${t('Offline Storage & Service Worker', 'Offline-Speicher & Service Worker')}
            </span>
            <span class="text-[9px] font-mono font-black uppercase bg-emerald-200/80 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 px-2 py-0.5 rounded-full">
              ${'serviceWorker' in navigator ? t('Active', 'Aktiv') : t('Unavailable', 'Nicht verfügbar')}
            </span>
          </div>
          <p class="text-[11px] text-emerald-800/80 dark:text-emerald-300/80 leading-relaxed">
            ${t('All 1,000+ Goethe B1 words, SM-2 flashcard schedules, and exam tests are cached and accessible without an internet connection.', 'Alle 1.000+ Goethe B1-Vokabeln, SM-2-Wiederholungspläne und Prüfungen sind offline im Cache gespeichert.')}
          </p>
        </div>

        <!-- Close button footer -->
        <div class="pt-2">
          <button id="save-close-settings-btn" class="w-full py-3 bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 text-white text-xs font-black rounded-xl shadow cursor-pointer transition">
            ✓ ${t('Done', 'Fertig')}
          </button>
        </div>
      </div>
    </div>
  `;

  // Attach Listeners
  const closeModal = () => {
    state.showSettings = false;
    container.classList.add('hidden');
  };

  container.querySelector('#close-settings-btn')?.addEventListener('click', closeModal);
  container.querySelector('#save-close-settings-btn')?.addEventListener('click', closeModal);
  container.querySelector('#settings-backdrop')?.addEventListener('click', (e) => {
    if (e.target.id === 'settings-backdrop') closeModal();
  });

  container.querySelector('#toggle-dark-mode-btn')?.addEventListener('click', () => {
    updateSettings({ dark: !state.settings.dark });
  });

  container.querySelectorAll('.settings-theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const themeId = btn.getAttribute('data-theme-id');
      if (themeId) {
        updateSettings({ theme: themeId });
      }
    });
  });

  container.querySelector('#toggle-tts-btn')?.addEventListener('click', () => {
    updateSettings({ ttsOn: !state.settings.ttsOn });
  });

  container.querySelectorAll('.settings-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang');
      updateSettings({ lang });
    });
  });

  container.querySelectorAll('.settings-fs-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const fontSize = btn.getAttribute('data-fs');
      updateSettings({ fontSize });
    });
  });

  container.querySelectorAll('.settings-goal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const dailyGoal = parseInt(btn.getAttribute('data-goal'), 10);
      updateSettings({ dailyGoal });
    });
  });

  const usernameInput = container.querySelector('#settings-username-input');
  usernameInput?.addEventListener('change', () => {
    updateSettings({ userName: usernameInput.value || 'Learner' });
  });

  container.querySelectorAll('.settings-avatar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const avatar = btn.getAttribute('data-avatar');
      updateSettings({ avatar, photoUrl: null });
    });
  });

  // Photo Upload Handler with Canvas resize to 120x120
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
        renderSettingsModal(container);
      };
      img.src = event.target?.result;
    };
    reader.readAsDataURL(file);
  });

  container.querySelector('#remove-photo-btn')?.addEventListener('click', () => {
    updateSettings({ photoUrl: null });
    renderSettingsModal(container);
  });

  // Modal GitHub Listeners
  const modalGhInput = container.querySelector('#modal-github-repo-input');
  modalGhInput?.addEventListener('input', () => {
    updateSettings({ githubRepo: modalGhInput.value.trim() });
  });

  container.querySelector('#modal-copy-git-push-btn')?.addEventListener('click', async () => {
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

  container.querySelector('#modal-export-app-data-btn')?.addEventListener('click', () => {
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
}
