import { useSearchParams } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import Button from '../components/ui/Button';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();

    const raw = Number(searchParams.get('category'));
    const categoryId = Number.isInteger(raw) && raw > 0 ? raw : null;

    const { data: categories } = useCategories();
    const { data: products, isLoading, isError, refetch } = useProducts(categoryId);

    const selectCategory = (id) => {
        setSearchParams(id ? { category: String(id) } : {});
    };

    const chipClass = (active) =>
        `rounded-full px-4 py-2 text-sm font-medium transition ${active
            ? 'bg-brand-700 text-white'
            : 'bg-white text-brand-900 hover:bg-brand-100'
        }`;

    return (
        <div className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="text-3xl font-bold text-brand-900">Our Products</h1>
            <p className="mt-1 text-muted">Pure and natural, picked with care.</p>

            <div className="mt-6 flex flex-wrap gap-2">
                <button onClick={() => selectCategory(null)} className={chipClass(!categoryId)}>
                    All
                </button>
                {categories?.map((c) => (
                    <button
                        key={c.id}
                        onClick={() => selectCategory(c.id)}
                        className={chipClass(categoryId === c.id)}
                    >
                        {c.cat_name}
                    </button>
                ))}
            </div>

            {isLoading && (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-72 animate-pulse rounded-2xl bg-white" />
                    ))}
                </div>
            )}

            {isError && (
                <div className="mt-6 rounded-xl bg-white p-6">
                    <p className="text-danger">Could not load products.</p>
                    <Button variant="outline" onClick={() => refetch()} className="mt-3">
                        Try again
                    </Button>
                </div>
            )}

            {products?.length === 0 && (
                <p className="mt-6 rounded-xl bg-white p-6 text-muted">
                    No products in this category yet.
                </p>
            )}

            {products?.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((p, i) => (
                        <ProductCard key={p.id} product={p} index={i} />
                    ))}
                </div>
            )}
        </div>
    );
}