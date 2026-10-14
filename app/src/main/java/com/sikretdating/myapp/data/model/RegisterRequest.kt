package com.sikretdating.myapp.data.model

import com.google.gson.annotations.SerializedName

data class RegisterRequest(
    @SerializedName("email") val email: String,
    @SerializedName("password") val password: String,
    @SerializedName("displayName") val displayName: String,
    @SerializedName("age") val age: Int? = null
)
