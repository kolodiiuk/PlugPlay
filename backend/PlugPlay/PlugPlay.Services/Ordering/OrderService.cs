using System.Transactions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PlugPlay.Domain.Common;
using PlugPlay.Domain.Entities;
using PlugPlay.Domain.Enums;
using PlugPlay.Domain.Extensions;
using PlugPlay.Infrastructure;
using PlugPlay.Services.Interfaces;
using PlugPlay.Services.Payment;

namespace PlugPlay.Services.Ordering;

public class OrderService : BaseService<OrderService>, IOrderService
{
    private static readonly EventId GetOrderByIdEvent = new(2006, nameof(GetOrderAsync));

    private static readonly EventId ClearCartEvent = new(2007, "ClearCart");

    private static readonly EventId RefundPaymentSuccessEvent = new(2008, "RefundPaymentSuccess");

    private static readonly EventId RefundPaymentFailureEvent = new(2009, "RefundPaymentFailure");

    private readonly IPaymentService _paymentService;
    private readonly ICartService _cartService;

    public OrderService(PlugPlayDbContext context, IPaymentService paymentService, ICartService cartService,
        ILogger<OrderService> logger) : base(context, logger)
    {
        _paymentService = paymentService;
        _cartService = cartService;
    }

    public async Task<Result<OrderResponse>> PlaceOrderAsync(PlaceOrderRequest orderReq)
    {
        using var scope = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled);

        try
        {
            var user = await Context.Users.FindAsync(orderReq.UserId);
            if (user == null)
            {
                return Result.Fail<OrderResponse>(
                    $"No user {orderReq.UserId} specified in order request");
            }

            var address = await Context.UserAddresses.FindAsync(orderReq.DeliveryAddressId);
            if (address == null)
            {
                return Result.Fail<OrderResponse>(
                    $"No address {orderReq.DeliveryAddressId} specified in order request");
            }

            var newOrder = new Order
            {
                Status = OrderStatus.Created,
                PaymentMethod = orderReq.PaymentMethod,
                PaymentStatus = PaymentStatus.NotPaid,
                DeliveryMethod = orderReq.DeliveryMethod,
                DeliveryAddressId = orderReq.DeliveryAddressId,
                UserId = orderReq.UserId,
                OrderDate = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                OrderItems = new List<OrderItem>()
            };

            Context.Orders.Add(newOrder);
            await Context.SaveChangesAsync();

            var items = await CreateOrderItems(orderReq.OrderItems, newOrder.Id);
            newOrder.OrderItems = items;
            newOrder.TotalAmount = items.Sum(i => i.Quantity * i.UnitPrice);
            await Context.SaveChangesAsync();

            var totalWithDelivery = CalcTotalWithDelivery(newOrder.TotalAmount, orderReq.DeliveryMethod);
            if (orderReq.PaymentMethod == PaymentMethod.Card)
            {
                var paymentDataResult = await _paymentService.CreatePayment(newOrder.Id, totalWithDelivery);
                if (paymentDataResult.Failure)
                {
                    return Result.Fail<OrderResponse>($"{paymentDataResult.Error}");
                }

                await Context.SaveChangesAsync();
                await ClearCart();
                scope.Complete();

                return Result.Success(new OrderResponse
                {
                    OrderId = newOrder.Id,
                    PaymentData = paymentDataResult.Value
                });
            }

            if (orderReq.PaymentMethod == PaymentMethod.Cash)
            {
                newOrder.TotalAmount = totalWithDelivery;
            }

            await Context.SaveChangesAsync();
            await ClearCart();
            scope.Complete();

            return Result.Success(new OrderResponse { OrderId = newOrder.Id });
        }
        catch (InvalidOperationException e)
        {
            return Result.Fail<OrderResponse>($"One of product is not available: {e.Message}");
        }
        catch (Exception e)
        {
            return Result.Fail<OrderResponse>($"Failure placing order: {e.Message}");
        }

        decimal CalcTotalWithDelivery(decimal totalAmount, DeliveryMethod deliveryMethod)
        {
            decimal totalWithDelivery = default;
            switch (deliveryMethod)
            {
                case DeliveryMethod.Courier:
                    totalWithDelivery += 100;
                    break;
                case DeliveryMethod.Post:
                    totalWithDelivery += 80;
                    break;
                case DeliveryMethod.Premium:
                    totalWithDelivery += 150;
                    break;
                case DeliveryMethod.Pickup:
                    break;
            }

            return totalAmount + totalWithDelivery;
        }

