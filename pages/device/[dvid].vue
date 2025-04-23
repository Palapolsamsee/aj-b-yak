<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 py-12 px-6">
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse bg-gray-300 h-24 w-full rounded-lg"></div>
    </div>
    <div v-else-if="error" class="text-center text-red-500 text-xl">
      ⚠️ {{ error }}
    </div>
    <div v-else-if="!device" class="text-center text-yellow-600 text-xl">
      ⚠️ ไม่พบอุปกรณ์ที่ค้นหา
    </div>
    <div v-else>
      <!-- Air Quality Widget -->
      <div class="relative bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-6 sm:p-8 overflow-hidden">
        <div class="flex items-center justify-between mb-6 flex-wrap">
          <div>
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-800">สำรวจคุณภาพอากาศ </h2>
                    <!-- วันที่และเวลา -->
            <p class="text-sm text-gray-500 mt-1">{{ formattedDate }} | {{ formattedTime }}</p>
            <p class="text-gray-500 text-sm">📍สถานที่: {{ device.place }} </p>
            <p class="text-gray-500 text-sm">Heyhey: {{ device.address }} </p>
          </div>
          
          <!-- แสดง Icon ตามค่าฝุ่น -->
          <div>
            <img :src="weatherIcon" alt="Air Quality Icon"   class="ml-4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40"
            />
          </div>
        </div>

        <!-- Data Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center px-4 py-8">
          <!-- PM2.5 -->
          <div class="flex justify-center">
            <div :class="['w-48 h-48 rounded-full flex flex-col items-center justify-center transform transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-1', pm25Class, 'border-4 border-gradient-to-r from-green-500 via-yellow-500 to-orange-500 shadow-xl hover:shadow-2xl']">
              <p class="text-ml text-gray-600 font-semibold uppercase">PM 2.5</p>
              <p class="text-xl sm:text-4xl font-bold">{{ device.pm25 }}<span class="text-sm"> µg/m³</span></p>
            </div>
          </div>

          <!-- PM10 -->
          <div class="flex justify-center">
            <div :class="['w-48 h-48 rounded-full flex flex-col items-center justify-center transform transition-all duration-500 ease-in-out hover:scale-110 hover:rotate-1', pm10Class, 'border-4 border-gradient-to-r from-green-500 via-yellow-500 to-orange-500 shadow-xl hover:shadow-2xl']">
              <p class="text-ml text-gray-600 font-semibold uppercase">PM 10</p>
              <p class="text-xl sm:text-4xl font-bold">{{ device.pm10 }}<span class="text-sm"> µg/m³</span></p>
            </div>
          </div>

          <!-- Temperature -->
          <div class="flex items-center space-x-4 justify-center sm:justify-start">
            <i class="fas fa-temperature-high text-red-500 text-3xl sm:text-4xl"></i>
            <div>
              <p class="text-gray-500">อุณหภูมิ 🌤</p> 
              <p class="text-xl sm:text-2xl font-semibold text-gray-800">{{ device.temperature }}°C</p>
            </div>
          </div>

          <!-- Humidity -->
          <div class="flex items-center space-x-4 justify-center sm:justify-start">
            <i class="fas fa-tint text-cyan-500 text-3xl sm:text-4xl"></i>
            <div>
              <p class="text-gray-500">ความชื้น 💧</p>
              <p class="text-xl sm:text-2xl font-semibold text-gray-800">{{ device.humidity }}%</p>
            </div>
          </div>
        </div>

        <!-- Health Tips -->
        <div class="mt-6 text-center"> 
          <div v-if="device.pm25 <= 25" class="text-blue-400 text-lg font-semibold">
            <p>คุณภาพอากาศดีมาก</p>
            <p>ไม่มีความเสี่ยงจากฝุ่นละออง</p>
          </div>
          <div v-else-if="device.pm25 <= 37" class="text-green-400 text-lg font-semibold">
            <p>คุณภาพอากาศดี</p>
            <p>ไม่มีความเสี่ยงจากฝุ่นละออง</p>
          </div>
          <div v-else-if="device.pm25 <= 50" class="text-yellow-400 text-lg font-semibold">
            <p>คุณภาพอากาศปานกลาง</p>
            <p>ควรหลีกเลี่ยงกิจกรรมกลางแจ้ง</p>
          </div>
          <div v-else-if="device.pm25 <= 90" class="text-orange-400 text-lg font-semibold">
            <p>คุณภาพอากาศแย่</p>
            <p>ควรหลีกเลี่ยงกิจกรรมกลางแจ้ง และสวมหน้ากาก N95</p>
          </div>
          <div v-else class="text-red-400 text-lg font-semibold">
            <p>คุณภาพอากาศอันตราย</p>
            <p>ควรหลีกเลี่ยงกิจกรรมกลางแจ้ง และสวมหน้ากาก N95</p>
          </div>
        </div>

        <!-- ปุ่มกลับ -->
        <div class="text-center mt-8">
          <NuxtLink to="/" class="text-gray-600 hover:underline text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105">
            กลับหน้าแรก
          </NuxtLink>
          <div class="mt-8 text-center text-xs text-gray-400">
  ข้อมูลจากระบบ Yakkaw วัดฝุ่น
