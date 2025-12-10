using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PlugPlay.Domain.Common;
using PlugPlay.Domain.Entities;
using PlugPlay.Infrastructure;
using PlugPlay.Services.Interfaces;
using PlugPlay.Services.Logging;

namespace PlugPlay.Services.Products;

public class WishListService : BaseService<WishListService>, IWishListService
{
    public WishListService(PlugPlayDbContext context, ILogger<WishListService> logger)
        : base(context, logger)
    {
    }

    public async Task<Result<int>> AddWishListItemAsync(int prodId, int userId)
    {
        if (userId < 1)
        {
            return Result.Fail<int>("Invalid user id");
        }

        try
        {
            var product = await Context.Products.FindAsync(prodId);
            if (product is null)
            {
                return Result.Fail<int>($"Product with id {prodId} not found");
            }

            var item = await Context.WishList
                .FirstOrDefaultAsync(ci => ci.UserId == userId && ci.ProductId == prodId);
            if (item is null)
            {
                item = new WishList
                {
                    ProductId = prodId,
                    UserId = userId
                };
                await Context.WishList.AddAsync(item);
                await Context.SaveChangesAsync();
            }

            return Result.Success(item.Id);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, WishListServiceEventIds.FailureAddingItemToWishList,
                "Error adding item to wishlist: {message}", e.Message);

            return Result.Fail<int>($"Problem adding an item to wish list: {e.Message}");
        }
    }

    public async Task<Result<WishList>> GetWishListItemAsyncById(int itemId)
    {
        if (itemId < 1)
        {
            return Result.Fail<WishList>("Invalid item id");
        }

        try
        {
            var wishlistItem = await Context.WishList
                .AsNoTracking()
                .FirstOrDefaultAsync(ci => ci.Id == itemId);

            if (wishlistItem is null)
            {
                return Result.Fail<WishList>($"No wishlist item with id {itemId}");
            }

            return Result.Success(wishlistItem);
        }
        catch (Exception e)
        {
            return Result.Fail<WishList>($"Error: {e.Message}");
        }
    }

    public async Task<Result<bool>> IsItemInWishListAsync(int prodId, int userId)
    {
        if (userId < 1 || prodId < 1)
        {
            return Result.Fail<bool>("Invalid user or product id");
        }

        try
        {
            var exists = await Context.WishList
                .AnyAsync(wl => wl.UserId == userId && wl.ProductId == prodId);

            return Result.Success(exists);
        }
        catch (Exception e)
        {
            return Result.Fail<bool>($"Error checking if item exists in wishlist: {e.Message}");
        }
    }

    public async Task<Result<IEnumerable<WishList>>> GetUserWishListAsync(int userId)
    {
        if (userId < 1)
        {
            return Result.Fail<IEnumerable<WishList>>("Invalid userId");
        }

        try
        {
            var wishlist = await Context.WishList
                .Where(ci => ci.UserId == userId)
                .AsNoTracking()
                .ToListAsync();

            return Result.Success<IEnumerable<WishList>>(wishlist);
        }
        catch (Exception e)
        {
            return Result.Fail<IEnumerable<WishList>>($"Error retrieving user wishlist: {e.Message}");
        }
    }

    public async Task<Result> RemoveWishListItemAsync(int itemId) // no user validation cause [Authorize]
    {
        if (itemId < 1)
        {
            return Result.Fail("Invalid item id");
        }

        try
        {
            var entity = await Context.WishList.FindAsync(itemId);

            if (entity == null)
            {
                return Result.Fail($"No wishlist item {itemId}");
            }

            Context.Remove(entity);
            await Context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, WishListServiceEventIds.FailureRemovingWishListItem,
                "Error deleting wishlist item {ItemId}", itemId);

            return Result.Fail($"Problem deleting wishlist item {itemId}");
        }

        return Result.Success();
    }

    public async Task<Result> ClearUserWishListAsync(int userId)
    {
        if (userId < 1)
        {
            return Result.Fail("Invalid user id");
        }

        try
        {
            await Context.WishList.Where(ci => ci.UserId == userId).ExecuteDeleteAsync();
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, WishListServiceEventIds.FailureDeletingUserWishList,
                "Error deleting wishlist of user {UserId}", userId);

            return Result.Fail($"Problem deleting wishlist of user {userId}");
        }

        return Result.Success();
    }
}
