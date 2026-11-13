// Build-only integration: Instagram API with Facebook Login.
// Setup: professional Instagram linked to a Facebook Page; Meta app authorized
// for instagram_basic + pages_read_engagement (pages_show_list for discovery).
// Use the access level/App Review required by the account's relationship to the app.
// In the build provider's secrets, set INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID,
// META_GRAPH_VERSION (supported vNN.N). Never use VITE_* or commit credentials.
// Schedule the normal build in the hosting provider; manage token renewal there.
// https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api
export default function instagramFeed() {
  const virtualId = '\0virtual:instagram-feed'
  return {
    name: 'instagram-feed',
    resolveId(id) { if (id === 'virtual:instagram-feed') return virtualId },
    async load(id) {
      if (id !== virtualId) return
      const empty = 'export default []'
      const token = process.env.INSTAGRAM_ACCESS_TOKEN
      const account = process.env.INSTAGRAM_ACCOUNT_ID
      const version = process.env.META_GRAPH_VERSION
      if (!token || !account || !version) { this.warn('Instagram não configurado: mantidos os artigos existentes.'); return empty }
      if (!/^\d+$/.test(account) || !/^v\d+\.\d+$/.test(version)) { this.warn('Configuração Instagram inválida; mantidos os artigos existentes.'); return empty }
      try {
        const request = async (path, fields) => {
          const url = new URL(`https://graph.facebook.com/${version}/${path}`)
          url.searchParams.set('fields', fields)
          url.searchParams.set('limit', '12')
          const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(15000), redirect: 'error' })
          if (!response.ok) throw new Error('API indisponível')
          const body = await response.json()
          if (body.error) throw new Error('API indisponível')
          return body
        }
        const profile = await request(account, 'username')
        if (profile.username !== 'clinica.alcancari') throw new Error('Conta não autorizada')
        const body = await request(`${account}/media`, 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp')
        if (!Array.isArray(body.data)) throw new Error('Resposta inválida')
        const posts = []
        for (const item of body.data) {
          if (!/^\d+$/.test(item.id) || !Number.isFinite(Date.parse(item.timestamp))) continue
          const link = new URL(item.permalink)
          if (link.protocol !== 'https:' || !['www.instagram.com', 'instagram.com'].includes(link.hostname)) continue
          const imageUrl = new URL(item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url)
          if (imageUrl.protocol !== 'https:' || !/(^|\.)(cdninstagram\.com|fbcdn\.net)$/.test(imageUrl.hostname)) continue
          const response = await fetch(imageUrl, { redirect: 'error', signal: AbortSignal.timeout(15000) })
          const type = response.headers.get('content-type')?.split(';')[0]
          const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type]
          if (!response.ok || !extension) continue
          const bytes = new Uint8Array(await response.arrayBuffer())
          if (bytes.length > 12 * 1024 * 1024) continue
          const fileName = `images/instagram/${item.id}.${extension}`
          this.emitFile({ type: 'asset', fileName, source: bytes })
          posts.push({ id: item.id, caption: typeof item.caption === 'string' ? item.caption : '', date: item.timestamp, url: link.href, image: `/${fileName}` })
        }
        posts.sort((a, b) => Date.parse(b.date) - Date.parse(a.date))
        return `export default ${JSON.stringify(posts)}`
      } catch {
        // Do not log API errors/URLs: they may include credentials or signed URLs.
        this.warn('Instagram indisponível ou autorização inválida: mantidos os artigos existentes. Verifique a configuração privada do build.')
        return empty
      }
    },
  }
}
