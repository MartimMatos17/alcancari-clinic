import Icon from './Icon'

export default function EmptyState({ title, text, children }) {
  return <div className="empty-state"><span className="empty-mark" aria-hidden="true"><Icon name="plus" /></span><div><h2>{title}</h2><p>{text}</p>{children}</div></div>
}
