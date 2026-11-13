// Service-only browser QA. Uses the installed Chrome DevTools endpoint; no dependencies.
// Run npm run preview -- --port 5173 and isolated Chrome on debugging port 9223 first.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import services from '../src/content/services.json' with { type: 'json' }

const origin = 'http://127.0.0.1:5173'
const output = '/tmp/alcancari-services-qa'
const tabs = await (await fetch('http://127.0.0.1:9223/json')).json()
const tab = tabs.find(item => item.type === 'page')
assert.ok(tab, 'Start an isolated Chrome with --remote-debugging-port=9223.')
const socket = new WebSocket(tab.webSocketDebuggerUrl)
await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject })
let sequence = 0
const pending = new Map()
const exceptions = [], failedRequests = []
socket.onmessage = event => {
  const message = JSON.parse(event.data)
  if (message.id) {
    const request = pending.get(message.id)
    pending.delete(message.id)
    message.error ? request.reject(new Error(JSON.stringify(message.error))) : request.resolve(message.result)
  }
  if (message.method === 'Runtime.exceptionThrown') exceptions.push(message.params.exceptionDetails.text)
  if (message.method === 'Network.responseReceived' && message.params.response.status >= 400) failedRequests.push(message.params.response.url)
}
function send(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
}
async function evaluate(expression) {
  const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })
  if (response.exceptionDetails) throw new Error(JSON.stringify(response.exceptionDetails))
  return response.result.value
}
async function waitFor(expression) {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (await evaluate(expression)) return
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  throw new Error(`Timed out: ${expression}`)
}
async function navigate(path) {
  await send('Page.navigate', { url: origin + path })
  await waitFor(`location.pathname === ${JSON.stringify(path)} && !!document.querySelector('h1') && !document.querySelector('.loading-message')`)
}
async function screenshot(name) {
  await evaluate(`Promise.all([...document.images].filter(image => { const box = image.getBoundingClientRect(); return box.width && box.bottom > 0 && box.top < innerHeight }).map(image => image.decode()))`)
  const shot = await send('Page.captureScreenshot', { format: 'png' })
  await writeFile(`${output}/${name}.png`, Buffer.from(shot.data, 'base64'))
}
const normalize = text => text.replace(/\s+/g, ' ').trim()
let routeChecks = 0
try {
  await mkdir(output, { recursive: true })
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable')
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })
  for (const width of [1440, 768, 390, 320]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 640 })
    for (const path of ['/servicos', ...services.map(service => `/servicos/${service.slug}`)]) {
      await navigate(path)
      const page = await evaluate(`({ text: document.querySelector('main').innerText, h1: document.querySelectorAll('h1').length, main: document.querySelectorAll('main').length, overflow: document.documentElement.scrollWidth > innerWidth, missingAnchors: [...document.querySelectorAll('.service-page a[href^="#"], .services-design a[href^="#"]')].map(a => a.getAttribute('href').slice(1)).filter(id => !document.getElementById(id)) })`)
      assert.equal(page.h1, 1, path)
      assert.equal(page.main, 1, path)
      assert.equal(page.overflow, false, `Overflow ${width}px ${path}`)
      assert.deepEqual(page.missingAnchors, [], path)
      const service = services.find(item => path.endsWith('/' + item.slug))
      const texts = service ? [service.title, service.summary, ...service.blocks.flatMap(block => block.items || [block.text])] : services.flatMap(item => [item.title, item.summary])
      for (const text of texts) assert.ok(normalize(page.text).includes(normalize(text)), `Missing text: ${path}: ${text.slice(0, 70)}`)
      await evaluate(`Promise.all([...document.querySelectorAll('.service-page img, .services-design img')].map(image => { image.loading = 'eager'; return image.decode() }))`)
      assert.ok(await evaluate('document.documentElement.scrollWidth <= innerWidth'), `Overflow after image loading: ${width} ${path}`)
      if (width === 1440 && await evaluate(`document.querySelectorAll('.sv-gallery__image').length >= 2`)) {
        assert.ok(await evaluate(`document.querySelectorAll('.sv-gallery__image')[1].getBoundingClientRect().width > 400`), `Gallery column too narrow: ${path}`)
      }
      if ([1440, 390].includes(width) && ['/servicos', '/servicos/terapia-ocupacional', '/servicos/fisioterapia', '/servicos/floortime', '/servicos/intervencao-em-grupo'].includes(path)) await screenshot(`${width}-${path.slice(1).replaceAll('/', '-')}`)
      routeChecks++
    }
  }
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false })
  await navigate('/servicos/terapia-ocupacional')
  await evaluate(`document.querySelector('.sv-gallery-shortcut').click()`)
  await screenshot('1440-service-gallery')
  const previewCount = await evaluate(`document.querySelectorAll('.sv-gallery__image').length`)
  assert.equal(previewCount, 3)
  await evaluate(`document.querySelector('.sv-gallery__more').click()`)
  assert.equal(await evaluate(`document.querySelectorAll('.sv-gallery__image').length`), 22)
  await evaluate(`document.querySelector('.sv-gallery__image').click()`)
  await waitFor(`document.querySelector('dialog').open`)
  assert.equal(await evaluate(`document.activeElement.getAttribute('aria-label')`), 'Fechar galeria')
  const firstImage = await evaluate(`document.querySelector('.sv-lightbox__image').src`)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight' })
  await waitFor(`document.querySelector('.sv-lightbox__bottom p').textContent === '2 / 22'`)
  assert.notEqual(await evaluate(`document.querySelector('.sv-lightbox__image').src`), firstImage)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft' })
  await waitFor(`document.querySelector('.sv-lightbox__image').src === ${JSON.stringify(firstImage)}`)
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowLeft', code: 'ArrowLeft' })
  await waitFor(`document.querySelector('.sv-lightbox__bottom p').textContent === '22 / 22'`)
  await screenshot('1440-service-lightbox')
  for (let i = 0; i < 5; i++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 })
    assert.ok(await evaluate(`!!document.activeElement.closest('dialog') || document.activeElement === document.body`), 'Modal focus escaped to a page control')
  }
  await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 })
  await waitFor(`!document.querySelector('dialog').open`)
  assert.equal(await evaluate(`document.activeElement === document.querySelector('.sv-gallery__image')`), true)
  assert.notEqual(await evaluate(`document.body.style.overflow`), 'hidden')
  await evaluate(`document.querySelector('.sv-gallery__more').click()`)
  assert.equal(await evaluate(`document.querySelectorAll('.sv-gallery__image').length`), 3)
  await evaluate(`document.querySelector('.sv-pagination a:last-child').click()`)
  await waitFor(`document.querySelector('h1')?.textContent === 'Floortime'`)
  assert.equal(await evaluate('window.scrollY'), 0)
  assert.equal(await evaluate(`document.querySelector('.sv-gallery__more').getAttribute('aria-expanded')`), 'false')
  await evaluate(`document.querySelector('.sv-gallery__image').click()`)
  await waitFor(`document.querySelector('dialog').open`)
  await evaluate(`document.querySelector('.sv-lightbox__top button').click()`)
  await waitFor(`!document.querySelector('dialog').open`)
  await navigate('/servicos/inexistente')
  assert.match(await evaluate(`document.querySelector('main').innerText`), /não encontr|não existe|encontrar/i)
  assert.deepEqual(exceptions, [], 'Browser runtime exceptions')
  assert.deepEqual(failedRequests, [], 'Failed HTTP requests')
  const report = { routeChecks, widths: [1440, 768, 390, 320], officialText: 'all service text preserved', images: 'all rendered service images decoded', anchors: 'all targets exist', gallery: 'expand, collapse, keyboard, wrap, close, focus restoration passed', navigation: 'next service and state reset passed', unknownService: '404 view passed', exceptions, failedRequests }
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2))
  console.log(JSON.stringify(report, null, 2))
} finally { socket.close() }
