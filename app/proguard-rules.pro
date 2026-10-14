# Proguard / R8 Rules for Sikret Dating

# Keep Data Models for Retrofit / Gson Reflection
-keep class com.sikretdating.myapp.data.model.** { *; }
-keepclassmembers class com.sikretdating.myapp.data.model.** { *; }

# Keep View Binding
-keep class com.sikretdating.myapp.databinding.** { *; }

# Retrofit 2 & Annotations
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes *Annotation*
-keep class retrofit2.** { *; }
-keepclasseswithmembers class * {
    @retrofit2.http.* <methods>;
}

# Gson
-dontwarn sun.misc.Unsafe
-keep class com.google.gson.** { *; }

# OkHttp3
-dontwarn okhttp3.**
-dontwarn okio.**
