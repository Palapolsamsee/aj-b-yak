<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="bg-white shadow-sm sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div class="text-lg font-bold text-gray-900">Air Quality Monitor</div>
        <nav class="space-x-4 text-sm font-medium text-gray-600 hidden sm:block">
          <a href="#" class="hover:text-black">Locations</a>
          <a href="#" class="hover:text-black">Map</a>
          <a href="#" class="hover:text-black">Health</a>
          <a href="#" class="hover:text-black">News</a>
          <a href="#news" class="hover:text-black">About</a>
        </nav>
      </div>
    </header>

    <!-- Main -->
    <main class="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <!-- Location & AQI Summary -->
      <section v-if="nearestSensor" class="bg-white p-6 rounded-xl shadow">
        <h1 class="text-2xl font-semibold text-gray-900">
          {{ nearestSensor.place }}
        </h1>
        <p class="text-sm text-gray-500">
          Last updated {{ new Date(nearestSensor.updatedAt || Date.now()).toLocaleTimeString() }}
        </p>
        <div class="mt-4 text-lg font-medium text-gray-700">
          PM2.5 AQI {{ nearestSensor.pm25 }} | 
          <span 
            class="font-semibold" 
            :style="{ color: getColorByValue(nearestSensor.pm25) }"
          >
            {{ getStatusLabel(nearestSensor.pm25) }}
          </span>
        </div>
        <div class="w-full h-2 bg-gray-200 rounded mt-2">
          <div
            class="h-2 rounded transition-all duration-300"
            :style="{
              width: Math.min((nearestSensor.pm25 / 500) * 100, 100) + '%',
              backgroundColor: getColorByValue(nearestSensor.pm25)
            }"
          ></div>
        </div>
        <p class="mt-4 text-sm text-gray-700">
          Health Advisory:
          <span v-if="nearestSensor.pm25 > 100">
            People with respiratory conditions should avoid prolonged outdoor exertion.
          </span>
          <span v-else-if="nearestSensor.pm25 > 50">
            Unusually sensitive people should consider reducing prolonged or heavy exertion outside.
          </span>
          <span v-else>
            Air quality is good. Enjoy your day!
          </span>
        </p>
      </section>

      <!-- Map -->
      <section class="bg-white p-4 rounded-xl shadow overflow-hidden">
        <div class="mb-2 flex items-center justify-between">
          <span class="font-medium text-gray-700">Map View</span>
        </div>
        <div class="rounded-lg overflow-hidden h-72">
          <newmap :sensorData="displayedSensors" :colorRanges="colorRanges" />
        </div>
      </section>

      <!-- Locations Table -->
      <section class="bg-white p-6 rounded-xl shadow">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Locations</h2>
 <input
      type="text"
      placeholder="Search location..."
      v-model="searchQuery"
      class="border p-2 rounded mb-4 w-full"
    />
        <table class="w-full text-sm text-left">
          <thead class="text-gray-500 border-b">
            <tr>
              <th class="py-2">Location</th>
              <th class="py-2">AQI</th>
              <th class="py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="sensor in displayedSensors" :key="sensor.deviceid" class="border-b hover:bg-gray-50">
              <td class="py-2">{{ sensor.place }} TEST</td>
              <td class="py-2">{{ sensor.pm25 }}</td>
              <td class="py-2">
                <span :class="getStatusClass(sensor.pm25)">{{ getStatusLabel(sensor.pm25) }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- News Section -->
      <section class="bg-white p-6 rounded-xl shadow"  id="news">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Latest News</h2>
        <div class="space-y-4">
          <div v-for="n in 3" :key="n">
            <h3 class="font-medium text-gray-900">Spare the Air Alert Extended</h3>
            <p class="text-sm text-gray-500">September {{ 7 - n }}, 2025</p>
            <p class="text-sm text-gray-700 mt-1">The San Francisco Bay Area Air Quality Management District is extending the Spare the Air Alert due to wildfire smoke.</p>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>


<script setup lang="ts">
import { onMounted } from 'vue';
import newmap from '~/components/newmap.vue';
import { useSensorData } from '~/composables/useSensorData';



const {
  sensorData,
  pending,
  error,
  searchQuery,
  displayedSensors,
  getColorByValue,
  nearestSensor,
  setUserLocation,
  colorRanges
} = useSensorData();

// ฟังก์ชันหาสถานะ AQI
function getStatusLabel(pm25: number): string {
  if (pm25 <= 50) return 'Good';
  if (pm25 <= 100) return 'Moderate';
  if (pm25 <= 150) return 'Unhealthy for Sensitive Groups';
  if (pm25 <= 200) return 'Unhealthy';
  if (pm25 <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

function getStatusClass(pm25: number): string {
  if (pm25 <= 50) return 'text-green-600 font-medium';
  if (pm25 <= 100) return 'text-yellow-600 font-medium';
  if (pm25 <= 150) return 'text-orange-600 font-medium';
  if (pm25 <= 200) return 'text-red-600 font-medium';
  if (pm25 <= 300) return 'text-purple-600 font-medium';
  return 'text-pink-600 font-medium';
}

// หาตำแหน่งผู้ใช้ตอนโหลด
onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setUserLocation(latitude, longitude);
    });
  }
});
</script>
