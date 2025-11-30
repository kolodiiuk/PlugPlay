package com.plugplay.plugplaymobile.domain.model.ordering

data class Order(
    val id: Int,
    val userId: Int?,
    val orderDate: java.time.Instant,
    val status: OrderStatus,
    val totalAmount: Double,
    val deliveryMethod: DeliveryMethod,
    val paymentMethod: PaymentMethod,
    val deliveryAddressId: Int?,
    val paymentStatus: PaymentStatus,
    val transactionId: Long,
    val paymentCreated: java.time.Instant?,
    val paymentProcessed: java.time.Instant?,
    val paymentFailureReason: String?,
    val updatedAt: java.time.Instant
)
