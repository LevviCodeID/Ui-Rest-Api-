import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import Skeleton from '../components/Skeleton';
import * as api from '../services/api';

export default function Home() {
  const [stats, setStats] = useState(null);
  const [categoryStats, setCategoryStats] = useState(null);
  const [latency, setLatency] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, catRes, pingRes] = await Promise.all([
        api.fetchStats(),
        api.fetchCategoryStats(),
        api.ping(),
      ]);
      setStats(statsRes.data.stats);
      setCategoryStats(catRes.data);
      setLatency(pingRes.config?.metadata?.startTime ? Date.now() - pingRes.config.metadata.startTime : 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="stats-grid">
          <Skeleton width="100%" height={140} />
          <Skeleton width="100%" height={140} />
          <Skeleton width="100%" height={140} />
          <Skeleton width="100%" height={140} />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="stats-grid">
        <StatsCard icon="bi-hdd-stack" title="Total Requests" value={stats.totalRequests} color="#3b82f6" />
        <StatsCard icon="bi-clock-history" title="Uptime" value={`${stats.uptime.days}d ${stats.uptime.hours}h ${stats.uptime.minutes}m`} color="#8b5cf6" />
        <StatsCard icon="bi-wifi" title="Latency" value={latency ? `${latency} ms` : 'N/A'} color="#10b981" />
        <StatsCard icon="bi-cpu" title="CPU Cores" value={stats.cpu.cores} color="#60a5fa" />
      </div>

      <section className="section">
        <h2 className="section-title">API Statistics</h2>
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
        <Link to="/categories" className="btn-primary">Show All Categories</Link>
      </section>
    </div>
  );
}