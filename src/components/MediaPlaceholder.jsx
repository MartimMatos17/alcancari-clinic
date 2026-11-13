import { isPublicAsset } from '../lib/content'

export default function MediaPlaceholder({ image, label = 'Fotografia da clínica', variant = 'sand', eager = false, className = '' }) {
  if (image && isPublicAsset(image.src) && image.alt) {
    return <figure className={`media-frame ${className}`}><img src={image.src} alt={image.alt} width={image.width || 960} height={image.height || 1080} loading={eager ? 'eager' : 'lazy'} decoding="async" className="h-full w-full object-cover" /></figure>
  }
  return (
    <figure className={`media-frame media-placeholder media-${variant} ${className}`}>
      <div className="placeholder-lines" aria-hidden="true"><span /><span /><span /></div>
      <span className="placeholder-word" aria-hidden="true">a.</span>
      <figcaption><span className="placeholder-dot" aria-hidden="true" />{label}<span className="placeholder-status">Imagem em falta</span></figcaption>
    </figure>
  )
}
