import { Package, ShoppingCart } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import RecentOrdersTable from '../../components/admin/RecentOrdersTable';
import { mockAdminProducts, mockAdminOrders } from '../../data/mockAdminData';

const AdminDashboard = () => {
    const totalProducts = mockAdminProducts.length;
    const totalOrders = mockAdminOrders.length;
    const recentOrders = mockAdminOrders.slice(0, 5);

    return (
        <div className="max-w-7xl ml-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StatCard
                    title="Total Products"
                    value={totalProducts}
                    icon={Package}
                    iconBgColor="bg-blue-100"
                    iconColor="text-blue-600"
                />
                <StatCard
                    title="Total Orders"
                    value={totalOrders}
                    icon={ShoppingCart}
                    trend={{ value: '+8.3%', isPositive: true }}
                    iconBgColor="bg-green-100"
                    iconColor="text-green-600"
                />
            </div>

            <RecentOrdersTable orders={recentOrders} />
        </div>
    );
};

export default AdminDashboard;
