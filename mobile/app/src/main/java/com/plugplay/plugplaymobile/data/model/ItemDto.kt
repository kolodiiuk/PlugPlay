package com.plugplay.plugplaymobile.data.model

import com.google.gson.annotations.SerializedName
import com.plugplay.plugplaymobile.domain.model.Review

data class ItemDto(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String,
    @SerializedName("description") val description: String,
    @SerializedName("price") val price: Double,
    @SerializedName("stockQuantity") val stockQuantity: Int = 0,
    @SerializedName("createdAt") val createdAt: String? = null,
    @SerializedName("category") val category: CategoryDto? = null,
    @SerializedName("pictureUrls") val pictureUrls: List<String>? = null,
    @SerializedName("reviews") val reviews: List<Review> = emptyList(),
    @SerializedName("attributes") val attributes: List<AttributeDto>? = null,
    @SerializedName("productAttributeDtos") val productAttributeDtos: List<ProductAttributeDto>? = null
)
{
    // Backward-compatible convenience properties used by UI
    val imageUrl: String = pictureUrls?.firstOrNull() ?: ""
    val isAvailable: Boolean = stockQuantity > 0
}
