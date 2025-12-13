namespace PlugPlay.Api.Logging;

internal static class AdminOrderControllerEventIds
{
    internal static readonly EventId UpdateOrderStatusStartAdmin = new(6003, nameof(UpdateOrderStatusStartAdmin));

    internal static readonly EventId UpdateOrderStatusSuccessAdmin = new(6004, nameof(UpdateOrderStatusSuccessAdmin));

    internal static readonly EventId UpdateOrderStatusFailedAdmin = new(6005, nameof(UpdateOrderStatusFailedAdmin));

    internal static readonly EventId UpdatePaymentStatusStartAdmin = new(6006, nameof(UpdatePaymentStatusStartAdmin));

    internal static readonly EventId UpdatePaymentStatusSuccessAdmin = new(6007, nameof(UpdatePaymentStatusSuccessAdmin));

    internal static readonly EventId UpdatePaymentStatusFailedAdmin = new(6008, nameof(UpdatePaymentStatusFailedAdmin));

    internal static readonly EventId CancelOrderStartAdmin = new(6009, nameof(CancelOrderStartAdmin));

    internal static readonly EventId CancelOrderSuccessAdmin = new(6010, nameof(CancelOrderSuccessAdmin));

    internal static readonly EventId CancelOrderFailedAdmin = new(6011, nameof(CancelOrderFailedAdmin));
}
