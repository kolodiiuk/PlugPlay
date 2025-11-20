package com.plugplay.plugplaymobile.data.repository

import com.plugplay.plugplaymobile.data.model.ordering.OrderPlacementResponse
import com.plugplay.plugplaymobile.data.remote.ShopApiService
import com.plugplay.plugplaymobile.domain.model.ordering.Order
import com.plugplay.plugplaymobile.domain.model.ordering.OrderItem
import com.plugplay.plugplaymobile.domain.repository.OrderRepository
import javax.inject.Inject

class OrderRepositoryImpl  @Inject constructor(
    private val apiService: ShopApiService
) : OrderRepository {

    override suspend fun placeOrder(request: String): Result<OrderPlacementResponse> {
        TODO("Not yet implemented")

//        return runCatching {
//            apiService.placeOrder(request)
//        }
    }

    override suspend fun getOrderById(orderId: Int): Result<Order> {
        TODO("Not yet implemented")
    }

    override suspend fun getUserOrders(userId: Int): Result<List<Order>> {
        TODO("Not yet implemented")
    }

    override suspend fun getOrderItems(): Result<List<OrderItem>> {
        TODO("Not yet implemented")
    }

    override suspend fun cancelOrder(): Result<Unit> {
        TODO("Not yet implemented")
    }
}
