package com.plugplay.plugplaymobile.domain.model

data class ProductAttribute(
    val id: Int,
    val attributeId: Int,
    val productId: Int,
    val strValue: String?,
    val numValue: Double?
)
