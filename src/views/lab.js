import { state, setTab, t, addModuleProgress } from '../state.js';
import { speak } from '../utils/audio.js';
import { getApiUrl } from '../utils/api.js';
import { showToast } from '../utils/toast.js';

// Roleplay Scenarios for Spoken Dialogue Practice
const ROLEPLAY_SCENARIOS = [
  {
    id: 'bakery',
    icon: '🥖',
    title: { en: 'At the Bakery', de: 'In der Bäckerei' },
    desc: { en: 'Order fresh bread rolls, specify seed toppings, and ask for the total in cash.', de: 'Brötchen bestellen, nach Körnerbrötchen fragen und bar bezahlen.' },
    systemPrompt: 'Du bist Bäckerin Monika in einer Münchner Bäckerei. Antworte freundlich, kurz auf Deutsch (B1 Niveau), frage ob noch etwas gewünscht wird und nenne einen Preis.',
    initialMsg: {
      sender: 'ai',
      de: 'Guten Morgen! Was darf es denn für Sie sein? Wir haben heute ganz frische Dinkelbrötchen.',
      en: 'Good morning! What can I get for you today? We have very fresh spelt rolls today.'
    }
  },
  {
    id: 'taxi',
    icon: '🚕',
    title: { en: 'In the Taxi', de: 'Im Taxi zum Hauptbahnhof' },
    desc: { en: 'Explain your destination, request a faster route due to your train departure, and ask for a receipt.', de: 'Ziel erklären, um zügige Fahrt wegen Zugabfahrt bitten und Quittung verlangen.' },
    systemPrompt: 'Du bist Taxifahrer Cem in Berlin. Antworte kurz, hilfsbereit auf B1-Niveau Deutsch, frage nach dem Terminal oder Gleis und bestätige die Route.',
    initialMsg: {
      sender: 'ai',
      de: 'Hallo! Wo soll es denn hingehen? Bitte anschnallen!',
      en: 'Hello! Where are you headed? Please buckle up!'
    }
  },
  {
    id: 'doctor',
    icon: '🩺',
    title: { en: "At the Doctor's Office", de: 'Beim Arzt (Praxis Dr. Weber)' },
    desc: { en: 'Describe symptoms like sore throat and fever, and ask for a sick note (Krankschreibung) for your employer.', de: 'Symptome wie Halsschmerzen und Fieber schildern und um eine Arbeitsunfähigkeitsbescheinigung bitten.' },
    systemPrompt: 'Du bist Dr. Weber, Hausarzt. Frage nach Symptomen, Dauer der Beschwerden und gib einen kurzen medizinischen Rat auf B1-Deutsch.',
    initialMsg: {
      sender: 'ai',
      de: 'Guten Tag! Nehmen Sie bitte Platz. Was fehlt Ihnen denn? Seit wann haben Sie die Beschwerden?',
      en: 'Good day! Please take a seat. What seems to be the problem? How long have you had these symptoms?'
    }
  }
];

let selectedScenarioId = 'bakery';
let messages = {};
let showTranslations = false;
let isRecording = false;
let isAiReplying = false;
let recognition = null;

export function renderLab(container) {
  // Initialize scenario chat if not initialized
  if (!messages[selectedScenarioId]) {
    const scenario = ROLEPLAY_SCENARIOS.find(s => s.id === selectedScenarioId) || ROLEPLAY_SCENARIOS[0];
    messages[selectedScenarioId] = [scenario.initialMsg];
  }

  const currentScenario = ROLEPLAY_SCENARIOS.find(s => s.id === selectedScenarioId) || ROLEPLAY_SCENARIOS[0];
  const chatList = messages[selectedScenarioId] || [];

  container.innerHTML = `
    <div class="mx-auto max-w-lg bg-white dark:bg-slate-950 pb-28 min-h-screen">
      <!-- Lab Header -->
      <div class="bg-white text-slate-900 p-6 rounded-b-[2rem] border-b-4 border-pink-500 border-x border-gray-200 shadow-xs dark:bg-slate-900 dark:text-white dark:border-slate-800">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 font-mono">
            🎙️ ${t('AI SPOKEN DIALOGUE LAB', 'KI-SPRECHLABOR B1')}
          </span>
          <span class="bg-pink-50 text-pink-700 border border-pink-200 dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-400/30 text-[9px] font-black px-2 py-0.5 rounded-full font-mono">
            Interactive Speech
          </span>
        </div>
        <h1 class="text-2xl font-black mt-2 tracking-tight text-slate-900 dark:text-white">
          ${t('Spoken Conversation Partner', 'Gesprächssimulator B1')}
        </h1>
        <p class="text-xs text-slate-500 dark:text-indigo-200 mt-1 leading-relaxed">
          ${t(
            'Practice spontaneous German spoken dialogues with real-time AI roleplay partners and voice speech input.',
            'Übe spontane deutsche Dialoge und Alltagskonversationen mit Sprach- und Mikrofoneingabe.'
          )}
        </p>
      </div>

      <!-- Main Body Container -->
      <div class="p-4">
        ${renderRoleplaySection(currentScenario, chatList)}
      </div>
    </div>
  `;

  attachRoleplayListeners(container, currentScenario);
}

