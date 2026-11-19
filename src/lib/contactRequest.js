export const validContactEndpoint = value => typeof value === 'string' && /^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(value)

export async function sendContactRequest(endpoint, payload, { fetcher = fetch, timeoutMs = 12000 } = {}) {
  if (!validContactEndpoint(endpoint)) return { ok: false, reason: 'configuration' }
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetcher(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload), signal: controller.signal, credentials: 'omit', redirect: 'error', referrerPolicy: 'no-referrer' })
    if (!response.ok) return { ok: false, reason: response.status === 429 ? 'rate-limit' : 'rejected' }
    // Do not show success for an unexpected HTML/error response with a 200 status.
    const result = await response.json()
    return result && typeof result === 'object' && !Array.isArray(result) && result.ok !== false && !result.error && !result.errors ? { ok: true } : { ok: false, reason: 'rejected' }
  } catch {
    return { ok: false, reason: controller.signal.aborted ? 'timeout' : 'network' }
  } finally { clearTimeout(timeout) }
}
