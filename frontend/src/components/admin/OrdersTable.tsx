import { Order } from '../../models/Order';
import { OrderStatusInfo } from '../../models/enums/OrderStatus';
import { mockCustomerNames } from '../../data/mockAdminData';
import { Eye, X } from 'lucide-react';
import OrderStatus from '../../models/enums/OrderStatus';

interface OrdersTableProps {
    orders: Order[];
    onView: (order: Order) => void;
    onCancel: (order: Order) => void;
}

const OrdersTable = ({ orders, onView, onCancel }: OrdersTableProps) => {
    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)} ₴`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: number) => {
        const statusInfo = OrderStatusInfo[status as keyof typeof OrderStatusInfo];
        return statusInfo?.displayColor || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status: number) => {
        const statusInfo = OrderStatusInfo[status as keyof typeof OrderStatusInfo];
        return statusInfo?.label || 'Unknown';
    };

    const canCancelOrder = (status: number) => {
        return status !== OrderStatus.Delivered && status !== OrderStatus.Cancelled;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm font-medium text-gray-900">#{order.id}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm text-gray-900">{mockCustomerNames[order.userId as number]}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm text-gray-900">{formatDate(order.orderDate)}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.status}
                                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                                    >
                                        <option value={OrderStatus.Created}>Created</option>
                                        <option value={OrderStatus.Approved}>Approved</option>
                                        <option value={OrderStatus.Collected}>Collected</option>
                                        <option value={OrderStatus.Delivered}>Delivered</option>
                                        <option value={OrderStatus.Cancelled}>Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => onView(order)}
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                            title="View order details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        {canCancelOrder(order.status) && (
                                            <button
                                                onClick={() => onCancel(order)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                                title="Cancel order"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">Showing {orders.length} of {orders.length} orders</p>
            </div>
        </div>
    );
};

export default OrdersTable;
