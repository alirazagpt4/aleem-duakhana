import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    getAdminProducts,
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../api/products.api';

export const useAdminProducts = () =>
    useQuery({ queryKey: ['products', 'admin'], queryFn: getAdminProducts });

export const useProducts = (categoryId) =>
    useQuery({
        queryKey: ['products', 'list', categoryId ?? 'all'],
        queryFn: () => getProducts(categoryId),
    });

export const useProduct = (id) =>
    useQuery({
        queryKey: ['products', 'detail', id],
        queryFn: () => getProduct(id),
        enabled: Boolean(id),
    });

const errorMessage = (err) => err.response?.data?.message || 'Something went wrong';

function useProductMutation(mutationFn, successMessage) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(successMessage);
        },
        onError: (err) => toast.error(errorMessage(err)),
    });
}

export const useCreateProduct = () => useProductMutation(createProduct, 'Product added');
export const useUpdateProduct = () => useProductMutation(updateProduct, 'Product updated');
export const useDeleteProduct = () => useProductMutation(deleteProduct, 'Product deleted');