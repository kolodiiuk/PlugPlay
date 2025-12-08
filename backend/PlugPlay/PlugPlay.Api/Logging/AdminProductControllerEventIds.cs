namespace PlugPlay.Api.Controllers.Admin;

internal static class AdminProductControllerEventIds
{
    internal static readonly EventId FailedToAddProductImage = new(2001, nameof(FailedToAddProductImage));

    internal static readonly EventId ProductImageAdded = new(2002, nameof(ProductImageAdded));
}
