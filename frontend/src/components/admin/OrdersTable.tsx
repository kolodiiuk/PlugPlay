import { Order } from '../../models/Order';
import { OrderStatusInfo, ORDER_STATUS_TRANSITIONS } from '../../models/enums/OrderStatus';
//import { mockCustomerNames } from '../../data/mockAdminData';
import { Eye, X } from 'lucide-react';
import OrderStatus from '../../models/enums/OrderStatus';
import PaymentStatus, {PaymentStatusInfo, PAYMENT_STATUSES} from '../../models/enums/PaymentStatus';
import PaymentMethod from '../../models/enums/PaymentMethod';

interface OrdersTableProps {
    orders: Order[];
    userNamesById: Record<number, string>;
    onView: (order: Order) => void;
    onCancel: (orderId: number) => void;
    onChangeStatus: (orderId: number, status: OrderStatus) => void;
    onChangePaymentStatus: (orderId: number, status: PaymentStatus) => void;
}

const OrdersTable = ({ orders, userNamesById, onView, onCancel, onChangeStatus, onChangePaymentStatus}: OrdersTableProps) => {
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
                                Payment Status
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
                                    <p className="text-sm text-gray-900">{userNamesById[order.userId as number]}</p>
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
                                        onChange={(e) => {
                                            const newStatus = e.target.value as unknown as OrderStatus;
                                            if(order.status != newStatus) {
                                                 onChangeStatus(order.id, newStatus);
                                            }
                                        }}
                                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 ${getStatusColor(order.status)}`}
                                    >
                                        {(ORDER_STATUS_TRANSITIONS[order.status] ?? []).map(status => (
                                            <option key={status} value={status}>
                                                {OrderStatusInfo[status].label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={order.paymentStatus}
                                        disabled={order.paymentMethod === PaymentMethod.Card}
                                        onChange={(e) => {
                                            const newStatus = e.target.value as unknown as PaymentStatus;
                                            if(order.paymentStatus != newStatus) {
                                                 onChangePaymentStatus(order.id, newStatus);
                                            }
                                        }}
                                        className={`px-3 py-1 text-xs font-medium rounded-full border-0 focus:ring-2 focus:ring-blue-500 bg-green-100 text-gray-700`}
                                    >
                                        {PAYMENT_STATUSES.map(status => (
                                            <option key={status} value={status}>
                                                {PaymentStatusInfo[status].label}
                                            </option>
                                        ))}
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
                                                onClick={() => onCancel(order.id)}
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
