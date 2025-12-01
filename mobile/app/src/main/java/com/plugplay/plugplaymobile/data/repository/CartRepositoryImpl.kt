package com.plugplay.plugplaymobile.data.repository

import com.plugplay.plugplaymobile.data.local.CartLocalDataSource
import com.plugplay.plugplaymobile.data.model.CartItemDto
import com.plugplay.plugplaymobile.data.model.CreateCartItemDto
import com.plugplay.plugplaymobile.data.model.UpdateCartItemQuantityDto
import com.plugplay.plugplaymobile.data.remote.ShopApiService
import com.plugplay.plugplaymobile.domain.model.CartItem
import com.plugplay.plugplaymobile.domain.repository.CartRepository
import com.plugplay.plugplaymobile.domain.repository.ProductRepository
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.emitAll
import kotlinx.coroutines.flow.flow
import kotlinx.coroutines.withContext
import javax.inject.Inject
import javax.inject.Singleton
import java.lang.Exception

@Singleton
class CartRepositoryImpl @Inject constructor(
    private val apiService: ShopApiService,
    private val localDataSource: CartLocalDataSource,
    private val productRepository: ProductRepository
) : CartRepository {

    override fun getCartItems(userId: Int?): Flow<List<CartItem>> {
        return if (userId != null && userId > 0) {
            flow {
                refreshLocalCart(userId)
                emitAll(localDataSource.guestCart)
            }
        } else {
            localDataSource.guestCart
        }
    }

    override suspend fun addToCart(userId: Int?, productId: Int, quantity: Int): Result<Unit> =
        withContext(Dispatchers.IO) {
            if (userId != null) {
                if (userId < 1) {
                    return@withContext Result.failure(IllegalArgumentException("Invalid user id"))
                }
                runCatching {
                    val request = CreateCartItemDto(
                        productId = productId,
                        userId = userId,
                        quantity = quantity
                    )
                    val response = apiService.addToCart(request)
                    if (!response.isSuccessful) {
                        throw Exception("Failed to add to cart via API: ${response.message()}")
                    }
                    refreshLocalCart(userId)
                    Unit
                }
            } else {
                runCatching {
                    val product = productRepository.getProductById(productId).getOrThrow()
                    val cart = localDataSource.value.toMutableList()
                    val existingItem = cart.find { it.productId == productId }

                    if (existingItem != null) {
                        val newQuantity = existingItem.quantity + quantity
                        val updatedItem = existingItem.copy(
                            quantity = newQuantity,
                            total = newQuantity * product.price
                        )
                        cart[cart.indexOf(existingItem)] = updatedItem
                    } else {
                        val newCartItem = CartItem(
                            id = localDataSource.getNextId().toInt(),
                            productId = product.id,
                            name = product.name,
                            imageUrl = product.imageUrl,
                            unitPrice = product.price,
                            quantity = quantity,
                            total = product.price * quantity
                        )
                        cart.add(newCartItem)
                    }
                    localDataSource.saveGuestCart(cart)
                    Unit
                }
            }
        }

    override suspend fun updateQuantity(
        userId: Int?,
        cartItemId: Int,
        newQuantity: Int
    ): Result<Unit> = withContext(Dispatchers.IO) {
        if (newQuantity < 1) return@withContext Result.success(Unit)

        if (userId != null) {
            if (userId < 1) {
                return@withContext Result.failure(IllegalArgumentException("Invalid user id"))
            }
            runCatching {
                val request = UpdateCartItemQuantityDto(
                    cartItemId = cartItemId,
                    newQuantity = newQuantity
                )
                val response = apiService.updateQuantity(request)
                if (!response.isSuccessful) {
                    throw Exception("Failed to update quantity via API: ${response.message()}")
                }
                refreshLocalCart(userId)
                Unit
            }
        } else {
            runCatching {
                val cart = localDataSource.value.toMutableList()
                val item =
                    cart.find { it.id == cartItemId } ?: throw Exception("Cart item not found")

                val updatedItem = item.copy(
                    quantity = newQuantity,
                    total = newQuantity * item.unitPrice
                )
                cart[cart.indexOf(item)] = updatedItem
                localDataSource.saveGuestCart(cart)
                Unit
            }
        }
    }

    override suspend fun deleteCartItem(userId: Int?, cartItemId: Int): Result<Unit> =
        withContext(Dispatchers.IO) {
            if (userId != null) {
                if (userId < 1) {
                    return@withContext Result.failure(IllegalArgumentException("Invalid user id"))
                }
                runCatching {
                    val response = apiService.deleteCartItem(cartItemId)
                    if (!response.isSuccessful) {
                        throw Exception("Failed to delete cart item via API: ${response.message()}")
                    }
                    refreshLocalCart(userId)
                    Unit
                }
            } else {
                runCatching {
                    val updatedCart = localDataSource.value.filter { it.id != cartItemId }
                    localDataSource.saveGuestCart(updatedCart)
                    Unit
                }
            }
        }

    override suspend fun clearCart(userId: Int?): Result<Unit> = withContext(Dispatchers.IO) {
        if (userId != null) {
            if (userId < 1) {
                return@withContext Result.failure(IllegalArgumentException("Invalid user id"))
            }
            runCatching {
                val response = apiService.clearCart(userId)
                if (!response.isSuccessful) {
                    throw Exception("Failed to clear cart via API: ${response.message()}")
                }
                localDataSource.clearGuestCart()
                Unit
            }
        } else {
            runCatching {
                localDataSource.clearGuestCart()
                Unit
            }
        }
    }

    private suspend fun refreshLocalCart(userId: Int) {
        if (userId < 1) return
        try {
            val response = apiService.getCartItems(userId)
            if (!response.isSuccessful) {
                println("ERROR: Failed to fetch cart for user $userId: ${response.code()} ${response.message()}")
                return
            }
            val remoteItems = response.body().orEmpty()
            val mappedItems = mapRemoteCartItems(remoteItems)
            localDataSource.saveGuestCart(mappedItems)
        } catch (e: Exception) {
            println("ERROR: Failed to refresh local cart after API mutation: ${e.message}")
        }
    }

    private suspend fun mapRemoteCartItems(remoteItems: List<CartItemDto>): List<CartItem> {
        return remoteItems.map { dto ->
            val productResult = productRepository.getProductById(dto.productId)
            if (productResult.isFailure) {
                println("WARN: Unable to fetch product ${dto.productId}: ${productResult.exceptionOrNull()?.message}")
            }
            val product = productResult.getOrNull()
            dto.toDomain(
                name = product?.name ?: "Product #${dto.productId}",
                imageUrl = product?.imageUrl ?: DEFAULT_IMAGE_URL,
                unitPrice = product?.price ?: safeUnitPrice(dto.total, dto.quantity),
                totalOverride = dto.total
            )
        }
    }

    private fun CartItemDto.toDomain(
        name: String,
        imageUrl: String,
        unitPrice: Double,
        totalOverride: Double
    ): CartItem {
        val resolvedTotal = if (totalOverride <= 0.0) unitPrice * quantity else totalOverride
        return CartItem(
            id = id,
            productId = productId,
            name = name,
            imageUrl = imageUrl,
            unitPrice = unitPrice,
            quantity = quantity,
            total = resolvedTotal
        )
    }

    private fun safeUnitPrice(total: Double, quantity: Int): Double {
        return if (quantity <= 0) 0.0 else total / quantity
    }

    companion object {
        private const val DEFAULT_IMAGE_URL = "https://example.com/placeholder.jpg"
    }
}