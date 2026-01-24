import { useEffect, useState } from 'react';

export const ASSET_VERSION = '3';

export const useWordBank = () => {
  const [wordBank, setWordBank] = useState(null);
  const [status, setStatus] = useState('loading');

  const load = (force = false) => {
    setStatus('loading');
    const cacheBust = force ? `&ts=${Date.now()}` : '';
    return fetch(`/words.json?v=${ASSET_VERSION}${cacheBust}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('bad response'))))
      .then((data) => {
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('invalid word bank');
        }
        setWordBank(data);
        setStatus('ready');
        return true;
      })
      .catch(() => {
        setWordBank(null);
        setStatus('error');
        return false;
      });
  };

  useEffect(() => {
    load();
  }, []);

  return { wordBank, status, load };
};
