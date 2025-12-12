import { Product } from '../models/Product';
import { Order } from '../models/Order';
import OrderStatus from '../models/enums/OrderStatus';
import DeliveryMethod from '../models/enums/DeliveryMethod';
import PaymentMethod from '../models/enums/PaymentMethod';
import PaymentStatus from '../models/enums/PaymentStatus';

export const mockAdminProducts: Product[] = [
    {
        id: 1,
        name: 'USB-C 65W Charger',
        price: 29.99,
        description: 'Fast charging USB-C charger with 65W power delivery',
        stockQuantity: 45,
        pictureUrls: ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=100'],
        createdAt: '2025-11-01T10:00:00Z',
        category: { id: 1, name: 'Chargers' }
    },
    {
        id: 2,
        name: 'HomePlug Smart Socket',
        price: 29.99,
        description: 'WiFi enabled smart socket for home automation',
        stockQuantity: 32,
        pictureUrls: ['https://images.unsplash.com/photo-1558089687-e5c825c6f4c7?w=100'],
        createdAt: '2025-11-02T10:00:00Z',
        category: { id: 2, name: 'Smart Home' }
    },
    {
        id: 3,
        name: 'PowerMax 20000',
        price: 39.99,
        description: 'High capacity 20000mAh portable power bank',
        stockQuantity: 28,
        pictureUrls: ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=100'],
        createdAt: '2025-11-03T10:00:00Z',
        category: { id: 3, name: 'Power Banks' }
    },
    {
        id: 4,
        name: 'BoomBox Mini 3',
        price: 59.99,
        description: 'Portable Bluetooth speaker with premium sound',
        stockQuantity: 18,
        pictureUrls: ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=100'],
        createdAt: '2025-11-04T10:00:00Z',
        category: { id: 4, name: 'Audio' }
    },
    {
        id: 5,
        name: 'BlueSound 8300',
        price: 89.99,
        description: 'Premium wireless headphones with noise cancellation',
        stockQuantity: 15,
        pictureUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'],
        createdAt: '2025-11-05T10:00:00Z',
        category: { id: 4, name: 'Audio' }
    },
    {
        id: 6,
        name: 'SmartFit Pro Band',
        price: 89.99,
        description: 'Advanced fitness tracker with heart rate monitor',
        stockQuantity: 22,
        pictureUrls: ['https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=100'],
        createdAt: '2025-11-06T10:00:00Z',
        category: { id: 5, name: 'Wearables' }
    },
    {
        id: 7,
        name: 'Pro NVMe 1TB SSD',
        price: 129.99,
        description: 'High-speed NVMe solid state drive with 1TB capacity',
        stockQuantity: 12,
        pictureUrls: ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=100'],
        createdAt: '2025-11-07T10:00:00Z',
        category: { id: 6, name: 'Storage' }
    },
    {
        id: 8,
        name: 'FitTrack S2',
        price: 149.99,
        description: 'Premium smartwatch with advanced health tracking',
        stockQuantity: 8,
        pictureUrls: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'],
        createdAt: '2025-11-08T10:00:00Z',
        category: { id: 5, name: 'Wearables' }
    }
];

