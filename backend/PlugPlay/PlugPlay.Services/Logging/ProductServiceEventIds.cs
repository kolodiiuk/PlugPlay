using Microsoft.Extensions.Logging;

namespace PlugPlay.Services.Logging;

internal static class ProductServiceEventIds
{
    internal static readonly EventId GetCategoryError = new(2014, nameof(GetCategoryError));

    internal static readonly EventId AddProductError = new(2022, nameof(AddProductError));

    internal static readonly EventId ChangeProductNotFound = new(2031, nameof(ChangeProductNotFound));

    internal static readonly EventId ChangeProductError = new(2033, nameof(ChangeProductError));

    internal static readonly EventId DeleteProductNotFound = new(2041, nameof(DeleteProductNotFound));

    internal static readonly EventId DeleteProductError = new(2043, nameof(DeleteProductError));

    internal static readonly EventId GetAllCategoriesError = new(2051, nameof(GetAllCategoriesError));

    internal static readonly EventId GetAllAttributesError = new(2061, nameof(GetAllAttributesError));

    internal static readonly EventId GetAttributeByIdNotFound = new(2071, nameof(GetAttributeByIdNotFound));

    internal static readonly EventId GetAttributeByIdError = new(2072, nameof(GetAttributeByIdError));
}
