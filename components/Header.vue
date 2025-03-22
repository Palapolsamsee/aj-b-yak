<template>
  <!-- Desktop Header -->
  <header class="hidden md:flex fixed top-0 left-0 w-full bg-slate-900 text-white h-20 md:h-24 p-2 shadow-lg z-50 backdrop-blur-md items-center">
    <div class="container mx-auto max-w-screen-xl flex items-center justify-between">
      <!-- โลโก้ -->
      <h1 class="text-4xl font-bold">
        <span class="text-white">ยักษ์ขาว</span> <span class="text-red-500">วัดฝุ่น</span>
      </h1>
      <!-- เมนู -->
      <nav class="flex gap-4 md:gap-6">
        <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" class="nav-item"
          :class="{ 'active': activePage === item.path }">
          {{ item.name }}
        </NuxtLink>
      </nav>
    </div>
  </header>

  <!-- Mobile Header -->
  <header class="block md:hidden bg-slate-900 text-white p-4 shadow-lg">
    <div class="container mx-auto max-w-screen-xl flex justify-between items-center">
      <h1 class="text-2xl font-bold">
        <span class="text-white">ยักษ์ขาว</span> <span class="text-red-500">วัดฝุ่น</span>
      </h1>
      <!-- Hamburger Menu -->
      <div class="relative">
        <button class="menu-button p-2 rounded-lg text-2xl" :class="{ 'active': isMenuOpen }"
          @click="toggleMenu">☰</button>
        <div class="dropdown-menu" v-if="isMenuOpen">
          <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path" class="dropdown-item"
            :class="{ 'active': activePage === item.path }">
            {{ item.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute } from "vue-router";

const isMenuOpen = ref(false);
const route = useRoute(); 
const activePage = computed(() => route.path);

const menuItems = [
  { name: "หน้าแรก", path: "/" },
  { name: "แผนที่ยักษ์ขาว", path: "/MapPage" },
  { name: "ข่าว", path: "/News" },
  { name: "ตั้งค่าสี", path: "/ColorSetting" },
  { name: "ร่วมสนับสนุน", path: "/Regis" },
  { name: "ผู้สนับสนุน", path: "/SponPage" },
  { name: "ติดต่อเรา", path: "/ContactPage" }
];

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};
</script>

<style scoped>
.nav-item {
  padding: 10px 16px;
  text-decoration: none;
  color: white;
  font-size: 16px;
  position: relative;
  transition: color 0.3s ease-in-out;
}

.nav-item::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 2px;
  width: 100%;
  height: 3px;
  background: #e53e3e;
  transform: scaleX(0);
  transition: transform 0.3s ease-in-out;
}

.nav-item:hover::after,
.nav-item.active::after {
  transform: scaleX(1);
}

.menu-button {
  font-size: 28px;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
  padding: 8px;
  transition: color 0.3s ease;
}

.menu-button.active {
  color: #e53e3e;
}

.dropdown-menu {
  position: absolute;
  top: 48px;
  right: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  width: 200px;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  padding: 10px 0;
}

.dropdown-item {
  padding: 10px 18px;
  text-decoration: none;
  color: black;
  font-size: 16px;
  transition: background 0.3s ease;
}

.dropdown-item:hover,
.dropdown-item.active {
  background: #e53e3e;
  color: white;
}
</style>