export const mockAdminOrders: Order[] = [
    {
        id: 10234,
        userId: 1,
        orderDate: '2025-11-15T14:30:00Z',
        status: OrderStatus.Delivered,
        totalAmount: 149.99,
        discountAmount: 0,
        deliveryMethod: DeliveryMethod.Courier,
        paymentMethod: PaymentMethod.Card,
        deliveryAddressId: 1,
        paymentStatus: PaymentStatus.Paid,
        transactionId: 1001,
        paymentCreated: '2025-11-15T14:30:00Z',
        paymentProcessed: '2025-11-15T14:31:00Z',
        paymentFailureReason: null,
        updatedAt: '2025-11-16T10:00:00Z',
        deliveryAddress: {
            id: 1,
            city: 'Kharkiv',
            street: 'Rymarskaya',
            house: '1',
            apartments: '10'
        },
        orderItems: [
            {
                id: 1,
                productId: 8,
                quantity: 1,
                productName: 'FitTrack S2',
                price: 149.99
            }
        ]
    },
    {
        id: 10233,
        userId: 2,
        orderDate: '2025-11-12T09:15:00Z',
        status: OrderStatus.Approved,
        totalAmount: 89.99,
        discountAmount: 0,
        deliveryMethod: DeliveryMethod.Courier,
        paymentMethod: PaymentMethod.Card,
        deliveryAddressId: 2,
        paymentStatus: PaymentStatus.Paid,
        transactionId: 1002,
        paymentCreated: '2025-11-12T09:15:00Z',
        paymentProcessed: '2025-11-12T09:16:00Z',
        paymentFailureReason: null,
        updatedAt: '2025-11-13T11:00:00Z',
        deliveryAddress: {
            id: 2,
            city: 'Kyiv',
            street: 'Khreshchatyk',
            house: '15',
            apartments: '5'
        },
        orderItems: [
            {
                id: 2,
                productId: 5,
                quantity: 1,
                productName: 'BlueSound 8300',
                price: 89.99
            }
        ]
    },
    {
        id: 10232,
        userId: 3,
        orderDate: '2025-11-10T16:45:00Z',
        status: OrderStatus.Created,
        totalAmount: 219.98,
        discountAmount: 0,
        deliveryMethod: DeliveryMethod.Courier,
        paymentMethod: PaymentMethod.Card,
        deliveryAddressId: 3,
        paymentStatus: PaymentStatus.NotPaid,
        transactionId: 1003,
        paymentCreated: '2025-11-10T16:45:00Z',
        paymentProcessed: '2025-11-10T16:46:00Z',
        paymentFailureReason: null,
        updatedAt: '2025-11-10T16:46:00Z',
        deliveryAddress: {
            id: 3,
            city: 'Lviv',
            street: 'Svobody Avenue',
            house: '23',
            apartments: '12'
        },
        orderItems: [
            {
                id: 3,
                productId: 7,
                quantity: 1,
                productName: 'Pro NVMe 1TB SSD',
                price: 129.99
            },
            {
                id: 4,
                productId: 6,
                quantity: 1,
                productName: 'SmartFit Pro Band',
                price: 89.99
            }
        ]
    },
    {
        id: 10231,
        userId: 4,
        orderDate: '2025-11-08T11:20:00Z',
        status: OrderStatus.Delivered,
        totalAmount: 59.99,
        discountAmount: 0,
        deliveryMethod: DeliveryMethod.Courier,
        paymentMethod: PaymentMethod.Card,
        deliveryAddressId: 4,
        paymentStatus: PaymentStatus.Paid,
        transactionId: 1004,
        paymentCreated: '2025-11-08T11:20:00Z',
        paymentProcessed: '2025-11-08T11:21:00Z',
        paymentFailureReason: null,
        updatedAt: '2025-11-09T14:00:00Z',
        deliveryAddress: {
            id: 4,
            city: 'Odesa',
            street: 'Deribasivska',
            house: '8',
            apartments: '3'
        },
        orderItems: [
            {
                id: 5,
                productId: 4,
                quantity: 1,
                productName: 'BoomBox Mini 3',
                price: 59.99
            }
        ]
    },
    {
        id: 10230,
        userId: 5,
        orderDate: '2025-11-05T13:30:00Z',
        status: OrderStatus.Created,
        totalAmount: 119.97,
        discountAmount: 0,
        deliveryMethod: DeliveryMethod.Courier,
        paymentMethod: PaymentMethod.Card,
        deliveryAddressId: 5,
        paymentStatus: PaymentStatus.NotPaid,
        transactionId: 1005,
        paymentCreated: '2025-11-05T13:30:00Z',
        paymentProcessed: '2025-11-05T13:31:00Z',
        paymentFailureReason: null,
        updatedAt: '2025-11-05T13:31:00Z',
        deliveryAddress: {
            id: 5,
            city: 'Dnipro',
            street: 'Dmytra Yavornytskoho',
            house: '45',
            apartments: '22'
        },
        orderItems: [
            {
                id: 6,
                productId: 3,
                quantity: 3,
                productName: 'PowerMax 20000',
                price: 39.99
            }
        ]
    },
    {
        id: 10229,
        userId: 6,
        orderDate: '2025-11-03T10:00:00Z',
        status: OrderStatus.Cancelled,
        totalAmount: 39.99,
        discountAmount: 0,
        deliveryMethod: DeliveryMethod.Courier,
        paymentMethod: PaymentMethod.Card,
        deliveryAddressId: 6,
        paymentStatus: PaymentStatus.Failed,
        transactionId: 1006,
        paymentCreated: '2025-11-03T10:00:00Z',
        paymentProcessed: '2025-11-03T10:01:00Z',
        paymentFailureReason: 'Insufficient funds',
        updatedAt: '2025-11-03T10:05:00Z',
        deliveryAddress: {
            id: 6,
            city: 'Kharkiv',
            street: 'Sumska',
            house: '112',
            apartments: '7'
        },
        orderItems: [
            {
                id: 7,
                productId: 3,
                quantity: 1,
                productName: 'PowerMax 20000',
                price: 39.99
            }
        ]
    }
];

export const mockCustomerNames: Record<number, string> = {
    1: 'Yehor Horbachok',
    2: 'Ivan Petrov',
    3: 'Maria Sidorova',
    4: 'Alexey Volkov',
    5: 'Olga Kuznetsova',
    6: 'Dimitry Sokolov'
};
