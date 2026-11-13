import { Link } from 'react-router-dom'
import Icon from './Icon'
import { exploreLinks } from '../content/site'

export default function ExploreLinks() {
  return <div className="explore-grid">{exploreLinks.map((item, index) => <Link key={item.to} to={item.to} className="explore-item">
    <span className="explore-number">0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p><span className="explore-arrow"><Icon name="diagonal" /></span>
  </Link>)}</div>
}
