import { useEffect, useState } from 'react';
import { ASSET_VERSION } from './useWordBank.js';

export const useI18n = () => {
  const [i18nData, setI18nData] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = (force = false) => {
    setStatus('loading');
    const cacheBust = force ? `&ts=${Date.now()}` : '';
    return fetch(`/i18n.json?v=${ASSET_VERSION}${cacheBust}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('bad response'))))
      .then((data) => {
        if (!data || typeof data !== 'object') {
          throw new Error('invalid i18n');
        }
        setI18nData(data);
        setStatus('ready');
        return true;
      })
      .catch(() => {
        setI18nData(null);
        setStatus('error');
        return false;
      });
  };

  useEffect(() => {
    load();
  }, []);

  return { i18nData, status, load };
};
