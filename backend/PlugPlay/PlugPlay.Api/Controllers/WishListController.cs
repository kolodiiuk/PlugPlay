using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlugPlay.Services.Interfaces;

namespace PlugPlay.Api.Controllers;

[Authorize(Roles = "User")]
[Microsoft.AspNetCore.Components.Route("api/[controller]")]
public class WishListController : BaseController<WishListController>
{
    private readonly IWishListService _wishListService;

    public WishListController(IWishListService wishListService, ILogger<WishListController> logger)
        : base(logger)
    {
        _wishListService = wishListService;
    }

    [HttpPost]
    public async Task<IActionResult> AddItemToWishList(int productId)
    {
        return StatusCode(418);
    }

    [HttpGet("{itemId:int}")]
    public async Task<IActionResult> GetWishListItem(int itemId)
    {
        return StatusCode(418);
    }

    [HttpGet]
    public async Task<IActionResult> GetUserWishList()
    {
        return StatusCode(418);
    }

    [HttpDelete("{itemId:int}")]
    public async Task<IActionResult> RemoveWishListItem(int itemId)
    {
        return StatusCode(418);
    }
}
