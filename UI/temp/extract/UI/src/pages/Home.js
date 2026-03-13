import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import Skeleton from '../components/Skeleton';
import * as Icon from 'react-bootstrap-icons';
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
      <Container className="py-5">
        <Row className="g-4">
          {[...Array(4)].map((_, i) => (
            <Col md={3} sm={6} key={i}>
              <Skeleton width="100%" height={140} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  const uptimeStr = `${stats.uptime.days}d ${stats.uptime.hours}h ${stats.uptime.minutes}m`;

  return (
    <Container className="py-5">
      <Row className="g-4 mb-5">
        <Col md={3} sm={6}>
          <StatsCard icon={Icon.HddStack} title="Total Requests" value={stats.totalRequests} variant="primary" />
        </Col>
        <Col md={3} sm={6}>
          <StatsCard icon={Icon.ClockHistory} title="Uptime" value={uptimeStr} variant="success" />
        </Col>
        <Col md={3} sm={6}>
          <StatsCard icon={Icon.Wifi} title="Latency" value={latency ? `${latency} ms` : 'N/A'} variant="warning" />
        </Col>
        <Col md={3} sm={6}>
          <StatsCard icon={Icon.Cpu} title="CPU Cores" value={stats.cpu.cores} variant="info" />
        </Col>
      </Row>

      <section className="text-center mb-5">
        <h2 className="mb-4">API Statistics</h2>
        <Row className="justify-content-center g-4">
          <Col md={3}>
            <Card className="text-center p-3 shadow-sm">
              <h1 className="display-4 text-primary">{categoryStats.totalCategories}</h1>
              <p className="text-secondary">Total Categories</p>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center p-3 shadow-sm">
              <h1 className="display-4 text-primary">{categoryStats.totalEndpoints}</h1>
              <p className="text-secondary">Total Endpoints</p>
            </Card>
          </Col>
        </Row>
        <Link to="/categories">
          <Button variant="primary" size="lg" className="mt-4">
            <Icon.Grid3x3GapFill className="me-2" /> Show All Categories
          </Button>
        </Link>
      </section>
    </Container>
  );
}