package com.sikretdating.myapp.ui.main

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.sikretdating.myapp.R
import com.sikretdating.myapp.data.local.TokenManager
import com.sikretdating.myapp.databinding.ActivityPremiumBinding

class PremiumActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPremiumBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPremiumBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        binding.premiumToolbar.setNavigationIcon(R.drawable.ic_arrow_back)
        binding.premiumToolbar.setNavigationOnClickListener { finish() }

        if (tokenManager.isPremium()) {
            binding.buyPremiumButton.text = "You are already a Premium VIP 👑"
            binding.buyPremiumButton.isEnabled = false
        } else {
            binding.buyPremiumButton.setOnClickListener {
                tokenManager.setPremium(true)
                Toast.makeText(this, "🎉 Congratulations! You are now a Premium VIP!", Toast.LENGTH_LONG).show()
                finish()
            }
        }
    }
}
