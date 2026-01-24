import { formatTime } from '../../../lib/utils.js';

export default function RoundScreen({
  t,
  round,
  categoryLabels,
  timerSeconds,
  timerRunning,
  onToggleTimer,
  onResetTimer,
  onNewWord,
  onReveal,
  onHome,
  onPickStarter,
  starterName
}) {
  if (!round) return null;
  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">{t.discuss}</h2>
        <button className="ghost ghost--tiny" onClick={onHome}>{t.home}</button>
      </div>
      <div className="round-highlight">
        <div className="round-highlight__row">
          <div>
            <div className="round-highlight__label">{t.category}</div>
            <div className="round-highlight__value">{categoryLabels[round.category] || round.category}</div>
          </div>
          <button className="pill" onClick={onPickStarter}>{t.random || t.pickStarter}</button>
        </div>
        <div className="round-highlight__hint">{t.impostersLabel}: {round.imposterIndexes.length}</div>
        {starterName && (
          <div className="round-highlight__hint">{t.starter}: {starterName}</div>
        )}
      </div>

      <div className="timer">
        <div className="timer__ring">
          <div className="timer__time">{formatTime(timerSeconds)}</div>
          <div className="timer__label">{t.roundTimer}</div>
        </div>
        <div className="timer__controls">
          <button className="cta" onClick={onToggleTimer}>
            {timerRunning ? t.pause : t.start}
          </button>
          <button className="ghost" onClick={() => onResetTimer()}>{t.reset}</button>
        </div>
        <div className="timer__presets">
          {[120, 180, 240].map((value) => (
            <button
              key={value}
              className="pill"
              onClick={() => onResetTimer(value)}
            >
              {Math.floor(value / 60)} min
            </button>
          ))}
        </div>
      </div>

      <div className="round-actions">
        <button className="ghost" onClick={onNewWord}>{t.newWord}</button>
        <button className="cta" onClick={onReveal}>{t.revealAnswer}</button>
      </div>
    </section>
  );
}
