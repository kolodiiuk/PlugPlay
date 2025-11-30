package com.plugplay.plugplaymobile.presentation.ordering

import androidx.compose.runtime.Composable
import androidx.hilt.navigation.compose.hiltViewModel

@Composable
fun CheckoutScreen(
    onCheckoutSuccess: () -> Unit,
    onNavigateToCheckout: () -> Unit, // not sure about it
    viewModel: CheckoutViewModel = hiltViewModel()
) {

}
