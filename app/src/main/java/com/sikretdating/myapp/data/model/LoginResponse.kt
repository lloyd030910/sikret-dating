package com.sikretdating.myapp.data.model

import com.google.gson.annotations.SerializedName

data class LoginResponse(
    @SerializedName("access_token") val accessToken: String,
    @SerializedName("refresh_token") val refreshToken: String? = null,
    @SerializedName("user") val user: UserProfile? = null
)

data class UserProfile(
    @SerializedName("id") val id: String,
    @SerializedName("email") val email: String,
    @SerializedName("displayName") val displayName: String? = null
)
