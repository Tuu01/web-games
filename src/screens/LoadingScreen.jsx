export default function LoadingScreen({ hasError, onRetry }) {
  return (
    <div className="app">
      <section className="panel">
        <h2 className="panel__title">{hasError ? 'Failed to load data' : 'Loading data...'}</h2>
        <div className="control__hint">Make sure words.json and i18n.json are available.</div>
        {hasError && (
          <button className="cta" onClick={onRetry}>Retry</button>
        )}
      </section>
    </div>
  );
}
