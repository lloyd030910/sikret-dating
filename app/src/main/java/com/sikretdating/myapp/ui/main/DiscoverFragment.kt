package com.sikretdating.myapp.ui.main

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.animation.OvershootInterpolator
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import com.sikretdating.myapp.R
import com.sikretdating.myapp.data.model.Profile
import com.sikretdating.myapp.data.repository.ProfileRepository
import com.sikretdating.myapp.databinding.DialogLocationFilterBinding
import com.sikretdating.myapp.databinding.FragmentDiscoverBinding

class DiscoverFragment : Fragment() {
    private var _binding: FragmentDiscoverBinding? = null
    private val binding get() = _binding!!

    private var currentProfiles: MutableList<Profile> = mutableListOf()
    private var currentIndex = 0

    private var selectedCity = "New York"
    private var selectedDistance = "50km"

    private var dX = 0f
    private var dY = 0f
    private var initialX = 0f
    private var initialY = 0f

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDiscoverBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        loadProfiles()

        binding.locationSettingsButton.setOnClickListener {
            showLocationFilterDialog()
        }

        binding.likeButton.setOnClickListener {
            animateSwipeRightAndLike()
        }

        binding.superLikeButton.setOnClickListener {
            if (currentIndex < currentProfiles.size) {
                val profile = currentProfiles[currentIndex]
                Toast.makeText(requireContext(), "⭐ Super Liked ${profile.name}!", Toast.LENGTH_SHORT).show()
                animateSwipeRightAndLike()
            }
        }

        binding.passButton.setOnClickListener {
            animateSwipeLeftAndPass()
        }

        setupCardTouchListener()
    }

    private fun showLocationFilterDialog() {
        val dialogBinding = DialogLocationFilterBinding.inflate(layoutInflater)
        dialogBinding.locationCityInput.setText(selectedCity)

        AlertDialog.Builder(requireContext())
            .setView(dialogBinding.root)
            .setPositiveButton("Apply Filter") { _, _ ->
                val newCity = dialogBinding.locationCityInput.text.toString().trim()
                if (newCity.isNotEmpty()) {
                    selectedCity = newCity
                }

                selectedDistance = when (dialogBinding.distanceRadioGroup.checkedRadioButtonId) {
                    R.id.radio10km -> "10km"
                    R.id.radio100km -> "100km"
                    R.id.radioGlobal -> "Global 🌐"
                    else -> "50km"
                }

                binding.locationSettingsButton.text = "📍 $selectedCity ($selectedDistance)"
                Toast.makeText(requireContext(), "Discovery filter updated: $selectedCity ($selectedDistance)", Toast.LENGTH_SHORT).show()
                loadProfiles()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    @SuppressLint("ClickableViewAccessibility")
    private fun setupCardTouchListener() {
        binding.profileCard.setOnTouchListener { view, event ->
            when (event.action) {
                MotionEvent.ACTION_DOWN -> {
                    initialX = view.x
                    initialY = view.y
                    dX = view.x - event.rawX
                    dY = view.y - event.rawY
                    true
                }
                MotionEvent.ACTION_MOVE -> {
                    val newX = event.rawX + dX
                    val newY = event.rawY + dY
                    val deltaX = newX - initialX

                    view.x = newX
                    view.y = newY
                    view.rotation = (deltaX / 30f).coerceIn(-25f, 25f)
                    true
                }
                MotionEvent.ACTION_UP -> {
                    val deltaX = view.x - initialX
                    when {
                        deltaX > 250f -> animateSwipeRightAndLike()
                        deltaX < -250f -> animateSwipeLeftAndPass()
                        else -> {
                            // Reset position with smooth spring back
                            view.animate()
                                .x(initialX)
                                .y(initialY)
                                .rotation(0f)
                                .setDuration(200)
                                .start()
                        }
                    }
                    true
                }
                else -> false
            }
        }
    }

    private fun animateHeartPop() {
        binding.bigHeartPop.apply {
            visibility = View.VISIBLE
            scaleX = 0.2f
            scaleY = 0.2f
            alpha = 1f
            animate()
                .scaleX(1.4f)
                .scaleY(1.4f)
                .alpha(0f)
                .setDuration(600)
                .setInterpolator(OvershootInterpolator(2f))
                .withEndAction {
                    visibility = View.GONE
                }
                .start()
        }
    }

    private fun animateSwipeRightAndLike() {
        animateHeartPop()
        binding.profileCard.animate()
            .translationX(1200f)
            .rotation(25f)
            .alpha(0f)
            .setDuration(350)
            .withEndAction {
                resetCardPosition()
                handleLike()
            }
            .start()
    }

    private fun animateSwipeLeftAndPass() {
        binding.profileCard.animate()
            .translationX(-1200f)
            .rotation(-25f)
            .alpha(0f)
            .setDuration(350)
            .withEndAction {
                resetCardPosition()
                handlePass()
            }
            .start()
    }

    private fun resetCardPosition() {
        binding.profileCard.apply {
            translationX = 0f
            translationY = 0f
            rotation = 0f
            alpha = 1f
        }
    }

    private fun loadProfiles() {
        currentProfiles = ProfileRepository.getUnswipedProfiles().toMutableList()
        currentIndex = 0
        showCurrentProfile()
    }

    private fun showCurrentProfile() {
        if (currentIndex < currentProfiles.size) {
            val profile = currentProfiles[currentIndex]
            binding.profileCard.visibility = View.VISIBLE
            binding.likeButton.visibility = View.VISIBLE
            binding.superLikeButton.visibility = View.VISIBLE
            binding.passButton.visibility = View.VISIBLE
            binding.noMoreProfilesText.visibility = View.GONE

            binding.nameAgeText.text = "${profile.name}, ${profile.age}"
            binding.locationText.text = "📍 $selectedCity • ${profile.location}"
            binding.bioText.text = profile.bio
        } else {
            binding.profileCard.visibility = View.GONE
            binding.likeButton.visibility = View.GONE
            binding.superLikeButton.visibility = View.GONE
            binding.passButton.visibility = View.GONE
            binding.noMoreProfilesText.visibility = View.VISIBLE
        }
    }

    private fun handleLike() {
        if (currentIndex < currentProfiles.size) {
            val profile = currentProfiles[currentIndex]
            val matched = ProfileRepository.likeProfile(profile.id)
            if (matched) {
                Toast.makeText(requireContext(), "🎉 It's a Match with ${profile.name}!", Toast.LENGTH_LONG).show()
            } else {
                Toast.makeText(requireContext(), "Liked ${profile.name} ❤️", Toast.LENGTH_SHORT).show()
            }
            currentIndex++
            showCurrentProfile()
        }
    }

    private fun handlePass() {
        if (currentIndex < currentProfiles.size) {
            val profile = currentProfiles[currentIndex]
            ProfileRepository.passProfile(profile.id)
            currentIndex++
            showCurrentProfile()
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
