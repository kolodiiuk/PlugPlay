package com.plugplay.plugplaymobile.presentation.product_detail

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.plugplay.plugplaymobile.domain.model.Item
import com.plugplay.plugplaymobile.R
import java.text.NumberFormat
import java.util.Locale


@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemDetailScreen(
    navController: NavController, viewModel: ItemDetailViewModel = hiltViewModel()
) {
    val state by viewModel.state.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Plug & Play") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Назад")
                    }
                }, actions = {
                    IconButton(onClick = { /* TODO: Пошук */ }) {
                        Icon(Icons.Outlined.Search, contentDescription = "Пошук")
                    }
                    IconButton(onClick = { /* TODO: Профіль */ }) {
                        Icon(Icons.Outlined.Person, contentDescription = "Профіль")
                    }
                    IconButton(onClick = { /* TODO: Корзина */ }) {
                        Icon(Icons.Outlined.ShoppingCart, contentDescription = "Корзина")
                    }
                })
        }) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            when {
                state.isLoading -> {
                    CircularProgressIndicator(Modifier.align(Alignment.Center))
                }

                state.error != null -> {
                    Text(
                        text = state.error.toString(),
                        color = MaterialTheme.colorScheme.error,
                        modifier = Modifier
                            .align(Alignment.Center)
                            .padding(16.dp)
                    )
                }

                state.item != null -> {
                    ItemDetailContent(item = state.item!!)
                }
            }
        }
    }
}

@Composable
fun ItemDetailContent(item: Item) {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF4F4F4)),
        contentPadding = PaddingValues(bottom = 32.dp)
    ) {
        item {
            ImagePager(item.imageUrl)
        }

        item {
            Column(
                Modifier
                    .background(Color.White)
                    .padding(16.dp)
            ) {
                TitleAndPrice(item)
                Spacer(Modifier.height(24.dp))
            }
        }

        item {
            ActionButtons(item)
        }

        item {
            DescriptionSection(item)
        }
    }
}

@Composable
fun ImagePager(imageUrl: String) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(400.dp)
            .background(Color.White),
        contentAlignment = Alignment.Center
    ) {
        AsyncImage(
            model = imageUrl,
            contentDescription = "Зображення товару",
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
            error = painterResource(id = R.drawable.ic_launcher_foreground)
        )

        IconButton(
            onClick = { /*TODO*/ }, modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(16.dp)
        ) {
            Icon(Icons.Outlined.FavoriteBorder, contentDescription = "В обране")
        }
    }
}

@Composable
fun TitleAndPrice(item: Item) {
    val currencyFormat = NumberFormat.getCurrencyInstance(Locale("uk", "UA"))

    Column(modifier = Modifier.fillMaxWidth()) {
        Text(
            text = item.name,
            style = MaterialTheme.typography.headlineSmall,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(Modifier.height(8.dp))
// reviews
//        Row(
//            verticalAlignment = Alignment.CenterVertically,
//            modifier = Modifier.fillMaxWidth()
//        ) {
//            Icon(
//                Icons.Filled.Star,
//                contentDescription = null,
//                tint = Color(0xFFFFC107),
//                modifier = Modifier.size(16.dp)
//            )
//            Text(
//                " 4.7 (1044 відгуки)", style = MaterialTheme.typography.bodySmall, color = Color.Gray
//            )
//            Spacer(Modifier.width(8.dp))
//        }

        Spacer(Modifier.height(16.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(
                Icons.Default.CheckCircle,
                contentDescription = "Наявність",
                tint = Color.Green,
                modifier = Modifier.size(18.dp)
            )
            Spacer(Modifier.width(4.dp))
            Text(
                text = if (item.isAvailable) "Є в наявності" else "Немає в наявності",
                color = Color.Green,
                fontWeight = FontWeight.SemiBold
            )
        }

        Spacer(Modifier.height(16.dp))

        Row(
            verticalAlignment = Alignment.Bottom,
            modifier = Modifier.fillMaxWidth()
        ) {
            Text(
                text = currencyFormat.format(item.price),
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.Bold,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}

@Composable
fun ActionButtons(item: Item) {
    Column(
        Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(start = 16.dp, end = 16.dp, bottom = 16.dp, top = 8.dp)
    ) {
        Button(
            onClick = { /* TODO: Buy Logic */ },
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(8.dp),
            enabled = item.isAvailable
        ) {
            Text("Купити", fontWeight = FontWeight.Bold)
        }
        Spacer(Modifier.height(8.dp))
        OutlinedButton(
            onClick = { /* TODO: Add to Cart Logic */ },
            modifier = Modifier
                .fillMaxWidth()
                .height(48.dp),
            shape = RoundedCornerShape(8.dp),
            enabled = item.isAvailable
        ) {
            Text("Додати в корзину", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun DescriptionSection(item: Item) {
    Column(
        Modifier
            .fillMaxWidth()
            .padding(top = 8.dp)
            .background(Color.White)
            .padding(16.dp)
    ) {
        Text(
            "Опис товару", style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold
        )
        Spacer(Modifier.height(16.dp))
        Text(
            text = item.description, style = MaterialTheme.typography.bodyMedium
        )
    }
}
