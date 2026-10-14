import { useState } from 'react';
import { Pencil, Trash2, Check, X } from 'lucide-react';
import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '../../hooks/useCategories';
import Button from '../../components/ui/Button';

export default function Categories() {
    const { data: categories, isLoading, isError, refetch } = useCategories();
    const createMutation = useCreateCategory();
    const updateMutation = useUpdateCategory();
    const deleteMutation = useDeleteCategory();

    const [newName, setNewName] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editName, setEditName] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        const name = newName.trim();
        if (!name) return;
        createMutation.mutate(name, { onSuccess: () => setNewName('') });
    };

    const startEdit = (category) => {
        setEditingId(category.id);
        setEditName(category.cat_name);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditName('');
    };

    const saveEdit = () => {
        const name = editName.trim();
        if (!name) return;
        updateMutation.mutate({ id: editingId, cat_name: name }, { onSuccess: cancelEdit });
    };

    const handleDelete = (category) => {
        if (window.confirm(`Delete "${category.cat_name}"?`)) {
            deleteMutation.mutate(category.id);
        }
    };

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-brand-900">Categories</h1>
            <p className="mt-1 text-sm text-muted">Group your products into categories.</p>

            <form onSubmit={handleAdd} className="mt-6 rounded-xl bg-white p-4 shadow-sm">
                <label htmlFor="cat_name" className="mb-2 block text-sm font-medium text-ink">
                    New category
                </label>
                <div className="flex gap-3">
                    <input
                        id="cat_name"
                        name="cat_name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        maxLength={100}
                        placeholder="e.g. Honey"
                        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <Button type="submit" loading={createMutation.isPending}>
                        Add
                    </Button>
                </div>
            </form>

            <div className="mt-4 overflow-hidden rounded-xl bg-white shadow-sm">
                <div className="border-b border-gray-100 px-4 py-3 text-sm font-medium text-muted">
                    All categories {categories ? `(${categories.length})` : ''}
                </div>

                {isLoading && <p className="px-4 py-4 text-muted">Loading...</p>}

                {isError && (
                    <div className="px-4 py-4">
                        <p className="text-danger">Could not load categories.</p>
                        <Button variant="outline" onClick={() => refetch()} className="mt-3">
                            Try again
                        </Button>
                    </div>
                )}

                {categories?.length === 0 && (
                    <p className="px-4 py-4 text-muted">No categories yet. Add your first one above.</p>
                )}

                <ul className="divide-y divide-gray-100">
                    {categories?.map((category) => (
                        <li
                            key={category.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50"
                        >
                            {editingId === category.id ? (
                                <>
                                    <input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') saveEdit();
                                            if (e.key === 'Escape') cancelEdit();
                                        }}
                                        maxLength={100}
                                        autoFocus
                                        className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-500"
                                    />
                                    <button
                                        onClick={saveEdit}
                                        disabled={updateMutation.isPending}
                                        aria-label="Save"
                                        className="rounded p-2 text-brand-700 hover:bg-brand-100"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        aria-label="Cancel"
                                        className="rounded p-2 text-muted hover:bg-gray-100"
                                    >
                                        <X size={18} />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="flex-1 text-ink">{category.cat_name}</span>
                                    <button
                                        onClick={() => startEdit(category)}
                                        aria-label={`Edit ${category.cat_name}`}
                                        className="rounded p-2 text-brand-700 hover:bg-brand-100"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(category)}
                                        disabled={deleteMutation.isPending}
                                        aria-label={`Delete ${category.cat_name}`}
                                        className="rounded p-2 text-danger hover:bg-red-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}