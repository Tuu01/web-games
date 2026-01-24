export default function DealScreen({
  t,
  round,
  revealed,
  dragOffset,
  maxDrag,
  dealIndex,
  displayPlayerName,
  imposterHintOn,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onTouchStart,
  onTouchMove,
  onTouchEnd,
  onNextPlayer,
  onStartOver,
  onHome,
  dealStackRef
}) {
  if (!round) return null;
  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">{t.secretDeal}</h2>
        <button className="ghost ghost--tiny" onClick={onHome}>{t.home}</button>
      </div>
      <div className="deal-stack" ref={dealStackRef}>
        <div className={`deal-card deal-card--base ${revealed ? 'deal-card--revealed' : ''}`}>
          <div className="deal-card__face deal-card__face--reveal">
            <div className="deal-card__label">{t.yourRole}</div>
            <div className={`deal-card__word ${round.roles[dealIndex] === 'IMPOSTER' ? 'imposter' : ''}`}>
              {round.roles[dealIndex] === 'IMPOSTER' && imposterHintOn ? round.imposterWord : round.roles[dealIndex]}
            </div>
            <div className="deal-card__prompt">{t.releaseHide}</div>
          </div>
        </div>
        <div
          className={`deal-card deal-card--cover ${revealed ? 'deal-card--lifted' : ''}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          role="button"
          tabIndex={0}
          style={{ transform: `translateY(${-dragOffset}px)` }}
        >
          <div className="deal-card__face">
            <div className="deal-card__label">{displayPlayerName(dealIndex)}</div>
          </div>
        </div>
      </div>
      <div className="reveal-strip">
        <div className="reveal-strip__label">{t.dragReveal}</div>
        <div className="reveal-strip__bar">
          <div className="reveal-strip__fill" style={{ width: `${Math.min(100, (dragOffset / maxDrag) * 100)}%` }} />
        </div>
      </div>
      <div className="deal-progress">{dealIndex + 1} / {round.roles.length}</div>
      <button className="cta" onClick={onNextPlayer} disabled={revealed}>
        {dealIndex < round.roles.length - 1 ? t.nextPlayer : t.discuss}
      </button>
      <button className="ghost" onClick={onStartOver}>{t.startOver}</button>
    </section>
  );
}
