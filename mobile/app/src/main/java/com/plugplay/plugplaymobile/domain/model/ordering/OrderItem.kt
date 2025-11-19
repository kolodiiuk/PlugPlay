package com.plugplay.plugplaymobile.domain.model.ordering

data class OrderItem(
    val id: Int,
    val productId: Int,
    val orderId: Int,
    val quantity: Int,
    val unitPrice: Double
)
