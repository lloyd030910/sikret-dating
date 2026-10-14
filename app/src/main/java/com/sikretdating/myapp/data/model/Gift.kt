package com.sikretdating.myapp.data.model

data class Gift(
    val id: String,
    val name: String,
    val emoji: String,
    val coinPrice: Int
) {
    companion object {
        val AVAILABLE_GIFTS = listOf(
            Gift("1", "Red Rose", "🌹", 10),
            Gift("2", "Hot Coffee", "☕", 25),
            Gift("3", "Chocolate Box", "🍫", 50),
            Gift("4", "Shining Diamond", "💎", 100),
            Gift("5", "Golden Crown", "👑", 250)
        )
    }
}
