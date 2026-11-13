// Source text is rendered as React text. No WordPress markup or scripts run here.
export default function RichContent({ blocks = [], skipTitle = false }) {
  return <div className="rich-content">{blocks.map((block, index) => {
    if (skipTitle && index === 0 && block.type === 'heading') return null
    if (block.type === 'heading') {
      const Heading = block.level === 3 ? 'h3' : 'h2'
      return <Heading key={index} id={`section-${index}`}>{block.text}</Heading>
    }
    if (block.type === 'list') {
      const List = block.ordered ? 'ol' : 'ul'
      return <List key={index}>{block.items.map((item, i) => <li key={i}>{item}</li>)}</List>
    }
    return <p key={index}>{block.text}</p>
  })}</div>
}
