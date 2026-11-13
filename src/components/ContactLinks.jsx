import { site } from '../content/site'
import { getContactLinks } from '../lib/content'
import Icon from './Icon'

export default function ContactLinks() {
  const contacts = getContactLinks(site.contacts)
  if (!contacts.length) return null
  return <div className="contact-grid">{contacts.map(contact => <a className="contact-card" key={contact.type} href={contact.href} {...(contact.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
    <Icon name={contact.type} /><h2>{contact.label}</h2><span className="contact-value">{contact.value}</span><span className="text-link">{contact.action}<Icon name={contact.external ? 'diagonal' : 'arrow'} /></span>
  </a>)}</div>
}
