import api from './axios';

export const getAdminProducts = () =>
    api.get('/products/admin/all').then((res) => res.data);

export const createProduct = (formData) =>
    api.post('/products', formData).then((res) => res.data);

export const updateProduct = ({ id, formData }) =>
    api.put(`/products/${id}`, formData).then((res) => res.data);

export const deleteProduct = (id) =>
    api.delete(`/products/${id}`).then((res) => res.data);