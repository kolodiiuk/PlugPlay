package com.plugplay.plugplaymobile.presentation.ordering

sealed interface CheckoutResultState {
    data object Idle : CheckoutResultState
    data object Loading : CheckoutResultState
    data object Success : CheckoutResultState
    data class Error(val message: String) : CheckoutResultState
}
