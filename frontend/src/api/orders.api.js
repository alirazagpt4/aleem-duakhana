import api from './axios';

export const getOrders = (params) =>
    api.get('/orders', { params }).then((res) => res.data);

export const getOrderById = (id) =>
    api.get(`/orders/${id}`).then((res) => res.data);

export const updateOrder = ({ id, data }) =>
    api.patch(`/orders/${id}`, data).then((res) => res.data);

// customer create order
export const createOrder = (payload) =>
    api.post('/orders', payload).then((res) => res.data);