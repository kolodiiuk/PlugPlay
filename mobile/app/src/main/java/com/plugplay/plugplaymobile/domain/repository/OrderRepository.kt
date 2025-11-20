package com.plugplay.plugplaymobile.domain.repository

import com.plugplay.plugplaymobile.data.model.ordering.OrderPlacementResponse
import com.plugplay.plugplaymobile.domain.model.ordering.Order
import com.plugplay.plugplaymobile.domain.model.ordering.OrderItem

interface OrderRepository {

    suspend fun placeOrder(request: String): Result<OrderPlacementResponse>

    suspend fun getOrderById(orderId: Int): Result<Order>

    suspend fun getUserOrders(userId: Int): Result<List<Order>>

    suspend fun getOrderItems(): Result<List<OrderItem>>

    suspend fun cancelOrder(): Result<Unit>
}
