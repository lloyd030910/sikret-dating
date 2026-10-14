package com.sikretdating.myapp.data.api

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object RetrofitClient {
    // Configurable API base URL (Change to your live production server or API domain)
    var baseUrl: String = "https://api.sikretdating.com/api/"
        set(value) {
            field = value
            rebuildRetrofit()
        }

    private val logging = HttpLoggingInterceptor().apply {
        level = HttpLoggingInterceptor.Level.BODY
    }

    private val httpClient = OkHttpClient.Builder()
        .addInterceptor(logging)
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(10, TimeUnit.SECONDS)
        .build()

    private var retrofit: Retrofit = buildRetrofit()

    var authService: AuthService = retrofit.create(AuthService::class.java)
        private set

    var profileService: ProfileService = retrofit.create(ProfileService::class.java)
        private set

    var chatService: ChatService = retrofit.create(ChatService::class.java)
        private set

    private fun buildRetrofit(): Retrofit {
        return Retrofit.Builder()
            .baseUrl(baseUrl)
            .addConverterFactory(GsonConverterFactory.create())
            .client(httpClient)
            .build()
    }

    private fun rebuildRetrofit() {
        retrofit = buildRetrofit()
        authService = retrofit.create(AuthService::class.java)
        profileService = retrofit.create(ProfileService::class.java)
        chatService = retrofit.create(ChatService::class.java)
    }
}
