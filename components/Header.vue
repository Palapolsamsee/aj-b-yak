<!-- components/Header.vue -->
<template>
  <div class="hidden md:block">
    <div class="bg-slate-900 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-2xl font-bold">
          ยักษ์ขาว <span class="text-red-500">วัดฝุ่น</span>
        </h1>

        <!-- Hamburger Menu -->
        <div class="relative">
          <button class="menu-button" @click="toggleMenu">☰</button>
          <div class="dropdown-menu" v-if="isMenuOpen">
            <a href="">หน้าแรก</a>
            <a href="MapPage">แผนที่ยักษ์ขาว</a>
            <a href="News">ข่าว</a>
            <a href="ColorSetting">ตั้งค่าสี</a>
            <a href="Regis">ซื้อเครื่อง</a>
            <a href="SponPage">ผู้สนับสนุน</a>
            <a href="ContactPage">ติดต่อเรา</a>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- <div class="hidden md:block">
    <header class="bg-slate-900 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">
  ยักษ์ขาว <span class="text-red-500 space-x-10">วัดฝุ่น </span> 
  <span class ="space-x-10"> <a href="/index" class="hover:text-gray-200">ผู้สนับสนุน</a> <a href="/settings" class="hover:text-gray-200">คู่มือ</a> 
    <a href="/pm25" class="hover:text-gray-200"> ร่วมสนับสนุน</a> <a href="/list" class="hover:text-gray-200">ติดต่อเรา</a>  </span>
</h1>
      <nav>
        <ul class="space-x-6">
           <a href="/index" class="hover:text-gray-200">ผู้สนับสนุน</a> 
           <a href="/settings" class="hover:text-gray-200">คู่มือ</a> 
           <a href="/pm25" class="hover:text-gray-200">ร่วมสนับสนุน</a> 
           <a href="/list" class="hover:text-gray-200">ติดต่อเรา</a> 
        </ul>
      </nav>
    </div>
  </header>
</div> -->


  <div class="block md:hidden">
    <!-- เนื้อหาสำหรับ mobile เท่านั้น -->
    <header class="bg-slate-900 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <h1 class="text-xl font-bold">PM2.5 Monitoring</h1>
        <nav class="relative">
          <button @click="isDropdownOpen = !isDropdownOpen"
            class="flex items-center space-x-2 focus:outline-none hover:text-gray-200">
            <span>Menu</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clip-rule="evenodd" />
            </svg>
          </button>
          <!-- Dropdown menu -->
          <ul v-show="isDropdownOpen"
            class="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg overflow-hidden">
            <li><a href="/index" class="block px-4 py-2 hover:text-gray-200">Home</a></li>
            <li><a href="/settings" class="block px-4 py-2 hover:text-gray-200">Setting</a></li>
            <li><a href="/pm25" class="block px-4 py-2 hover:text-gray-200">Add PM</a></li>
            <li><a href="/list" class="block px-4 py-2 hover:text-gray-200">List</a></li>
          </ul>
        </nav>
      </div>
    </header>


  </div>

</template>

<script setup>
import { ref } from "vue";
const isDropdownOpen = ref(false);
</script>

<script>
export default {
    data() {
        return {
            isMenuOpen: false,
        }
      },
      methods: {
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
    }
  }

</script>
<style scoped>
/* Customize header styles if needed */
.menu-button {
    font-size: 30px;
    background: none;
    border: none;
    cursor: pointer;
    color: white;
    padding: 10px;
}

.dropdown-menu {
    position: absolute;
    top: 40px;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 150px;
    display: flex;
    flex-direction: column;
    z-index: 1000;
}

.dropdown-menu a {
    padding: 10px;
    text-decoration: none;
    color: black;
    font-size: 16px;
}

.dropdown-menu a:hover {
    background: #f0f0f0;
}
</style>