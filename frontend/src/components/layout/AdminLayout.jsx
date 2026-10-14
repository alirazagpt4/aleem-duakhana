import { NavLink, Outlet } from 'react-router-dom';
import { ShoppingBag, Package, Tags, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Tags },
];

export default function AdminLayout() {
    const { admin, logout } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50 md:flex">
            <aside className="bg-brand-900 text-white md:flex md:min-h-screen md:w-60 md:shrink-0 md:flex-col">
                <div className="px-4 py-4">
                    <p className="text-lg font-bold">AleemDuaKhana</p>
                    <p className="text-xs text-brand-100">{admin?.username}</p>
                </div>

                <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-1 md:flex-col md:pb-4">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-brand-700 text-white' : 'text-brand-100 hover:bg-brand-700/60'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-brand-100 transition hover:bg-brand-700/60 md:mt-auto"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </nav>
            </aside>

            <main className="min-w-0 flex-1 p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}