        async Task ClearCart()
        {
            var cartRes = await _cartService.ClearCartAsync(orderReq.UserId);
            if (cartRes.Failure)
            {
                Log(LogLevel.Warning, ClearCartEvent, "Couldn't clear cart. Error: {error}", cartRes.Error);
            }
        }
    }

    public async Task<Result<IEnumerable<Order>>> GetUserOrdersAsync(int userId)
    {
        try
        {
            var user = await Context.Users.FindAsync(userId);
            if (user is null)
            {
                return Result.Fail<IEnumerable<Order>>($"No user with id {userId}");
            }

            var orders = await Context.Orders
                .Where(o => o.UserId == userId)
                .Include(o => o.User)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.ProductAttributes)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.ProductImages)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.Category)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ToListAsync();

            return Result.Success<IEnumerable<Order>>(orders);
        }
        catch (Exception e)
        {
            return Result.Fail<IEnumerable<Order>>(
                $"Exception thrown retrieving orders of user {userId}. Message: {e.Message}");
        }
    }

    public async Task<Result<Order>> GetOrderAsync(int orderId)
    {
        try
        {
            var order = await Context.Orders
                .Include(o => o.User)
                .Include(o => o.DeliveryAddress)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.ProductAttributes)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.ProductImages)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.Category)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .FirstOrDefaultAsync(o => o.Id == orderId);

            if (order == null)
            {
                Log(LogLevel.Warning, GetOrderByIdEvent, "Order with ID {orderId} not found.", orderId);

                return Result.Fail<Order>($"Order with ID {orderId} not found.");
            }

            return Result.Success(order);
        }
        catch (Exception e)
        {
            return Result.Fail<Order>(
                $"Exception thrown retrieving order with ID {orderId}. Message: {e.Message}");
        }
    }

    public async Task<Result<LiqPayRefundResponse>> CancelOrderAsync(int orderId)
    {
        try
        {
            var order = await Context.Orders.FindAsync(orderId);
            if (order is null)
            {
                return Result.Fail<LiqPayRefundResponse>($"No order with id {orderId}");
            }

            var stateTransitionNotValid = order.Status == OrderStatus.Cancelled
                                          || order.Status == OrderStatus.Delivered;
            if (stateTransitionNotValid)
            {
                return Result.Fail<LiqPayRefundResponse>($"Order with id {orderId} can't be cancelled");
            }

            Result<LiqPayRefundResponse> result = new Result<LiqPayRefundResponse>(null, true, "");
            if (order.PaymentMethod == PaymentMethod.Card && (order.PaymentStatus == PaymentStatus.TestPaid ||
                                                              order.PaymentStatus == PaymentStatus.Paid))
            {
                result = await _paymentService.RefundPayment(orderId);
                result.OnSuccess(() =>
                        Log(LogLevel.Information, RefundPaymentSuccessEvent, "Success refunding payment"))
                    .OnFailure(() =>
                        Log(LogLevel.Error, RefundPaymentFailureEvent, "Refund failed: {error}", result.Error));

                if (result.Value.Result == "error")
                {
                    return Result.Fail<LiqPayRefundResponse>($"Error refunding: {result.Value.Status}");
                }
            }

            order.Status = OrderStatus.Cancelled;
            Context.Orders.Update(order);
            await Context.SaveChangesAsync();

            return result.Failure
                ? Result.Fail<LiqPayRefundResponse>($"Payment refund failed. Reason: {result.Error}")
                : Result.Success(result.Value);
        }
        catch (Exception e)
        {
            return Result.Fail<LiqPayRefundResponse>($"Error refunding: {e.Message}");
        }
    }


    public async Task<Result<IEnumerable<OrderItem>>> GetOrderItemsAsync(int orderId)
    {
        try
        {
            var order = await Context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return Result.Fail<IEnumerable<OrderItem>>($"No order with id {orderId}");
            }

            var items = await Context.OrderItems
                .Where(oi => oi.OrderId == orderId)
                .Include(oi => oi.Product)
                .ThenInclude(p => p.ProductAttributes)
                .Include(oi => oi.Product)
                .ThenInclude(p => p.ProductImages)
                .Include(oi => oi.Product)
                .ThenInclude(p => p.Category)
                .ToListAsync();

            return Result.Success<IEnumerable<OrderItem>>(items);
        }
        catch (Exception e)
        {
            return Result.Fail<IEnumerable<OrderItem>>(
                $"Exception thrown retrieving order items for order with id {orderId}. Message: {e.Message}");
        }
    }

    public async Task<Result> UpdateOrderStatusAsync(int orderId)
    {
        throw new NotImplementedException();
    }

    public async Task<Result> UpdatePaymentStatusAsync(int orderId)
    {
        throw new NotImplementedException();
    }

    public async Task<Result> CancelOrderCashAsync(int orderId)
    {
        throw new NotImplementedException();
    }

    public async Task<Result<LiqPayRefundResponse>> CancelOrderCardAsync(int orderId)
    {
        throw new NotImplementedException();
    }

    private async Task<List<OrderItem>> CreateOrderItems(IEnumerable<OrderItemDto> orderItemDtos, int orderId)
    {
        var items = new List<OrderItem>();

        foreach (var dto in orderItemDtos)
        {
            var product = await Context.Products.FindAsync(dto.ProductId);
            if (product == null)
            {
                throw new InvalidOperationException($"Product not found: {dto.ProductId}");
            }

            if (product.StockQuantity == 0)
            {
                throw new InvalidOperationException($"Out of stock: {dto.ProductId}");
            }

            if (product.StockQuantity - dto.Quantity < 0)
            {
                throw new InvalidOperationException($"Ordered more than in stock");
            }

            var price = product.Price;

            var item = new OrderItem
            {
                OrderId = orderId,
                ProductId = dto.ProductId,
                Quantity = dto.Quantity,
                UnitPrice = price,
            };
            product.StockQuantity -= dto.Quantity;

            Context.OrderItems.Add(item);

            items.Add(item);
        }

        await Context.SaveChangesAsync();

        return items;
    }
}
