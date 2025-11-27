package com.plugplay.plugplaymobile.data.model

import com.google.gson.annotations.SerializedName

data class CategoryDto(
    @SerializedName("id") val id: Int,
    @SerializedName("name") val name: String?,
    @SerializedName("parent") val parent: CategoryDto?
)
