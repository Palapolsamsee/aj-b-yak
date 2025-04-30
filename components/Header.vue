<template>
  <header
    class="fixed top-0 left-0 w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg z-50 transition-all duration-300"
  >
    <!-- Desktop Header -->
    <div class="hidden md:flex container mx-auto max-w-screen-xl px-4 py-3 md:py-4 items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2">
        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight">
          <span class="text-white">ยักษ์ขาว</span>
          <span class="text-red-500">วัดฝุ่น</span>
        </h1>
      </NuxtLink>

      <!-- Menu -->
      <nav class="flex gap-6">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="nav-item text-lg font-medium relative py-2 px-3 transition-colors duration-300"
          :class="{ 'active': activePage === item.path }"
        >
          {{ item.name }}
        </NuxtLink>
      </nav>
    </div>

    <!-- Mobile Header -->
    <div class="md:hidden container mx-auto max-w-screen-xl px-4 py-3 flex justify-between items-center">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center space-x-2">
        <h1 class="text-2xl font-extrabold tracking-tight">
          <span class="text-white">ยักษ์ขาว</span>
          <span class="text-red-500">วัดฝุ่น</span>
        </h1>
      </NuxtLink>

      <!-- Hamburger Menu -->
      <button
        class="menu-button p-2 rounded-lg text-2xl focus:outline-none"
        :class="{ 'active': isMenuOpen }"
        @click="toggleMenu"
        aria-label="Toggle menu"
      >
        <span v-if="!isMenuOpen">☰</span>
        <span v-else>✕</span>
      </button>
    </div>

    <!-- Mobile Dropdown Menu -->
    <transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMenuOpen"
        class="md:hidden bg-white text-gray-900 absolute top-full left-0 w-full shadow-lg z-50"
      >
        <nav class="container mx-auto max-w-screen-xl px-4 py-4 flex flex-col">
          <NuxtLink
            v-for="item in menuItems"
            :key="item.path"
            :to="item.path"
            class="dropdown-item py-3 px-4 text-lg font-medium transition-colors duration-300"
            :class="{ 'active': activePage === item.path }"
            @click="closeMenu"
          >
            {{ item.name }}
          </NuxtLink>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

const isMenuOpen = ref(false);
const route = useRoute();
const activePage = computed(() => route.path);

const menuItems = [
  { name: 'หน้าแรก', path: '/' },
  { name: 'ข่าว', path: '/News' },
  { name: 'ตั้งค่าสี', path: '/ColorSetting' },
  { name: 'ร่วมสนับสนุน', path: '/Regis' },
  { name: 'ผู้สนับสนุน', path: '/SponPage' },
  { name: 'ติดต่อเรา', path: '/ContactPage' },
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};
</script>

<style scoped>
.nav-item {
  color: #e5e7eb; /* text-gray-200 */
  border-radius: 8px;
}

.nav-item:hover {
  color: #fefcbf; /* text-yellow-200 */
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-item.active {
  color: #fefcbf;
  font-weight: 600;
}

.nav-item.active::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 0;
  width: 60%;
  height: 3px;
  background: #ef4444; /* red-500 */
  transform: translateX(-50%);
  transition: width 0.3s ease-in-out;
}

.menu-button {
  color: #ffffff;
  transition: color 0.3s ease, transform 0.3s ease;
}

.menu-button.active {
  color: #ef4444; /* red-500 */
  transform: rotate(90deg);
}

.dropdown-item {
  color: #1f2937; /* text-gray-800 */
  border-radius: 6px;
}

.dropdown-item:hover {
  background-color: #f3f4f6; /* bg-gray-100 */
  color: #ef4444; /* text-red-500 */
}

.dropdown-item.active {
  background-color: #fefcbf; /* bg-yellow-200 */
  color: #b91c1c; /* text-red-700 */
  font-weight: 600;
}
</style>