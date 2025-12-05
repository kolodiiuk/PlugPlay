using PlugPlay.Domain.Common;
using PlugPlay.Domain.Entities;

namespace PlugPlay.Services.Interfaces;

public interface IWishListService
{
    Task<Result<int>> AddWishListItemAsync(int prodId, int userId);

    Task<Result<WishList>> GetWishListItemAsyncById(int itemId);

    Task<Result<bool>> IsItemInWishListAsync(int prodId, int userId);

    Task<Result<IEnumerable<WishList>>> GetUserWishListAsync(int userId);

    Task<Result> RemoveWishListItemAsync(int itemId);

    Task<Result> ClearUserWishListAsync(int userId);
}
