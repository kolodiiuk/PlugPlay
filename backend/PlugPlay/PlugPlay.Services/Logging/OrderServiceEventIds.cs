using Microsoft.Extensions.Logging;

namespace PlugPlay.Services.Logging;

internal static class OrderServiceEventIds
{
    internal static readonly EventId OrderCancellationAdminError = new(6000, nameof(OrderCancellationAdminError));

    internal static readonly EventId UpdatePaymentStatusError = new(6001, nameof(UpdatePaymentStatusError));

    internal static readonly EventId UpdateOrderStatusError = new(6002, nameof(UpdateOrderStatusError));
}
