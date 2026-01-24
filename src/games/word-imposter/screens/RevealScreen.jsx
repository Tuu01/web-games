export default function RevealScreen({
  t,
  round,
  displayPlayerName,
  imposterHintOn,
  onPlayAgain,
  onNewSetup,
  onHome
}) {
  if (!round) return null;
  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">{t.reveal}</h2>
        <button className="ghost ghost--tiny" onClick={onHome}>{t.home}</button>
      </div>
      <div className="reveal-card">
        <div className="reveal-card__label">{t.secretWord}</div>
        <div className="reveal-card__word">{round.word}</div>
        <div className="reveal-card__label">{t.impostersLabel}</div>
        <div className="reveal-card__imposters">
          {round.imposterIndexes.map((index) => (
            <div key={index} className="reveal-card__imposter">
              <span>{displayPlayerName(index)}</span>
              <span className="reveal-card__imposter-word">
                {imposterHintOn ? `"${round.imposterWord}"` : ''}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="round-actions">
        <button className="ghost" onClick={onPlayAgain}>{t.playAgain}</button>
        <button className="cta" onClick={onNewSetup}>{t.newSetup}</button>
      </div>
    </section>
  );
}
