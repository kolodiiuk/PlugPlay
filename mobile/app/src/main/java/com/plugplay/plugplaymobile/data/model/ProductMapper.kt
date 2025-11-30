package com.plugplay.plugplaymobile.data.model

import com.plugplay.plugplaymobile.domain.model.Item
import com.plugplay.plugplaymobile.domain.model.Product
import java.util.Locale
import java.text.NumberFormat

fun ProductDto.toDomain(): Product {
    val firstImage = this.pictureUrls?.firstOrNull()
        ?: "https://res.cloudinary.com/dovmlupww/image/upload/v1761867319/Gemini_Generated_Image_3vl0793vl0793vl0_ly2vhd.png"

    val priceText = this.price ?: 0.0
    val currencyFormat = NumberFormat.getCurrencyInstance(Locale("uk", "UA"))

    return Product(
        id = this.id.toString(),
        title = this.name ?: "Без назви",
        priceValue = String.format("%.2f ₴", priceText),
        image = firstImage
    )
}

fun List<ProductDto>.toDomainList(): List<Product> = this.map { it.toDomain() }

fun ProductDto.toDomainItem(): Item {
    val pictures = this.pictureUrls ?: emptyList()
    return Item(
        id = this.id,
        name = this.name ?: "Без назви",
        description = this.description ?: "Опис відсутній.",
        price = this.price ?: 0.0,
        stockQuantity = this.stockQuantity ?: 0,
        createdAt = this.createdAt,
        category = this.category,
        pictureUrls = pictures,
        reviews = this.reviews ?: emptyList(),
        attributes = this.attributes ?: emptyList(),
        productAttributeDtos = this.productAttributeDtos ?: emptyList()
    )
}
