import { useMutation } from '@tanstack/react-query';
import { createOrder } from '../api/orders.api';

export const usePlaceOrder = () => useMutation({ mutationFn: createOrder });