export default function SetupScreen({
  t,
  players,
  setPlayers,
  imposters,
  setImposters,
  maxImposters,
  minPlayers,
  maxPlayers,
  category,
  setCategory,
  categories,
  categoryLabels,
  playerNames,
  setPlayerNames,
  imposterHintOn,
  setImposterHintOn,
  onStartRound,
  onBack
}) {
  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">{t.gameSetup}</h2>
        <button className="ghost ghost--tiny" onClick={onBack}>{t.back}</button>
      </div>

      <div className="control">
        <div>
          <div className="control__label">{t.players}</div>
          <div className="control__hint">{minPlayers} - {maxPlayers}</div>
        </div>
        <div className="stepper">
          <button
            className="stepper__btn"
            onClick={() => setPlayers((prev) => Math.max(minPlayers, prev - 1))}
            aria-label="Decrease players"
          >
            -
          </button>
          <div className="stepper__value">{players}</div>
          <button
            className="stepper__btn"
            onClick={() => setPlayers((prev) => Math.min(maxPlayers, prev + 1))}
            aria-label="Increase players"
          >
            +
          </button>
        </div>
      </div>

      <div className="control">
        <div>
          <div className="control__label">{t.imposters}</div>
          <div className="control__hint">Max {maxImposters}</div>
        </div>
        <div className="stepper">
          <button
            className="stepper__btn"
            onClick={() => setImposters((prev) => Math.max(1, prev - 1))}
            aria-label="Decrease imposters"
          >
            -
          </button>
          <div className="stepper__value">{imposters}</div>
          <button
            className="stepper__btn"
            onClick={() => setImposters((prev) => Math.min(maxImposters, prev + 1))}
            aria-label="Increase imposters"
          >
            +
          </button>
        </div>
      </div>

      <div className="control control--stack">
        <div className="control__label">{t.category}</div>
        <div className="pill-grid">
          {categories.map((item) => (
            <button
              key={item}
              className={`pill ${category === item ? 'pill--active' : ''}`}
              onClick={() => setCategory(item)}
            >
              {categoryLabels[item] || item}
            </button>
          ))}
        </div>
      </div>

      <div className="control control--stack">
        <div className="control__label">{t.playerNames}</div>
        <div className="name-grid">
          {playerNames.map((value, index) => (
            <input
              key={index}
              className="name-input"
              type="text"
              placeholder={`Player ${index + 1}`}
              value={value}
              onChange={(event) => {
                const next = [...playerNames];
                next[index] = event.target.value;
                setPlayerNames(next);
              }}
            />
          ))}
        </div>
      </div>

      <div className="control">
        <div>
          <div className="control__label">{t.imposterHint}</div>
          <div className="control__hint">{imposterHintOn ? t.hintOn : t.hintOff}</div>
        </div>
        <button
          className={`toggle ${imposterHintOn ? 'toggle--on' : ''}`}
          onClick={() => setImposterHintOn((prev) => !prev)}
          aria-pressed={imposterHintOn}
        >
          <span className="toggle__knob" />
        </button>
      </div>

      <button className="cta" onClick={onStartRound}>{t.dealRoles}</button>
    </section>
  );
}
