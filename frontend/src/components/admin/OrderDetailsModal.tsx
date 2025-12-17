import { X } from 'lucide-react';
import { Order } from '../../models/Order';
import { OrderStatusInfo } from '../../models/enums/OrderStatus';
import { DeliveryMethodInfo } from '../../models/enums/DeliveryMethod';
import PaymentMethod, { PaymentMethodInfo } from '../../models/enums/PaymentMethod';

interface OrderDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
    userName: string;
}

const OrderDetailsModal = ({ isOpen, onClose, order, userName }: OrderDetailsModalProps) => {
    if (!isOpen || !order) return null;

    const formatCurrency = (amount: number) => {
        return `${amount.toFixed(2)} ₴`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        return date.toLocaleString('en-GB', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        }).replace(',', '');
    };

    const formatAddress = (address: any) => {
        if (!address) return 'Address information not available';
        return `${address.city}, ${address.street} ${address.house}${address.apartments ? `, Apt ${address.apartments}` : ''}`;
    };

    const getDeliveryPrice = () => {
        return DeliveryMethodInfo[order.deliveryMethod]?.price || 0;
    };

    const getSubtotal = () => {
        if(order.paymentMethod == PaymentMethod.Card) {
            return order.totalAmount;
        }
        return order.totalAmount - getDeliveryPrice();
    };

    const getTotal  = () => {
        if(order.paymentMethod == PaymentMethod.Card) {
            return order.totalAmount + getDeliveryPrice();
        }
        return order.totalAmount;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                        <p className="text-sm text-gray-500 mt-1">Order #{order.id}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Customer</p>
                            <p className="text-sm font-medium text-gray-900">{userName}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Order Status</p>
                            <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${OrderStatusInfo[order.status].displayColor}`}>
                                {OrderStatusInfo[order.status].label}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Order Date</p>
                            <p className="text-sm text-gray-900">{formatDate(order.orderDate)}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                            <p className="text-sm font-semibold text-gray-900">{formatCurrency(getTotal())}</p>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Delivery Method</p>
                            <p className="text-sm text-gray-900">{DeliveryMethodInfo[order.deliveryMethod]?.label || 'Unknown'}</p>
                        </div>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-1">Full Address</p>
                        <p className="text-sm text-gray-900">{formatAddress(order.deliveryAddress)}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                        <p className="text-sm text-gray-900">{PaymentMethodInfo[order.paymentMethod]?.label || 'Unknown'}</p>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <p className="text-xs text-gray-500 mb-3">Order Items</p>
                        <div className="space-y-2">
                            {order.orderItems.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-700">Qty: {item.quantity}</p>
                                        <p className="text-sm font-medium text-gray-900">Price: {formatCurrency(item.price || 0)}</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            Total: {formatCurrency((item.price || 0) * item.quantity)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="text-gray-900">{formatCurrency(getSubtotal())}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Shipment Cost</span>
                            <span className="text-gray-900">{formatCurrency(getDeliveryPrice())}</span>
                        </div>
                        <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">{formatCurrency(getTotal())}</span>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
