import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getOrders, updateOrder } from '../api/orders.api';

export const useOrders = (params) =>
    useQuery({
        queryKey: ['orders', params],
        queryFn: () => getOrders(params),
        placeholderData: keepPreviousData,
    });

export const useUpdateOrder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            toast.success('Order status updated successfully');
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || 'Something went wrong');
        },
    });
};