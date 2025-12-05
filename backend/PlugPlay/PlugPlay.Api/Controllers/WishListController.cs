using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlugPlay.Api.Logging;
using PlugPlay.Domain.Extensions;
using PlugPlay.Services.Interfaces;

namespace PlugPlay.Api.Controllers;

[Authorize(Roles = "User")]
[Route("api/[controller]")]
public class WishListController : BaseController<WishListController>
{
    private readonly IWishListService _wishListService;

    public WishListController(IWishListService wishListService, ILogger<WishListController> logger)
        : base(logger)
    {
        _wishListService = wishListService;
    }

    [HttpPost("{productId:int}")]
    public async Task<IActionResult> AddItemToWishList(int productId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return StatusCode(StatusCodes.Status401Unauthorized);
        }

        Log(LogLevel.Information, WishListControllerEventIds.AddingItemToWishList,
            "Adding item to wishlist for user {UserId}", userId);

        if (productId < 1)
        {
            Log(LogLevel.Warning, WishListControllerEventIds.InvalidProductId,
                "Invalid productId: {ProductId}",
                productId);
            return StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Title = "Invalid productId" });
        }

        var result = await _wishListService.AddWishListItemAsync(productId, userId);
        result.OnFailure(() =>
                Log(LogLevel.Warning, WishListControllerEventIds.InvalidProductId,
                    "Problem adding item to wishlist: {Error}", result.Error))
            .OnSuccess(() =>
                Log(LogLevel.Information, WishListControllerEventIds.ItemAddedToWishList,
                    "Added item {ItemId} to wishlist for user {UserId}",
                    result.Value, userId));

        return result.Failure
            ? StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Title = $"Problem adding item to wishlist: {result.Error}" })
            : StatusCode(StatusCodes.Status201Created, new { ItemId = result.Value });
    }

    [HttpGet("item/{itemId:int}")]
    public async Task<IActionResult> GetWishListItem(int itemId)
    {
        Log(LogLevel.Information, WishListControllerEventIds.GettingWishListItem,
            "Getting wishlist item {ItemId}",
            itemId);

        if (itemId < 1)
        {
            Log(LogLevel.Warning, WishListControllerEventIds.InvalidItemId,
                "Invalid itemId: {ItemId}", itemId);

            return StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Title = "Invalid itemId" });
        }

        var result = await _wishListService.GetWishListItemAsyncById(itemId);
        result.OnFailure(() =>
                Log(LogLevel.Warning, WishListControllerEventIds.InvalidItemId,
                    "Problem retrieving wishlist item: {Error}", result.Error))
            .OnSuccess(() =>
                Log(LogLevel.Information, WishListControllerEventIds.WishListItemRetrieved,
                    "Retrieved wishlist item {ItemId}", itemId));

        return result.Failure
            ? StatusCode(StatusCodes.Status404NotFound,
                new ProblemDetails { Title = $"Problem retrieving wishlist item: {result.Error}" })
            : StatusCode(StatusCodes.Status200OK, result.Value);
    }

    [HttpGet("{prodId:int}")]
    public async Task<IActionResult> IsWishListItemInList(int prodId)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return StatusCode(StatusCodes.Status401Unauthorized);
        }

        Log(LogLevel.Information, WishListControllerEventIds.CheckingWishListItem,
            "Checking if product {ProdId} is in wishlist for user {UserId}",
            prodId, userId);

        if (prodId < 1)
        {
            Log(LogLevel.Warning, WishListControllerEventIds.InvalidProdId,
                "Invalid prodId: {ProdId}", prodId);

            return StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Title = "Invalid prodId" });
        }

        var result = await _wishListService.IsItemInWishListAsync(prodId, userId);
        result.OnFailure(() =>
                Log(LogLevel.Warning, WishListControllerEventIds.InvalidProdId,
                    "Problem checking wishlist item: {Error}", result.Error))
            .OnSuccess(() =>
                Log(LogLevel.Information, WishListControllerEventIds.WishListItemChecked,
                    "Checked product {ProdId} in wishlist for user {UserId}: {Exists}",
                    prodId, userId, result.Value));

        return result.Failure
            ? StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Title = $"Problem checking wishlist item: {result.Error}" })
            : StatusCode(StatusCodes.Status200OK, result.Value);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserWishList()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return StatusCode(StatusCodes.Status401Unauthorized);
        }

        Log(LogLevel.Information, WishListControllerEventIds.GettingUserWishList,
            "Getting wishlist for user {UserId}",
            userId);

        var result = await _wishListService.GetUserWishListAsync(userId);
        result.OnFailure(() =>
                Log(LogLevel.Warning, WishListControllerEventIds.GettingUserWishList,
                    "Problem retrieving user wishlist: {Error}", result.Error))
            .OnSuccess(() =>
                Log(LogLevel.Information, WishListControllerEventIds.UserWishListRetrieved,
                    "Retrieved wishlist for user {UserId}", userId));

        return result.Failure
            ? StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Title = $"Problem retrieving user wishlist: {result.Error}" })
            : StatusCode(StatusCodes.Status200OK, result.Value);
    }

    [HttpDelete("{itemId:int}")]
    public async Task<IActionResult> RemoveWishListItem(int itemId)
    {
        Log(LogLevel.Information, WishListControllerEventIds.RemovingWishListItem,
            "Removing wishlist item {ItemId}",
            itemId);

        if (itemId < 1)
        {
            Log(LogLevel.Warning, WishListControllerEventIds.InvalidItemId,
                "Invalid itemId: {ItemId}", itemId);

            return StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Title = "Invalid itemId" });
        }

        var result = await _wishListService.RemoveWishListItemAsync(itemId);
        result.OnFailure(() =>
                Log(LogLevel.Warning, WishListControllerEventIds.InvalidItemId,
                    "Problem removing wishlist item: {Error}", result.Error))
            .OnSuccess(() =>
                Log(LogLevel.Information, WishListControllerEventIds.WishListItemRemoved,
                    "Removed wishlist item {ItemId}", itemId));

        return result.Failure
            ? StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Title = $"Problem removing wishlist item: {result.Error}" })
            : StatusCode(StatusCodes.Status200OK);
    }

    [HttpDelete]
    public async Task<IActionResult> ClearWishList()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return StatusCode(StatusCodes.Status401Unauthorized);
        }

        Log(LogLevel.Information, WishListControllerEventIds.ClearingWishList,
            "Clearing wishlist for user {UserId}",
            userId);

        var result = await _wishListService.ClearUserWishListAsync(userId);
        result.OnFailure(() =>
                Log(LogLevel.Warning, WishListControllerEventIds.ClearingWishList,
                    "Problem clearing wishlist: {Error}",
                    result.Error))
            .OnSuccess(() =>
                Log(LogLevel.Information, WishListControllerEventIds.WishListCleared,
                    "Cleared wishlist for user {UserId}", userId));

        return result.Failure
            ? StatusCode(StatusCodes.Status400BadRequest,
                new ProblemDetails { Title = $"Problem clearing wishlist: {result.Error}" })
            : StatusCode(StatusCodes.Status200OK);
    }
}
