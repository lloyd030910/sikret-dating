package com.sikretdating.myapp.data.model

data class Profile(
    val id: String,
    val name: String,
    val age: Int,
    val bio: String,
    val location: String,
    val imageUrl: String? = null,
    var isLiked: Boolean = false,
    var isMatched: Boolean = false,
    var lastMessage: String? = null
)
