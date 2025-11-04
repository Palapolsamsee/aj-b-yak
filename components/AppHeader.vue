<template>
  <header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center py-4">
        <!-- Logo and Title -->
        <div class="bg-white hidden md:flex items-center space-x-3">
          <div class="p-1 rounded-lg">
            <img src="/assets/images/yakkaw_nouse.jpg" alt="Yakkaw Logo" class="w-100 h-20 object-contain" />
          </div>
          <h1 class="justify-center text-4xl font-bold text-gray-900" >
            <span class="text-blue-950">ยักษ์ขาว</span><span class="text-red-600">วัดฝุ่น</span>
          </h1>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-8">
          <a href="#home" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">หน้าหลัก</a>
          <a href="#map" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">แผนที่</a>
          <a href="#data" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">คุณภาพอากาศ</a>
          <a href="#advice" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">ข่าว</a>
          <a href="#supporters" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">ผู้สนับสนุน</a>
          <a href="#contact" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">ติดต่อเรา</a>
          <a href="#regis" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">ร่วมสนับสนุน</a>
        </nav>

        <!-- Language Switch and Mobile Menu -->
        <div class="flex items-center space-x-4">
          <!--           <div class="flex bg-gray-100 rounded-lg p-1">
            <button from-blue-50 via-white to-green-50
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
          </div> -->

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
          <a href="#home" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</a>
          <a href="#map" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">แผนที่</a>
          <a href="#data" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">คุณภาพอากาศ</a>
          <a href="#advice" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">ข่าว</a>
          <a href="#supporters" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">ผู้สนับสนุน</a>
          <a href="#contact" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">ติดต่อเรา</a>
          <a href="#regis" class="text-gray-700 hover:text-blue-600 font-medium transition-colors">ร่วมสนับสนุน</a>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
const currentLang = ref('en')
const mobileMenuOpen = ref(false)
</script>
