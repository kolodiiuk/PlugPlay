import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import OrdersTable from '../../components/admin/OrdersTable';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import { Order } from '../../models/Order';
import OrderStatus from '../../models/enums/OrderStatus';
import { useCancelOrderAdminMutation, useGetAllOrdersQuery, useUpdateOrderStatusMutation, useUpdatePaymentStatusMutation } from '../../api/adminOrderApi';
import LoadingMessage from '../../components/common/LoadingMessage';
import ErrorMessage from '../../components/common/ErrorMessage';
import { useGetAllUsersQuery } from '../../api/userInfoApi';
import { useGetAllProductsQuery } from '../../api/productsApi';
import { OrderItemWithDetails } from '../../models/Order';
import PaymentStatus from '../../models/enums/PaymentStatus';

const AdminOrders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const {data: orders, isLoading: isLoadingOrders, isError: isOrderError} = useGetAllOrdersQuery();
    const {
          data: products,
          isLoading: isLoadingProducts,
          isError: isProductsError,
    } = useGetAllProductsQuery();

    const enrichedOrders = useMemo(() => {
        if (!orders || !products) return [];
    
        return orders.map((order) => ({
          ...order,
          orderItems: order.orderItems.map((item) => {
            const product = products.find((p) => p.id === item.productId);
    
            const enriched: OrderItemWithDetails = {
              ...item,
              productName: product?.name ?? "Unknown product",
              price: product?.price ?? 0,
            };
    
            return enriched;
          }),
        }));
    }, [orders, products]);
    
    const {data: users, isLoading: isLoadingUsers, isError: isUsersError} = useGetAllUsersQuery();
    const userNamesById = useMemo<Record<number, string>>(
        () =>
            Object.fromEntries(
                (users ?? []).map(u => [u.id, u.firstName + " " + u.lastName])
            ),
        [users]
    );

    const [cancelOrder] = useCancelOrderAdminMutation();
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

    const filteredOrders = enrichedOrders.filter(order => {
        const matchesSearch =
            order.id.toString().includes(searchQuery) ||
            userNamesById[order.userId].toLowerCase().includes(searchQuery.toLowerCase()) ||
            searchQuery === '';

        const matchesStatus =
            selectedStatus === '' ||
            order.status.toString() === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const handleViewOrder = (order: Order) => {
        setSelectedOrder(order);
        setIsDetailsModalOpen(true);
    };

    const handleCancelOrder = async (orderId: number) => {
        try {
            await cancelOrder(orderId).unwrap()
        }
        catch(err) {
            alert("Something went wrong when canceling the order");
        }
    };

    const handleChangeStatus= async (orderId: number, status: OrderStatus) => {
        try {
            await updateOrderStatus({orderId, status}).unwrap()
        }
        catch(err) {
            alert("Something went wrong when changing the order status");
        }
    };

    const handleChangePaymentStatus= async (orderId: number, paymentStatus: PaymentStatus) => {
        try {

            console.log({orderId, paymentStatus: Number((paymentStatus))})
            await updatePaymentStatus({orderId, paymentStatus: Number(paymentStatus)}).unwrap()
        }
        catch(err) {
            alert("Something went wrong when changing the order payment status");
        }
    };

    if (isLoadingOrders || isLoadingUsers || isLoadingProducts) {
        return LoadingMessage("products control page");
    }

    if (isOrderError || isUsersError || isProductsError) {
        return ErrorMessage("error loading products control page", "couldn't retrieve data from the database")
    }

    return (
        <div className="max-w-7xl ml-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
                <p className="text-sm text-gray-500">Total Orders: {enrichedOrders.length}</p>
            </div>

            <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by order ID or customer name..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-w-[200px]"
                >
                    <option value="">All Status</option>
                    <option value={OrderStatus.Created.toString()}>Created</option>
                    <option value={OrderStatus.Approved.toString()}>Approved</option>
                    <option value={OrderStatus.Collected.toString()}>Collected</option>
                    <option value={OrderStatus.Delivered.toString()}>Delivered</option>
                    <option value={OrderStatus.Cancelled.toString()}>Cancelled</option>
                </select>
            </div>

            <OrdersTable
                orders={filteredOrders}
                onView={handleViewOrder}
                onCancel={handleCancelOrder}
                onChangeStatus={handleChangeStatus}
                onChangePaymentStatus={handleChangePaymentStatus}
                userNamesById={userNamesById}
            />

            <OrderDetailsModal
                userName={selectedOrder?.userId ? userNamesById[selectedOrder?.userId] : ""}
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};

export default AdminOrders;
