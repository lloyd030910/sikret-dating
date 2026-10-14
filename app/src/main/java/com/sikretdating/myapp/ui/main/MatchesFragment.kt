package com.sikretdating.myapp.ui.main

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import com.sikretdating.myapp.data.repository.ProfileRepository
import com.sikretdating.myapp.databinding.FragmentMatchesBinding
import com.sikretdating.myapp.ui.chat.ChatActivity

class MatchesFragment : Fragment() {
    private var _binding: FragmentMatchesBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMatchesBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        binding.matchesRecyclerView.layoutManager = LinearLayoutManager(requireContext())

        val matches = ProfileRepository.getMatches()
        if (matches.isEmpty()) {
            binding.matchesRecyclerView.visibility = View.GONE
            binding.emptyMatchesText.visibility = View.VISIBLE
        } else {
            binding.matchesRecyclerView.visibility = View.VISIBLE
            binding.emptyMatchesText.visibility = View.GONE
            binding.matchesRecyclerView.adapter = MatchesAdapter(matches) { profile ->
                val intent = Intent(requireContext(), ChatActivity::class.java).apply {
                    putExtra("MATCH_NAME", profile.name)
                    putExtra("INITIAL_MSG", profile.lastMessage ?: "Hey! So glad we matched 😊")
                }
                startActivity(intent)
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
