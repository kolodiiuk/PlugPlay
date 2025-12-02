using PlugPlay.Domain.Entities;
using PlugPlay.Infrastructure;
using PlugPlay.Services.Products;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;

namespace PlugPlay.UnitTests;

public class ProductServiceTests
{
    private readonly PlugPlayDbContext _context;
    private readonly Mock<ILogger<ProductsService>> _mockLogger;
    private readonly ProductsService _service;

    public ProductServiceTests()
    {
        var dbName = Guid.NewGuid().ToString();
        var options = new DbContextOptionsBuilder<PlugPlayDbContext>()
            .UseInMemoryDatabase(dbName)
            .Options;

        _context = new PlugPlayDbContext(options);
        _mockLogger = new Mock<ILogger<ProductsService>>();
        _service = new ProductsService(_context, _mockLogger.Object);
    }

    [Fact]
    public async Task FilterProductsAsync_SortsByPriceAscending_WhenNoOrderProvided()
    {
        // Arrange
        var p1 = new Product { Id = 1, Name = "A", Price = 50 };
        var p2 = new Product { Id = 2, Name = "B", Price = 10 };
        var p3 = new Product { Id = 3, Name = "C", Price = 30 };

        _context.Products.AddRange(p1, p2, p3);
        await _context.SaveChangesAsync();

        var req = new FilterProductsRequest
        {
            Predicate = null,
            Includes = null,
            OrderBy = null,
            SkipCount = 0,
            TakeCount = 25
        };

        // Act
        var result = await _service.FilterProductsAsync(req);

        // Assert
        Assert.False(result.Failure);
        var list = result.Value.ToList();
        Assert.Equal(new[] { 2, 3, 1 }, list.Select(x => x.Id).ToArray());
    }

    [Fact]
    public async Task FilterProductsAsync_SortsUsingCustomOrder()
    {
        // Arrange
        var p1 = new Product { Id = 1, Name = "A", Price = 50 };
        var p2 = new Product { Id = 2, Name = "B", Price = 10 };
        var p3 = new Product { Id = 3, Name = "C", Price = 30 };

        _context.Products.AddRange(p1, p2, p3);
        await _context.SaveChangesAsync();

        var req = new FilterProductsRequest
        {
            OrderBy = q => q.OrderByDescending(p => p.Price),
            SkipCount = 0,
            TakeCount = 25
        };

        // Act
        var result = await _service.FilterProductsAsync(req);

        // Assert
        Assert.False(result.Failure);
        var list = result.Value.ToList();
        Assert.Equal(new[] { 1, 3, 2 }, list.Select(x => x.Id).ToArray());
    }

    [Fact]
    public async Task SearchProductsAsync_EmptyQuery_ReturnsAllProductsPaged()
    {
        // Arrange
        for (int i = 1; i <= 30; i++)
        {
            _context.Products.Add(new Product { Id = i, Name = $"P{i}", Description = "X" });
        }
        await _context.SaveChangesAsync();

        var req = new ProductSearchRequest
        {
            Query = "",
            Page = 2,
            PageSize = 10
        };

        // Act
        var result = await _service.SearchProductsAsync(req);

        // Assert
        Assert.False(result.Failure);
        Assert.Equal(10, result.Value.Count());
        Assert.Equal(11, result.Value.First().Id);
    }

    [Fact]
    public async Task SearchProductsAsync_PageIsClamped_PageCannotBeLessThan1()
    {
        // Arrange
        for (int i = 1; i <= 5; i++)
        {
            _context.Products.Add(new Product { Id = i, Name = $"P{i}", Description = "D" });
        }
        await _context.SaveChangesAsync();

        var req = new ProductSearchRequest
        {
            Query = "",
            Page = 0,
            PageSize = 10
        };

        // Act
        var result = await _service.SearchProductsAsync(req);

        // Assert
        Assert.False(result.Failure);
        Assert.Equal(5, result.Value.Count());
    }
}
