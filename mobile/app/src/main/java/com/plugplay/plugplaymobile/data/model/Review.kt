package com.plugplay.plugplaymobile.domain.model

import com.plugplay.plugplaymobile.data.model.UserDto
import java.time.LocalDateTime

data class Review(
    val id: Int,
    val productId: Int,
    val userId: Int?,
    val rating: Int,
    val comment: String,
    val userDto: UserDto?,
    val createdAt: LocalDateTime,
    val updatedAt: LocalDateTime?
)
