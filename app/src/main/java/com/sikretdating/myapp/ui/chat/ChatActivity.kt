package com.sikretdating.myapp.ui.chat

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.sikretdating.myapp.R
import com.sikretdating.myapp.data.api.RetrofitClient
import com.sikretdating.myapp.data.local.TokenManager
import com.sikretdating.myapp.data.model.ChatMessage
import com.sikretdating.myapp.data.model.Gift
import com.sikretdating.myapp.databinding.ActivityChatBinding
import com.sikretdating.myapp.ui.main.PremiumActivity
import com.sikretdating.myapp.ui.main.WalletActivity
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

class ChatActivity : AppCompatActivity() {
    private lateinit var binding: ActivityChatBinding
    private lateinit var tokenManager: TokenManager
    private val messages = mutableListOf<ChatMessage>()
    private lateinit var adapter: ChatAdapter
    private var matchName: String = "Match"
    private var matchId: String = "1"
    private var isAutoTranslateEnabled = false

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityChatBinding.inflate(layoutInflater)
        setContentView(binding.root)

        tokenManager = TokenManager(this)

        matchName = intent.getStringExtra("MATCH_NAME") ?: "Match"
        matchId = intent.getStringExtra("MATCH_ID") ?: "1"
        val initialMsg = intent.getStringExtra("INITIAL_MSG") ?: "Connected with $matchName! Say hello 👋"

        binding.chatToolbar.title = matchName
        binding.chatToolbar.setNavigationIcon(R.drawable.ic_arrow_back)
        binding.chatToolbar.setNavigationOnClickListener { finish() }

        binding.translateButton.setOnClickListener {
            isAutoTranslateEnabled = !isAutoTranslateEnabled
            val userLang = Locale.getDefault().displayLanguage
            if (isAutoTranslateEnabled) {
                binding.translateButton.setText("🌐 Translate: ON ($userLang)")
                Toast.makeText(this, "Auto-Translate Enabled (Language: $userLang) 🌐", Toast.LENGTH_SHORT).show()
            } else {
                binding.translateButton.setText("🌐 Auto-Translate")
                Toast.makeText(this, "Auto-Translate Disabled", Toast.LENGTH_SHORT).show()
            }
        }

        // Voice and Video Call Button Handlers
        binding.voiceCallButton.setOnClickListener {
            handleVoiceCall()
        }

        binding.videoCallButton.setOnClickListener {
            handleVideoCall()
        }

        // Suggestive Smart Replies Handlers
        binding.suggestion1.setOnClickListener { sendSuggestedText(binding.suggestion1.text.toString()) }
        binding.suggestion2.setOnClickListener { sendSuggestedText(binding.suggestion2.text.toString()) }
        binding.suggestion3.setOnClickListener { sendSuggestedText(binding.suggestion3.text.toString()) }
        binding.suggestion4.setOnClickListener { sendSuggestedText(binding.suggestion4.text.toString()) }

        // Initial match greeting & setup initial suggestions
        messages.add(ChatMessage(text = initialMsg, isFromMe = false, timestamp = getCurrentTime()))
        updateSuggestiveReplies(initialMsg)

        adapter = ChatAdapter(messages) { msg ->
            handleUnlockMedia(msg)
        }
        binding.chatRecyclerView.layoutManager = LinearLayoutManager(this).apply {
            stackFromEnd = true
        }
        binding.chatRecyclerView.adapter = adapter

        binding.sendButton.setOnClickListener {
            sendMessage()
        }

        binding.giftButton.setOnClickListener {
            showGiftDialog()
        }

        binding.mediaButton.setOnClickListener {
            showMediaOptionsDialog()
        }

