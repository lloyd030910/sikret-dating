package com.sikretdating.myapp.ui.main

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import com.sikretdating.myapp.R
import com.sikretdating.myapp.data.local.TokenManager
import com.sikretdating.myapp.databinding.ActivityWalletBinding
import com.sikretdating.myapp.databinding.DialogWithdrawBinding
import java.util.Locale

class WalletActivity : AppCompatActivity() {
    private lateinit var binding: ActivityWalletBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWalletBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        binding.walletToolbar.setNavigationIcon(R.drawable.ic_arrow_back)
        binding.walletToolbar.setNavigationOnClickListener { finish() }

        updateDisplays()

        binding.topUpOption1.setOnClickListener { topUpCoins(100) }
        binding.topUpOption2.setOnClickListener { topUpCoins(500) }
        binding.topUpOption3.setOnClickListener { topUpCoins(1200) }

        binding.withdrawButton.setOnClickListener {
            showWithdrawDialog()
        }
    }

    private fun topUpCoins(amount: Int) {
        tokenManager.addWalletBalance(amount)
        updateDisplays()
        Toast.makeText(this, "Successfully added $amount coins to your balance! 💰", Toast.LENGTH_SHORT).show()
    }

    private fun showWithdrawDialog() {
        val currentEarnings = tokenManager.getWithdrawableEarnings()
        val dialogBinding = DialogWithdrawBinding.inflate(layoutInflater)
        dialogBinding.dialogAvailableText.text = "Available: $${String.format(Locale.US, "%.2f", currentEarnings)} USD"

        AlertDialog.Builder(this)
            .setView(dialogBinding.root)
            .setPositiveButton("Withdraw") { _, _ ->
                val amountStr = dialogBinding.withdrawAmountInput.text.toString().trim()
                val accountStr = dialogBinding.withdrawAccountInput.text.toString().trim()
                val amount = amountStr.toFloatOrNull() ?: 0f

                if (accountStr.isEmpty()) {
                    Toast.makeText(this, "Please enter your withdrawal account email or number", Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }

                if (amount <= 0f) {
                    Toast.makeText(this, "Please enter a valid amount", Toast.LENGTH_SHORT).show()
                    return@setPositiveButton
                }

                if (tokenManager.withdrawEarnings(amount)) {
                    updateDisplays()
                    Toast.makeText(
                        this,
                        "🎉 Withdrawal request of $${String.format(Locale.US, "%.2f", amount)} submitted to $accountStr!",
                        Toast.LENGTH_LONG
                    ).show()
                } else {
                    Toast.makeText(
                        this,
                        "Insufficient withdrawable balance! Available: $${String.format(Locale.US, "%.2f", currentEarnings)}",
                        Toast.LENGTH_SHORT
                    ).show()
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun updateDisplays() {
        val currentCoins = tokenManager.getWalletBalance()
        val currentEarnings = tokenManager.getWithdrawableEarnings()

        binding.balanceText.text = "💰 $currentCoins Coins"
        binding.earningsText.text = "💵 $${String.format(Locale.US, "%.2f", currentEarnings)} USD"
    }
}
