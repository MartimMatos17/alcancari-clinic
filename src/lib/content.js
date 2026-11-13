export function getContactLinks(contacts) {
  const links = []
  const internationalPhone = /^\+[1-9]\d{7,14}$/
  const emailAddress = /^[^\s@?&#<>]+@[^\s@?&#<>]+\.[^\s@?&#<>]+$/
  const phone = contacts.phone
  const whatsapp = contacts.whatsapp
  const email = contacts.email

  if (phone?.confirmed === true && internationalPhone.test(phone.value)) {
    links.push({ type: 'phone', label: 'Telefone', value: phone.value, href: `tel:${phone.value}`, action: 'Ligar para a clínica' })
  }
  if (whatsapp?.confirmed === true && internationalPhone.test(whatsapp.value)) {
    links.push({ type: 'whatsapp', label: 'WhatsApp', value: whatsapp.value, href: `https://wa.me/${whatsapp.value.slice(1)}`, action: 'Abrir conversa', external: true })
  }
  if (email?.confirmed === true && emailAddress.test(email.value)) {
    links.push({ type: 'email', label: 'Email', value: email.value, href: `mailto:${email.value}`, action: 'Escrever à clínica' })
  }
  return links
}

export function getPublished(items) {
  return items.filter(item => item.confirmed === true && item.published === true)
}

export function isPublicAsset(path) {
  return typeof path === 'string'
    && /^\/(images|brand)\/[a-zA-Z0-9_./-]+\.(avif|webp|png|jpe?g|svg)$/.test(path)
    && !path.includes('..')
}

export function formatDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value || '')) return ''
  const date = new Date(`${value}T12:00:00Z`)
  if (Number.isNaN(date.getTime()) || date.toISOString().slice(0, 10) !== value) return ''
  return new Intl.DateTimeFormat('pt-PT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Lisbon' }).format(date)
}
