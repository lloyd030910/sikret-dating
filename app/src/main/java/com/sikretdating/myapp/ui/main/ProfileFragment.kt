package com.sikretdating.myapp.ui.main

import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.fragment.app.Fragment
import com.sikretdating.myapp.data.local.TokenManager
import com.sikretdating.myapp.databinding.DialogEditProfileBinding
import com.sikretdating.myapp.databinding.FragmentProfileBinding
import com.sikretdating.myapp.ui.auth.LoginActivity

class ProfileFragment : Fragment() {
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!

    private lateinit var tokenManager: TokenManager

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        tokenManager = TokenManager(requireContext())

        updateProfileDisplay()

        binding.darkModeSwitch.isChecked = tokenManager.isDarkMode()
        binding.darkModeSwitch.setOnCheckedChangeListener { _, isChecked ->
            tokenManager.setDarkMode(isChecked)
            Toast.makeText(
                requireContext(),
                if (isChecked) "Dark Mode Enabled 🌙" else "Light Mode Enabled ☀️",
                Toast.LENGTH_SHORT
            ).show()
        }

        binding.editProfileButton.setOnClickListener {
            showEditProfileDialog()
        }

        binding.buyPremiumOption.setOnClickListener {
            val intent = Intent(requireContext(), PremiumActivity::class.java)
            startActivity(intent)
        }

        binding.topUpOption.setOnClickListener {
            val intent = Intent(requireContext(), WalletActivity::class.java)
            startActivity(intent)
        }

        binding.walletOption.setOnClickListener {
            val intent = Intent(requireContext(), WalletActivity::class.java)
            startActivity(intent)
        }

        binding.logoutButton.setOnClickListener {
            handleLogout()
        }
    }

    override fun onResume() {
        super.onResume()
        updateProfileDisplay()
    }

    private fun updateProfileDisplay() {
        val name = tokenManager.getUserName()
        val age = tokenManager.getUserAge()
        val bio = tokenManager.getUserBio()
        val lookingFor = tokenManager.getLookingFor()
        val gender = tokenManager.getGender()
        val occupation = tokenManager.getOccupation()
        val location = tokenManager.getLocation()
        val height = tokenManager.getHeight()
        val isPremium = tokenManager.isPremium()

        binding.userNameText.text = "$name, $age"
        binding.userBioText.text = if (bio.isNotEmpty()) bio else "No bio added yet"
        binding.premiumBadgeText.text = if (isPremium) "👑 Premium VIP (No Ads)" else "⭐ Standard Member"

        binding.lookingForDetailText.text = "🎯 Looking For: $lookingFor"
        binding.occupationDetailText.text = "💼 $occupation • $gender"
        binding.locationDetailText.text = "📍 $location • 📏 $height"
    }

    private fun showEditProfileDialog() {
        val dialogBinding = DialogEditProfileBinding.inflate(layoutInflater)
        dialogBinding.editNameInput.setText(tokenManager.getUserName())
        dialogBinding.editAgeInput.setText(tokenManager.getUserAge().toString())
        dialogBinding.editLookingForInput.setText(tokenManager.getLookingFor())
        dialogBinding.editGenderInput.setText(tokenManager.getGender())
        dialogBinding.editOccupationInput.setText(tokenManager.getOccupation())
        dialogBinding.editLocationInput.setText(tokenManager.getLocation())
        dialogBinding.editHeightInput.setText(tokenManager.getHeight())
        dialogBinding.editBioInput.setText(tokenManager.getUserBio())

        AlertDialog.Builder(requireContext())
            .setView(dialogBinding.root)
            .setPositiveButton("Save") { _, _ ->
                val newName = dialogBinding.editNameInput.text.toString().trim()
                val newAgeStr = dialogBinding.editAgeInput.text.toString().trim()
                val newLookingFor = dialogBinding.editLookingForInput.text.toString().trim()
                val newGender = dialogBinding.editGenderInput.text.toString().trim()
                val newOccupation = dialogBinding.editOccupationInput.text.toString().trim()
                val newLocation = dialogBinding.editLocationInput.text.toString().trim()
                val newHeight = dialogBinding.editHeightInput.text.toString().trim()
                val newBio = dialogBinding.editBioInput.text.toString().trim()

                if (newName.isNotEmpty()) tokenManager.setUserName(newName)
                newAgeStr.toIntOrNull()?.let { tokenManager.setUserAge(it) }
                if (newLookingFor.isNotEmpty()) tokenManager.setLookingFor(newLookingFor)
                if (newGender.isNotEmpty()) tokenManager.setGender(newGender)
                if (newOccupation.isNotEmpty()) tokenManager.setOccupation(newOccupation)
                if (newLocation.isNotEmpty()) tokenManager.setLocation(newLocation)
                if (newHeight.isNotEmpty()) tokenManager.setHeight(newHeight)
                tokenManager.setUserBio(newBio)

                updateProfileDisplay()
                Toast.makeText(requireContext(), "Profile updated successfully!", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }

    private fun handleLogout() {
        tokenManager.clearToken()
        val intent = Intent(requireContext(), LoginActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
        startActivity(intent)
        activity?.finish()
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
