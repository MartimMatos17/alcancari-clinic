// Optional browser QA using the installed Chrome DevTools endpoint; no npm dependencies.
// Start npm run preview on 127.0.0.1:5173 and an isolated headless Chrome on port 9223.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { publicPaths, legacyRoutes } from '../src/content/routes.js'
import { site } from '../src/content/site.js'
import mediaInventory from '../docs/media-inventory.json' with { type: 'json' }
const origin = 'http://127.0.0.1:5173'
const tabs = await (await fetch('http://127.0.0.1:9223/json')).json()
const tab = tabs.find(tab => tab.type === 'page')
assert.ok(tab, 'Start Chrome with --remote-debugging-port=9223 and an isolated temporary profile.')
const socket = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
let sequence = 0
const pending = new Map()
const failures = [], externalRequests = [], exceptions = []
socket.onmessage = event => {
  const message = JSON.parse(event.data)
  if (message.id) {
    const item = pending.get(message.id); pending.delete(message.id)
    message.error ? item.reject(new Error(JSON.stringify(message.error))) : item.resolve(message.result)
  }
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text)
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failures.push(message.params.response.url)
  if (message.method === 'Network.requestWillBeSent' && !message.params.request.url.startsWith(origin) && !message.params.request.url.startsWith('data:')) externalRequests.push(message.params.request.url)
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence; pending.set(id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails))
  return response.result.value
}
async function ready(path) {
  for (let attempt = 0; attempt < 120; attempt++) {
    if (await evaluate(`location.pathname === ${JSON.stringify(path)} && !!document.querySelector('main h1') && !document.querySelector('[role="status"].loading-message')`)) return
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  throw new Error(`Page did not render: ${path}`)
}
async function navigate(path, destination = path) { await send('Page.navigate', { url: origin + path }); await ready(destination) }
async function screenshot(name) {
  await evaluate(`Promise.all([...document.images].filter(image => { const box = image.getBoundingClientRect(); return box.width > 0 && box.bottom > 0 && box.top < innerHeight }).map(image => image.decode()))`)
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(`test-results/${name}.png`, Buffer.from(shot.data, 'base64'))
}
const normalize = value => value.replace(/\s+/g, ' ').trim()
const textBlocks = entry => entry.blocks.flatMap(block => block.items || [block.text])
const expectedContent = new Map([
  ...site.services.map(entry => [`/servicos/${entry.slug}`, [entry.summary, ...textBlocks(entry)]]),
  ...site.team.map(entry => [`/equipa/${entry.id}`, [entry.role, ...textBlocks(entry)]]),
  ...site.posts.map(entry => [`/novidades/${entry.slug}`, textBlocks(entry)]),
])
let routeChecks = 0
try {
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable')
  await mkdir('test-results', { recursive: true })
  for (const width of [1440, 390]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 960, deviceScaleFactor: 1, mobile: width < 640 })
    for (const path of publicPaths) {
      await navigate(path)
      const page = await evaluate(`({ text: document.querySelector('main').innerText, h1: document.querySelectorAll('h1').length, width: innerWidth, scrollWidth: document.documentElement.scrollWidth, title: document.title, brokenImages: [...document.images].filter(image => image.complete && image.naturalWidth === 0).length })`)
      assert.equal(page.h1, 1, path)
      assert.ok(page.scrollWidth <= page.width, `Overflow: ${width} ${path}: ${page.scrollWidth}`)
      assert.equal(page.brokenImages, 0, path)
      assert.ok(!page.text.includes('Página não encontrada'), path)
      for (const text of expectedContent.get(path) || []) assert.ok(normalize(page.text).includes(normalize(text)), `Missing source text on ${path}: ${text.slice(0, 60)}`)
      if (['/', '/servicos/terapia-ocupacional', '/equipa/vania-peixoto', '/contactos', '/novidades'].includes(path)) await screenshot(`${width}-${path === '/' ? 'home' : path.slice(1).replaceAll('/', '-')}`)
      routeChecks++
    }
  }
  for (const [path, destination] of Object.entries(legacyRoutes)) { await navigate(path + '/', destination); routeChecks++ }
  for (const path of ['/inexistente', '/servicos/inexistente', '/equipa/inexistente', '/unidades/inexistente', '/novidades/inexistente', '/login', '/dashboard']) {
    await navigate(path)
    assert.match(await evaluate('document.querySelector("main").innerText'), /não encontr|não existe|encontrar/i)
    routeChecks++
  }
  await navigate('/')
  await evaluate(`document.querySelector('.menu-toggle').click()`)
  assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'true')
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape' })
  assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'false')
  assert.equal(await evaluate(`document.activeElement === document.querySelector('.menu-toggle')`), true)
  await evaluate(`document.querySelector('.menu-toggle').click(); document.querySelector('#navegacao-principal a[href="/equipa"]').click()`)
  await ready('/equipa')
  assert.equal(await evaluate(`document.querySelector('.menu-toggle').getAttribute('aria-expanded')`), 'false')
  await evaluate(`const select = document.querySelector('select'); select.value = 'psicóloga'; select.dispatchEvent(new Event('change', { bubbles: true }))`)
  assert.equal(await evaluate(`document.querySelectorAll('.team-grid article').length`), 4)
  await evaluate(`document.querySelector('.team-grid h2 a').click()`)
  await ready('/equipa/joana-bessa')
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 1, mobile: true })
  for (const path of ['/', '/contactos', '/servicos', '/equipa', '/novidades', '/equipa/vania-peixoto']) {
    await navigate(path)
    assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `320px overflow: ${path}`)
  }
  await navigate('/unidades/leca-da-palmeira')
  await evaluate(`document.querySelector('.media-gallery summary').click()`)
  assert.equal(await evaluate(`document.querySelector('.media-gallery').open`), true)
  assert.equal(await evaluate(`document.querySelectorAll('.gallery-grid a').length`), 19)
  // Decode every recovered original in the browser, including CSS-only assets
  // and off-screen gallery images. Limit concurrency for very large originals.
  for (let start = 0; start < mediaInventory.length; start += 4) {
    const batch = mediaInventory.slice(start, start + 4).map(image => image.localPath)
    const decoded = await evaluate(`Promise.all(${JSON.stringify(batch)}.map(async src => { const image = new Image(); image.src = src; await image.decode(); return image.naturalWidth > 0 && image.naturalHeight > 0 }))`)
    assert.ok(decoded.every(Boolean))
  }
  assert.deepEqual(failures, [], 'Failed resource requests')
  assert.deepEqual(externalRequests, [], 'Unexpected external dependency')
  assert.deepEqual(exceptions, [], 'Browser runtime errors')
  const report = { recoveredImagesDecoded: mediaInventory.length, unitGallery: 'passed', routeChecks, widths: [1440, 390, 320], fullTextVerifiedInBrowser: true, mobileMenu: 'passed', specialtyFilter: 'passed', failedRequests: failures, externalRequests, exceptions }
  await writeFile('test-results/browser-report.json', JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
} finally { socket.close() }
