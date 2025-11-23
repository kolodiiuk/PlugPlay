package com.plugplay.plugplaymobile.data.model

import com.google.gson.annotations.SerializedName
import com.plugplay.plugplaymobile.domain.model.AuthData
import com.plugplay.plugplaymobile.domain.model.UserProfile
import com.plugplay.plugplaymobile.data.model.UserDto // Додаємо імпорт UserDto

data class LoginResponse(
    @SerializedName("token") val token: String,
    @SerializedName("refreshToken") val refreshToken: String? = null,
    @SerializedName("expiration") val expiration: String? = null,
    @SerializedName("user") val user: UserDto
)

data class ProfileResponse(
    val id: Int,
    @SerializedName("firstName") val firstName: String,
    @SerializedName("lastName") val lastName: String,
    val email: String,
    @SerializedName("phoneNumber") val phoneNumber: String
)

data class UpdateProfileRequest(
    val firstName: String,
    val lastName: String,
    val phoneNumber: String,
    val email: String,
    val currentPassword: String? = null,
    val newPassword: String? = null,
)

fun LoginResponse.toAuthData(): AuthData {
    return AuthData(
        token = this.token,
        userId = this.user.id
    )
}

fun ProfileResponse.toDomain(): UserProfile {
    return UserProfile(
        id = this.id.toString(),
        firstName = this.firstName,
        lastName = this.lastName,
        email = this.email,
        phoneNumber = this.phoneNumber
    )
}
