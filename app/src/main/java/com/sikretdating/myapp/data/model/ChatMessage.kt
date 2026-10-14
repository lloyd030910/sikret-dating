package com.sikretdating.myapp.data.model

data class ChatMessage(
    val id: String = System.currentTimeMillis().toString(),
    var text: String,
    val isFromMe: Boolean,
    val timestamp: String,
    val isGift: Boolean = false,
    val giftEmoji: String? = null,
    val giftCoins: Int? = null,
    val mediaType: String? = null, // "PHOTO" or "VIDEO"
    var isLocked: Boolean = false,
    var unlockPriceUSD: Double = 0.0,
    var isUnlocked: Boolean = false,
    var freePreviewText: String? = null
)
