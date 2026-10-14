package com.sikretdating.myapp.data.api

import com.sikretdating.myapp.data.model.LoginRequest
import com.sikretdating.myapp.data.model.LoginResponse
import com.sikretdating.myapp.data.model.RegisterRequest
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.POST

interface AuthService {
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<LoginResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<LoginResponse>
}
