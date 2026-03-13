import { useState } from 'react';
import { api } from '../services/api';

export default function EndpointCard({ endpoint }) {
  const [expanded, setExpanded] = useState(false);
  const [formData, setFormData] = useState({});
  const [response, setResponse] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
      setModalOpen(true);
    } catch (err) {
      setResponse({ status: err.response?.status, data: err.response?.data });
      setModalOpen(true);
    }
  };

  return (
    <div className="endpoint-card">
      <div className="endpoint-header">
        <h5>{endpoint.path}</h5>
        <span className={`method-badge method-${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
      </div>
      <p className="description">{endpoint.description}</p>

      <button className="try-btn" onClick={() => setExpanded(!expanded)}>
        <i className="bi bi-play-fill"></i> TRY IT OUT
      </button>

      {expanded && (
        <div className="try-form">
          <h6><i className="bi bi-sliders2"></i> Parameters</h6>
          {Object.keys(endpoint.parameters).length === 0 ? (
            <p className="text-muted">No parameters</p>
          ) : (
            Object.entries(endpoint.parameters).map(([key, desc]) => (
              <div key={key} className="param-item">
                <label>{key}</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder={desc}
                  value={formData[key] || ''}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              </div>
            ))
          )}
          <button className="btn-primary" onClick={handleTry}>
            <i className="bi bi-send"></i> Try {endpoint.method}
          </button>
        </div>
      )}

      {modalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h5>Response</h5>
            <p><strong>Status:</strong> {response?.status}</p>
            <pre>{JSON.stringify(response?.data, null, 2)}</pre>
            <button onClick={() => setModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}