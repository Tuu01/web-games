export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 12;
export const DEFAULT_TIMER = 180;

export const randomItem = (list) => list[Math.floor(Math.random() * list.length)];

export const shuffle = (list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes}:${rest.toString().padStart(2, '0')}`;
};
