package com.plugplay.plugplaymobile.data.remote

import com.plugplay.plugplaymobile.data.model.*
import com.plugplay.plugplaymobile.data.model.ProductDto
import com.plugplay.plugplaymobile.data.model.ProductListResponse
import com.plugplay.plugplaymobile.data.model.ordering.OrderDto
import com.plugplay.plugplaymobile.data.model.ordering.OrderItemDto
import com.plugplay.plugplaymobile.data.model.ordering.OrderPlacementRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import java.lang.Void // [ВИПРАВЛЕНО] Правильний імпорт

interface ShopApiService {

    @GET("api/Products/all")
    suspend fun getProducts(): List<ProductDto>

    @POST("api/auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("api/Auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<Void>

    @GET("api/UserInfo/{id}")
    suspend fun getProfile(@Path("id") userId: Int): Response<ProfileResponse>

    @PUT("api/UserInfo/{id}")
    suspend fun updateProfile(@Path("id") userId: Int, @Body request: UpdateProfileRequest): Response<ProfileResponse>

    @GET("api/Products/{id}")
    suspend fun getProductById(@Path("id") itemId: String): Response<ProductDto>

    @POST("api/Orders")
    suspend fun placeOrder(@Body request: OrderPlacementRequest): Response<OrderDto>

    @GET("api/Orders/user/{userId}")
    suspend fun getUserOrders(@Path("userId") userId: Int): Response<List<OrderDto>>

    @GET("api/Orders/{orderId}/order_items")
    suspend fun getOrderItems(@Path("orderId") orderId: Int): Response<List<OrderItemDto>>

    @GET("api/Orders/{orderId}")
    suspend fun getOrderById(@Path("orderId") orderId: Int): Response<OrderDto>

    @PUT("api/Orders/cancel/{orderId}")
    suspend fun cancelOrder(@Path("orderId") orderId: Int): Response<Void>

    // ------------------ CART API ------------------

    // GET /api/Cart/{userId}
    @GET("api/Cart/{userId}")
    suspend fun getCartItems(@Path("userId") userId: Int): Response<List<CartItemDto>>

    // POST /api/Cart
    @POST("api/Cart")
    suspend fun addToCart(@Body request: CreateCartItemDto): Response<Void>

    // PUT /api/Cart/quantity
    @PUT("api/Cart/quantity")
    suspend fun updateQuantity(@Body request: UpdateCartItemQuantityDto): Response<Void>

    // DELETE /api/Cart/{itemId} (itemId тут - це cartItemId)
    @DELETE("api/Cart/{itemId}")
    suspend fun deleteCartItem(@Path("itemId") cartItemId: Int): Response<Void>

    // DELETE /api/Cart/clear/{userId}
    @DELETE("api/Cart/clear/{userId}")
    suspend fun clearCart(@Path("userId") userId: Int): Response<Void>
}