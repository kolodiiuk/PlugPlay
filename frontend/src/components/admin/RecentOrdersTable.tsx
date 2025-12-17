import { Order } from '../../models/Order';
import { OrderStatusInfo } from '../../models/enums/OrderStatus';
import { ShoppingBag } from 'lucide-react';

interface RecentOrdersTableProps {
    orders: Order[];
    userNamesById: Record<number, string>
}

const RecentOrdersTable = ({ orders, userNamesById }: RecentOrdersTableProps) => {
    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)} ₴`;
    };

    const getStatusBadgeColor = (status: number) => {
        const statusInfo = OrderStatusInfo[status as keyof typeof OrderStatusInfo];
        return statusInfo?.displayColor || 'bg-gray-100 text-gray-700';
    };

    const getStatusLabel = (status: number) => {
        const statusInfo = OrderStatusInfo[status as keyof typeof OrderStatusInfo];
        return statusInfo?.label || 'Unknown';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            </div>
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
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                            <ShoppingBag className="text-blue-600 w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900">Order #{order.id}</p>
                                            <p className="text-xs text-gray-500">{userNamesById[order.userId as number]}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <p className="text-sm text-gray-900">{userNamesById[order.userId as number]}</p>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <p className="text-sm font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default RecentOrdersTable;
