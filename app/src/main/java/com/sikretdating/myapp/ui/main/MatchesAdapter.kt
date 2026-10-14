package com.sikretdating.myapp.ui.main

import android.view.LayoutInflater
import android.view.ViewGroup
import androidx.recyclerview.widget.RecyclerView
import com.sikretdating.myapp.data.model.Profile
import com.sikretdating.myapp.databinding.ItemMatchBinding

class MatchesAdapter(
    private val matches: List<Profile>,
    private val onItemClick: (Profile) -> Unit
) : RecyclerView.Adapter<MatchesAdapter.MatchViewHolder>() {

    class MatchViewHolder(val binding: ItemMatchBinding) : RecyclerView.ViewHolder(binding.root)

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MatchViewHolder {
        val binding = ItemMatchBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return MatchViewHolder(binding)
    }

    override fun onBindViewHolder(holder: MatchViewHolder, position: Int) {
        val match = matches[position]
        holder.binding.matchName.text = "${match.name}, ${match.age}"
        holder.binding.matchMessage.text = match.lastMessage ?: "Say hello 👋"
        holder.itemView.setOnClickListener { onItemClick(match) }
    }

    override fun getItemCount(): Int = matches.size
}
