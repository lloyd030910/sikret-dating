package com.sikretdating.myapp.data.local

import android.content.Context
import android.content.SharedPreferences
import androidx.appcompat.app.AppCompatDelegate

class TokenManager(context: Context) {
    private val prefs: SharedPreferences = context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val TOKEN_KEY = "auth_token"
        private const val KEY_EMAIL = "registered_email"
        private const val KEY_PASSWORD = "registered_password"
        private const val KEY_NAME = "user_name"
        private const val KEY_BIO = "user_bio"
        private const val KEY_AGE = "user_age"
        private const val KEY_LOOKING_FOR = "user_looking_for"
        private const val KEY_GENDER = "user_gender"
        private const val KEY_OCCUPATION = "user_occupation"
        private const val KEY_LOCATION = "user_location"
        private const val KEY_HEIGHT = "user_height"
        private const val KEY_BALANCE = "wallet_balance"
        private const val KEY_EARNINGS = "withdrawable_earnings"
        private const val KEY_PREMIUM = "is_premium"
        private const val KEY_DARK_MODE = "dark_mode"
    }

    fun saveToken(token: String) {
        prefs.edit().putString(TOKEN_KEY, token).apply()
    }

    fun getToken(): String? = prefs.getString(TOKEN_KEY, null)

    fun clearToken() {
        // Clear active session token
        prefs.edit().remove(TOKEN_KEY).apply()
    }

    fun hasToken(): Boolean = getToken() != null

    fun getRegisteredEmail(): String? = prefs.getString(KEY_EMAIL, null)
    fun setRegisteredEmail(email: String) = prefs.edit().putString(KEY_EMAIL, email).apply()

    fun getRegisteredPassword(): String? = prefs.getString(KEY_PASSWORD, null)
    fun setRegisteredPassword(password: String) = prefs.edit().putString(KEY_PASSWORD, password).apply()

    fun getUserName(): String = prefs.getString(KEY_NAME, "User") ?: "User"
    fun setUserName(name: String) = prefs.edit().putString(KEY_NAME, name).apply()

    fun getUserBio(): String = prefs.getString(KEY_BIO, "Looking for genuine connections ✨") ?: ""
    fun setUserBio(bio: String) = prefs.edit().putString(KEY_BIO, bio).apply()

    fun getUserAge(): Int = prefs.getInt(KEY_AGE, 25)
    fun setUserAge(age: Int) = prefs.edit().putInt(KEY_AGE, age).apply()

    fun getLookingFor(): String = prefs.getString(KEY_LOOKING_FOR, "Long-term relationship ❤️") ?: "Long-term relationship ❤️"
    fun setLookingFor(lookingFor: String) = prefs.edit().putString(KEY_LOOKING_FOR, lookingFor).apply()

    fun getGender(): String = prefs.getString(KEY_GENDER, "Not specified") ?: "Not specified"
    fun setGender(gender: String) = prefs.edit().putString(KEY_GENDER, gender).apply()

    fun getOccupation(): String = prefs.getString(KEY_OCCUPATION, "Professional 💻") ?: "Professional 💻"
    fun setOccupation(occupation: String) = prefs.edit().putString(KEY_OCCUPATION, occupation).apply()

    fun getLocation(): String = prefs.getString(KEY_LOCATION, "New York, USA 📍") ?: "New York, USA 📍"
    fun setLocation(location: String) = prefs.edit().putString(KEY_LOCATION, location).apply()

    fun getHeight(): String = prefs.getString(KEY_HEIGHT, "5'7\" (170 cm)") ?: "5'7\" (170 cm)"
    fun setHeight(height: String) = prefs.edit().putString(KEY_HEIGHT, height).apply()

    fun getWalletBalance(): Int = prefs.getInt(KEY_BALANCE, 100)
    fun addWalletBalance(amount: Int) {
        val newBalance = (getWalletBalance() + amount).coerceAtLeast(0)
        prefs.edit().putInt(KEY_BALANCE, newBalance).apply()
    }

    fun getFreePhotoViews(matchName: String): Int {
        val key = "free_views_$matchName"
        return prefs.getInt(key, 2)
    }

    fun useFreePhotoView(matchName: String): Boolean {
        val current = getFreePhotoViews(matchName)
        if (current > 0) {
            prefs.edit().putInt("free_views_$matchName", current - 1).apply()
            return true
        }
        return false
    }

    fun getWithdrawableEarnings(): Float = prefs.getFloat(KEY_EARNINGS, 15.00f)
    fun addWithdrawableEarnings(amount: Float) {
        val newEarnings = getWithdrawableEarnings() + amount
        prefs.edit().putFloat(KEY_EARNINGS, newEarnings).apply()
    }
    fun withdrawEarnings(amount: Float): Boolean {
        val current = getWithdrawableEarnings()
        if (amount > 0 && current >= amount) {
            prefs.edit().putFloat(KEY_EARNINGS, current - amount).apply()
            return true
        }
        return false
    }

    fun isPremium(): Boolean = prefs.getBoolean(KEY_PREMIUM, false)
    fun setPremium(isPremium: Boolean) = prefs.edit().putBoolean(KEY_PREMIUM, isPremium).apply()

    fun isDarkMode(): Boolean = prefs.getBoolean(KEY_DARK_MODE, false)
    fun setDarkMode(enabled: Boolean) {
        prefs.edit().putBoolean(KEY_DARK_MODE, enabled).apply()
        val mode = if (enabled) AppCompatDelegate.MODE_NIGHT_YES else AppCompatDelegate.MODE_NIGHT_NO
        AppCompatDelegate.setDefaultNightMode(mode)
    }

    fun applyTheme() {
        val mode = if (isDarkMode()) AppCompatDelegate.MODE_NIGHT_YES else AppCompatDelegate.MODE_NIGHT_NO
        AppCompatDelegate.setDefaultNightMode(mode)
    }
}
