using System.Runtime.CompilerServices;
using LinqKit;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PlugPlay.Domain.Common;
using PlugPlay.Domain.Entities;
using PlugPlay.Infrastructure;
using PlugPlay.Services.Interfaces;
using Attribute = PlugPlay.Domain.Entities.Attribute;

namespace PlugPlay.Services.Products;

public class ProductsService : BaseService<ProductsService>, IProductsService
{
    public ProductsService(PlugPlayDbContext context, ILogger<ProductsService> logger) : base(context, logger)
    {
    }

    public async Task<IEnumerable<Product>> GetAllProductsAsync()
    {
        Log(LogLevel.Information, new EventId(2000, "FetchingAllProducts"), "Fetching all products");

        try
        {
            var query = Context.Products
                .Include(p => p.ProductAttributes)
                .ThenInclude(pa => pa.Attribute)
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.Reviews)
                .ThenInclude(r => r.User)
                .AsQueryable();

            var products = await query.ToListAsync();
            Log(LogLevel.Information, new EventId(2002, "ProductsRetrievedCount"),
                "Successfully retrieved {Count} products", products.Count);

            return products;
        }
        catch (Exception)
        {
            return new List<Product>();
        }
    }

    public async Task<Result<IEnumerable<Product>>> GetAvailableProductsAsync()
    {
        Log(LogLevel.Information, new EventId(2003, "FetchingAvailableProducts"), "Fetching available products");

        try
        {
            var products = Context.Products
                .Where(p => p.StockQuantity != 0)
                .Include(p => p.ProductAttributes)
                .ThenInclude(pa => pa.Attribute)
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.Reviews)
                .ThenInclude(r => r.User);

            Log(LogLevel.Information, new EventId(2002, "ProductsRetrievedCount"),
                "Successfully retrieved {Count} products", products.Count());

            return Result.Success<IEnumerable<Product>>(await products.ToListAsync());
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, new EventId(2004, "GetAvailableProductsError"),
                "Error fetching available products. Error: {error}", e.Message);

            return Result.Fail<IEnumerable<Product>>(e.Message);
        }
    }

    public async Task<Result> AddImageAsync(int productId, string uploadResultUrl)
    {
        Log(LogLevel.Information, new EventId(2000, "AddingProductImage"), "Adding image for product {ProductId}",
            productId);
        try
        {
            var product = await Context.Products.FindAsync(productId);
            if (product is null)
            {
                Log(LogLevel.Warning, new EventId(2001, "ProductNotFoundWarning"),
                    "Product with ID {ProductId} not found", productId);
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

    public async Task<Result<IEnumerable<Product>>> FilterProductsAsync(FilterProductsRequest request)
    {
        try
        {
            var query = Context.Products.AsQueryable().AsExpandable();

            if (request.Predicate != null)
            {
                query = query.Where(request.Predicate);
            }

            if (request.Includes != null)
            {
                foreach (var include in request.Includes)
                {
                    query = include(query);
                }
            }

            query = request.OrderBy != null ? request.OrderBy(query) : query.OrderBy(p => p.Price);

            query = query.Skip(request.SkipCount).Take(request.TakeCount ?? 25);

            var products = await query.AsNoTracking().ToListAsync();

            return Result.Success<IEnumerable<Product>>(products);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, new EventId(2010, "FilterProductsError"), "Error filtering products. Error: {error}",
                e.Message);

            return Result.Fail<IEnumerable<Product>>($"Problem filtering products: {e.Message}");
        }
    }

    public async Task<Result<IEnumerable<Attribute>>> GetCategoryAttributesAsync(
        int categoryId,
        int[] productIds = null)
    {
        List<int> categoryIds;
        int[] targetProductIds = null;

        try
        {
            // all available
            if (categoryId == int.MaxValue)
            {
                var categoryIdsWithProducts = await Context.Products
                    .Select(p => p.CategoryId)
                    .Distinct()
                    .ToListAsync();

                categoryIds = await Context.Categories
                    .Where(c => categoryIdsWithProducts.Contains(c.Id))
                    .Select(c => c.Id)
                    .ToListAsync();

                if (productIds != null && productIds.Length > 0)
                {
                    targetProductIds = productIds;
                }
                else
                {
                    targetProductIds = await Context.Products
                        .Where(p => p.StockQuantity != 0)
                        .Select(p => p.Id)
                        .ToArrayAsync();
                }
            }
            // category specified
            else
            {
                const string descendantsSql = """
                                                  WITH RECURSIVE descendants AS (
                                                      SELECT * FROM "categories" 
                                                      WHERE "id" = {0}
                                                      UNION ALL
                                                      SELECT c.* FROM "categories" c 
                                                      INNER JOIN descendants d ON c."parent_category_id" = d."id"
                                                  )
                                                  SELECT * FROM descendants
                                              """;
                var descendantCategories = await Context.Categories
                    .FromSqlInterpolated(FormattableStringFactory.Create(descendantsSql, categoryId))
                    .AsNoTracking()
                    .ToListAsync();

                if (descendantCategories.Count == 0)
                {
                    return Result.Fail<IEnumerable<Attribute>>($"No category with id {categoryId}");
                }

                categoryIds = descendantCategories.Select(c => c.Id).ToList();

                if (productIds != null && productIds.Length > 0)
                {
                    targetProductIds = productIds;
                }
            }

            IQueryable<int> productsQuery;

            if (targetProductIds != null && targetProductIds.Length > 0)
            {
                productsQuery = Context.Products
                    .AsNoTracking()
                    .Where(p => categoryIds.Contains(p.CategoryId) && targetProductIds.Contains(p.Id))
                    .Select(p => p.Id);
            }
            else
            {
                productsQuery = Context.Products
                    .AsNoTracking()
                    .Where(p => categoryIds.Contains(p.CategoryId))
                    .Select(p => p.Id);
            }

            var attributeCounts = await Context.ProductAttributes
                .AsNoTracking()
                .Where(pa => productsQuery.Contains(pa.ProductId))
                .GroupBy(pa => pa.AttributeId)
                .Select(g => new { AttributeId = g.Key })
                .ToListAsync();

            if (attributeCounts.Count == 0)
            {
                return Result.Success<IEnumerable<Attribute>>(new List<Attribute>());
            }

            var attributeIds = attributeCounts.Select(ac => ac.AttributeId).ToList();

            var attributes = await Context.Attributes
                .AsNoTracking()
                .Where(a => attributeIds.Contains(a.Id))
                .Include(a => a.ProductAttributes.Where(pa =>
                    targetProductIds == null || targetProductIds.Contains(pa.ProductId)))
                .ToListAsync();

            return Result.Success<IEnumerable<Attribute>>(attributes);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, new EventId(2011, "GetCategoryAttributesError"),
                "Error getting category attributes. Error: {error}", e.Message);

            return Result.Fail<IEnumerable<Attribute>>(e.Message);
        }
    }

    public async Task<Result<IEnumerable<Product>>> SearchProductsAsync(ProductSearchRequest req)
    {
        Log(LogLevel.Information, new EventId(2012, "SearchProductsStart"), "Fetching available products");

        try
        {
            var query = Context.Products.AsNoTracking().AsQueryable();

            if (!string.IsNullOrWhiteSpace(req.Query))
            {
                var pattern = $"%{req.Query}%";
                query = query.Where(p =>
                        EF.Functions.ILike(p.Name, pattern) ||
                        EF.Functions.ILike(p.Description, pattern))
                    .Include(p => p.ProductImages);
            }

            var pageSize = Math.Clamp(req.PageSize, 1, 100);
            var page = Math.Max(1, req.Page);
            var skip = (page - 1) * pageSize;

            var products = await query
                .Skip(skip)
                .Take(pageSize)
                .ToListAsync();

            Log(LogLevel.Information, new EventId(2002, "ProductsRetrievedSuccess"),
                "Successfully retrieved {Count} products", products.Count);

            return Result.Success<IEnumerable<Product>>(products);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, new EventId(2013, "SearchProductsError"), "Error searching products: {error}",
                e.Message);

            return Result.Fail<IEnumerable<Product>>($"Error searching products: {e.Message}");
        }
    }

    public async Task<Result<Category>> GetCategoryAsync(int categoryId)
    {
        try
        {
            var category = await Context.Categories
                .Include(c => c.ParentCategory)
                .Include(c => c.SubCategories)
                .FirstOrDefaultAsync(c => c.Id == categoryId);

            if (category is null)
            {
                return Result.Fail<Category>($"No category {categoryId}");
            }

            return Result.Success(category);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, new EventId(2014, "GetCategoryError"),
                "Error getting category {categoryId}. Error: {error}", categoryId, e.Message);

            return Result.Fail<Category>(e.Message);
        }
    }

    public async Task<Result<Product>> GetProductByIdAsync(int id)
    {
        Log(LogLevel.Information, new EventId(2000, "FetchingProduct"), "Fetching product with ID: {ProductId}", id);

        try
        {
            var product = await Context.Products
                .Include(p => p.ProductAttributes)
                .ThenInclude(pa => pa.Attribute)
                .Include(p => p.ProductImages)
                .Include(p => p.Category)
                .Include(p => p.Reviews)
                .ThenInclude(r => r.User)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                Log(LogLevel.Warning, new EventId(2001, "ProductNotFoundWarningById"),
                    "Product with ID {ProductId} not found", id);

                return Result.Fail<Product>($"Product with ID {id} not found.");
            }

            Log(LogLevel.Information, new EventId(2002, "ProductRetrievedSuccess"),
                "Successfully retrieved product with ID: {ProductId}", id);

            return Result.Success(product);
        }
        catch (Exception e)
        {
            Log(LogLevel.Error, new EventId(2015, "GetProductByIdError"), "Error fetching product {id}. Error: {error}",
                id, e.Message);

            return Result.Fail<Product>(e.Message);
        }
    }
}
