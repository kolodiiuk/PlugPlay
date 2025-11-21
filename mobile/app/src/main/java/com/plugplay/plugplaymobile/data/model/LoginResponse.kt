package com.plugplay.plugplaymobile.data.model

import com.google.gson.annotations.SerializedName
import com.plugplay.plugplaymobile.domain.model.AuthData
import com.plugplay.plugplaymobile.domain.model.UserProfile
import com.plugplay.plugplaymobile.data.model.UserDto // Додаємо імпорт UserDto

data class LoginResponse(
    val token: String,
    val user: UserDto
)

data class ProfileResponse(
    val id: Int,
    @SerializedName("firstName") val firstName: String,
    @SerializedName("lastName") val lastName: String,
    val email: String,
    @SerializedName("phoneNumber") val phoneNumber: String
)

data class UpdateProfileRequest(
    val id: Int,
    val firstName: String,
    val lastName: String,
    val phoneNumber: String,
    val email: String,
    val addresses: List<UserAddressDto>
)

data class UserAddressDto (
    val id: Int,
    val house: String?,
    val apartments: String?,
    val street: String?,
    val city: String?
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
