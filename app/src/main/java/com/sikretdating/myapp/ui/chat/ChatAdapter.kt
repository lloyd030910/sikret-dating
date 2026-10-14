package com.sikretdating.myapp.ui.chat

import android.graphics.Color
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.LinearLayout
import androidx.core.content.ContextCompat
import androidx.recyclerview.widget.RecyclerView
import com.sikretdating.myapp.data.model.ChatMessage
import com.sikretdating.myapp.databinding.ItemChatMessageBinding
import java.util.Locale

class ChatAdapter(
    private val messages: List<ChatMessage>,
    private val onUnlockMedia: (ChatMessage) -> Unit
) : RecyclerView.Adapter<ChatAdapter.ChatViewHolder>() {

    class ChatViewHolder(val binding: ItemChatMessageBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatViewHolder {
        val binding = ItemChatMessageBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return ChatViewHolder(binding)
    }

    override fun onBindViewHolder(holder: ChatViewHolder, position: Int) {
        val msg = messages[position]
        holder.binding.messageText.text = msg.text
        holder.binding.timestampText.text = msg.timestamp

        val context = holder.itemView.context
        val params = holder.binding.messageCard.layoutParams as LinearLayout.LayoutParams

        // Locked Media Handling
        if (msg.isLocked && !msg.isUnlocked) {
            holder.binding.unlockContainer.visibility = View.VISIBLE
            holder.binding.unlockButton.text = "🔒 Unlock ${msg.mediaType ?: "Media"} ($${String.format(Locale.US, "%.2f", msg.unlockPriceUSD)})"
            holder.binding.unlockButton.setOnClickListener {
                onUnlockMedia(msg)
            }

            if (msg.freePreviewText != null) {
                holder.binding.freePreviewBadge.visibility = View.VISIBLE
                holder.binding.freePreviewBadge.text = msg.freePreviewText
            } else {
                holder.binding.freePreviewBadge.visibility = View.GONE
            }
        } else {
            holder.binding.unlockContainer.visibility = View.GONE
        }

        if (msg.isGift) {
            holder.binding.messageCard.setCardBackgroundColor(Color.parseColor("#FFF3CD"))
            holder.binding.messageText.setTextColor(Color.parseColor("#856404"))
            holder.binding.timestampText.setTextColor(Color.parseColor("#856404"))
            holder.binding.messageCard.strokeColor = Color.parseColor("#FFEBAA")
            holder.binding.messageCard.strokeWidth = 3
        } else {
            holder.binding.messageCard.strokeWidth = 0
            if (msg.isFromMe) {
                holder.binding.messageCard.setCardBackgroundColor(
                    ContextCompat.getColor(context, com.google.android.material.R.color.design_default_color_primary)
                )
                holder.binding.messageText.setTextColor(Color.WHITE)
                holder.binding.timestampText.setTextColor(Color.LTGRAY)
            } else {
                holder.binding.messageCard.setCardBackgroundColor(
                    ContextCompat.getColor(context, com.google.android.material.R.color.design_default_color_background)
                )
                holder.binding.messageText.setTextColor(Color.BLACK)
                holder.binding.timestampText.setTextColor(Color.GRAY)
            }
        }

        if (msg.isFromMe) {
            holder.binding.messageContainer.gravity = Gravity.END
            params.gravity = Gravity.END
        } else {
            holder.binding.messageContainer.gravity = Gravity.START
            params.gravity = Gravity.START
        }
        holder.binding.messageCard.layoutParams = params
    }

    override fun getItemCount(): Int = messages.size
}
