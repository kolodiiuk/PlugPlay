using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlugPlay.Services.Interfaces;

namespace PlugPlay.Api.Controllers.Admin;
[Authorize(Roles = "Admin")]
[Microsoft.AspNetCore.Components.Route("api/admin/[controller]")]
public class ProductController : BaseController<ProductController>
{
    private readonly IProductsService _productsService;

    public ProductController(IProductsService productsService, ILogger<ProductController> logger) : base(logger)
    {
        _productsService = productsService;
    }

    [HttpPost("product")]
    public async Task<IActionResult> AddProduct(ProductRequest req)
    {
        return StatusCode(418);
    }

    [HttpPut("product/{prodId:int}")]
    public async Task<IActionResult> ChangeProduct(int prodId, ProductRequest req)
    {
        return StatusCode(418);
    }

    [HttpDelete("product/{prodId:int}")]
    public async Task<IActionResult> DeleteProduct(int prodId)
    {
        return StatusCode(418);
    }

    [HttpGet("category/all")]
    public async Task<IActionResult> GetAllCategories()
    {
        return StatusCode(418);
    }

    [HttpGet("category/{id:int}")]
    public async Task<IActionResult> GetCategoryId(int id)
    {
        return StatusCode(418);
    }

    [HttpPost("category")]
    public async Task<IActionResult> AddCategory(CategoryRequest req)
    {
        return StatusCode(418);
    }

    [HttpPut("category/{prodId:int}")]
    public async Task<IActionResult> ChangeCategory(int catId, CategoryRequest req)
    {
        return StatusCode(418);
    }

    [HttpDelete("category/{prodId:int}")]
    public async Task<IActionResult> DeleteCategory(int catId)
    {
        return StatusCode(418);
    }

    [HttpGet("attribute/all")]
    public async Task<IActionResult> GetAllAttributes()
    {
        return StatusCode(418);
    }

    [HttpGet("attribute/{id:int}")]
    public async Task<IActionResult> GetAttributeId(int id)
    {
        return StatusCode(418);
    }

    [HttpPost("attribute")]
    public async Task<IActionResult> AddAttribute(AttributeRequest req)
    {
        return StatusCode(418);
    }

    [HttpPut("attribute/{prodId:int}")]
    public async Task<IActionResult> ChangeAttribute(int attrId, AttributeRequest req)
    {
        return StatusCode(418);
    }

    [HttpDelete("attribute/{prodId:int}")]
    public async Task<IActionResult> DeleteAttribute(int attrId)
    {
        return StatusCode(418);
    }
}