function renderRoleplaySection(scenario, chatList) {
  return `
    <div class="space-y-4">
      <!-- Scenario Selector Ribbon -->
      <div class="grid grid-cols-3 gap-2">
        ${ROLEPLAY_SCENARIOS.map(s => `
          <button data-scenario-id="${s.id}" class="scenario-btn p-3 rounded-2xl border text-left transition cursor-pointer ${
            selectedScenarioId === s.id
              ? 'bg-white dark:bg-slate-900 border-pink-500 shadow-md scale-102 ring-2 ring-pink-400/20'
              : 'bg-white/60 dark:bg-slate-900/60 border-gray-200/60 dark:border-slate-800 text-gray-500 dark:text-slate-400 hover:bg-white'
          }">
            <div class="text-2xl">${s.icon}</div>
            <div class="text-xs font-black mt-1 text-slate-900 dark:text-white truncate">${t(s.title.en, s.title.de)}</div>
          </button>
        `).join('')}
      </div>

      <!-- Current Scenario Goals Banner -->
      <div class="bg-indigo-50/70 dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 p-3.5 rounded-2xl flex items-center justify-between">
        <div class="text-left pr-2">
          <span class="text-[9px] font-black uppercase text-indigo-700 dark:text-indigo-400 tracking-wider block">
            🎯 ${t('SCENARIO MISSION', 'SITUATIONSZIEL')}
          </span>
          <p class="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-0.5 leading-snug">
            ${t(scenario.desc.en, scenario.desc.de)}
          </p>
        </div>
        <button id="toggle-translation-btn" class="px-2.5 py-1 text-[10px] font-bold rounded-lg border border-indigo-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 shrink-0 cursor-pointer">
          ${showTranslations ? t('Hide EN', 'EN ausblenden') : t('Show EN', 'EN anzeigen')}
        </button>
      </div>

      <!-- Chat History Box -->
      <div id="roleplay-chat-box" class="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200/80 dark:border-slate-800 p-4 shadow-sm min-h-[300px] max-h-[420px] overflow-y-auto space-y-3.5">
        ${chatList.map((msg) => `
          <div class="flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}">
            <div class="max-w-[85%] rounded-2xl p-3.5 text-xs ${
              msg.sender === 'user'
                ? 'bg-pink-600 text-white rounded-br-none shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-bl-none border border-slate-200/60 dark:border-slate-700'
            }">
              <div class="font-medium leading-relaxed">${msg.de}</div>
              ${showTranslations && msg.en ? `
                <div class="mt-1.5 pt-1.5 border-t ${msg.sender === 'user' ? 'border-pink-500 text-pink-100' : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'} text-[10px] italic">
                  ${msg.en}
                </div>
              ` : ''}
              ${msg.feedback ? `
                <div class="mt-2 p-2 bg-yellow-400/10 border border-yellow-400/30 rounded-lg text-[10px] text-amber-700 dark:text-yellow-300 font-sans">
                  💡 <strong>Tip:</strong> ${msg.feedback}
                </div>
              ` : ''}
            </div>
            ${msg.sender === 'ai' ? `
              <button data-speech-text="${msg.de}" class="speech-play-btn mt-1 text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 font-bold cursor-pointer">
                🔊 ${t('Listen Spoken German', 'Anhören')}
              </button>
            ` : ''}
          </div>
        `).join('')}
        ${isAiReplying ? `
          <div class="flex items-center gap-2 text-xs text-slate-400 italic">
            <span class="w-2 h-2 rounded-full bg-pink-500 animate-ping"></span>
            <span>${t('Speaking and thinking...', 'Partner antwortet...')}</span>
          </div>
        ` : ''}
      </div>

      <!-- Speech & Text Input Bar -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-2 shadow-md flex items-center gap-2">
        <button id="voice-record-btn" class="w-10 h-10 rounded-xl flex items-center justify-center text-base transition shrink-0 cursor-pointer ${
          isRecording
            ? 'bg-red-500 text-white animate-pulse shadow-lg scale-105'
            : 'bg-pink-50 dark:bg-slate-800 text-pink-600 dark:text-pink-400 hover:bg-pink-100'
        }" title="Toggle voice recording">
          ${isRecording ? '⏹' : '🎤'}
        </button>
        <input
          id="roleplay-text-input"
          type="text"
          placeholder="${t('Type in German or use microphone...', 'Auf Deutsch antworten oder sprechen...')}"
          class="flex-1 bg-transparent text-xs p-2 focus:outline-none dark:text-white"
        />
        <button id="roleplay-send-btn" class="px-4 py-2 bg-pink-600 hover:bg-pink-500 active:scale-95 text-white font-black text-xs rounded-xl shadow cursor-pointer transition shrink-0">
          ${t('Send', 'Senden')}
        </button>
      </div>
    </div>
  `;
}

