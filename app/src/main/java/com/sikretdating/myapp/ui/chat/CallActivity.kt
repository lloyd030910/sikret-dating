package com.sikretdating.myapp.ui.chat

import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.sikretdating.myapp.databinding.ActivityCallBinding
import java.util.Locale

class CallActivity : AppCompatActivity() {
    private lateinit var binding: ActivityCallBinding
    private var secondsElapsed = 0
    private val handler = Handler(Looper.getMainLooper())
    private var isMuted = false

    private val timerRunnable = object : Runnable {
        override fun run() {
            secondsElapsed++
            val minutes = secondsElapsed / 60
            val seconds = secondsElapsed % 60
            val timeStr = String.format(Locale.US, "%02d:%02d", minutes, seconds)
            binding.callStatus.text = "Connected • $timeStr"
            handler.postDelayed(this, 1000)
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCallBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val matchName = intent.getStringExtra("MATCH_NAME") ?: "Match"
        val callType = intent.getStringExtra("CALL_TYPE") ?: "Voice Call"

        binding.callName.text = matchName
        binding.callStatus.text = "$callType • Connecting..."

        handler.postDelayed(timerRunnable, 1000)

        binding.muteButton.setOnClickListener {
            isMuted = !isMuted
            Toast.makeText(this, if (isMuted) "Microphone Muted 🔇" else "Microphone Unmuted 🎙️", Toast.LENGTH_SHORT).show()
        }

        binding.endCallButton.setOnClickListener {
            finishCall()
        }

        binding.speakerButton.setOnClickListener {
            Toast.makeText(this, "Speaker Toggled 🔊", Toast.LENGTH_SHORT).show()
        }
    }

    private fun finishCall() {
        handler.removeCallbacks(timerRunnable)
        Toast.makeText(this, "Call Ended", Toast.LENGTH_SHORT).show()
        finish()
    }

    override fun onDestroy() {
        super.onDestroy()
        handler.removeCallbacks(timerRunnable)
    }
}
