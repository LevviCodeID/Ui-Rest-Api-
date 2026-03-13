import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
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
      <Container className="py-5">
        <Row className="g-4">
          {[...Array(2)].map((_, i) => (
            <Col md={6} key={i}>
              <Skeleton width="100%" height={140} />
            </Col>
          ))}
        </Row>
        <Row className="g-4 mt-3">
          {[...Array(3)].map((_, i) => (
            <Col md={4} key={i}>
              <Skeleton width="100%" height={200} />
            </Col>
          ))}
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/" className="btn btn-link text-decoration-none mb-3">
        ← Back to Home
      </Link>
      <h1 className="text-center mb-5">All Categories</h1>

      <Row className="justify-content-center g-4 mb-5">
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

      <Row className="g-4">
        {categories.map((cat) => (
          <Col md={4} key={cat.name}>
            <CategoryCard name={cat.name} count={cat.count} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}