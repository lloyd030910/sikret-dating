package com.sikretdating.myapp.data.api

import com.sikretdating.myapp.data.model.ChatMessage
import retrofit2.Response
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ChatService {
    @GET("chat/{matchId}/messages")
    suspend fun getMessages(@Path("matchId") matchId: String): Response<List<ChatMessage>>

    @POST("chat/{matchId}/send")
    suspend fun sendMessage(
        @Path("matchId") matchId: String,
        @Body message: ChatMessage
    ): Response<ChatMessage>
}