function attachRoleplayListeners(container, scenario) {
  // Scenario selector
  container.querySelectorAll('.scenario-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      selectedScenarioId = btn.getAttribute('data-scenario-id');
      renderLab(container);
    });
  });

  // Translation toggle
  container.querySelector('#toggle-translation-btn')?.addEventListener('click', () => {
    showTranslations = !showTranslations;
    renderLab(container);
  });

  // Speech buttons inside chat
  container.querySelectorAll('.speech-play-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-speech-text');
      if (text) speak(text, true);
    });
  });

  // Text Send
  const inputEl = container.querySelector('#roleplay-text-input');
  const sendBtn = container.querySelector('#roleplay-send-btn');
  const handleSend = async () => {
    if (!inputEl) return;
    const userText = inputEl.value.trim();
    if (!userText || isAiReplying) return;
    inputEl.value = '';

    messages[selectedScenarioId].push({ sender: 'user', de: userText, en: '' });
    isAiReplying = true;
    renderLab(container);
    scrollToBottom(container);

    try {
      const res = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          systemPrompt: scenario.systemPrompt,
          history: messages[selectedScenarioId].slice(-6).map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.de }]
          }))
        })
      });
      if (!res.ok) throw new Error('Network error');
      const data = await res.json();
      messages[selectedScenarioId].push({
        sender: 'ai',
        de: data.reply || 'Vielen Dank für Ihre Antwort.',
        en: data.translation || ''
      });
      if (state.settings.ttsOn) {
        speak(data.reply, true);
      }
      addModuleProgress('lab', 10);
    } catch (err) {
      // Local fallback simulator
      const fallbacks = [
        'Das habe ich gut verstanden! Möchten Sie sonst noch etwas?',
        'Alles klar. Das macht dann insgesamt 4 Euro und 50 Cent bitte.',
        'Sehr gut. Ich drucke Ihnen sofort den Beleg aus.'
      ];
      const reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      messages[selectedScenarioId].push({
        sender: 'ai',
        de: reply,
        en: 'I understood that well! Would you like anything else?'
      });
      addModuleProgress("lab", 10);
      if (state.settings.ttsOn) speak(reply, true);
    } finally {
      isAiReplying = false;
      renderLab(container);
      scrollToBottom(container);
    }
  };

  sendBtn?.addEventListener('click', handleSend);
  inputEl?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  // Voice recording
  const voiceBtn = container.querySelector('#voice-record-btn');
  voiceBtn?.addEventListener('click', () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast(t('Speech recognition is not supported in this browser.', 'Spracherkennung wird in diesem Browser leider nicht unterstützt.'), 'warning');
      return;
    }

    if (isRecording) {
      if (recognition) recognition.stop();
      isRecording = false;
      renderLab(container);
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'de-DE';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isRecording = true;
      renderLab(container);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (inputEl) inputEl.value = transcript;
      isRecording = false;
      renderLab(container);
      handleSend();
    };

    recognition.onerror = () => {
      isRecording = false;
      renderLab(container);
    };

    recognition.onend = () => {
      isRecording = false;
      renderLab(container);
    };

    recognition.start();
  });
}

function scrollToBottom(container) {
  setTimeout(() => {
    const box = container.querySelector('#roleplay-chat-box');
    if (box) box.scrollTop = box.scrollHeight;
  }, 50);
}
