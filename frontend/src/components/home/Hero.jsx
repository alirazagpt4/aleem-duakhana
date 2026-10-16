import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { SHOP } from '../../utils/constants';
import { useProducts } from '../../hooks/useProducts';
import { formatPrice } from '../../utils/format';
import { imageUrl } from '../../utils/image';

const POSITIONS = [
    'right-0 top-0 z-10 h-72 w-60',
    'left-0 top-20 h-52 w-44',
    'bottom-0 left-28 z-20 h-40 w-36',
];

export default function Hero() {
    const { data: products } = useProducts();
    const showcase = (products ?? []).filter((p) => p.image).slice(0, 3);

    const whatsappUrl = `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(
        'Hello, I would like to ask about your products.'
    )}`;

    return (
        <section className="relative overflow-hidden bg-cream-100">
            <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-100/70" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-gold-500/10" />

            <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 sm:py-20 lg:grid-cols-2">
                <div>
                    <p className="animate-fade-up text-sm font-medium uppercase tracking-widest text-gold-600">
                        Khana Pansar &amp; Dry Fruits
                    </p>

                    <h1
                        className="animate-fade-up mt-3 text-4xl font-bold leading-tight text-brand-900 sm:text-5xl"
                        style={{ animationDelay: '100ms' }}
                    >
                        Pure honey, herbs and dry fruits,{' '}
                        <span className="text-gold-600">picked with care</span>
                    </h1>

                    <p
                        className="animate-fade-up mt-4 text-lg text-muted"
                        style={{ animationDelay: '200ms' }}
                    >
                        Order from home and pay cash on delivery.
                    </p>

                    <div
                        className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row"
                        style={{ animationDelay: '300ms' }}
                    >
                        <Link
                            to="/products"
                            className="rounded-lg bg-brand-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-brand-700"
                        >
                            Shop now
                        </Link>
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-lg border border-brand-900 px-6 py-3 font-semibold text-brand-900 transition hover:bg-brand-100"
                        >
                            <MessageCircle size={18} />
                            Ask on WhatsApp
                        </a>
                    </div>
                </div>

                {showcase.length > 0 && (
                    <div className="relative mx-auto h-[22rem] w-full max-w-md">
                        {showcase.map((p, i) => (
                            <Link
                                key={p.id}
                                to={`/products/${p.id}`}
                                className={`animate-float absolute overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl ${POSITIONS[i]}`}
                                style={{ animationDelay: `${i * 0.8}s` }}
                            >
                                <img
                                    src={imageUrl(p.image)}
                                    alt={p.name}
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-brand-900/85 px-2 py-1.5 text-white">
                                    <p className="truncate text-xs font-medium">{p.name}</p>
                                    <p className="text-xs font-bold text-gold-500">
                                        {formatPrice(p.price_after_discount)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}