</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';



const route = useRoute();
const device = ref<Device | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const weatherIcon = ref('');

const currentTime = ref(new Date());
const lang = ref<'th-TH' | 'en-US'>('th-TH');


// ฟอร์แมตวันที่และเวลา
const formattedDate = computed(() =>
  currentTime.value.toLocaleDateString(lang.value, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
);

const formattedTime = computed(() =>
  currentTime.value.toLocaleTimeString(lang.value, {
    hour: '2-digit', minute: '2-digit',
  })
);

// PM2.5 Class Computed Property & Icon
const pm25Class = computed(() => {
  const value = device.value?.pm25 ?? 0;
  if (value <= 25) {
    weatherIcon.value = '/assets/images/yyakkaw_blue_icon.png';
    return 'bg-blue-400';  
  } else if (value <= 37) {
    weatherIcon.value = '/assets/images/yyakkaw_green_icon.png';
    return 'bg-green-400';  
  } else if (value <= 50) {
    weatherIcon.value = '/assets/images/yyakkaw_yellow_icon.png';
    return 'bg-yellow-400';  
  } else if (value <= 90) {
    weatherIcon.value = '/assets/images/yyakkaw_orange_icon.png';
    return 'bg-orange-400';  
  } else {
    weatherIcon.value = '/assets/images/yyakkaw_red_icon.png';
    return 'bg-red-600';  
  }
});

// PM10 Class Computed Property & Icon
const pm10Class = computed(() => {
  const value = device.value?.pm10 ?? 0;
  if (value <= 40) {
    return 'bg-blue-400';  
  } else if (value <= 120) {
    return 'bg-green-400'; 
  } else if (value <= 350) {
    return 'bg-yellow-400';
  }  else if (value <= 420) {
      return 'bg-orange-400';  
  } else {
    return 'bg-red-400';  
  }
});

// Fetching device data
const fetchDeviceByLocation = async () => {
  try {
    const res = await fetch('https://yakkaw.mfu.ac.th/api/yakkaw/devices');
    const data = await res.json();
    const devices = data.response;

    navigator.geolocation.getCurrentPosition((position) => {
      const userLat = position.coords.latitude;
      const userLon = position.coords.longitude;

      let closest = null;
      let minDistance = Infinity;

      for (const dev of devices) {
        if (dev.latitude && dev.longitude) {
          const dist = getDistance(userLat, userLon, dev.latitude, dev.longitude);
          if (dist < minDistance) {
            minDistance = dist;
            closest = dev;
          }
        }
      }

      if (closest) {
        device.value = closest;
      } else {
        error.value = "ไม่พบอุปกรณ์ในบริเวณใกล้เคียง";
      }
    }, (err) => {
      error.value = "ไม่สามารถเข้าถึงตำแหน่งผู้ใช้";
    });
  } catch (e) {
    error.value = "เกิดข้อผิดพลาดขณะโหลดข้อมูลอุปกรณ์";
  } finally {
    loading.value = false;
  }
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (x: number) => x * Math.PI / 180;
  const R = 6371; // Radius of Earth in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; // Distance in km
};

onMounted(() => {
  fetchDeviceByLocation();
});
</script>


