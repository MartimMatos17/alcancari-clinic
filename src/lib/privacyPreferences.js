export const localPreferenceKeys = ['alcancari-comfort', 'alcancari-reading-size', 'alcancari-first-visit-v1', 'alcancari:connect:favorites:v1', 'alcancari:leituras-guardadas:v1']
export const sessionPreferenceKeys = ['alcancari-recent-pages-v1', 'alcancari-recent-pages-v1-paused']
export function clearSitePreferences(local, session) {
  let failed = false
  for (const [storage, keys] of [[local, localPreferenceKeys], [session, sessionPreferenceKeys]]) {
    for (const key of keys) { try { storage.removeItem(key) } catch { failed = true } }
  }
  return !failed
}
