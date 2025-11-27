package com.plugplay.plugplaymobile.data.model

import com.plugplay.plugplaymobile.domain.model.Item

fun ItemDto.toDomain(): Item {
    return Item(
        id = this.id,
        name = this.name,
        description = this.description,
        price = this.price,
        stockQuantity = this.stockQuantity,
        createdAt = this.createdAt,
        category = this.category,
        pictureUrls = this.pictureUrls,
        reviews = this.reviews,
        attributes = this.attributes,
        productAttributeDtos = this.productAttributeDtos
    )
}