<template>
  <div class="container">
    <div v-if="loading">⏳ กำลังโหลด...</div>
    <div v-else-if="error">⚠️ {{ error }}</div>
    <div v-else-if="!device">⚠️ ไม่พบอุปกรณ์ที่ค้นหา</div>
    <div v-else>
      <!-- Air Quality Widget -->
      <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-4xl mx-auto">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl md:text-4xl font-bold text-gray-800">Air Quality</h2>
          <i class="fas fa-cloud-sun text-yellow-500 text-3xl md:text-5xl"></i>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="flex items-center">
            <i class="fas fa-smog text-gray-500 text-3xl md:text-5xl mr-2"></i>
            <div>
              <p class="text-sm md:text-lg text-gray-600">PM 2.5</p>
              <p class="text-lg md:text-2xl font-bold text-gray-800">{{ device.pm25 }} µg/m³</p>
            </div>
          </div>
          <div class="flex items-center">
            <i class="fas fa-temperature-high text-red-500 text-3xl md:text-5xl mr-2"></i>
            <div>
              <p class="text-sm md:text-lg text-gray-600">Temperature</p>
              <p class="text-lg md:text-2xl font-bold text-gray-800">{{ device.temperature }}°C</p>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex items-center">
            <i class="fas fa-wind text-blue-500 text-3xl md:text-5xl mr-2"></i>
            <div>
              <p class="text-sm md:text-lg text-gray-600">PM 10</p>
              <p class="text-lg md:text-2xl font-bold text-gray-800">{{ device.ddate }} µg/m³</p>
            </div>
          </div>
          <div class="flex items-center">
            <i class="fas fa-tint text-blue-500 text-3xl md:text-5xl mr-2"></i>
            <div>
              <p class="text-sm md:text-lg text-gray-600">Humidity</p>
              <p class="text-lg md:text-2xl font-bold text-gray-800">{{ device.dtime }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- กลับหน้าแรก -->
      <!-- <div class="flex justify-center mt-6">
        <NuxtLink to="/" class="text-blue-500 text-xl">🔙 กลับหน้าแรก</NuxtLink>
      </div> -->

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

interface Device {
  dvid: string;
  place: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  installDate?: string;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  address?: string;
  model?: string;
  deploydate?: string;
  [key: string]: any;
}

const route = useRoute();
const device = ref<Device | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);

// ฟังก์ชันที่ดึงข้อมูลจาก API
const fetchDeviceData = async () => {
  try {
    const dvid = route.params.dvid; // ดึง dvid จาก URL
    console.log("🔍 กำลังโหลดอุปกรณ์ที่มี dvid:", dvid);

    const apikey = 'https://yakkaw.mfu.ac.th/api/yakkaw/devices';
    const response = await fetch(apikey);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    
    const res1 = await response.json();
    const devices = Array.isArray(res1.response) ? res1.response : [];

    // ค้นหาอุปกรณ์ที่มี dvid ตรงกับ URL
    device.value = devices.find(dev => dev.dvid === dvid) || null;

    if (!device.value) {
      console.warn("⚠️ ไม่พบอุปกรณ์ที่มี dvid:", dvid);
    } else {
      console.log("✅ อุปกรณ์ที่พบ:", device.value);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  // ดึงข้อมูลครั้งแรกเมื่อโหลดหน้า
  fetchDeviceData();
});
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
  padding: 20px;
}
.widget {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
h2, h3 {
  color: #333;
}
</style>
