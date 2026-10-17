import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../product/ProductCard';

const LIMIT = 8;

export default function FeaturedProducts() {
    const [categoryId, setCategoryId] = useState(null);
    const { data: categories } = useCategories();
    const { data: products, isLoading, isError, refetch } = useProducts(categoryId);

    if (!isLoading && !isError && categoryId === null && products?.length === 0) {
        return null;
    }

    const chipClass = (active) =>
        `rounded-full px-4 py-2 text-sm font-medium transition ${active
            ? 'bg-brand-900 text-white'
            : 'bg-white text-brand-900 hover:bg-brand-100'
        }`;

    const viewAllLink = categoryId ? `/products?category=${categoryId}` : '/products';

    return (
        <section className="mx-auto max-w-6xl px-4 py-14">
            <div className="flex items-end justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-widest text-gold-600">
                        Our range
                    </p>
                    <h2 className="mt-1 text-3xl font-bold text-brand-900">Featured products</h2>
                </div>
                <Link
                    to={viewAllLink}
                    className="flex shrink-0 items-center gap-1 text-sm font-semibold text-brand-900 hover:text-gold-600"
                >
                    View all <ArrowRight size={16} />
                </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={() => setCategoryId(null)} className={chipClass(categoryId === null)}>
                    All
                </button>
                {categories?.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => setCategoryId(c.id)}
                        className={chipClass(categoryId === c.id)}
                    >
                        {c.cat_name}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-72 animate-pulse rounded-2xl bg-white" />
                    ))}
                </div>
            )}

            {isError && (
                <div className="mt-6 rounded-xl bg-white p-6">
                    <p className="text-danger">Could not load products.</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-3 rounded-lg border border-brand-700 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                    >
                        Try again
                    </button>
                </div>
            )}

            {products?.length === 0 && categoryId !== null && (
                <p className="mt-6 rounded-xl bg-white p-6 text-muted">
                    No products in this category yet.
                </p>
            )}

            {products?.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
                    {products.slice(0, LIMIT).map((p, i) => (
                        <ProductCard key={p.id} product={p} index={i} />
                    ))}
                </div>
            )}
        </section>
    );
}