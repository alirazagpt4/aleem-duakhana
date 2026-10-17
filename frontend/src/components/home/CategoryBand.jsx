import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';

export default function CategoryBand() {
    const { data: categories } = useCategories();
    const { data: products } = useProducts();

    const counts = {};
    (products ?? []).forEach((p) => {
        counts[p.category_id] = (counts[p.category_id] || 0) + 1;
    });

    const visible = (categories ?? []).filter((c) => counts[c.id] > 0);

    if (visible.length === 0) return null;

    return (
        <section className="bg-brand-900 text-white">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 lg:grid-cols-[1fr_2fr] lg:items-center">
                <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gold-500">
                        Find your starting point
                    </p>
                    <h2 className="mt-2 text-3xl font-bold leading-tight">Shop by category</h2>
                    <p className="mt-2 text-brand-100">Pick a category and see what we have.</p>
                </div>

                <div className="grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-3">
                    {visible.map((c) => (
                        <Link
                            key={c.id}
                            to={`/products?category=${c.id}`}
                            className="group flex min-h-[9rem] flex-col justify-between rounded-2xl border border-brand-700 p-4 transition hover:bg-brand-700"
                        >
                            <p className="text-xs uppercase tracking-wider text-gold-500">
                                {String(counts[c.id]).padStart(2, '0')}{' '}
                                {counts[c.id] === 1 ? 'product' : 'products'}
                            </p>
                            <div>
                                <p className="text-lg font-semibold">{c.cat_name}</p>
                                <p className="mt-1 flex items-center gap-1 text-sm text-brand-100 group-hover:text-white">
                                    Explore
                                    <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}