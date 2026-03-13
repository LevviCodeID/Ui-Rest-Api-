import { Link } from 'react-router-dom';

export default function CategoryCard({ name, count }) {
  return (
    <Link to={`/category/${encodeURIComponent(name)}`} className="category-card">
      <i className="bi bi-folder2-open icon"></i>
      <h3>{name}</h3>
      <p>{count} endpoints</p>
    </Link>
  );
}