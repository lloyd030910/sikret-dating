package com.sikretdating.myapp.data.api

import com.sikretdating.myapp.data.model.Profile
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.Path

interface ProfileService {
    @GET("profiles/discover")
    suspend fun getDiscoverProfiles(): Response<List<Profile>>

    @POST("profiles/{id}/like")
    suspend fun likeProfile(@Path("id") profileId: String): Response<Map<String, Boolean>>

    @POST("profiles/{id}/pass")
    suspend fun passProfile(@Path("id") profileId: String): Response<Unit>

    @GET("profiles/matches")
    suspend fun getMatches(): Response<List<Profile>>
}
