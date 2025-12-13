namespace PlugPlay.Api.Logging;

internal static class AdminProductControllerEventIds
{
    internal static readonly EventId AddProductStart = new(2020, nameof(AddProductStart));

    internal static readonly EventId AddProductFailed = new(2021, nameof(AddProductFailed));

    internal static readonly EventId AddProductSuccess = new(2022, nameof(AddProductSuccess));

    internal static readonly EventId FailedToAddProductImage = new(2001, nameof(FailedToAddProductImage));

    internal static readonly EventId ProductImageAdded = new(2002, nameof(ProductImageAdded));

    internal static readonly EventId ChangeProductStart = new(2030, nameof(ChangeProductStart));

    internal static readonly EventId ChangeProductSuccess = new(2032, nameof(ChangeProductSuccess));

    internal static readonly EventId ChangeProductFailed = new(2031, nameof(ChangeProductFailed));

    internal static readonly EventId DeleteProductStart = new(2040, nameof(DeleteProductStart));

    internal static readonly EventId DeleteProductSuccess = new(2042, nameof(DeleteProductSuccess));

    internal static readonly EventId DeleteProductFailed = new(2041, nameof(DeleteProductFailed));

    internal static readonly EventId GetAllCategoriesStart = new(2050, nameof(GetAllCategoriesStart));

    internal static readonly EventId GetAllCategoriesFailed = new(2051, nameof(GetAllCategoriesFailed));

    internal static readonly EventId GetAllCategoriesSuccess = new(2052, nameof(GetAllCategoriesSuccess));

    internal static readonly EventId GetCategoryByIdStart = new(2053, nameof(GetCategoryByIdStart));

    internal static readonly EventId GetCategoryByIdFailed = new(2054, nameof(GetCategoryByIdFailed));

    internal static readonly EventId GetCategoryByIdSuccess = new(2055, nameof(GetCategoryByIdSuccess));

    internal static readonly EventId GetAllAttributesStart = new(2060, nameof(GetAllAttributesStart));

    internal static readonly EventId GetAllAttributesFailed = new(2061, nameof(GetAllAttributesFailed));

    internal static readonly EventId GetAllAttributesSuccess = new(2062, nameof(GetAllAttributesSuccess));

    internal static readonly EventId GetAttributeByIdStart = new(2070, nameof(GetAttributeByIdStart));

    internal static readonly EventId GetAttributeByIdFailed = new(2071, nameof(GetAttributeByIdFailed));

    internal static readonly EventId GetAttributeByIdSuccess = new(2072, nameof(GetAttributeByIdSuccess));
}
