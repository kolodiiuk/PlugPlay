package com.plugplay.plugplaymobile.data.model

import com.google.gson.annotations.SerializedName
import com.plugplay.plugplaymobile.domain.model.Review

data class ProductDto(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String?,
    @SerializedName("description") val description: String?,
    @SerializedName("price") val price: Double?,
    @SerializedName("stockQuantity") val stockQuantity: Int?,
    @SerializedName("createdAt") val createdAt: String?,
    @SerializedName("category") val category: CategoryDto?,
    @SerializedName("pictureUrls") val pictureUrls: List<String>?,
    @SerializedName("reviews") val reviews: List<Review>,
    @SerializedName("attributes") val attributes: List<AttributeDto>?,
    @SerializedName("productAttributeDtos") val productAttributeDtos: List<ProductAttributeDto>?
)

data class ReviewDto(
    @SerializedName("id") val id: Int,
    @SerializedName("author") val author: String?,
    @SerializedName("rating") val rating: Double?,
    @SerializedName("comment") val comment: String?
)

data class AttributeDto(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String?,
    @SerializedName("unit") val unit: String?,
    @SerializedName("dataType") val dataType: String?
)

data class ProductAttributeDto(
    @SerializedName("id") val id: Int,
    @SerializedName("attributeId") val attributeId: Int,
    @SerializedName("productId") val productId: Int,
    @SerializedName("strValue") val strValue: String?,
    @SerializedName("numValue") val numValue: Double?
)
