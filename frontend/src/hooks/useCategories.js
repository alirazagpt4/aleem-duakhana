import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../api/categories.api';

const KEY = ['categories'];

export const useCategories = () => useQuery({ queryKey: KEY, queryFn: getCategories });


const errorMessage = (err) => err.response?.data?.message || 'Something went wrong';

function useCategoryMutation(mutationFn, successMessage) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: KEY });
            queryClient.invalidateQueries({ queryKey: ['products'] });
            toast.success(successMessage);
        },
        onError: (err) => toast.error(errorMessage(err)),
    });
}


export const useCreateCategory = () => useCategoryMutation(createCategory, 'Category added');
export const useUpdateCategory = () => useCategoryMutation(updateCategory, 'Category updated');
export const useDeleteCategory = () => useCategoryMutation(deleteCategory, 'Category deleted');