package com.plugplay.plugplaymobile.domain.usecase.ordering

import com.plugplay.plugplaymobile.domain.repository.OrderRepository
import javax.inject.Inject

class CancelOrderUseCase @Inject constructor(
    private val repository: OrderRepository
) {
    suspend operator fun invoke(): Result<Unit> {
        return TODO("Provide the return value")
    }
}
