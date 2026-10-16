import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';


const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/products', label: 'Products' },
];

export default function Navbar() {
    const { totalItems } = useCart();

    return (
        <header className="sticky top-0 z-40 bg-brand-900 text-white shadow-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-1 py-3">
                <Link to="/" className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream-50">
                        <img src="/aleemlogo.png" alt="Aleem Dawa logo" className="h-8 w-auto" />
                    </span>
                    <span className="leading-tight">
                        <span className="block text-lg font-bold tracking-wide">
                            Aleem <span className="text-gold-500">Dawa</span>
                        </span>
                        <span className="hidden text-[10px] uppercase tracking-wider text-brand-100 sm:block">
                            Khana Pansar &amp; Dry Fruits
                        </span>
                    </span>
                </Link>

                <nav className="flex items-center gap-1 sm:gap-3">
                    {links.map(({ to, label, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            className={({ isActive }) =>
                                `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-700/60'
                                }`
                            }
                        >
                            {label}
                        </NavLink>
                    ))}

                    <Link
                        to="/cart"
                        aria-label={`Cart, ${totalItems} items`}
                        className="relative rounded-lg p-2 text-brand-100 transition hover:bg-brand-700/60"
                    >
                        <ShoppingCart size={22} />
                        {totalItems > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-xs font-bold text-ink">
                                {totalItems}
                            </span>
                        )}
                    </Link>
                </nav>
            </div>
        </header>
    );
}