package com.sikretdating.myapp.ui.main

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.sikretdating.myapp.R
import com.sikretdating.myapp.data.local.TokenManager
import com.sikretdating.myapp.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var tokenManager: TokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        tokenManager = TokenManager(this)
        tokenManager.applyTheme()

        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Default fragment on launch
        if (savedInstanceState == null) {
            replaceFragment(DiscoverFragment())
        }

        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_discover -> {
                    replaceFragment(DiscoverFragment())
                    true
                }
                R.id.nav_matches -> {
                    replaceFragment(MatchesFragment())
                    true
                }
                R.id.nav_profile -> {
                    replaceFragment(ProfileFragment())
                    true
                }
                else -> false
            }
        }
    }

    private fun replaceFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
}
