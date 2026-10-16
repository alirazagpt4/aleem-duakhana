import { useRef, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { usePlaceOrder } from '../hooks/usePlaceOrder';
import Button from '../components/ui/Button';
import { formatPrice } from '../utils/format';

const normalizePhone = (value) => {
    let phone = value.replace(/[\s-]/g, '');
    if (phone.startsWith('+92')) phone = '0' + phone.slice(3);
    else if (phone.startsWith('92') && phone.length === 12) phone = '0' + phone.slice(2);
    return phone;
};

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

export default function Checkout() {
    const { items, subtotal, clear } = useCart();
    const navigate = useNavigate();
    const placeOrder = usePlaceOrder();
    const placedRef = useRef(false);

    const [form, setForm] = useState({ name: '', phone: '', city: '', address: '' });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');

    if (items.length === 0 && !placedRef.current) {
        return <Navigate to="/cart" replace />;
    }

    const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

    const validate = () => {
        const next = {};
        const name = form.name.trim();
        const city = form.city.trim();
        const address = form.address.trim();

        if (name.length < 2) next.name = 'Please enter your full name';
        if (!/^03\d{9}$/.test(normalizePhone(form.phone))) {
            next.phone = 'Enter a mobile number like 03001234567';
        }
        if (city.length < 2) next.city = 'Please enter your city';
        if (address.length < 5) next.address = 'Please enter your full address';

        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setServerError('');
        if (!validate()) return;

        const payload = {
            customer_name: form.name.trim(),
            customer_phone: normalizePhone(form.phone),
            city: form.city.trim(),
            address: form.address.trim(),
            items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
        };

        placeOrder.mutate(payload, {
            onSuccess: (order) => {
                placedRef.current = true;
                clear();
                navigate('/order-success', { state: { order }, replace: true });
            },
            onError: (err) => {
                setServerError(
                    err.response?.data?.message || 'Could not place your order. Please try again.'
                );
            },
        });
    };

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="text-3xl font-bold text-brand-900">Checkout</h1>

            <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_340px]">
                <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl bg-white p-5 shadow-sm">
                    <h2 className="text-lg font-bold text-brand-900">Delivery details</h2>

                    <Field label="Full name" error={errors.name}>
                        <input
                            value={form.name}
                            onChange={set('name')}
                            maxLength={120}
                            autoComplete="name"
                            className={inputClass(errors.name)}
                        />
                    </Field>

                    <Field label="Mobile number" error={errors.phone}>
                        <input
                            type="tel"
                            value={form.phone}
                            onChange={set('phone')}
                            placeholder="03001234567"
                            maxLength={20}
                            autoComplete="tel"
                            className={inputClass(errors.phone)}
                        />
                    </Field>

                    <Field label="City" error={errors.city}>
                        <input
                            value={form.city}
                            onChange={set('city')}
                            maxLength={80}
                            autoComplete="address-level2"
                            className={inputClass(errors.city)}
                        />
                    </Field>

                    <Field label="Full address" error={errors.address}>
                        <textarea
                            value={form.address}
                            onChange={set('address')}
                            rows={3}
                            maxLength={500}
                            autoComplete="street-address"
                            placeholder="House, street, area"
                            className={inputClass(errors.address)}
                        />
                    </Field>

                    <p className="rounded-lg bg-brand-100 px-3 py-2 text-sm text-brand-900">
                        Payment: Cash on delivery. You pay when your order arrives.
                    </p>

                    {serverError && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-danger">{serverError}</p>
                    )}

                    <Button type="submit" loading={placeOrder.isPending} className="w-full py-3">
                        Place order
                    </Button>
                </form>

                <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm lg:sticky lg:top-24">
                    <h2 className="text-lg font-bold text-brand-900">Your order</h2>

                    <ul className="mt-4 space-y-2 text-sm">
                        {items.map((item) => (
                            <li key={item.product_id} className="flex justify-between gap-3">
                                <span className="text-ink">
                                    {item.name} <span className="text-muted">× {item.quantity}</span>
                                </span>
                                <span className="shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </li>
                        ))}
                    </ul>

                    <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-muted">Subtotal</dt>
                            <dd className="font-semibold">{formatPrice(subtotal)}</dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-muted">Shipping</dt>
                            <dd className="text-right text-muted">Confirmed after you order</dd>
                        </div>
                    </dl>

                    <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-lg font-bold text-brand-900">
                        <span>Total</span>
                        <span>{formatPrice(subtotal)}</span>
                    </div>

                    <Link to="/cart" className="mt-4 block text-center text-sm text-brand-700 hover:underline">
                        Back to cart
                    </Link>
                </aside>
            </div>
        </div>
    );
}