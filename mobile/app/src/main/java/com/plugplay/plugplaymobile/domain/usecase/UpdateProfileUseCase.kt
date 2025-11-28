package com.plugplay.plugplaymobile.domain.usecase

import com.plugplay.plugplaymobile.domain.model.UserProfile
import com.plugplay.plugplaymobile.domain.repository.AuthRepository
import javax.inject.Inject

class UpdateProfileUseCase @Inject constructor(
    private val repository: AuthRepository
) {
    suspend operator fun invoke(
        firstName: String,
        lastName: String,
        phoneNumber: String,
        email: String,
        addresses: List<com.plugplay.plugplaymobile.data.model.UserAddressDto> = emptyList()
    ): Result<UserProfile> {
        return repository.updateProfile(firstName, lastName, phoneNumber, email, addresses)
    }
}
