import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CategoryCard from '../components/CategoryCard';
import Skeleton from '../components/Skeleton';
import * as api from '../services/api';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [categoryStats, setCategoryStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, catRes] = await Promise.all([
          api.fetchCategoryStats(),
          api.fetchCategories(),
        ]);
        setCategoryStats(statsRes.data);
        setCategories(catRes.data.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="stats-grid">
          <Skeleton width="100%" height={140} />
          <Skeleton width="100%" height={140} />
        </div>
        <div className="category-grid">
          <Skeleton width="100%" height={200} />
          <Skeleton width="100%" height={200} />
          <Skeleton width="100%" height={200} />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="back-link">← Back to Home</Link>
      <h1 className="page-title">All Categories</h1>

      <div className="row">
        <div className="stat-box">
          <h3>{categoryStats.totalCategories}</h3>
          <p>Total Categories</p>
        </div>
        <div className="stat-box">
          <h3>{categoryStats.totalEndpoints}</h3>
          <p>Total Endpoints</p>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((cat) => (
          <CategoryCard key={cat.name} name={cat.name} count={cat.count} />
        ))}
      </div>
    </div>
  );
}