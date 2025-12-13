using PlugPlay.Domain.Common;
using PlugPlay.Domain.Entities;
using PlugPlay.Domain.Enums;
using PlugPlay.Services.Ordering;
using PlugPlay.Services.Payment;

namespace PlugPlay.Services.Interfaces;

public interface IOrderService
{
    Task<Result<OrderResponse>> PlaceOrderAsync(PlaceOrderRequest orderReq);

    Task<Result<IEnumerable<Order>>> GetUserOrdersAsync(int userId);

    Task<Result<Order>> GetOrderAsync(int orderId);

    Task<Result<IEnumerable<OrderItem>>> GetOrderItemsAsync(int orderId);

    Task<Result<LiqPayRefundResponse>> CancelOrderAsync(int orderId);

    Task<Result> UpdateOrderStatusAsync(int orderId, OrderStatus newOrderStatus);

    Task<Result> UpdatePaymentStatusAsync(int orderId, PaymentStatus newPaymentStatus);

    Task<Result> CancelOrderAdminAsync(int orderId);
}
