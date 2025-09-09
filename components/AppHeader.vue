<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo and Title -->
        <div class="flex items-center space-x-3">
        <div class="bg-gradient-to-br from-[#0b1126] to-[#f82249] p-2 rounded-lg">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            </path>
          </svg>
        </div>

       <h1 class="text-xl font-bold text-gray-900">
          <span class="text-blue-950">Yak</span><span class="text-red-600">kaw</span>
        </h1>

        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="#home" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
          <a href="#map" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Map</a>
          <a href="#data" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Air Quality</a>
          <a href="#advice" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">News</a>
          <a href="#contact" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Contact</a>
        </nav>

        <!-- Language Switch and Mobile Menu -->
        <div class="flex items-center space-x-4">
          <div class="flex bg-gray-100 rounded-lg p-1">
            <button 
              @click="currentLang = 'en'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                currentLang === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              EN
            </button>
            <button 
              @click="currentLang = 'th'"
              :class="[
                'px-3 py-1 rounded-md text-sm font-medium transition-colors',
                currentLang === 'th' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              ]"
            >
              TH
            </button>
          </div>

          <!-- Mobile menu button -->
          <button @click="mobileMenuOpen = !mobileMenuOpen" class="md:hidden p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div v-show="mobileMenuOpen" class="md:hidden border-t border-gray-200 py-4">
        <nav class="flex flex-col space-y-4">
          <a href="#home" class="text-gray-700 hover:text-blue-600 font-medium">Home</a>
          <a href="#map" class="text-gray-700 hover:text-blue-600 font-medium">Map</a>
          <a href="#data" class="text-gray-700 hover:text-blue-600 font-medium">AQI Data</a>
          <a href="#advice" class="text-gray-700 hover:text-blue-600 font-medium">Advice</a>
          <a href="#contact" class="text-gray-700 hover:text-blue-600 font-medium">Contact</a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
const currentLang = ref('en')
const mobileMenuOpen = ref(false)
</script>