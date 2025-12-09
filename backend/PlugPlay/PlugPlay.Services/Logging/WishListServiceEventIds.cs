using Microsoft.Extensions.Logging;

namespace PlugPlay.Services.Logging;

internal static class WishListServiceEventIds
{
    internal static readonly EventId FailureAddingItemToWishList = new(5000, nameof(FailureAddingItemToWishList));

    internal static readonly EventId FailureDeletingUserWishList = new(5001, nameof(FailureDeletingUserWishList));

    internal static readonly EventId FailureRemovingWishListItem = new(5002, nameof(FailureRemovingWishListItem));
}
