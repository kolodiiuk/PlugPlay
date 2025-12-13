using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlugPlay.Services.Interfaces;
using PlugPlay.Api.Logging;
using PlugPlay.Domain.Enums;
using PlugPlay.Domain.Extensions;

namespace PlugPlay.Api.Controllers.Admin;

// [Authorize(Roles = "Admin")]
[Route("api/admin/[controller]")]
public class OrderController : BaseController<OrderController>
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService, ILogger<OrderController> logger) : base(logger)
    {
        _orderService = orderService;
    }

    [HttpPut("order-status/{orderId:int}")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] OrderStatus newStatus)
    {
        if (orderId < 1)
        {
            return StatusCode(StatusCodes.Status400BadRequest, "Order id is less than 1");
        }

        Log(LogLevel.Information, AdminOrderControllerEventIds.UpdateOrderStatusStartAdmin,
            "Updating order {OrderId} to status {Status}", orderId, newStatus);

        var result = await _orderService.UpdateOrderStatusAsync(orderId, newStatus);

        result.OnSuccess(() =>
                Log(LogLevel.Information, AdminOrderControllerEventIds.UpdateOrderStatusSuccessAdmin,
                    "Order {OrderId} status updated to {Status}", orderId, newStatus))
            .OnFailure(() =>
                Log(LogLevel.Warning, AdminOrderControllerEventIds.UpdateOrderStatusFailedAdmin,
                    "Failed to update order {OrderId} status. Error: {Error}", orderId, result.Error));

        return result.Failure
            ? DetermineOrderFailureResponse(result.Error)
            : StatusCode(StatusCodes.Status204NoContent);
    }

    [HttpPut("payment-status/{orderId:int}")]
    public async Task<IActionResult> UpdatePaymentStatus(int orderId, [FromBody] PaymentStatus newPaymentStatus)
    {
        if (orderId < 1)
        {
            return StatusCode(StatusCodes.Status400BadRequest, "Order id is less than 1");
        }

        Log(LogLevel.Information, AdminOrderControllerEventIds.UpdatePaymentStatusStartAdmin,
            "Updating payment status for order {OrderId} to {PaymentStatus}", orderId, newPaymentStatus);

        var result = await _orderService.UpdatePaymentStatusAsync(orderId, newPaymentStatus);

        result.OnSuccess(() =>
                Log(LogLevel.Information, AdminOrderControllerEventIds.UpdatePaymentStatusSuccessAdmin,
                    "Payment status for order {OrderId} updated to {PaymentStatus}", orderId, newPaymentStatus))
            .OnFailure(() =>
                Log(LogLevel.Warning, AdminOrderControllerEventIds.UpdatePaymentStatusFailedAdmin,
                    "Failed to update payment status for order {OrderId}. Error: {Error}", orderId, result.Error));

        return result.Failure
            ? DetermineOrderFailureResponse(result.Error)
            : StatusCode(StatusCodes.Status204NoContent);
    }

    [HttpPut("cancel/{orderId:int}")]
    public async Task<IActionResult> CancelOrder(int orderId)
    {
        if (orderId < 1)
        {
            return StatusCode(StatusCodes.Status400BadRequest, "Order id is less than 1");
        }

        Log(LogLevel.Information, AdminOrderControllerEventIds.CancelOrderStartAdmin,
            "Cancelling order {OrderId} as admin", orderId);

        var result = await _orderService.CancelOrderAdminAsync(orderId);

        result.OnSuccess(() =>
                Log(LogLevel.Information, AdminOrderControllerEventIds.CancelOrderSuccessAdmin,
                    "Order {OrderId} cancelled", orderId))
            .OnFailure(() =>
                Log(LogLevel.Error, AdminOrderControllerEventIds.CancelOrderFailedAdmin,
                    "Failed to cancel order {OrderId}. Error: {Error}", orderId, result.Error));

        return result.Failure
            ? StatusCode(StatusCodes.Status400BadRequest, new ProblemDetails
            {
                Title = "Failed to cancel order",
                Detail = result.Error
            })
            : StatusCode(StatusCodes.Status200OK);
    }

    private IActionResult DetermineOrderFailureResponse(string error)
    {
        if (!string.IsNullOrWhiteSpace(error) && error.Contains("No order", StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(StatusCodes.Status404NotFound, new ProblemDetails
            {
                Title = "Order not found",
                Detail = error
            });
        }

        return StatusCode(StatusCodes.Status400BadRequest, new ProblemDetails
        {
            Title = "Order operation failed",
            Detail = error
        });
    }
}
