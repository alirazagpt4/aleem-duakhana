import api from './axios';

export const getCategories = () => api.get('/categories').then((res) => res.data);

export const createCategory = (cat_name) =>
    api.post('/categories', { cat_name }).then((res) => res.data);

export const updateCategory = ({ id, cat_name }) =>
    api.put(`/categories/${id}`, { cat_name }).then((res) => res.data);

export const deleteCategory = (id) =>
    api.delete(`/categories/${id}`).then((res) => res.data);