import axios from 'axios';
import config from '../config.json';

const api = axios.create({ baseURL: config.API_BASE });

export const fetchStats = () => api.get('/stats');
export const fetchCategoryStats = () => api.get('/stats/categories');
export const fetchCategories = () => api.get('/api/categories');
export const fetchEndpoints = (category) => api.get(`/api/categories/${encodeURIComponent(category)}/endpoints`);
export const ping = () => api.get('/ping');

export { api };