import { connectKey, toggleSelection } from './connect.js'

export const FAVORITES_KEY = 'alcancari:connect:favorites:v1'

export function sanitizeFavorites(value, catalog) {
  if (!Array.isArray(value)) return []
  const allowed = new Set(catalog.filter(item => ['service', 'professional'].includes(item.type)).map(connectKey))
  const seen = new Set()
  return value.flatMap(item => {
    if (!item || typeof item.id !== 'string' || !['service', 'professional'].includes(item.type)) return []
    const key = connectKey(item)
    if (!allowed.has(key) || seen.has(key)) return []
    seen.add(key)
    return [{ type: item.type, id: item.id }]
  })
}

export function parseFavorites(raw, catalog) {
  try { return sanitizeFavorites(JSON.parse(raw || '[]'), catalog) } catch { return [] }
}

// Shared in-memory state remains usable if the browser denies storage access.
export function createFavoritesStore(catalog, getStorage) {
  const listeners = new Set()
  let snapshot = { items: [], persistent: true }

  function publish(items, persistent) {
    if (JSON.stringify(items) === JSON.stringify(snapshot.items) && persistent === snapshot.persistent) return
    snapshot = { items, persistent }
    listeners.forEach(listener => listener())
  }

  function sync() {
    try { publish(parseFavorites(getStorage().getItem(FAVORITES_KEY), catalog), true) }
    catch { publish(snapshot.items, false) }
  }

  sync()

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener) },
    sync,
    toggle(item) {
      const valid = sanitizeFavorites([item], catalog)[0]
      if (!valid) return
      let current = snapshot.items
      if (snapshot.persistent) {
        try { current = parseFavorites(getStorage().getItem(FAVORITES_KEY), catalog) } catch { /* Keep memory. */ }
      }
      const next = toggleSelection(current, valid)
      try {
        getStorage().setItem(FAVORITES_KEY, JSON.stringify(next))
        publish(next, true)
      } catch { publish(next, false) }
    },
  }
}
