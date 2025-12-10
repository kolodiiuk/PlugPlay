using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PlugPlay.Services.Interfaces;

namespace PlugPlay.Api.Controllers.Admin;

[Authorize(Roles = "Admin")]
[Microsoft.AspNetCore.Components.Route("api/admin/[controller]")]
public class OrderController : BaseController<OrderController>
{
    private readonly IOrderService _orderService;

    public OrderController(IOrderService orderService, ILogger<OrderController> logger) : base(logger)
    {
        _orderService = orderService;
    }

    [HttpPut("order/order-status/{id:int}")]
    public async Task<IActionResult> UpdateOrderStatus(int orderId)
    {
        return StatusCode(418);
    }

    [HttpPut("order/payment-status/{id:int}")]
    public async Task<IActionResult> UpdatePaymentStatus(int orderId)
    {
        return StatusCode(418);
    }
}