        fetchLiveMessages()
    }

    private fun fetchLiveMessages() {
        lifecycleScope.launch {
            try {
                val response = RetrofitClient.chatService.getMessages(matchId)
                if (response.isSuccessful && response.body() != null) {
                    val liveMsgs = response.body()!!
                    if (liveMsgs.isNotEmpty()) {
                        messages.clear()
                        messages.addAll(liveMsgs)
                        adapter.notifyDataSetChanged()
                        binding.chatRecyclerView.scrollToPosition(messages.size - 1)
                        messages.lastOrNull()?.text?.let { updateSuggestiveReplies(it) }
                    }
                }
            } catch (e: Exception) {
                // Keep local thread on network error
            }
        }
    }

    private fun updateSuggestiveReplies(incomingText: String) {
        val lower = incomingText.lowercase()
        val suggestions = when {
            lower.contains("coffee") || lower.contains("music") -> listOf(
                "Me too! What's your favorite song? 🎵",
                "I love iced lattes! ☕",
                "Let's grab coffee together! 😊",
                "I prefer tea! 🍵"
            )
            lower.contains("match") || lower.contains("hello") || lower.contains("hi") || lower.contains("hey") -> listOf(
                "Hey! So glad we connected! ✨",
                "Hi there! You look amazing 😊",
                "Hey! How has your week been?",
                "Hi! Tell me about yourself 💕"
            )
            lower.contains("weekends") || lower.contains("do") -> listOf(
                "Exploring new restaurants 🍕",
                "Going to concerts or movies 🍿",
                "Relaxing with a good book 📖",
                "Road trips and adventures 🚗"
            )
            lower.contains("yourself") || lower.contains("about") -> listOf(
                "I love travel, food & outdoor fun! 🌟",
                "I work in tech and love music 🎧",
                "I'm a coffee & fitness enthusiast ☕",
                "Tell me your favorite place to visit! ✈️"
            )
            lower.contains("thank") || lower.contains("gift") -> listOf(
                "You're very welcome! 😊",
                "Anytime! You deserve it ✨",
                "Hope it made you smile! 💕",
                "Sending you more smiles! ❤️"
            )
            else -> listOf(
                "That's so interesting! Tell me more 😊",
                "I totally agree with you! ✨",
                "Haha that made me laugh! 😂",
                "What are your plans for today? 🌟"
            )
        }

        binding.suggestion1.text = suggestions[0]
        binding.suggestion2.text = suggestions[1]
        binding.suggestion3.text = suggestions[2]
        binding.suggestion4.text = suggestions[3]
    }

    private fun sendSuggestedText(text: String) {
        binding.messageInput.setText(text)
        sendMessage()
    }

    private fun handleVoiceCall() {
        if (tokenManager.isPremium()) {
            Toast.makeText(this, "Voice Call Started (Unlimited Premium Call 👑)", Toast.LENGTH_SHORT).show()
            launchCallActivity("Voice Call 📞")
            return
        }

        val requiredCoins = 100 // $5.00 USD
        val currentCoins = tokenManager.getWalletBalance()

        if (currentCoins >= requiredCoins) {
            tokenManager.addWalletBalance(-requiredCoins)
            tokenManager.addWithdrawableEarnings(5.00f)
            Toast.makeText(this, "Voice Call Started! $5.00 USD (100 Coins) transferred to $matchName.", Toast.LENGTH_LONG).show()
            launchCallActivity("Voice Call 📞")
        } else {
            AlertDialog.Builder(this)
                .setTitle("Voice Call ($5.00 USD / 100 Coins)")
                .setMessage("Voice calling $matchName costs $5.00 USD (100 Coins) or is UNLIMITED with Premium VIP.\nYour balance: $currentCoins Coins.")
                .setPositiveButton("Top Up Coins") { _, _ ->
                    startActivity(Intent(this, WalletActivity::class.java))
                }
                .setNeutralButton("Get Premium 👑") { _, _ ->
                    startActivity(Intent(this, PremiumActivity::class.java))
                }
                .setNegativeButton("Cancel", null)
                .show()
        }
    }

    private fun handleVideoCall() {
        // Video Call is ALWAYS PAID ($20.00 USD / 400 Coins) for everyone
        val requiredCoins = 400 // $20.00 USD
        val currentCoins = tokenManager.getWalletBalance()

        if (currentCoins >= requiredCoins) {
            tokenManager.addWalletBalance(-requiredCoins)
            tokenManager.addWithdrawableEarnings(20.00f)
            Toast.makeText(this, "Video Call Started! $20.00 USD (400 Coins) transferred to $matchName.", Toast.LENGTH_LONG).show()
            launchCallActivity("Video Call 📹")
        } else {
            AlertDialog.Builder(this)
                .setTitle("Video Call ($20.00 USD / 400 Coins)")
                .setMessage("Video calling $matchName costs $20.00 USD (400 Coins).\nYour balance: $currentCoins Coins.")
                .setPositiveButton("Top Up Coins") { _, _ ->
                    startActivity(Intent(this, WalletActivity::class.java))
                }
                .setNegativeButton("Cancel", null)
                .show()
        }
    }

    private fun launchCallActivity(type: String) {
        val intent = Intent(this, CallActivity::class.java).apply {
            putExtra("MATCH_NAME", matchName)
            putExtra("CALL_TYPE", type)
        }
        startActivity(intent)
    }

    private fun showMediaOptionsDialog() {
        val options = arrayOf("📷 Send Photo", "🎥 Send Video")
        AlertDialog.Builder(this)
            .setTitle("Send Media Attachment")
            .setItems(options) { _, which ->
                if (which == 0) {
                    sendMediaAttachment("PHOTO")
                } else {
                    sendMediaAttachment("VIDEO")
                }
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun sendMediaAttachment(type: String) {
        val label = if (type == "PHOTO") "📷 Photo Attachment" else "🎥 Video Attachment"
        val userMsg = ChatMessage(
            text = label,
            isFromMe = true,
            timestamp = getCurrentTime(),
            mediaType = type
        )
        messages.add(userMsg)
        adapter.notifyItemInserted(messages.size - 1)
        binding.chatRecyclerView.scrollToPosition(messages.size - 1)

        Toast.makeText(this, "Sent $type to $matchName", Toast.LENGTH_SHORT).show()

        lifecycleScope.launch {
            try {
                RetrofitClient.chatService.sendMessage(matchId, userMsg)
            } catch (e: Exception) {
                // Saved locally
            }
        }
    }

    private fun handleUnlockMedia(msg: ChatMessage) {
        // Unlock price: $2.00 = 40 Coins; $5.00 = 100 Coins (1 USD = 20 Coins)
        val requiredCoins = (msg.unlockPriceUSD * 20).toInt()
        val currentCoins = tokenManager.getWalletBalance()

        if (currentCoins < requiredCoins) {
            AlertDialog.Builder(this)
                .setTitle("Unlock ${msg.mediaType}")
                .setMessage("To view this ${msg.mediaType?.lowercase()}, $${String.format(Locale.US, "%.2f", msg.unlockPriceUSD)} USD ($requiredCoins Coins) is required.\nYour current balance: $currentCoins Coins.")
                .setPositiveButton("Top Up Now") { _, _ ->
                    startActivity(Intent(this, WalletActivity::class.java))
                }
                .setNegativeButton("Cancel", null)
                .show()
        } else {
            tokenManager.addWalletBalance(-requiredCoins)
            // Transfer $ value to match's withdrawable wallet
            tokenManager.addWithdrawableEarnings(msg.unlockPriceUSD.toFloat())

            msg.isLocked = false
            msg.isUnlocked = true
            msg.text = if (msg.mediaType == "PHOTO") "📷 [Unlocked Photo] Picture from $matchName ✨" else "🎥 [Unlocked Video] Video from $matchName 🎬"
            val index = messages.indexOf(msg)
            if (index != -1) {
                adapter.notifyItemChanged(index)
            }

            Toast.makeText(this, "🎉 Unlocked ${msg.mediaType}! $requiredCoins Coins ($${String.format(Locale.US, "%.2f", msg.unlockPriceUSD)}) transferred to $matchName.", Toast.LENGTH_LONG).show()
        }
    }

    private fun showGiftDialog() {
        val gifts = Gift.AVAILABLE_GIFTS
        val options = gifts.map { "${it.emoji} ${it.name} (${it.coinPrice} Coins)" }.toTypedArray()

        AlertDialog.Builder(this)
            .setTitle("🎁 Send a Gift to $matchName")
            .setItems(options) { _, which ->
                val selectedGift = gifts[which]
                sendGift(selectedGift)
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun sendGift(gift: Gift) {
        val currentBalance = tokenManager.getWalletBalance()
        if (currentBalance < gift.coinPrice) {
            AlertDialog.Builder(this)
                .setTitle("Insufficient Coins")
                .setMessage("You need ${gift.coinPrice} coins to send ${gift.emoji} ${gift.name}. Current balance: $currentBalance coins.")
                .setPositiveButton("Top Up Now") { _, _ ->
                    startActivity(Intent(this, WalletActivity::class.java))
                }
                .setNegativeButton("Cancel", null)
                .show()
            return
        }

        // Deduct coins from sender & transfer withdrawable cash value ($0.05 per coin) to receiver's wallet
        tokenManager.addWalletBalance(-gift.coinPrice)
        val earningsValue = gift.coinPrice * 0.05f
        tokenManager.addWithdrawableEarnings(earningsValue)

        val giftMsg = ChatMessage(
            text = "🎁 Sent ${gift.emoji} ${gift.name} (${gift.coinPrice} Coins)",
            isFromMe = true,
            timestamp = getCurrentTime(),
            isGift = true,
            giftEmoji = gift.emoji,
            giftCoins = gift.coinPrice
        )
        messages.add(giftMsg)
        adapter.notifyItemInserted(messages.size - 1)
        binding.chatRecyclerView.scrollToPosition(messages.size - 1)

        Toast.makeText(this, "Sent ${gift.emoji} ${gift.name}! Transferred $${String.format(Locale.US, "%.2f", earningsValue)} to $matchName's withdrawable wallet.", Toast.LENGTH_LONG).show()

        lifecycleScope.launch {
            try {
                RetrofitClient.chatService.sendMessage(matchId, giftMsg)
            } catch (e: Exception) {
                // Saved locally
            }
        }
    }

    private fun sendMessage() {
        val text = binding.messageInput.text?.toString()?.trim() ?: ""
        if (text.isNotEmpty()) {
            val userMsg = ChatMessage(text = text, isFromMe = true, timestamp = getCurrentTime())
            messages.add(userMsg)
            adapter.notifyItemInserted(messages.size - 1)
            binding.chatRecyclerView.scrollToPosition(messages.size - 1)
            binding.messageInput.text?.clear()

            lifecycleScope.launch {
                try {
                    RetrofitClient.chatService.sendMessage(matchId, userMsg)
                } catch (e: Exception) {
                    // Message posted to chat
                }
            }
        }
    }

    private fun getCurrentTime(): String {
        return SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
    }
}
