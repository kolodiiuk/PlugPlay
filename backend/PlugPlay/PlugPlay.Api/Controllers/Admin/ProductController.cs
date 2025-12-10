using System.Net;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlugPlay.Api.Dto.Product;
using PlugPlay.Api.Logging;
using PlugPlay.Domain.Extensions;
using PlugPlay.Services.Dto;
using PlugPlay.Services.Interfaces;

namespace PlugPlay.Api.Controllers.Admin;

// [Authorize(Roles = "Admin")]
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
        Log(LogLevel.Information, AdminProductControllerEventIds.AddProductStart,
            "Adding new product {Name}", req.Name);

        var result = await _productsService.AddProduct(req);
        result.OnSuccess(productId =>
                Log(LogLevel.Information, AdminProductControllerEventIds.AddProductSuccess,
                    "Product {ProductId} added", productId))
            .OnFailure(() =>
                Log(LogLevel.Error, AdminProductControllerEventIds.AddProductFailed,
                    "Failed to add product {Name}. Error: {Error}", req.Name, result.Error));

        if (result.Failure)
        {
            return StatusCode(StatusCodes.Status400BadRequest, new ProblemDetails
            {
                Title = "Failed to add product",
                Detail = result.Error
            });
        }

        return StatusCode(StatusCodes.Status200OK, result.Value);
    }

    [HttpPut("{prodId:int}")]
    public async Task<IActionResult> ChangeProduct(int prodId, ProductRequest req)
    {
        Log(LogLevel.Information, AdminProductControllerEventIds.ChangeProductStart,
            "Changing product {ProductId}", prodId);

        var result = await _productsService.ChangeProduct(prodId, req);
        result.OnSuccess(() =>
                Log(LogLevel.Information, AdminProductControllerEventIds.ChangeProductSuccess,
                    "Product {ProductId} updated", prodId))
            .OnFailure(() =>
                Log(LogLevel.Warning, AdminProductControllerEventIds.ChangeProductFailed,
                    "Failed to update product {ProductId}. Error: {Error}", prodId, result.Error));

        return result.Failure
            ? DetermineProductFailureResponse(result.Error)
            : StatusCode(StatusCodes.Status204NoContent);
    }

    [HttpDelete("{prodId:int}")]
    public async Task<IActionResult> DeleteProduct(int prodId)
    {
        Log(LogLevel.Information, AdminProductControllerEventIds.DeleteProductStart,
            "Deleting product {ProductId}", prodId);

        var result = await _productsService.DeleteProduct(prodId);
        result.OnSuccess(() =>
                Log(LogLevel.Information, AdminProductControllerEventIds.DeleteProductSuccess,
                    "Product {ProductId} deleted", prodId))
            .OnFailure(() =>
                Log(LogLevel.Warning, AdminProductControllerEventIds.DeleteProductFailed,
                    "Failed to delete product {ProductId}. Error: {Error}", prodId, result.Error));

        return result.Failure
            ? DetermineProductFailureResponse(result.Error)
            : StatusCode(StatusCodes.Status204NoContent);
    }

    [HttpGet("category/all")]
    public async Task<IActionResult> GetAllCategories()
    {
        Log(LogLevel.Information, AdminProductControllerEventIds.GetAllCategoriesStart,
            "Fetching all categories");

        var result = await _productsService.GetAllCategories();
        result.OnSuccess(categories =>
                Log(LogLevel.Information, AdminProductControllerEventIds.GetAllCategoriesSuccess,
                    "Fetched {Count} categories", categories.Count()))
            .OnFailure(() =>
                Log(LogLevel.Error, AdminProductControllerEventIds.GetAllCategoriesFailed,
                    "Failed to fetch categories. Error: {Error}", result.Error));

        if (result.Failure)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Failed to fetch categories",
                Detail = result.Error
            });
        }

        var categoryDtos = result.Value
            .Select(category => CategoryDto.MapCategory(category))
            .ToList();

        return StatusCode(StatusCodes.Status200OK, categoryDtos);
    }

    [HttpGet("category/{id:int}")]
    public async Task<IActionResult> GetCategoryById(int id)
    {
        Log(LogLevel.Information, AdminProductControllerEventIds.GetCategoryByIdStart,
            "Fetching category {CategoryId}", id);

        var result = await _productsService.GetCategoryById(id);
        result.OnSuccess(_ =>
                Log(LogLevel.Information, AdminProductControllerEventIds.GetCategoryByIdSuccess,
                    "Fetched category {CategoryId}", id))
            .OnFailure(() =>
                Log(LogLevel.Warning, AdminProductControllerEventIds.GetCategoryByIdFailed,
                    "Failed to fetch category {CategoryId}. Error: {Error}", id, result.Error));

        if (result.Failure)
        {
            return StatusCode(StatusCodes.Status404NotFound, new ProblemDetails
            {
                Title = "Category not found",
                Detail = result.Error
            });
        }

        var dto = CategoryDto.MapCategory(result.Value);

        return StatusCode(StatusCodes.Status200OK, dto);
    }

    [HttpGet("attribute/all")]
    public async Task<IActionResult> GetAllAttributes()
    {
        Log(LogLevel.Information, AdminProductControllerEventIds.GetAllAttributesStart,
            "Fetching all attributes");

        var result = await _productsService.GetAllAttributes();
        result.OnSuccess(attributes =>
                Log(LogLevel.Information, AdminProductControllerEventIds.GetAllAttributesSuccess,
                    "Fetched {Count} attributes", attributes.Count()))
            .OnFailure(() =>
                Log(LogLevel.Error, AdminProductControllerEventIds.GetAllAttributesFailed,
                    "Failed to fetch attributes. Error: {Error}", result.Error));

        if (result.Failure)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new ProblemDetails
            {
                Title = "Failed to fetch attributes",
                Detail = result.Error
            });
        }

        var attributeDtos = result.Value.Select(AttributeDto.MapAttribute).ToList();

        return StatusCode(StatusCodes.Status200OK, attributeDtos);
    }

    [HttpGet("attribute/{id:int}")]
    public async Task<IActionResult> GetAttributeById(int id)
    {
        Log(LogLevel.Information, AdminProductControllerEventIds.GetAttributeByIdStart,
            "Fetching attribute {AttributeId}", id);

        var result = await _productsService.GetAttributeById(id);
        result.OnSuccess(_ =>
                Log(LogLevel.Information, AdminProductControllerEventIds.GetAttributeByIdSuccess,
                    "Fetched attribute {AttributeId}", id))
            .OnFailure(() =>
                Log(LogLevel.Warning, AdminProductControllerEventIds.GetAttributeByIdFailed,
                    "Failed to fetch attribute {AttributeId}. Error: {Error}", id, result.Error));

        if (result.Failure)
        {
            return StatusCode(StatusCodes.Status404NotFound, new ProblemDetails
            {
                Title = "Attribute not found",
                Detail = result.Error
            });
        }

        var attributeDto = AttributeDto.MapAttribute(result.Value);

        return StatusCode(StatusCodes.Status200OK, attributeDto);
    }

    [HttpPost("image/{productId:int}")]
    public async Task<IActionResult> UploadImage(int productId, IFormFile file)
    {
        Log(LogLevel.Information, new EventId(2000, "AddingProductImage"), "Adding image for product {ProductId}",
            productId);
        if (file == null || file.Length == 0)
        {
            return StatusCode(StatusCodes.Status400BadRequest, "No file uploaded.");
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
            return StatusCode(StatusCodes.Status400BadRequest, new ProblemDetails() { Title = "Upload failed." });
        }

        var result = await _productsService.AddImageAsync(
            productId, uploadResult.Url.AbsoluteUri);
        result.OnFailure(() => Log(LogLevel.Error, AdminProductControllerEventIds.FailedToAddProductImage,
                "Failed to add image for product {ProductId}. Error: {error}",
                productId, result.Error))
            .OnSuccess(() => Log(LogLevel.Information, AdminProductControllerEventIds.ProductImageAdded,
                "Added image for product {ProductId}", productId));

        return StatusCode(StatusCodes.Status200OK);
    }

    private IActionResult DetermineProductFailureResponse(string error)
    {
        if (!string.IsNullOrWhiteSpace(error) && error.Contains("No product", StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(StatusCodes.Status404NotFound, new ProblemDetails
            {
                Title = "Product not found",
                Detail = error
            });
        }

        return StatusCode(StatusCodes.Status400BadRequest, new ProblemDetails
        {
            Title = "Product operation failed",
            Detail = error
        });
    }
}
