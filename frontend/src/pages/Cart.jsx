import { Link } from 'react-router-dom';
import { Minus, Package, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { imageUrl } from '../utils/image';

const MAX_QTY = 20;

export default function Cart() {
    const { items, setQuantity, removeItem, clear, subtotal, totalItems } = useCart();

    if (items.length === 0) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-16 text-center">
                <ShoppingCart size={48} className="mx-auto text-brand-700" />
                <p className="mt-4 text-xl font-semibold text-brand-900">Your cart is empty</p>
                <Link
                    to="/products"
                    className="mt-4 inline-block rounded-lg bg-brand-700 px-5 py-2 font-semibold text-white hover:bg-brand-900"
                >
                    Browse products
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-brand-900">Your cart</h1>
                <button
                    onClick={() => {
                        if (window.confirm('Remove all items from your cart?')) clear();
                    }}
                    className="text-sm text-danger hover:underline"
                >
                    Clear cart
                </button>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
                <ul className="space-y-3">
                    {items.map((item) => (
                        <li
                            key={item.product_id}
                            className="flex gap-4 rounded-2xl bg-white p-3 shadow-sm"
                        >
                            <Link
                                to={`/products/${item.product_id}`}
                                className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-brand-100"
                            >
                                {item.image ? (
                                    <img
                                        src={imageUrl(item.image)}
                                        alt={item.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-brand-700">
                                        <Package size={28} />
                                    </div>
                                )}
                            </Link>

                            <div className="flex min-w-0 flex-1 flex-col justify-between">
                                <div className="flex items-start justify-between gap-2">
                                    <Link
                                        to={`/products/${item.product_id}`}
                                        className="line-clamp-2 font-semibold text-ink hover:text-brand-700"
                                    >
                                        {item.name}
                                    </Link>
                                    <button
                                        onClick={() => removeItem(item.product_id)}
                                        aria-label={`Remove ${item.name}`}
                                        className="rounded p-1 text-danger hover:bg-red-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <div className="flex items-center rounded-lg border border-gray-300">
                                        <button
                                            onClick={() => setQuantity(item.product_id, item.quantity - 1)}
                                            aria-label="Decrease quantity"
                                            className="p-2 text-brand-700"
                                        >
                                            <Minus size={14} />
                                        </button>
                                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                        <button
                                            onClick={() => setQuantity(item.product_id, item.quantity + 1)}
                                            disabled={item.quantity >= MAX_QTY}
                                            aria-label="Increase quantity"
                                            className="p-2 text-brand-700 disabled:opacity-40"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-brand-900">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                        <p className="text-xs text-muted">{formatPrice(item.price)} each</p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>

                <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-24">
                    <h2 className="text-lg font-bold text-brand-900">Order summary</h2>

                    <dl className="mt-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted">Items</dt>
                            <dd>{totalItems}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted">Subtotal</dt>
                            <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted">Shipping</dt>
                            <dd className="text-right text-muted">Confirmed after you order</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted">Payment</dt>
                            <dd>Cash on delivery</dd>
                        </div>
                    </dl>

                    <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-lg font-bold text-brand-900">
                        <span>Total</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <Link
                        to="/checkout"
                        className="mt-5 block rounded-lg bg-gold-500 px-4 py-3 text-center font-semibold text-ink transition hover:bg-gold-600"
                    >
                        Proceed to checkout
                    </Link>
                    <Link
                        to="/products"
                        className="mt-3 block text-center text-sm text-brand-700 hover:underline"
                    >
                        Continue shopping
                    </Link>
                </aside>
            </div>
        </div>
    );
}