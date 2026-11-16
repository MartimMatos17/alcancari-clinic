import { useSyncExternalStore } from 'react'
import { site } from '../content/site.js'
import { createConnectCatalog } from '../lib/connect.js'
import { createFavoritesStore, FAVORITES_KEY } from '../lib/favorites.js'

export const connectCatalog = createConnectCatalog(site)
const store = createFavoritesStore(connectCatalog, () => window.localStorage)
const serverSnapshot = { items: [], persistent: true }
let subscribers = 0

function handleStorage(event) {
  if (event.key === null || event.key === FAVORITES_KEY) store.sync()
}

function subscribe(listener) {
  const unsubscribe = store.subscribe(listener)
  if (subscribers++ === 0) {
    window.addEventListener('storage', handleStorage)
    // Catch changes made in another tab while no favorite controls were mounted.
    if (store.getSnapshot().persistent) store.sync()
  }
  return () => {
    unsubscribe()
    if (--subscribers === 0) window.removeEventListener('storage', handleStorage)
  }
}

export default function useFavorites() {
  const snapshot = useSyncExternalStore(subscribe, store.getSnapshot, () => serverSnapshot)
  return { ...snapshot, toggle: store.toggle }
}
