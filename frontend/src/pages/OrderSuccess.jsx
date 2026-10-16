import { Link, Navigate, useLocation } from 'react-router-dom';
import { CheckCircle2, MessageCircle } from 'lucide-react';
import { SHOP } from '../utils/constants';
import { formatPrice } from '../utils/format';

export default function OrderSuccess() {
    const { state } = useLocation();
    const order = state?.order;

    if (!order) return <Navigate to="/" replace />;

    const message = `Hello, I placed order ${order.order_number}. Please confirm the delivery charges.`;
    const whatsappUrl = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(message)}`;

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
                <CheckCircle2 size={56} className="mx-auto text-brand-700" />
                <h1 className="mt-3 text-2xl font-bold text-brand-900">Thank you! Your order is placed</h1>
                <p className="mt-1 text-muted">Your order number</p>
                <p className="mt-1 select-all text-2xl font-bold tracking-wider text-gold-600">
                    {order.order_number}
                </p>
                <p className="mt-3 text-sm text-muted">
                    Please save this number. We will call you to confirm your order and the delivery charges.
                </p>
            </div>

            <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
                <h2 className="font-bold text-brand-900">Order summary</h2>

                <ul className="mt-3 space-y-2 text-sm">
                    {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between gap-3">
                            <span>
                                {item.product_name} <span className="text-muted">× {item.quantity}</span>
                            </span>
                            <span className="shrink-0 font-medium">
                                {formatPrice(item.unit_price * item.quantity)}
                            </span>
                        </li>
                    ))}
                </ul>

                <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-muted">Subtotal</dt>
                        <dd className="font-semibold">{formatPrice(order.subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-muted">Delivery charges</dt>
                        <dd className="text-muted">We will confirm by phone</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-muted">Payment</dt>
                        <dd>Cash on delivery</dd>
                    </div>
                </dl>

                <div className="mt-4 border-t border-gray-100 pt-4 text-sm">
                    <p className="font-medium text-ink">Delivering to</p>
                    <p className="mt-1 text-muted">
                        {order.customer_name} · {order.customer_phone}
                    </p>
                    <p className="text-muted">
                        {order.address}, {order.city}
                    </p>
                </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-whatsapp px-4 py-3 font-semibold text-ink transition hover:opacity-90"
                >
                    <MessageCircle size={18} />
                    Message us on WhatsApp
                </a>
                <Link
                    to="/products"
                    className="flex-1 rounded-lg border border-brand-700 px-4 py-3 text-center font-semibold text-brand-700 transition hover:bg-brand-100"
                >
                    Continue shopping
                </Link>
            </div>
        </div>
    );
}