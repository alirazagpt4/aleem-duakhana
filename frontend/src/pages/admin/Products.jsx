import { useEffect, useState } from 'react';
import { Package, Pencil, Trash2, Eye, EyeOff, Plus, X } from 'lucide-react';
import {
    useAdminProducts,
    useCreateProduct,
    useUpdateProduct,
    useDeleteProduct,
} from '../../hooks/useProducts';
import { useCategories } from '../../hooks/useCategories';
import Button from '../../components/ui/Button';
import { formatPrice } from '../../utils/format';
import { imageUrl } from '../../utils/image';

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const calcPrice = (retail, discount) => Math.round(retail - (retail * discount) / 100);

const inputClass = (hasError) =>
    `w-full rounded-lg border bg-white px-3 py-2 text-ink outline-none focus:ring-2 focus:ring-brand-500 ${hasError ? 'border-danger' : 'border-gray-300'
    }`;

function Field({ label, error, children }) {
    return (
        <div>
            <label className="mb-1 block text-sm font-medium text-ink">{label}</label>
            {children}
            {error && <p className="mt-1 text-sm text-danger">{error}</p>}
        </div>
    );
}

export default function Products() {
    const { data: products, isLoading, isError, refetch } = useAdminProducts();
    const updateMutation = useUpdateProduct();
    const deleteMutation = useDeleteProduct();
    const [modal, setModal] = useState(null);

    const toggleActive = (product) => {
        const formData = new FormData();
        formData.append('is_active', String(!product.is_active));
        updateMutation.mutate({ id: product.id, formData });
    };

    const handleDelete = (product) => {
        const message = `Delete "${product.name}" permanently?\nPast orders are kept. Hiding the product is safer.`;
        if (window.confirm(message)) {
            deleteMutation.mutate(product.id);
        }
    };

    return (
        <div>
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-brand-900">Products</h1>
                    <p className="mt-1 text-sm text-muted">
                        {products ? `${products.length} products` : 'Manage your catalog.'}
                    </p>
                </div>
                <Button onClick={() => setModal({ product: null })}>
                    <Plus size={18} className="mr-1" />
                    Add product
                </Button>
            </div>

            <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
                {isLoading && <p className="px-4 py-4 text-muted">Loading...</p>}

                {isError && (
                    <div className="px-4 py-4">
                        <p className="text-danger">Could not load products.</p>
                        <Button variant="outline" onClick={() => refetch()} className="mt-3">
                            Try again
                        </Button>
                    </div>
                )}

                {products?.length === 0 && (
                    <p className="px-4 py-4 text-muted">No products yet. Add your first one.</p>
                )}

                {products?.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="border-b border-gray-100 text-muted">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Product</th>
                                    <th className="px-4 py-3 font-medium">Category</th>
                                    <th className="px-4 py-3 font-medium">Price</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 text-right font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {product.image ? (
                                                    <img
                                                        src={imageUrl(product.image)}
                                                        alt={product.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                                                        <Package size={20} />
                                                    </div>
                                                )}
                                                <span className="font-medium text-ink">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-ink">{product.category?.cat_name}</td>
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-ink">
                                                {formatPrice(product.price_after_discount)}
                                            </span>
                                            {product.discount > 0 && (
                                                <span className="ml-2 text-xs text-muted line-through">
                                                    {formatPrice(product.retail_price)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`rounded-full px-2.5 py-1 text-xs font-medium ${product.is_active
                                                    ? 'bg-brand-100 text-brand-900'
                                                    : 'bg-gray-100 text-muted'
                                                    }`}
                                            >
                                                {product.is_active ? 'Active' : 'Hidden'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-end gap-1">
                                                <button
                                                    onClick={() => toggleActive(product)}
                                                    disabled={updateMutation.isPending}
                                                    aria-label={product.is_active ? `Hide ${product.name}` : `Show ${product.name}`}
                                                    title={product.is_active ? 'Hide from store' : 'Show in store'}
                                                    className="rounded p-2 text-muted hover:bg-gray-100"
                                                >
                                                    {product.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                                <button
                                                    onClick={() => setModal({ product })}
                                                    aria-label={`Edit ${product.name}`}
                                                    title="Edit"
                                                    className="rounded p-2 text-brand-700 hover:bg-brand-100"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product)}
                                                    disabled={deleteMutation.isPending}
                                                    aria-label={`Delete ${product.name}`}
                                                    title="Delete"
                                                    className="rounded p-2 text-danger hover:bg-red-50"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modal && (
                <ProductModal
                    key={modal.product?.id ?? 'new'}
                    product={modal.product}
                    onClose={() => setModal(null)}
                />
            )}
        </div>
    );
}

function ProductModal({ product, onClose }) {
    const isEdit = Boolean(product);
    const { data: categories } = useCategories();
    const createMutation = useCreateProduct();
    const updateMutation = useUpdateProduct();
    const saving = createMutation.isPending || updateMutation.isPending;

    const [form, setForm] = useState({
        name: product?.name ?? '',
        category_id: product ? String(product.category_id) : '',
        retail_price: product ? String(product.retail_price) : '',
        discount: product ? String(product.discount) : '0',
        rating: product?.rating ?? '5',
        description: product?.description ?? '',
        is_active: product?.is_active ?? true,
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [imageError, setImageError] = useState('');

    const close = () => {
        if (!saving) onClose();
    };

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'Escape' && !saving) onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [saving, onClose]);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(file);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [file]);

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const handleFile = (e) => {
        const picked = e.target.files[0];
        if (!picked) return;

        if (!IMAGE_TYPES.includes(picked.type)) {
            setImageError('Only JPG, PNG or WEBP images are allowed');
            e.target.value = '';
            return;
        }
        if (picked.size > MAX_IMAGE_SIZE) {
            setImageError('Image must be under 2MB');
            e.target.value = '';
            return;
        }
        setImageError('');
        setFile(picked);
    };

    const retailNum = Number(form.retail_price);
    const discountNum = Number(form.discount);
    const validPrice =
        Number.isInteger(retailNum) &&
        retailNum > 0 &&
        form.discount !== '' &&
        Number.isInteger(discountNum) &&
        discountNum >= 0 &&
        discountNum <= 100;
    const previewPrice = validPrice ? calcPrice(retailNum, discountNum) : null;

    const validate = () => {
        const next = {};
        if (!form.name.trim()) next.name = 'Name is required';
        if (!form.category_id) next.category_id = 'Choose a category';
        if (!Number.isInteger(retailNum) || retailNum < 1) {
            next.retail_price = 'Enter a whole number above 0';
        }
        if (
            form.discount === '' ||
            !Number.isInteger(discountNum) ||
            discountNum < 0 ||
            discountNum > 100
        ) {
            next.discount = 'Enter a whole number from 0 to 100';
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) return;

        const formData = new FormData();
        formData.append('name', form.name.trim());
        formData.append('category_id', form.category_id);
        formData.append('retail_price', form.retail_price);
        formData.append('discount', form.discount);
        formData.append('rating', form.rating);
        formData.append('description', form.description.trim());
        formData.append('is_active', String(form.is_active));
        if (file) formData.append('image', file);

        if (isEdit) {
            updateMutation.mutate({ id: product.id, formData }, { onSuccess: onClose });
        } else {
            createMutation.mutate(formData, { onSuccess: onClose });
        }
    };

    const currentImage = preview || (product?.image ? imageUrl(product.image) : null);

    return (
        <div
            role="dialog"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) close();
            }}
        >
            <form
                onSubmit={handleSubmit}
                className="my-8 w-full max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow-xl"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-brand-900">
                        {isEdit ? 'Edit product' : 'Add product'}
                    </h2>
                    <button
                        type="button"
                        onClick={close}
                        aria-label="Close"
                        className="rounded p-1 text-muted hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <Field label="Name" error={errors.name}>
                    <input
                        value={form.name}
                        onChange={set('name')}
                        maxLength={200}
                        autoFocus
                        className={inputClass(errors.name)}
                    />
                </Field>

                <Field label="Category" error={errors.category_id}>
                    <select
                        value={form.category_id}
                        onChange={set('category_id')}
                        className={inputClass(errors.category_id)}
                    >
                        <option value="">Select a category</option>
                        {categories?.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.cat_name}
                            </option>
                        ))}
                    </select>
                    {categories?.length === 0 && (
                        <p className="mt-1 text-sm text-muted">Add a category first from the Categories page.</p>
                    )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Retail price (Rs)" error={errors.retail_price}>
                        <input
                            type="number"
                            min="1"
                            step="1"
                            value={form.retail_price}
                            onChange={set('retail_price')}
                            className={inputClass(errors.retail_price)}
                        />
                    </Field>
                    <Field label="Discount (%)" error={errors.discount}>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={form.discount}
                            onChange={set('discount')}
                            className={inputClass(errors.discount)}
                        />
                    </Field>
                </div>

                <p className="rounded-lg bg-brand-100 px-3 py-2 text-sm text-brand-900">
                    Customer pays:{' '}
                    <span className="font-semibold">
                        {previewPrice !== null ? formatPrice(previewPrice) : '—'}
                    </span>
                </p>

                <Field label="Rating">
                    <select value={form.rating} onChange={set('rating')} className={inputClass(false)}>
                        {[5, 4, 3, 2, 1].map((n) => (
                            <option key={n} value={n}>
                                {n} {n === 1 ? 'star' : 'stars'}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Description">
                    <textarea
                        value={form.description}
                        onChange={set('description')}
                        rows={4}
                        className={inputClass(false)}
                    />
                </Field>

                <Field label="Image" error={imageError}>
                    <div className="flex items-center gap-3">
                        {currentImage ? (
                            <img src={currentImage} alt="Preview" className="h-16 w-16 rounded-lg object-cover" />
                        ) : (
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                                <Package size={24} />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFile}
                                className="block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-100 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-900"
                            />
                            <p className="mt-1 text-xs text-muted">
                                JPG, PNG or WEBP, max 2MB.
                                {isEdit && ' Leave empty to keep the current image.'}
                            </p>
                        </div>
                    </div>
                </Field>

                <label className="flex items-center gap-2 text-sm text-ink">
                    <input
                        type="checkbox"
                        checked={form.is_active}
                        onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
                        className="h-4 w-4 accent-brand-700"
                    />
                    Visible in store
                </label>

                <div className="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" onClick={close} disabled={saving}>
                        Cancel
                    </Button>
                    <Button type="submit" loading={saving}>
                        {isEdit ? 'Save changes' : 'Add product'}
                    </Button>
                </div>
            </form>
        </div>
    );
}