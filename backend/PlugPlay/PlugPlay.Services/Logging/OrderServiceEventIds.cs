using Microsoft.Extensions.Logging;

namespace PlugPlay.Services.Logging;

internal static class OrderServiceEventIds
{
    internal static readonly EventId OrderCancellationAdminError = new(6000, nameof(OrderCancellationAdminError));

    internal static readonly EventId UpdatePaymentStatusError = new(6001, nameof(UpdatePaymentStatusError));

    internal static readonly EventId UpdateOrderStatusError = new(6002, nameof(UpdateOrderStatusError));
    
    internal static readonly EventId GetOrderByIdEvent = new(2006, nameof(GetOrderByIdEvent));

    internal static readonly EventId ClearCartEvent = new(6100, nameof(ClearCartEvent));

    internal static readonly EventId RefundPaymentSuccessEvent = new(6101, nameof(RefundPaymentSuccessEvent));

    internal static readonly EventId RefundPaymentFailureEvent = new(6102, nameof(RefundPaymentFailureEvent));
}
