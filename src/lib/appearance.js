export const COMFORT_KEY = 'alcancari-comfort'
export const defaultComfort = { size: 'normal', contrast: false, motion: false }

export function normalizeComfort(value) {
  return {
    size: ['normal', 'large', 'larger'].includes(value?.size) ? value.size : 'normal',
    contrast: value?.contrast === true,
    motion: value?.motion === true,
  }
}

export function readComfort(storage) {
  try { return normalizeComfort(JSON.parse(storage.getItem(COMFORT_KEY) || 'null')) }
  catch { return { ...defaultComfort } }
}

export function reduceMotion() {
  return document.documentElement.dataset.calm === 'true' || window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
