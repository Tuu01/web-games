export default function SettingsScreen({
  t,
  language,
  onLanguageChange,
  wordsStatus,
  wordsStatusMessage,
  i18nStatus,
  i18nStatusMessage,
  onReloadWords,
  onReloadI18n,
  onCheckUpdates,
  updateMessage,
  updatedLabel,
  failedLabel,
  swVersion
}) {
  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">{t.settings}</h2>
        <button className="ghost ghost--tiny" onClick={onCheckUpdates}>{t.checkUpdates}</button>
      </div>

      <div className="control control--stack">
        <div className="control__label">{t.language}</div>
        <div className="pill-grid">
          <button
            className={`pill ${language === 'en' ? 'pill--active' : ''}`}
            onClick={() => onLanguageChange('en')}
          >
            {t.english}
          </button>
          <button
            className={`pill ${language === 'vi' ? 'pill--active' : ''}`}
            onClick={() => onLanguageChange('vi')}
          >
            {t.vietnamese}
          </button>
        </div>
      </div>

      <div className="control">
        <div>
          <div className="control__label">{t.wordsSource}</div>
          <div className="control__hint">
            {wordsStatus === 'ready' ? t.wordsLoaded : t.wordsFallback}
            {wordsStatusMessage === 'updated' && ` · ${updatedLabel}`}
            {wordsStatusMessage === 'failed' && ` · ${failedLabel}`}
          </div>
        </div>
        <button className="ghost ghost--tiny" onClick={onReloadWords}>
          {wordsStatus === 'loading' ? 'Loading...' : t.reloadWords}
        </button>
      </div>

      <div className="control">
        <div>
          <div className="control__label">{t.i18nSource}</div>
          <div className="control__hint">
            {i18nStatus === 'ready' ? t.i18nLoaded : t.i18nFallback}
            {i18nStatusMessage === 'updated' && ` · ${updatedLabel}`}
            {i18nStatusMessage === 'failed' && ` · ${failedLabel}`}
          </div>
        </div>
        <button className="ghost ghost--tiny" onClick={onReloadI18n}>
          {i18nStatus === 'loading' ? 'Loading...' : t.reloadI18n}
        </button>
      </div>

      {updateMessage && (
        <div className="update-toast">
          {updateMessage === 'updated' && t.updated}
          {updateMessage === 'partial' && t.partialUpdate}
          {updateMessage === 'failed' && t.failedUpdate}
        </div>
      )}

      <div className="update-toast">{swVersion}</div>
    </section>
  );
}
