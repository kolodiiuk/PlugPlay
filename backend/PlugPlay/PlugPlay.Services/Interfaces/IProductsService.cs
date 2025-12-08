using PlugPlay.Domain.Common;
using PlugPlay.Domain.Entities;
using PlugPlay.Services.Products;
using Attribute = PlugPlay.Domain.Entities.Attribute;

namespace PlugPlay.Services.Interfaces
{
    public interface IProductsService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();

        Task<Result<Product>> GetProductByIdAsync(int id);

        Task<Result<IEnumerable<Product>>> GetAvailableProductsAsync();

        Task<Result<IEnumerable<Product>>> SearchProductsAsync(ProductSearchRequest searchRequest);

        Task<Result> AddImageAsync(int productId, string uploadResultUrl);

        Task<Result<IEnumerable<Product>>> FilterProductsAsync(FilterProductsRequest request);

        Task<Result<IEnumerable<Attribute>>> GetCategoryAttributesAsync(int categoryId, int[] productIds = null);

        Task<Result<Category>> GetCategoryAsync(int categoryId);

        Task<Result> AddProduct(AddProductDto req);

        Task<Result> ChangeProduct(ChangeProductDto req);

        Task<Result> DeleteProduct(int prodId);

        Task<Result<IEnumerable<Category>>> GetAllCategories();

        Task<Result<Category>> GetCategoryById(int id);

        Task<Result<IEnumerable<Attribute>>> GetAllAttributes();

        Task<Result<Attribute>> GetAttributeById(int id);
    }
}
