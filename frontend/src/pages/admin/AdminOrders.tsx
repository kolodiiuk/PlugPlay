import { useState } from 'react';
import { Search } from 'lucide-react';
import OrdersTable from '../../components/admin/OrdersTable';
import OrderDetailsModal from '../../components/admin/OrderDetailsModal';
import { mockAdminOrders } from '../../data/mockAdminData';
import { Order } from '../../models/Order';
import OrderStatus from '../../models/enums/OrderStatus';

const AdminOrders = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('');
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

    const filteredOrders = mockAdminOrders.filter(order => {
        const matchesSearch =
            order.id.toString().includes(searchQuery) ||
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

    const handleCancelOrder = (order: Order) => {
        console.log('Cancel order:', order);
    };

    return (
        <div className="max-w-7xl ml-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Orders Management</h1>
                <p className="text-sm text-gray-500">Total Orders: {mockAdminOrders.length}</p>
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
            />

            <OrderDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                order={selectedOrder}
            />
        </div>
    );
};

export default AdminOrders;
