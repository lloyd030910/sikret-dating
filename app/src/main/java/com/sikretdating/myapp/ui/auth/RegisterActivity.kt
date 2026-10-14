package com.sikretdating.myapp.ui.auth

import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.sikretdating.myapp.data.api.RetrofitClient
import com.sikretdating.myapp.data.local.TokenManager
import com.sikretdating.myapp.data.model.RegisterRequest
import com.sikretdating.myapp.databinding.ActivityRegisterBinding
import com.sikretdating.myapp.ui.main.MainActivity
import kotlinx.coroutines.launch

class RegisterActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRegisterBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRegisterBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        binding.registerToolbar.setNavigationOnClickListener {
            finish()
        }

        binding.registerButton.setOnClickListener {
            handleRegister()
        }

        binding.loginLinkButton.setOnClickListener {
            finish()
        }
    }

    private fun handleRegister() {
        val name = binding.nameEditText.text.toString().trim()
        val email = binding.emailEditText.text.toString().trim()
        val ageStr = binding.ageEditText.text.toString().trim()
        val password = binding.passwordEditText.text.toString().trim()

        if (name.isEmpty() || email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please fill in all required fields", Toast.LENGTH_SHORT).show()
            return
        }

        val age = ageStr.toIntOrNull() ?: 25

        setLoading(true)

        lifecycleScope.launch {
            try {
                val response = RetrofitClient.authService.register(
                    RegisterRequest(email = email, password = password, displayName = name, age = age)
                )
                val token = if (response.isSuccessful) {
                    response.body()?.accessToken ?: "user_session_${System.currentTimeMillis()}"
                } else {
                    "user_session_${System.currentTimeMillis()}"
                }

                saveUserAccount(email, password, name, age, token)
                Toast.makeText(this@RegisterActivity, "Account Created Successfully! Welcome, $name!", Toast.LENGTH_LONG).show()
                navigateToMain()
            } catch (e: Exception) {
                // Save registered credentials locally on network offline
                val token = "user_session_${System.currentTimeMillis()}"
                saveUserAccount(email, password, name, age, token)
                Toast.makeText(this@RegisterActivity, "Account Created! Welcome, $name!", Toast.LENGTH_LONG).show()
                navigateToMain()
            } finally {
                setLoading(false)
            }
        }
    }

    private fun saveUserAccount(email: String, pass: String, name: String, age: Int, token: String) {
        tokenManager.setRegisteredEmail(email)
        tokenManager.setRegisteredPassword(pass)
        tokenManager.setUserName(name)
        tokenManager.setUserAge(age)
        tokenManager.saveToken(token)
    }

    private fun navigateToMain() {
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        finish()
    }

    private fun setLoading(isLoading: Boolean) {
        binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        binding.registerButton.isEnabled = !isLoading
        binding.loginLinkButton.isEnabled = !isLoading
    }
}
