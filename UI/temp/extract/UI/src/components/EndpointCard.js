import React, { useState } from 'react';
import { Card, Button, Collapse, Form, Modal } from 'react-bootstrap';
import { PlayFill, Sliders2, Send, Eye } from 'react-bootstrap-icons';
import { api } from '../services/api';

const EndpointCard = ({ endpoint }) => {
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (key, value) => setFormData({ ...formData, [key]: value });

  const handleTry = async () => {
    try {
      let res;
      if (endpoint.method === 'GET') {
        const params = new URLSearchParams(formData).toString();
        res = await api.get(`${endpoint.path}?${params}`);
      } else {
        res = await api.post(endpoint.path, formData);
      }
      setResponse({ status: res.status, data: res.data });
      setShowModal(true);
    } catch (err) {
      setResponse({ status: err.response?.status, data: err.response?.data });
      setShowModal(true);
    }
  };

  return (
    <Card className="shadow-sm mb-3">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <Card.Title className="text-break">{endpoint.path}</Card.Title>
          <span className={`badge bg-${endpoint.method === 'GET' ? 'primary' : 'success'}`}>
            {endpoint.method}
          </span>
        </div>
        <Card.Text className="text-secondary">{endpoint.description}</Card.Text>

        <Button
          variant="outline-primary"
          size="sm"
          className="d-flex align-items-center gap-1"
          onClick={() => setExpanded(!expanded)}
        >
          <PlayFill /> TRY IT OUT
        </Button>

        <Collapse in={expanded}>
          <div className="mt-3">
            <Card bg="dark" text="white" className="p-3">
              <h6><Sliders2 className="me-2" /> Parameters</h6>
              {Object.keys(endpoint.parameters).length === 0 ? (
                <p className="text-secondary">No parameters</p>
              ) : (
                Object.entries(endpoint.parameters).map(([key, desc]) => (
                  <Form.Group key={key} className="mb-2">
                    <Form.Label className="small">{key}</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={desc}
                      value={formData[key] || ''}
                      onChange={(e) => handleChange(key, e.target.value)}
                    />
                  </Form.Group>
                ))
              )}
              <Button variant="primary" className="mt-2" onClick={handleTry}>
                <Send className="me-2" /> Try {endpoint.method}
              </Button>
            </Card>
          </div>
        </Collapse>

        <div className="mt-2">
          <Button
            variant="outline-secondary"
            size="sm"
            className="w-100"
            onClick={() => setShowModal(true)}
          >
            <Eye className="me-2" /> Show example responses
          </Button>
        </div>
      </Card.Body>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Response</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {response && (
            <>
              <p><strong>Status:</strong> {response.status}</p>
              <pre className="bg-dark text-light p-3 rounded" style={{ maxHeight: '400px', overflow: 'auto' }}>
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default EndpointCard;