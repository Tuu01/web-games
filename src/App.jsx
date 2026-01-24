import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MIN_PLAYERS, MAX_PLAYERS, DEFAULT_TIMER, clamp } from './lib/utils.js';
import { buildRound } from './games/word-imposter/logic.js';
import { useWordBank, ASSET_VERSION } from './hooks/useWordBank.js';
import { useI18n } from './hooks/useI18n.js';
import LoadingScreen from './screens/LoadingScreen.jsx';
import HomeScreen from './screens/HomeScreen.jsx';
import SettingsScreen from './screens/SettingsScreen.jsx';
import SetupScreen from './games/word-imposter/screens/SetupScreen.jsx';
import DealScreen from './games/word-imposter/screens/DealScreen.jsx';
import RoundScreen from './games/word-imposter/screens/RoundScreen.jsx';
import RevealScreen from './games/word-imposter/screens/RevealScreen.jsx';

export default function App() {
  const [screen, setScreen] = useState('home');
  const [language, setLanguage] = useState('en');

  const { wordBank, status: wordsStatus, load: reloadWordBank } = useWordBank();
  const { i18nData, status: i18nStatus, load: reloadI18n } = useI18n();

  const [wordsStatusMessage, setWordsStatusMessage] = useState('');
  const [i18nStatusMessage, setI18nStatusMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');

  const [players, setPlayers] = useState(6);
  const [playerNames, setPlayerNames] = useState(Array(6).fill(''));
  const [imposters, setImposters] = useState(1);
  const [category, setCategory] = useState('All');
  const [imposterHintOn, setImposterHintOn] = useState(true);
  const [round, setRound] = useState(null);

  const [dealIndex, setDealIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [maxDrag, setMaxDrag] = useState(220);

  const [timerSeconds, setTimerSeconds] = useState(DEFAULT_TIMER);
  const [timerRunning, setTimerRunning] = useState(false);
  const [starterName, setStarterName] = useState('');

  const usedWordsRef = useRef({});
  const dealStackRef = useRef(null);
  const dragStartRef = useRef(null);

  const isReady = wordsStatus === 'ready' && i18nStatus === 'ready' && wordBank && i18nData;
  const t = i18nData ? i18nData[language] || i18nData.en : null;
  const categoryLabels = (t && t.categoryLabels) || {};
  const updatedLabel = (t && t.updated) || 'Updated';
  const failedLabel = (t && t.failedUpdate) || 'Failed to update';

  const categories = useMemo(() => {
    if (!wordBank || wordBank.length === 0) return ['All'];
    return ['All', ...wordBank.map((entry) => entry.category)];
  }, [wordBank]);

  const maxImposters = Math.max(1, Math.floor(players / 3));
  const revealThreshold = Math.max(24, Math.round(maxDrag * 0.2));

  useEffect(() => {
    setPlayerNames((prev) => {
      if (prev.length === players) return prev;
      if (prev.length < players) {
        return [...prev, ...Array(players - prev.length).fill('')];
      }
      return prev.slice(0, players);
    });
  }, [players]);

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

  useEffect(() => {
    if (screen !== 'deal') return undefined;
    const updateMaxDrag = () => {
      const node = dealStackRef.current;
      if (!node) return;
      const height = node.getBoundingClientRect().height;
      setMaxDrag(Math.max(180, Math.min(320, Math.round(height * 0.7))));
    };
    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, [screen]);

  useEffect(() => {
    setScreen('home');
  }, []);

  useEffect(() => {
    const handlePageShow = () => {
      setScreen('home');
    };
    window.addEventListener('pageshow', handlePageShow);
    return () => window.removeEventListener('pageshow', handlePageShow);
  }, []);

  useEffect(() => {
    setStarterName('');
  }, [screen]);

  const loadWordBank = () => {
    setWordsStatusMessage('');
    return reloadWordBank(true).then((ok) => {
      setWordsStatusMessage(ok ? 'updated' : 'failed');
      setTimeout(() => setWordsStatusMessage(''), 1500);
      return ok;
    });
  };

  const loadI18n = () => {
    setI18nStatusMessage('');
    return reloadI18n(true).then((ok) => {
      setI18nStatusMessage(ok ? 'updated' : 'failed');
      setTimeout(() => setI18nStatusMessage(''), 1500);
      return ok;
    });
  };

  const checkUpdates = () => {
    Promise.all([loadWordBank(), loadI18n()]).then(([wordsOk, i18nOk]) => {
      if (wordsOk && i18nOk) {
        setUpdateMessage('updated');
      } else if (wordsOk || i18nOk) {
        setUpdateMessage('partial');
      } else {
        setUpdateMessage('failed');
      }
      setTimeout(() => setUpdateMessage(''), 2000);
    });
  };

  const resetTimer = (value = DEFAULT_TIMER) => {
    setTimerRunning(false);
    setTimerSeconds(value);
  };

  const displayPlayerName = (index) => {
    const name = playerNames[index]?.trim();
    return name ? name : `Player ${index + 1}`;
  };

  const pickStarter = () => {
    if (players <= 0) return;
    const index = Math.floor(Math.random() * players);
    setStarterName(displayPlayerName(index));
  };

  const startRound = () => {
    if (!wordBank || wordBank.length === 0) return;
    const safePlayers = clamp(players, MIN_PLAYERS, MAX_PLAYERS);
    const safeImposters = clamp(imposters, 1, Math.max(1, Math.floor(safePlayers / 3)));
    const newRound = buildRound({
      players: safePlayers,
      imposters: safeImposters,
      category,
      language,
      usedWordsRef,
      wordBank
    });

    setRound(newRound);
    setPlayers(safePlayers);
    setImposters(safeImposters);
    setDealIndex(0);
    setRevealed(false);
    setTimerSeconds(DEFAULT_TIMER);
    setTimerRunning(false);
    setScreen('deal');
  };

  const handleNextPlayer = () => {
    if (!round) return;
    if (dealIndex < round.roles.length - 1) {
      setDealIndex((prev) => prev + 1);
      setRevealed(false);
      setDragOffset(0);
    } else {
      setScreen('round');
      setRevealed(false);
      setDragOffset(0);
    }
  };

  const handleDealPointerDown = (event) => {
    if (!round) return;
    event.preventDefault();
    dragStartRef.current = event.clientY;
    setDragOffset(0);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDealPointerMove = (event) => {
    if (!round || dragStartRef.current === null) return;
    event.preventDefault();
    const delta = dragStartRef.current - event.clientY;
    const clamped = clamp(delta, 0, maxDrag);
    setDragOffset(clamped);
    setRevealed(clamped > revealThreshold);
  };

  const handleDealPointerUp = () => {
    setDragOffset(0);
    setRevealed(false);
    dragStartRef.current = null;
  };

  const handleDealTouchStart = (event) => {
    if (!round) return;
    event.preventDefault();
    dragStartRef.current = event.touches[0].clientY;
    setDragOffset(0);
  };

  const handleDealTouchMove = (event) => {
    if (!round || dragStartRef.current === null) return;
    event.preventDefault();
    const delta = dragStartRef.current - event.touches[0].clientY;
    const clamped = clamp(delta, 0, maxDrag);
    setDragOffset(clamped);
    setRevealed(clamped > revealThreshold);
  };

  const handleDealTouchEnd = () => {
    setDragOffset(0);
    setRevealed(false);
    dragStartRef.current = null;
  };

  if (!isReady) {
    const hasError = wordsStatus === 'error' || i18nStatus === 'error';
    return <LoadingScreen hasError={hasError} onRetry={checkUpdates} />;
  }

  const titleText = screen === 'home' || screen === 'settings'
    ? t.homeTitle
    : screen === 'setup'
      ? t.gameSetup
      : t.wordImposter;
  const swVersion = `sw:${ASSET_VERSION}`;

  return (
    <div className="app">
      <header className="hero">
        <div className="hero__top">
          <div className="hero__badge">Offline party game</div>
          <div className="hero__actions">
            {screen !== 'home' && (
              <button className="ghost ghost--tiny" onClick={() => setScreen('home')}>
                {t.home}
              </button>
            )}
            <button className="ghost ghost--tiny" onClick={() => setScreen('settings')}>
              {t.settings}
            </button>
          </div>
        </div>
        <h1 className="hero__title">{titleText}</h1>
        <p className="hero__subtitle">{t.homeSubtitle}</p>
      </header>

      {screen === 'home' && (
        <HomeScreen
          t={t}
          onSelectWordImposter={() => setScreen('setup')}
        />
      )}

      {screen === 'settings' && (
        <SettingsScreen
          t={t}
          language={language}
          onLanguageChange={setLanguage}
          wordsStatus={wordsStatus}
          wordsStatusMessage={wordsStatusMessage}
          i18nStatus={i18nStatus}
          i18nStatusMessage={i18nStatusMessage}
          onReloadWords={loadWordBank}
          onReloadI18n={loadI18n}
          onCheckUpdates={checkUpdates}
          updateMessage={updateMessage}
          updatedLabel={updatedLabel}
          failedLabel={failedLabel}
          swVersion={swVersion}
        />
      )}

      {screen === 'setup' && (
        <SetupScreen
          t={t}
          players={players}
          setPlayers={setPlayers}
          imposters={imposters}
          setImposters={setImposters}
          maxImposters={maxImposters}
          minPlayers={MIN_PLAYERS}
          maxPlayers={MAX_PLAYERS}
          category={category}
          setCategory={setCategory}
          categories={categories}
          categoryLabels={categoryLabels}
          playerNames={playerNames}
          setPlayerNames={setPlayerNames}
          imposterHintOn={imposterHintOn}
          setImposterHintOn={setImposterHintOn}
          onStartRound={startRound}
          onBack={() => setScreen('home')}
        />
      )}

      {screen === 'deal' && (
        <DealScreen
          t={t}
          round={round}
          revealed={revealed}
          dragOffset={dragOffset}
          maxDrag={maxDrag}
          dealIndex={dealIndex}
          displayPlayerName={displayPlayerName}
          imposterHintOn={imposterHintOn}
          onPointerDown={handleDealPointerDown}
          onPointerMove={handleDealPointerMove}
          onPointerUp={handleDealPointerUp}
          onTouchStart={handleDealTouchStart}
          onTouchMove={handleDealTouchMove}
          onTouchEnd={handleDealTouchEnd}
          onNextPlayer={handleNextPlayer}
          onStartOver={() => setScreen('setup')}
          onHome={() => setScreen('home')}
          dealStackRef={dealStackRef}
        />
      )}

      {screen === 'round' && (
        <RoundScreen
          t={t}
          round={round}
          categoryLabels={categoryLabels}
          timerSeconds={timerSeconds}
          timerRunning={timerRunning}
          onToggleTimer={() => setTimerRunning((prev) => !prev)}
          onResetTimer={resetTimer}
          onNewWord={startRound}
          onReveal={() => setScreen('reveal')}
          onHome={() => setScreen('home')}
          onPickStarter={pickStarter}
          starterName={starterName}
        />
      )}

      {screen === 'reveal' && (
        <RevealScreen
          t={t}
          round={round}
          displayPlayerName={displayPlayerName}
          imposterHintOn={imposterHintOn}
          onPlayAgain={startRound}
          onNewSetup={() => setScreen('setup')}
          onHome={() => setScreen('home')}
        />
      )}

      <footer className="footer">
        {t.footer}
      </footer>
    </div>
  );
}
