package com.plugplay.plugplaymobile.data.model

import com.google.gson.annotations.SerializedName

/**
 * DTOs aligned with backend CartController contracts.
 */
data class CreateCartItemDto(
    @SerializedName("ProductId")
    val productId: Int,
    @SerializedName("UserId")
    val userId: Int,
    @SerializedName("Quantity")
    val quantity: Int
)

data class UpdateCartItemQuantityDto(
    @SerializedName("CartItemId")
    val cartItemId: Int,
    @SerializedName("NewQuantity")
    val newQuantity: Int
)

data class CartItemDto(
    @SerializedName("Id")
    val id: Int,
    @SerializedName("ProductId")
    val productId: Int,
    @SerializedName("Quantity")
    val quantity: Int,
    @SerializedName("Total")
    val total: Double,
    @SerializedName("UserId")
    val userId: Int
)
