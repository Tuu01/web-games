export default function HomeScreen({ t, onSelectWordImposter }) {
  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">{t.selectGame}</h2>
      </div>
      <div className="game-grid">
        <button className="game-card" onClick={onSelectWordImposter}>
          <div className="game-card__title">{t.wordImposter}</div>
          <div className="game-card__desc">{t.wordImposterDesc}</div>
          <div className="game-card__tag">3-12 players</div>
        </button>
        <div className="game-card game-card--locked">
          <div className="game-card__title">{t.comingSoon}</div>
          <div className="game-card__desc">{t.moreGames}</div>
          <div className="game-card__tag">{t.locked}</div>
        </div>
      </div>
    </section>
  );
}
