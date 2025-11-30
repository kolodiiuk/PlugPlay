package com.plugplay.plugplaymobile.domain.repository

import com.plugplay.plugplaymobile.data.model.UserAddressDto
import com.plugplay.plugplaymobile.domain.model.AuthData
import com.plugplay.plugplaymobile.domain.model.UserProfile
import kotlinx.coroutines.flow.Flow

interface AuthRepository {

    suspend fun login(email: String, password: String): Result<AuthData>

    suspend fun register(firstName: String, lastName: String, phoneNumber: String, email: String, password: String): Result<Unit>

    suspend fun saveAuthData(authData: AuthData)

    fun getUserId(): Flow<Int?>

    suspend fun logout()

    fun getAuthStatus(): Flow<Boolean>

    suspend fun getProfile(): Result<UserProfile>

    suspend fun updateProfile(
        firstName: String,
        lastName: String,
        phoneNumber: String,
        email: String,
        addresses: List<UserAddressDto> = emptyList(),
    ): Result<UserProfile>
}
