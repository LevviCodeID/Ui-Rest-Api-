import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE || 'https://api.levvicode.cloud';

const api = axios.create({ baseURL: API_BASE });

export const fetchStats = () => api.get('/stats');
export const fetchCategoryStats = () => api.get('/stats/categories');
export const fetchCategories = () => api.get('/api/categories');
export const fetchEndpoints = (category) => api.get(`/api/categories/${encodeURIComponent(category)}/endpoints`);
export const ping = () => api.get('/ping');

export { api };