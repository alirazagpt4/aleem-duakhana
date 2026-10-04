import api from './axios';

export const loginRequest = (username, password) =>
    api.post('/auth/login', { username, password }).then((res) => res.data);

export const meRequest = () => api.get('/auth/me').then((res) => res.data);