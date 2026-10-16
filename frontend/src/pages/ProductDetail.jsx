import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Minus, Package, Plus, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useProduct } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/format';
import { imageUrl } from '../utils/image';

const MAX_QTY = 20;

export default function ProductDetail() {
    const { id } = useParams();
    const productId = Number(id);
    const validId = Number.isInteger(productId) && productId > 0;

    const { data: product, isLoading, isError, error, refetch } = useProduct(validId ? productId : null);
    const { addItem } = useCart();
    const [quantity, setQuantity] = useState(1);

    if (!validId || error?.response?.status === 404) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-16 text-center">
                <p className="text-xl font-semibold text-brand-900">Product not found</p>
                <Link to="/products" className="mt-4 inline-block text-brand-700 underline">
                    Back to all products
                </Link>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 md:grid-cols-2">
                <div className="aspect-square animate-pulse rounded-2xl bg-white" />
                <div className="space-y-4">
                    <div className="h-6 w-1/3 animate-pulse rounded bg-white" />
                    <div className="h-10 w-2/3 animate-pulse rounded bg-white" />
                    <div className="h-24 animate-pulse rounded bg-white" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-16 text-center">
                <p className="text-danger">Could not load this product.</p>
                <Button variant="outline" onClick={() => refetch()} className="mt-3">
                    Try again
                </Button>
            </div>
        );
    }

    const stars = Number(product.rating);

    const handleAdd = () => {
        addItem(product, quantity);
        toast.success(`${quantity} × ${product.name} added to cart`);
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <Link
                to="/products"
                className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline"
            >
                <ArrowLeft size={16} /> All products
            </Link>

            <div className="mt-4 grid gap-8 md:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-brand-100">
                    {product.image ? (
                        <img
                            src={imageUrl(product.image)}
                            alt={product.name}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-brand-700">
                            <Package size={64} />
                        </div>
                    )}
                    {product.discount > 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-gold-500 px-3 py-1 text-sm font-bold text-ink">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                <div>
                    <p className="text-sm font-medium uppercase tracking-wide text-gold-600">
                        {product.category?.cat_name}
                    </p>
                    <h1 className="mt-1 text-3xl font-bold text-brand-900">{product.name}</h1>

                    <div className="mt-2 flex items-center gap-0.5" aria-label={`${stars} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                                key={n}
                                size={18}
                                className={n <= stars ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}
                            />
                        ))}
                    </div>

                    <div className="mt-4 flex items-baseline gap-3">
                        <span className="text-3xl font-bold text-brand-900">
                            {formatPrice(product.price_after_discount)}
                        </span>
                        {product.discount > 0 && (
                            <span className="text-lg text-muted line-through">
                                {formatPrice(product.retail_price)}
                            </span>
                        )}
                    </div>

                    {product.description && (
                        <p className="mt-4 whitespace-pre-line text-ink">{product.description}</p>
                    )}

                    <div className="mt-6 flex flex-wrap items-center gap-4">
                        <div className="flex items-center rounded-lg border border-gray-300 bg-white">
                            <button
                                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                                className="p-3 text-brand-700 disabled:opacity-40"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-10 text-center font-semibold" aria-live="polite">
                                {quantity}
                            </span>
                            <button
                                onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
                                disabled={quantity >= MAX_QTY}
                                aria-label="Increase quantity"
                                className="p-3 text-brand-700 disabled:opacity-40"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        <Button onClick={handleAdd} className="flex-1 sm:flex-none sm:px-8">
                            <ShoppingCart size={18} className="mr-2" />
                            Add to cart
                        </Button>
                    </div>

                    <p className="mt-4 text-sm text-muted">
                        Total for {quantity}:{' '}
                        <span className="font-semibold text-brand-900">
                            {formatPrice(product.price_after_discount * quantity)}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}