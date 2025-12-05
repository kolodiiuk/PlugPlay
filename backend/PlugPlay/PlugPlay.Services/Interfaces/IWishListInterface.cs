using PlugPlay.Domain.Common;
using PlugPlay.Domain.Entities;

namespace PlugPlay.Services.Interfaces;

public interface IWishListService
{
    Task<Result<int>> AddWishListItemAsync(int prodId, int userId);

    Task<Result<WishList>> GetWishListItemAsyncById(int itemId);

    Task<Result<IEnumerable<WishList>>> GetUserWishList(int userId);

    Task<Result> RemoveWishListItem(int itemId);

    Task<Result> ClearUserWishList(int userId);
}
