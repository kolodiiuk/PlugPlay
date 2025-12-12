import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Settings, ArrowLeft } from 'lucide-react';

const AdminSidebar = () => {
    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/products', icon: Package, label: 'Products' },
        { path: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
        { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <div className="w-64 bg-slate-800 min-h-screen flex flex-col">
            <div className="p-6 border-b border-slate-700">
                <div className="flex items-center gap-2 text-white">
                    <LayoutDashboard className="w-6 h-6" />
                    <h1 className="text-xl font-semibold">Admin Panel</h1>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-blue-600 text-white'
                                            : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                                        }`
                                    }
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            <div className="p-4 border-t border-slate-700">
                <NavLink
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back to Store</span>
                </NavLink>
            </div>
        </div>
    );
};

export default AdminSidebar;
