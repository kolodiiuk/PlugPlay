import {useMemo} from 'react';
import {Package, ShoppingCart} from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import RecentOrdersTable from '../../components/admin/RecentOrdersTable';
import {useGetAllOrdersQuery} from '../../api/adminOrderApi';
import {useGetAllProductsQuery} from '../../api/productsApi';
import {useGetAllUsersQuery } from '../../api/userInfoApi';
import LoadingMessage from '../../components/common/LoadingMessage';
import ErrorMessage from '../../components/common/ErrorMessage';

const AdminDashboard = () => {
    const { data: orders, isLoading: isLoadingOrders, isError: isOrderError } = useGetAllOrdersQuery();
    const recentOrders = useMemo(() => {
        if (!orders?.length) return [];

        const now = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);

        return orders.filter(order => {
            const createdAt = new Date(order.orderDate);
            return createdAt >= oneMonthAgo && createdAt <= now;
        });
    }, [orders]);

    const {
        data: products,
        isLoading: isLoadingProducts,
        isError: isProductsError,
    } = useGetAllProductsQuery();

    const totalProducts = products ? products.length : 0;
    const totalOrders = orders ? orders.length : 0;

    const { data: users, isLoading: isLoadingUsers, isError: isUsersError } = useGetAllUsersQuery();
    const userNamesById = useMemo<Record<number, string>>(
        () =>
            Object.fromEntries(
                (users ?? []).map(u => [u.id, u.firstName + " " + u.lastName])
            ),
        [users]
    );

    if (isLoadingOrders || isLoadingProducts || isLoadingUsers) {
        return LoadingMessage("products control page");
    }

    if (isOrderError || isProductsError || isUsersError) {
        return ErrorMessage("error loading products control page", "couldn't retrieve data from the database")
    }

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

            <RecentOrdersTable 
                orders={recentOrders}
                userNamesById={userNamesById} />
        </div>
    );
};

export default AdminDashboard;
