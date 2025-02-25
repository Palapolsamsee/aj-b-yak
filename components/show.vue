<template>

  <div class="max-8xl min-h-[80vh] bg-[#070d22] mx-auto p-4 rounded-lg shadow-lg">

    <!-- ช่องค้นหา -->
    <div class="mb-4 relative">
      <input v-model="searchQuery" placeholder="ค้นหาสถานที่"
      class="w-full px-3 py-2 border border-gray-300 rounded-lg pl-10 pr-10 focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
      <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 21l-4.35-4.35M15 10A5 5 0 1 1 5 10a5 5 0 0 1 10 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <svg v-if="searchQuery" @click="searchQuery = ''"
        class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer hover:text-gray-800"
        fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
     <!-- loading -->
     <div v-if="loading" class="space-y-4">
  <div class="animate-pulse bg-gray-300 h-24 w-full rounded-lg"></div>
  <div class="animate-pulse bg-gray-300 h-24 w-full rounded-lg"></div>
  <div class="animate-pulse bg-gray-300 h-24 w-full rounded-lg"></div>
  </div>
  <div v-else-if="error" class="text-red-500">{{ error }}</div>
  <div v-else-if="filteredDevices.length === 0" class="text-center text-gray-500">ไม่พบข้อมูล</div>
    <div v-else>
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- card of page -->
      <div v-for="device in filteredDevices" :key="device.dvid"
  class="bg-white rounded-xl shadow-md p-6 cursor-pointer transition-transform duration-300 ease-in-out 
         hover:shadow-xl hover:-translate-y-1 hover:scale-105"
  @click="selectDevice(device)">
        <div class="flex items-center justify-between">
          <div class="text-base md:text-lg font-semibold">{{ device.place }}</div>
          <p class="text-sm text-gray-500">{{ device.timestamp }}</p>
        </div>
        
        <div class="flex items-center space-x-4">
          <div class="w-24 h-24 flex flex-col items-center justify-center text-white rounded-full"
            :style="{ backgroundColor: getColor(device.pm25) }">
            <div class="text-3xl font-bold">{{ device.pm25 }}</div>
            <div class="text-sm">{{ device.temperature }}°C</div>
          </div>
          <div class="flex-1 space-y-2">
            <div class="text-gray-700 text-sm">Trend: {{ device.trend || 'N/A' }}</div>
            <div class="grid grid-cols-3 gap-2">
              <div class="bg-gray-100 text-center rounded-lg p-2">
                <div class="text-lg font-bold">{{ device.av1h }}</div>
                <div class="text-xs">1 ชม.</div>
              </div>
              <div class="bg-gray-100 text-center rounded-lg p-2">
                <div class="text-lg font-bold">{{ device.av3h }}</div>
                <div class="text-xs">3 ชม.</div>
              </div>
              <div class="bg-gray-100 text-center rounded-lg p-2">
                <div class="text-lg font-bold">{{ device.av6h }}</div>
                <div class="text-xs">6 ชม.</div>
              </div>
              <hr class="border-gray-1000" />
            </div>
            <p class="font-semibold text-left mt-2" :class="{ 'text-green-600': device.status === 'Active', 'text-red-600': device.status === 'InActive' }">
            Status: {{ device.status }}
          </p>
          </div>
        </div>
      </div>
      
    </div>

    <!-- โมดัลแสดงรายละเอียดอุปกรณ์ -->
    <div v-if="selectedDevice" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" @click.self="selectedDevice = null">
  <div class="bg-white p-6 rounded-lg shadow-lg w-96">
    <h2 class="text-xl font-bold mb-4">รายละเอียดอุปกรณ์</h2>
    <p><strong>สถานที่:</strong> {{ selectedDevice.place }}</p>
    <p><strong>วันที่ติดตั้ง:</strong> {{ selectedDevice.installDate || 'N/A' }}</p>
    <p><strong>ละติจูด:</strong> {{ selectedDevice.latitude || 'N/A' }}</p>
    <p><strong>ลองจิจูด:</strong> {{ selectedDevice.longitude || 'N/A' }}</p>
    <p><strong>ค่า PM2.5:</strong> {{ selectedDevice.pm25 }}</p>
    <p><strong>อุณหภูมิ:</strong> {{ selectedDevice.temperature }}°C</p>
    <p><strong>แนวโน้ม:</strong> {{ selectedDevice.trend || 'N/A' }}</p>
    <p><strong>สถานะ:</strong> 
      <span :class="{ 'text-green-600': selectedDevice.status === 'Active', 'text-red-600': selectedDevice.status === 'InActive' }">
        {{ selectedDevice.status }}
      </span>
    </p>
    <button @click="selectedDevice = null" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all active:scale-95">ปิด</button>
  </div>

</div>
 </div>

</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useColorSettings } from '@/utils/useColorSettings';

interface Device {
  dvid: string;
  place: string;
  status?: string;
  latitude?: number;
  longitude?: number;
  installDate?: string;
  pm25?: number;
  temperature?: number;
  timestamp?: string;
  trend?: string;
  av1h?: number;
  av3h?: number;
  av6h?: number;
  [key: string]: any;
}

const devices = ref<Device[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const selectedDevice = ref<Device | null>(null);

const { colorRanges } = useColorSettings();


const getColor = (value: number) => {
  const range = colorRanges.value.find(r => value >= r.min && value <= r.max);
  return range ? range.color : '#808080';
};


const filteredDevices = computed(() => {
  if (!searchQuery.value) return devices.value;
  return devices.value.filter(device =>
    device.place.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const selectDevice = (device: Device) => {
  selectedDevice.value = device;
};

onMounted(async () => {
  try {
    const apikey = 'https://yakkaw.mfu.ac.th/api/yakkaw/devices';
    const response = await fetch(apikey);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
    }
    const res1 = await response.json();
    devices.value = Array.isArray(res1.response) ? res1.response : [];
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
  } finally {
    loading.value = false;
  }
});
</script>
