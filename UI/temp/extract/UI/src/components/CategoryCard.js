import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Folder2Open } from 'react-bootstrap-icons';

const CategoryCard = ({ name, count }) => {
  return (
    <Link to={`/category/${encodeURIComponent(name)}`} style={{ textDecoration: 'none' }}>
      <Card className="text-center h-100 shadow-sm hover-effect">
        <Card.Body>
          <Folder2Open size={48} className="text-primary mb-3" />
          <Card.Title>{name}</Card.Title>
          <Card.Text className="text-secondary">{count} endpoints</Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default CategoryCard;