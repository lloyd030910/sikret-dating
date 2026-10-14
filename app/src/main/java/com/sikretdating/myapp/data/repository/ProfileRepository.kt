package com.sikretdating.myapp.data.repository

import com.sikretdating.myapp.data.model.Profile

object ProfileRepository {
    private val profiles = mutableListOf(
        Profile(
            id = "1",
            name = "Sophia",
            age = 24,
            bio = "Coffee lover, traveler, and photography enthusiast. Looking for someone to explore new cities with!",
            location = "2 km away",
            isMatched = true,
            lastMessage = "Hey! Loved your profile 😊"
        ),
        Profile(
            id = "2",
            name = "Isabella",
            age = 26,
            bio = "Software engineer by day, foodie by night 🍕 Let's talk about life.",
            location = "5 km away",
            isMatched = false
        ),
        Profile(
            id = "3",
            name = "Emma",
            age = 23,
            bio = "Art, indie music, and sunset beach walks 🌅 Let's go on an adventure!",
            location = "3 km away",
            isMatched = true,
            lastMessage = "Are you free this weekend?"
        ),
        Profile(
            id = "4",
            name = "Mia",
            age = 25,
            bio = "Fitness, dogs, and spontaneous road trips 🚗",
            location = "8 km away",
            isMatched = false
        )
    )

    fun getUnswipedProfiles(): List<Profile> {
        return profiles.filter { !it.isLiked }
    }

    fun likeProfile(id: String): Boolean {
        val profile = profiles.find { it.id == id }
        if (profile != null) {
            profile.isLiked = true
            profile.isMatched = true
            profile.lastMessage = "Connected! Say hello 👋"
            return true
        }
        return false
    }

    fun passProfile(id: String) {
        val profile = profiles.find { it.id == id }
        if (profile != null) {
            profile.isLiked = true
        }
    }

    fun getMatches(): List<Profile> {
        return profiles.filter { it.isMatched }
    }
}
