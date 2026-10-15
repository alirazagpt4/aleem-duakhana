import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ShoppingBag, Package, Tags, LogOut, Menu, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
    { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { to: '/admin/products', label: 'Products', icon: Package },
    { to: '/admin/categories', label: 'Categories', icon: Tags },
];

export default function AdminLayout() {
    const { admin, logout } = useAuth();
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 md:flex">
            <aside
                className={`bg-brand-900 text-white transition-all duration-300 md:flex md:min-h-screen md:shrink-0 md:flex-col ${collapsed ? 'md:w-20' : 'md:w-60'
                    }`}
            >
                <div className="flex items-center justify-between px-4 py-4">
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="text-lg font-bold truncate">AleemDuaKhana</p>
                            <p className="text-xs text-brand-100 truncate">{admin?.username}</p>
                        </div>
                    )}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden rounded-lg p-1.5 text-brand-100 hover:bg-brand-700 md:flex items-center justify-center ml-auto"
                        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-1 md:flex-col md:pb-4">
                    {links.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            title={collapsed ? label : undefined}
                            className={({ isActive }) =>
                                `flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${isActive
                                    ? 'bg-brand-700 text-white'
                                    : 'text-brand-100 hover:bg-brand-700/60'
                                }`
                            }
                        >
                            <Icon size={18} className="shrink-0" />
                            {!collapsed && <span className="truncate">{label}</span>}
                        </NavLink>
                    ))}

                    <button
                        onClick={logout}
                        title={collapsed ? 'Logout' : undefined}
                        className="flex items-center gap-3 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-brand-100 transition hover:bg-brand-700/60 md:mt-auto"
                    >
                        <LogOut size={18} className="shrink-0" />
                        {!collapsed && <span className="truncate">Logout</span>}
                    </button>
                </nav>
            </aside>

            <main className="min-w-0 flex-1 p-4 md:p-8">
                <Outlet />
            </main>
        </div>
    );
}