package com.plugplay.plugplaymobile.domain.usecase.ordering

import com.plugplay.plugplaymobile.data.model.ordering.OrderPlacementRequest
import com.plugplay.plugplaymobile.data.model.ordering.OrderPlacementResponse
import com.plugplay.plugplaymobile.domain.repository.OrderRepository
import javax.inject.Inject

class PlaceOrderUseCase @Inject constructor(
    private val repository: OrderRepository
) {
    suspend operator fun invoke(orderPlacementRequest: OrderPlacementRequest): Result<OrderPlacementResponse> {

        return repository.placeOrder("")
    }
}
