import { randomItem, shuffle } from '../../lib/utils.js';

const normalizeGroup = (group) => {
  const hint = typeof group.hint === 'string' ? { en: group.hint, vi: group.hint } : group.hint;
  const words = Array.isArray(group.words)
    ? { en: group.words, vi: group.words }
    : group.words;
  return { hint, words };
};

const normalizeWordBank = (wordBank) => {
  if (!Array.isArray(wordBank)) return [];
  return wordBank.map((entry) => {
    if (entry.words) {
      const words = Array.isArray(entry.words) ? { en: entry.words, vi: entry.words } : entry.words;
      return { ...entry, words };
    }
    if (entry.groups) {
      const groups = entry.groups.map(normalizeGroup);
      const words = {
        en: groups.flatMap((group) => group.words.en || []),
        vi: groups.flatMap((group) => group.words.vi || [])
      };
      return { category: entry.category, words, groups };
    }
    return entry;
  });
};

const combineAllCategories = (normalized) => {
  const groups = normalized.flatMap((entry) => entry.groups || []);
  const words = {
    en: normalized.flatMap((entry) => entry.words?.en || []),
    vi: normalized.flatMap((entry) => entry.words?.vi || [])
  };
  return { category: 'All', words, groups };
};

export const getAvailableCategories = (language, wordBank) => {
  if (!wordBank || wordBank.length === 0) return [];
  const normalized = normalizeWordBank(wordBank);
  const languageKey = normalized[0]?.words[language] ? language : 'en';
  return normalized.map((entry) => ({
    category: entry.category,
    words: entry.words[languageKey]
  }));
};

export const buildRound = ({ players, imposters, category, language, usedWordsRef, wordBank }) => {
  const normalized = normalizeWordBank(wordBank);
  const categories = getAvailableCategories(language, normalized);
  const languageKey = categories[0]?.words ? language : 'en';
  const allPool = combineAllCategories(normalized);

  const pickCategory = () => {
    if (category !== 'Random') {
      if (category === 'All') return allPool;
      return normalized.find((entry) => entry.category === category);
    }
    const available = categories.filter((entry) => {
      const used = usedWordsRef.current[languageKey]?.[entry.category] ?? new Set();
      return entry.words.some((word) => !used.has(word));
    });
    return randomItem(available.length ? available : categories);
  };

  const pool = pickCategory();
  const usedSet = usedWordsRef.current[languageKey]?.[pool.category] ?? new Set();

  let word = null;
  let hint = null;
  let wordsForLanguage = [];
  let groupWords = null;

  if (pool.groups && pool.groups.length > 0) {
    const groups = pool.groups.filter((group) => (group.words[languageKey] || group.words.en || []).length > 0);
    const groupsWithUnused = groups.filter((group) => {
      const list = group.words[languageKey] || group.words.en || [];
      return list.some((item) => !usedSet.has(item));
    });
    const chosenGroup = randomItem(groupsWithUnused.length ? groupsWithUnused : groups);
    groupWords = chosenGroup.words[languageKey] || chosenGroup.words.en || [];
    const unusedGroupWords = groupWords.filter((item) => !usedSet.has(item));
    const wordPool = unusedGroupWords.length ? unusedGroupWords : groupWords;
    word = randomItem(wordPool);
    hint = chosenGroup.hint[languageKey] || chosenGroup.hint.en || null;
    wordsForLanguage = pool.words[languageKey] || pool.words.en || groupWords;
  } else {
    wordsForLanguage = pool.words[languageKey] || pool.words.en;
    const unused = wordsForLanguage.filter((item) => !usedSet.has(item));
    const wordPool = unused.length ? unused : wordsForLanguage;
    word = randomItem(wordPool);
  }

  const decoySource = groupWords && groupWords.length ? groupWords : wordsForLanguage;
  const decoyPool = decoySource.filter((item) => item !== word);
  const decoyWord = decoyPool.length ? randomItem(decoyPool) : word;
  const imposterWord = hint || decoyWord;

  if (!usedWordsRef.current[languageKey]) {
    usedWordsRef.current[languageKey] = {};
  }
  if (!usedWordsRef.current[languageKey][pool.category]) {
    usedWordsRef.current[languageKey][pool.category] = new Set();
  }
  usedWordsRef.current[languageKey][pool.category].add(word);

  const roles = Array(players).fill(word);
  const imposterIndexes = shuffle([...Array(players).keys()]).slice(0, imposters);
  imposterIndexes.forEach((index) => {
    roles[index] = 'IMPOSTER';
  });

  return {
    word,
    category: pool.category,
    roles,
    imposterIndexes,
    decoyWord,
    hint,
    imposterWord
  };
};
