import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
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
      <Container className="py-5">
        <Skeleton width="100%" height={60} />
        <Row className="g-4 mt-3">
          <Col md={6}><Skeleton width="100%" height={300} /></Col>
          <Col md={6}><Skeleton width="100%" height={300} /></Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Link to="/categories" className="btn btn-link text-decoration-none mb-3">
          ← Back to Categories
        </Link>
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Link to="/categories" className="btn btn-link text-decoration-none mb-3">
        ← Back to Categories
      </Link>
      <h1 className="text-center mb-5">{name}</h1>
      <Row className="g-4">
        {endpoints.map((ep, idx) => (
          <Col md={6} key={idx}>
            <EndpointCard endpoint={ep} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}