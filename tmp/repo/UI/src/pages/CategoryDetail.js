import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import EndpointCard from '../components/EndpointCard';
import Skeleton from '../components/Skeleton';
import * as api from '../services/api';

export default function CategoryDetail() {
  const { name } = useParams();
  const [endpoints, setEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.fetchEndpoints(name);
        setEndpoints(res.data.endpoints);
      } catch (err) {
        setError('Category not found');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [name]);

  if (loading) {
    return (
      <div className="container">
        <Skeleton width="100%" height={200} />
        <Skeleton width="100%" height={200} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Link to="/categories" className="back-link">← Back to Categories</Link>
        <p className="error">{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/categories" className="back-link">← Back to Categories</Link>
      <h1 className="page-title">{name}</h1>
      <div className="endpoint-grid">
        {endpoints.map((ep, idx) => (
          <EndpointCard key={idx} endpoint={ep} />
        ))}
      </div>
    </div>
  );
}