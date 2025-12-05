namespace PlugPlay.Api.Logging;

internal static class WishListControllerEventIds
{
    internal static readonly EventId AddingItemToWishList = new(5100, nameof(AddingItemToWishList));

    internal static readonly EventId InvalidProductId = new(5101, nameof(InvalidProductId));

    internal static readonly EventId ItemAddedToWishList = new(5102, nameof(ItemAddedToWishList));

    internal static readonly EventId GettingWishListItem = new(5103, nameof(GettingWishListItem));

    internal static readonly EventId InvalidItemId = new(5104, nameof(InvalidItemId));

    internal static readonly EventId WishListItemRetrieved = new(5105, nameof(WishListItemRetrieved));

    internal static readonly EventId CheckingWishListItem = new(5106, nameof(CheckingWishListItem));

    internal static readonly EventId InvalidProdId = new(5107, nameof(InvalidProdId));

    internal static readonly EventId WishListItemChecked = new(5108, nameof(WishListItemChecked));

    internal static readonly EventId GettingUserWishList = new(5109, nameof(GettingUserWishList));

    internal static readonly EventId UserWishListRetrieved = new(5110, nameof(UserWishListRetrieved));

    internal static readonly EventId RemovingWishListItem = new(5111, nameof(RemovingWishListItem));

    internal static readonly EventId WishListItemRemoved = new(5112, nameof(WishListItemRemoved));

    internal static readonly EventId ClearingWishList = new(5113, nameof(ClearingWishList));

    internal static readonly EventId WishListCleared = new(5114, nameof(WishListCleared));
}
