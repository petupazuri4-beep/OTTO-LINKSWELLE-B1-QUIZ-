import { VOCAB } from '../data/vocab.js';
import { SENTENCE_EXERCISES } from '../data/sentenceExercises.js';

/**
 * Returns the exact filtered list of items corresponding to the chosen study mode.
 */
export function getModeItems(topicName, mode) {
  const vocabList = VOCAB[topicName] || [];
  if (mode === 'article') {
    return vocabList.filter((w) => w.t === 'n' && /^(der|die|das) /i.test(w.g));
  }
  if (mode === 'verb') {
    return vocabList.filter((w) => w.t === 'v');
  }
  if (mode === 'adjective') {
    return vocabList.filter((w) => w.t === 'a');
  }
  if (mode === 'sentence') {
    return SENTENCE_EXERCISES[topicName] || [];
  }
  return vocabList;
}

/**
 * Calculates level ladder configuration ensuring every level has at least 1 item
 * and up to 10 progressive steps.
 */
export function getModeLevelConfig(topicName, mode) {
  const items = getModeItems(topicName, mode);
  const totalItems = items.length;
  if (totalItems === 0) {
    return { items: [], totalItems: 0, numLevels: 0, itemsPerLevel: 0 };
  }
  const itemsPerLevel = Math.max(1, Math.ceil(totalItems / 10));
  const numLevels = Math.min(10, Math.ceil(totalItems / itemsPerLevel));
  return { items, totalItems, numLevels, itemsPerLevel };
}

/**
 * Returns the exact slice of items for a given 1-indexed level.
 */
export function getSliceForLevel(items, levelNum, itemsPerLevel) {
  const startIndex = (levelNum - 1) * itemsPerLevel;
  const endIndex = Math.min(items.length, levelNum * itemsPerLevel);
  const slice = items.slice(startIndex, endIndex);
  return {
    slice,
    startIndex,
    endIndex,
    count: slice.length
  };
}

/**
 * Level 1 is always unlocked. Level N is unlocked if level N - 1 has score >= 70%.
 */
export function isLevelUnlocked(topicName, mode, levelNum, state) {
  if (levelNum <= 1) return true;
  const prevProgress = state.progress?.[topicName]?.[`${mode}_level_${levelNum - 1}`];
  return Boolean(prevProgress && prevProgress.pct >= 70);
}
