package com.plugplay.plugplaymobile.presentation.ordering

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.plugplay.plugplaymobile.data.model.ordering.OrderPlacementRequest
import com.plugplay.plugplaymobile.domain.model.ordering.Order
import com.plugplay.plugplaymobile.domain.repository.AuthRepository
import com.plugplay.plugplaymobile.domain.repository.OrderRepository
import com.plugplay.plugplaymobile.domain.usecase.ordering.PlaceOrderUseCase
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

class CheckoutViewModel @Inject constructor(
    private val placeOrderUseCase: PlaceOrderUseCase,
    private val orderRepository: OrderRepository,
    private val authRepository: AuthRepository
) : ViewModel() {

    private val _state = MutableStateFlow<CheckoutResultState>(CheckoutResultState.Idle)
    val state: StateFlow<CheckoutResultState> = _state.asStateFlow()

    val isLoggedIn: StateFlow<Boolean> = authRepository.getAuthStatus()
        .stateIn(
            scope = viewModelScope,
            started = SharingStarted.WhileSubscribed(5000),
            initialValue = false
        )

    fun placeOrder(orderRequest: OrderPlacementRequest) {
        viewModelScope.launch {
            _state.value = CheckoutResultState.Loading

            placeOrderUseCase(orderRequest)
                .onSuccess {
                    _state.value = CheckoutResultState.Success
                }
                .onFailure { error ->
                    _state.value = CheckoutResultState.Error(error.message ?: "Помилка оформлення замовлення.")
                }
        }
    }

    fun resetState() {
        _state.value = CheckoutResultState.Idle
    }
}
