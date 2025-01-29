<!-- components/Header.vue -->
<template>
  <div class="hidden md:block">
  <header class="bg-slate-900 text-white p-4">
    <div class="container mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">
        ยักษ์ขาว <span class="text-red-500">วัดฝุ่น</span>
      </h1>
      <nav class="flex gap-4">
        <a href="/index" class="hover:text-gray-200">ผู้สนับสนุน</a>
        <a href="/settings" class="hover:text-gray-200">คู่มือ</a>
        <a href="/pm25" class="hover:text-gray-200">ร่วมสนับสนุน</a>
        <a href="/ColorSetting" class="hover:text-gray-200">ติดต่อเรา</a>
      </nav>
    </div>
  </header>
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
        <button
          @click="isDropdownOpen = !isDropdownOpen"
          class="flex items-center space-x-2 focus:outline-none hover:text-gray-200"
        >
          <span>Menu</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
        <!-- Dropdown menu -->
        <ul
          v-show="isDropdownOpen"
          class="absolute right-0 mt-2 bg-white text-black shadow-lg rounded-lg overflow-hidden"
        >
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

<script setup >
import { ref } from "vue";

const isDropdownOpen = ref(false);
</script>

<style scoped>
/* Customize header styles if needed */
</style>