import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_TIMER, MAX_PLAYERS, MIN_PLAYERS, clamp } from '../lib/utils.js';

export const usePlayers = (initialPlayers = 6) => {
  const [players, setPlayers] = useState(initialPlayers);
  const [playerNames, setPlayerNames] = useState(Array(initialPlayers).fill(''));

  useEffect(() => {
    setPlayerNames((prev) => {
      if (prev.length === players) return prev;
      if (prev.length < players) {
        return [...prev, ...Array(players - prev.length).fill('')];
      }
      return prev.slice(0, players);
    });
  }, [players]);

  const displayPlayerName = (index) => {
    const name = playerNames[index]?.trim();
    return name ? name : `Player ${index + 1}`;
  };

  return {
    players,
    setPlayers,
    playerNames,
    setPlayerNames,
    displayPlayerName
  };
};

export const useTimer = (initialSeconds = DEFAULT_TIMER) => {
  const [timerSeconds, setTimerSeconds] = useState(initialSeconds);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    if (!timerRunning) return undefined;
    if (timerSeconds <= 0) {
      setTimerRunning(false);
      return undefined;
    }
    const handle = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(handle);
  }, [timerRunning, timerSeconds]);

  const resetTimer = (value = initialSeconds) => {
    setTimerRunning(false);
    setTimerSeconds(value);
  };

  return { timerSeconds, timerRunning, setTimerRunning, resetTimer, setTimerSeconds };
};

export const useSetup = () => {
  const [imposters, setImposters] = useState(1);
  const [category, setCategory] = useState('Random');
  const [imposterHintOn, setImposterHintOn] = useState(true);

  return { imposters, setImposters, category, setCategory, imposterHintOn, setImposterHintOn };
};

export const useRound = () => {
  const [round, setRound] = useState(null);
  const [dealIndex, setDealIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [maxDrag, setMaxDrag] = useState(220);

  const resetDeal = () => {
    setDealIndex(0);
    setRevealed(false);
    setDragOffset(0);
  };

  return {
    round,
    setRound,
    dealIndex,
    setDealIndex,
    revealed,
    setRevealed,
    dragOffset,
    setDragOffset,
    maxDrag,
    setMaxDrag,
    resetDeal
  };
};

export const usePlayerBounds = (players) => {
  const safePlayers = clamp(players, MIN_PLAYERS, MAX_PLAYERS);
  const maxImposters = Math.max(1, Math.floor(safePlayers / 3));
  return { safePlayers, maxImposters };
};
