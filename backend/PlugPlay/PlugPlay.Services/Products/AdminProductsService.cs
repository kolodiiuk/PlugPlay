using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PlugPlay.Domain.Common;
using PlugPlay.Domain.Entities;
using PlugPlay.Services.Dto;
using PlugPlay.Services.Logging;
using Attribute = PlugPlay.Domain.Entities.Attribute;

namespace PlugPlay.Services.Products;

public partial class ProductsService
{
    public async Task<Result<int>> AddProduct(ProductRequest req)
    {
        try
        {
            var product = new Product
            {
                Name = req.Name,
                Description = req.Description,
                Price = req.Price,
                StockQuantity = req.StockQuantity,
                CategoryId = req.CategoryId,
                CreatedAt = DateTime.UtcNow
            };

            var entry = await Context.Products.AddAsync(product);
            await Context.SaveChangesAsync();

            if (req.ProductAttributes != null && req.ProductAttributes.Any())
            {
                var newAttrs = req.ProductAttributes.Select(pa => new ProductAttribute
                {
                    AttributeId = pa.AttributeId,
                    Value = pa.Value,
                    ProductId = entry.Entity.Id
                }).ToList();

                await Context.ProductAttributes.AddRangeAsync(newAttrs);
                await Context.SaveChangesAsync();
            }

            return Result.Success(entry.Entity.Id);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, ProductServiceEventIds.AddProductError, "Error adding product: {error}",
                e.Message);

            return Result.Fail<int>($"Problem adding product: {e.Message}");
        }
    }

    public async Task<Result> AddImageAsync(int productId, string uploadResultUrl)
    {
        try
        {
            var product = await Context.Products.FindAsync(productId);
            if (product is null)
            {
                return Result.Fail("No such product");
            }

            var image = new ProductImage
            {
                ImageUrl = uploadResultUrl,
                ProductId = productId
            };
            Context.ProductImages.Add(image);
            await Context.SaveChangesAsync();

            Log(LogLevel.Information, new EventId(2000, "ProductImageAddedSuccess"),
                "Successfully added image for product {ProductId}", productId);

            return Result.Success();
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, new EventId(2001, "FailedToAddProductImageError"),
                "Failed to add image for product {ProductId}. Error: {error}", productId, e.Message);

            return Result.Fail($"{e.Message}");
        }
    }

    public async Task<Result> ChangeProduct(int id, ProductRequest req)
    {
        try
        {
            var product = await Context.Products
                .Include(p => p.ProductAttributes)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product is null)
            {
                Log(LogLevel.Warning, ProductServiceEventIds.ChangeProductNotFound,
                    "Product {ProductId} not found", id);

                return Result.Fail($"No product with id {id}");
            }

            product.Name = req.Name;
            product.Description = req.Description;
            product.Price = req.Price;
            product.StockQuantity = req.StockQuantity;
            product.CategoryId = req.CategoryId;

            if (req.ProductAttributes != null)
            {
                Context.ProductAttributes.RemoveRange(product.ProductAttributes);
                var newAttrs = req.ProductAttributes.Select(pa => new ProductAttribute
                {
                    AttributeId = pa.AttributeId,
                    Value = pa.Value,
                    ProductId = product.Id
                }).ToList();

                await Context.ProductAttributes.AddRangeAsync(newAttrs);
            }

            await Context.SaveChangesAsync();

            return Result.Success();
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, ProductServiceEventIds.ChangeProductError,
                "Error updating product {ProductId}: {error}",
                id, e.Message);

            return Result.Fail($"Problem updating product {id}: {e.Message}");
        }
    }

    public async Task<Result> DeleteProduct(int prodId)
    {
        try
        {
            var product = await Context.Products.FindAsync(prodId);
            if (product is null)
            {
                Log(LogLevel.Warning, ProductServiceEventIds.DeleteProductNotFound,
                    "Product {ProductId} not found",
                    prodId);

                return Result.Fail($"No product {prodId}");
            }

            Context.Products.Remove(product);
            await Context.SaveChangesAsync();

            return Result.Success();
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, ProductServiceEventIds.DeleteProductError,
                "Error deleting product {ProductId}: {error}",
                prodId, e.Message);

            return Result.Fail($"Problem deleting product {prodId}: {e.Message}");
        }
    }

    public async Task<Result<IEnumerable<Category>>> GetAllCategories()
    {
        try
        {
            var categories = await Context.Categories
                .AsNoTracking()
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .ToListAsync();

            return Result.Success<IEnumerable<Category>>(categories);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, ProductServiceEventIds.GetAllCategoriesError,
                "Error getting categories: {error}",
                e.Message);

            return Result.Fail<IEnumerable<Category>>(e.Message);
        }
    }

    public async Task<Result<Category>> GetCategoryById(int id)
    {
        try
        {
            var category = await Context.Categories
                .AsNoTracking()
                .Include(c => c.ParentCategory)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (category is null)
            {
                return Result.Fail<Category>($"No attribute {id}");
            }

            return Result.Success(category);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, ProductServiceEventIds.GetCategoryError,
                "Error getting attribute {AttributeId}: {error}", id, e.Message);

            return Result.Fail<Category>(e.Message);
        }
    }

    public async Task<Result<IEnumerable<Attribute>>> GetAllAttributes()
    {
        try
        {
            var attributes = await Context.Attributes
                .AsNoTracking()
                .Include(a => a.ProductAttributes)
                .ToListAsync();

            return Result.Success<IEnumerable<Attribute>>(attributes);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, ProductServiceEventIds.GetAllAttributesError,
                "Error getting attributes: {error}",
                e.Message);

            return Result.Fail<IEnumerable<Attribute>>(e.Message);
        }
    }

    public async Task<Result<Attribute>> GetAttributeById(int id)
    {
        try
        {
            var attribute = await Context.Attributes
                .AsNoTracking()
                .Include(a => a.ProductAttributes)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (attribute is null)
            {
                Log(LogLevel.Warning, ProductServiceEventIds.GetAttributeByIdNotFound,
                    "Attribute {AttributeId} not found", id);

                return Result.Fail<Attribute>($"No attribute {id}");
            }

            return Result.Success(attribute);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, ProductServiceEventIds.GetAttributeByIdError,
                "Error getting attribute {AttributeId}: {error}", id, e.Message);

            return Result.Fail<Attribute>(e.Message);
        }
    }
}
