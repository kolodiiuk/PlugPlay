using System.Net;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlugPlay.Domain.Extensions;
using PlugPlay.Services.Interfaces;

namespace PlugPlay.Api.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Route("api/admin/[controller]")]
public class ProductController : BaseController<ProductController>
{
    private readonly IProductsService _productsService;

    private readonly Cloudinary _cloudinary;

    public ProductController(IProductsService productsService, Cloudinary cloudinary,
        ILogger<ProductController> logger) : base(logger)
    {
        _productsService = productsService;
        _cloudinary = cloudinary;
    }

    [HttpPost]
    public async Task<IActionResult> AddProduct(ProductRequest req)
    {
        return StatusCode(418);
    }

    [HttpPut("{prodId:int}")]
    public async Task<IActionResult> ChangeProduct(int prodId, ProductRequest req)
    {
        return StatusCode(418);
    }

    [HttpDelete("{prodId:int}")]
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
    public async Task<IActionResult> GetCategoryById(int id)
    {
        return StatusCode(418);
    }

    [HttpGet("attribute/all")]
    public async Task<IActionResult> GetAllAttributes()
    {
        return StatusCode(418);
    }

    [HttpGet("attribute/{id:int}")]
    public async Task<IActionResult> GetAttributeById(int id)
    {
        return StatusCode(418);
    }

    [HttpPost("image/{productId:int}")]
    public async Task<IActionResult> UploadImage(int productId, IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        var uploadParams = new ImageUploadParams()
        {
            File = new FileDescription(file.FileName, file.OpenReadStream()),
            PublicId = Guid.NewGuid().ToString(),
            Overwrite = true,
            Folder = "uploads/"
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.StatusCode != HttpStatusCode.OK)
        {
            return BadRequest(new ProblemDetails() { Title = "Upload failed." });
        }

        var result = await _productsService.AddImageAsync(
            productId, uploadResult.Url.AbsoluteUri);
        result.OnFailure(() => Log(LogLevel.Error, AdminProductControllerEventIds.FailedToAddProductImage,
                "Failed to add image for product {ProductId}. Error: {error}",
                productId, result.Error));

        result.OnSuccess(() => Log(LogLevel.Information, AdminProductControllerEventIds.ProductImageAdded,
                "Added image for product {ProductId}", productId));

        return Ok();
    }
}
