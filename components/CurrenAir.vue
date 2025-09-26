<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 font-sans">
      <!-- Header -->
      <h2 class="text-lg font-semibold text-gray-700 mb-2">
        วันนี้อากาศเป็นอย่างไร? <span class="text-sm text-gray-500">(PM2.5 เฉลี่ย 24 ชั่วโมง)</span>
      </h2>

      <!-- Location -->
      <div class="flex items-center text-gray-600 text-sm mb-4">
        <svg class="w-5 h-5 mr-1 text-sky-500" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" 
            d="M10 2a6 6 0 00-6 6c0 4.5 6 10 6 10s6-5.5 6-10a6 6 0 00-6-6zM8 8a2 2 0 114 0 2 2 0 01-4 0z" 
            clip-rule="evenodd" />
        </svg>
        <span>ท่าสุด เมืองเชียงราย เชียงราย (20.0478, 99.8950)</span>
      </div>

      <!-- Main Info -->
      <div class="flex items-center justify-between bg-sky-50 rounded-xl p-4 mb-4">
        <div class="flex items-center gap-2">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/5234/5234318.png" 
            alt="emoji" 
            class="w-12 h-12"
          />
          <span class="px-3 py-1 bg-sky-100 text-sky-700 text-sm rounded-full">
            คุณภาพอากาศดีมาก
          </span>
        </div>
        <p class="text-5xl font-bold text-sky-600">11.3</p>
        <span class="text-gray-500 text-sm">µg/m³</span>
      </div>

      <!-- Weather -->
      <div class="flex justify-around text-sm text-gray-600 mb-4">
        <div class="flex flex-col items-center">
          🌤️
          <span>30.29°C</span>
        </div>
        <div class="flex flex-col items-center">
          💧
          <span>48%</span>
        </div>
        <div class="flex flex-col items-center">
          🌬️
          <span>2.27 กม./ชม.</span>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-center">
        <button class="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg shadow">
          สถิติรายชั่วโมงและคาดการณ์ (PDF)
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// component นี้เป็น static แต่คุณสามารถส่ง props เข้ามาแทนค่าคงที่ได้
</script>
