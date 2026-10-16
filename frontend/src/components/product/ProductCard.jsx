import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/format';
import { imageUrl } from '../../utils/image';

export default function ProductCard({ product, index = 0 }) {
    const { addItem } = useCart();
    const stars = Number(product.rating);

    const handleAdd = () => {
        addItem(product);
        toast.success(`${product.name} added to cart`);
    };

    return (
        <div
            className="animate-fade-up group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
        >
            <Link to={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden bg-brand-100">
                    {product.image ? (
                        <img
                            src={imageUrl(product.image)}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center text-brand-700">
                            <Package size={40} />
                        </div>
                    )}
                    {product.discount > 0 && (
                        <span className="absolute left-2 top-2 rounded-full bg-gold-500 px-2.5 py-1 text-xs font-bold text-ink">
                            -{product.discount}%
                        </span>
                    )}
                </div>

                <div className="space-y-1 p-3 pb-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-gold-600">
                        {product.category?.cat_name}
                    </p>
                    <h3 className="line-clamp-2 min-h-[2.5rem] font-semibold text-ink">{product.name}</h3>
                    <div className="flex items-center gap-0.5" aria-label={`${stars} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                                key={n}
                                size={14}
                                className={n <= stars ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                </div>
            </Link>

            <div className="mt-auto space-y-3 p-3">
                <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-brand-900">
                        {formatPrice(product.price_after_discount)}
                    </span>
                    {product.discount > 0 && (
                        <span className="text-sm text-muted line-through">
                            {formatPrice(product.retail_price)}
                        </span>
                    )}
                </div>
                <button
                    onClick={handleAdd}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white transition hover:bg-brand-900"
                >
                    <ShoppingCart size={16} />
                    Add to cart
                </button>
            </div>
        </div>
    );
}