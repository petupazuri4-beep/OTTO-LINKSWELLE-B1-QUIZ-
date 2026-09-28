let voices = [];
let ttsUnlocked = false;

// Preload voices
const loadVoices = () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      voices = window.speechSynthesis.getVoices() || [];
    } catch (e) {
      voices = [];
    }
  }
};

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

// Gesture TTS unlock for iOS and mobile WebViews without firing empty utterance errors
export const unlockTTS = () => {
  if (ttsUnlocked || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  ttsUnlocked = true;
  try {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  } catch (e) {
    // Ignore unlock issues silently
  }
};

const pickDeVoice = () => {
  if (voices.length === 0) {
    loadVoices();
  }
  return (
    voices.find((v) => v.lang === 'de-DE' && v.localService) ||
    voices.find((v) => v.lang === 'de-DE') ||
    voices.find((v) => v.lang && v.lang.startsWith('de')) ||
    null
  );
};

export const speak = (text, isTtsEnabled = true) => {
  if (!isTtsEnabled || !text || typeof window === 'undefined') return;
  if (!('speechSynthesis' in window)) {
    return;
  }
  unlockTTS();

  try {
    const cleanText = String(text).replace(/<[^>]*>/g, '').trim();
    if (!cleanText) return;

    // Safely cancel any active utterance
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'de-DE';
    utterance.rate = 0.85; // slightly slower for clear B1 learning pronunciation
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const voice = pickDeVoice();
    if (voice) {
      utterance.voice = voice;
    }

    let keepAlive = null;

    utterance.onstart = () => {
      // Chrome keep-alive workaround for long utterances
      keepAlive = setInterval(() => {
        if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
          if (keepAlive) clearInterval(keepAlive);
          return;
        }
        try {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } catch (err) {}
      }, 5000);
    };

    utterance.onend = () => {
      if (keepAlive) clearInterval(keepAlive);
    };

    utterance.onerror = (e) => {
      if (keepAlive) clearInterval(keepAlive);
      // 'interrupted' and 'canceled' are standard lifecycle events when another audio plays
      if (e && (e.error === 'interrupted' || e.error === 'canceled')) {
        return;
      }
      // Non-critical warning rather than unhandled console.error
      console.warn('SpeechSynthesis notice:', e?.error || 'speech interrupted');
    };

    // Slight delay after cancel allows browser audio engine to cleanly start new stream
    setTimeout(() => {
      try {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('SpeechSynthesis playback notice:', err);
      }
    }, 20);
  } catch (err) {
    console.warn('TTS execution notice:', err);
  }
};

