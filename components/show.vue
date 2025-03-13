<template>
  <!-- แสดงวันที่ -->
<div class="text-black text-2xl font-bold mb-6 text-center mt-8">
  วันที่ {{ currentDate }}
</div>

  <div class="max-w-7xl min-h-[80vh] bg-[#070d22] mx-auto p-6 rounded-lg shadow-lg">
    <!-- ช่องค้นหา -->
    <div class="mb-4 relative">
      <input v-model="searchQuery" placeholder="ค้นหาสถานที่"
        class="w-full px-4 py-3 border border-gray-600 rounded-lg pl-12 pr-12 focus:ring-2 focus:ring-indigo-400 transition-all duration-300 text-gray-800 text-lg shadow-sm" />
      
      <!-- ไอคอนค้นหา -->
      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-" fill="currentColor" viewBox="0 0 24 24">
        <path d="M21 21l-4.35-4.35M15 10A5 5 0 1 1 5 10a5 5 0 0 1 10 0z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      
      <!-- ไอคอนลบเมื่อกรอกคำค้นหา -->
      <svg v-if="searchQuery" @click="searchQuery = ''"
        class="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer hover:text-gray-800 transition-all duration-200"
        fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </div>

    <!-- Loading, Error, และ No Data -->
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse bg-gray-500 h-24 w-full rounded-lg"></div>
    </div>
    
    <div v-else-if="error" class="text-red-500 text-lg font-semibold">{{ error }}</div>
    <div v-else-if="filteredDevices.length === 0" class="text-center text-gray-400 text-lg">ไม่พบข้อมูล</div>

  <!-- ตารางข้อมูล -->
<div v-else class="overflow-x-auto max-h-[600px] overflow-y-auto">
  <table class="w-full table-auto text-center text-sm text-white border-collapse shadow-lg">
    <thead class="bg-gray-800 text-white border-b-2 border-gray-200">
      <tr>
        <th class="px-4 py-4 text-base font-semibold">สถานที่</th>
        <th class="px-4 py-4 text-base font-semibold">PM2.5(µg/m³)</th>
        <th class="px-4 py-4 text-base font-semibold">PM10(µg/m³)</th>
        <th class="px-4 py-4 text-base font-semibold">อุณหภูมิ(°C)</th>
        <th class="px-4 py-4 text-base font-semibold">ความชื้น(%)</th>
        <th class="px-4 py-4 text-base font-semibold">แนวโน้ม</th>
        <th class="px-4 py-4 text-base font-semibold">ค่าเฉลี่ย</th>
        <th class="px-4 py-4 text-base font-semibold">สถิติค่าฝุ่น</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-gray-600">
      <tr v-for="(device, index) in filteredDevices.slice(0, 50)" :key="device.dvid" 
          :class="index % 2 === 0 ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 hover:bg-gray-700'"
          class="border-t transition-all duration-200">
        <td @click="openDeviceModal(device)" class="px-6 py-4 text-gray-200 cursor-pointer whitespace-nowrap hover:underline">{{ device.place }}</td>
        <td class="px-2 py-1 whitespace-nowrap font-bold text-center rounded-md" :style="{ backgroundColor: getColor(device.pm25) }">{{ device.pm25 }}</td>
        <td class="px-2 py-1 whitespace-nowrap font-bold text-center rounded-md" :style="{ backgroundColor: getColor(device.pm10) }">{{ device.pm10 }}</td>
        <td class="px-6 py-4 text-gray-200 whitespace-nowrap">{{ device.temperature }}</td>
        <td class="px-6 py-4 text-gray-200 whitespace-nowrap">{{ device.humidity }}</td>
        <td class="px-6 py-4 text-gray-200 whitespace-nowrap flex justify-center items-center">
          <span v-if="device.trend === 'd'" class="transform transition-all duration-300 hover:scale-125">
            <svg class="w-6 h-6 text-green-500 hover:text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 19L5 12H9L12 15L15 12H19L12 19Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span v-else-if="device.trend === 'u'" class="transform transition-all duration-300 hover:scale-125">
            <svg class="w-6 h-6 text-red-500 hover:text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 5L19 12H15L12 9L9 12H5L12 5Z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
          <span v-else class="transform transition-all duration-300 hover:scale-125">
            <svg class="w-6 h-6 text-gray-500 hover:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 12h14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </span>
        </td>
        <!-- คอลัมน์ "ค่าเฉลี่ย" -->
        <td class="px-6 py-4 text-gray-200 whitespace-nowrap relative">
          <!-- ปุ่มเพื่อแสดงข้อมูล -->
          <button @click="toggleExpand(device.dvid)" class="bg-gray-700 px-3 py-1 rounded-lg hover:bg-gray-600">
            ดูค่าเฉลี่ย ▼
          </button>
          <!-- แสดงข้อมูลค่าเฉลี่ย -->
          <transition name="fade">
            <div v-if="expandedRow === device.dvid" class="absolute left-0 mt-2 bg-gray-800 p-3 rounded-lg shadow-lg w-60 z-10 text-sm text-gray-300">
              <p>ค่าเฉลี่ย 1 ชั่วโมง: {{ device.av1h ?? '-' }} µg/m³</p>
              <p>ค่าเฉลี่ย 3 ชั่วโมง: {{ device.av3h ?? '-' }} µg/m³</p>
              <p>ค่าเฉลี่ย 6 ชั่วโมง: {{ device.av6h ?? '-' }} µg/m³</p>
              <p>ค่าเฉลี่ย 12 ชั่วโมง: {{ device.av12h ?? '-' }} µg/m³</p>
              <p>ค่าเฉลี่ย 24 ชั่วโมง: {{ device.av24h ?? '-' }} µg/m³</p>
            </div>
          </transition>
        </td>
        <td class="px-6 py-4 text-gray-200 whitespace-nowrap flex justify-center items-center">
    <!-- แสดงแผนภูมิแท่งเล็กๆ -->
    <span @click="openStatsModal(device)" class="cursor-pointer hover:text-gray-400">
      <svg class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M4 12h2V7H4zm4 0h2V5H8zm4 0h2V3h-2zm4 0h2V2h-2z" />
      </svg>
    </span>
  </td>
      </tr>
    </tbody>
  </table>
</div>



    <!-- Device Modal -->
    <div v-if="selectedDevice" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md relative">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ selectedDevice.place }}</h3>
        <p><strong>PM2.5:</strong> {{ selectedDevice.pm25 }} µg/m³</p>
        <p><strong>PM10:</strong> {{ selectedDevice.pm10 }} µg/m³</p>
        <p><strong>ที่อยู่:</strong> {{ selectedDevice.address }}</p>
        <p><strong>อุณหภูมิ:</strong> {{ selectedDevice.temperature }} °C</p>
        <p><strong>ความชื้น:</strong> {{ selectedDevice.humidity }} %</p>
        <p><strong>ละติจูด:</strong> {{ selectedDevice.latitude }} </p>
        <p><strong>ลองติจูด:</strong> {{ selectedDevice.longitude }} </p>

        <button @click="closeDeviceModal" class="absolute top-2 right-2 text-black hover:text-gray-600 px-3 py-1 rounded-full transition-all">✖
</button>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, computed } from 'vue';

const currentDate = computed(() => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  return new Intl.DateTimeFormat('th-TH', options).format(date);
});


interface Device {
  dvid: string;
  place: string;
  status?: string;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  av1h?: number;
  trend?: string;
}

const devices = ref<Device[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const expandedRow = ref<string | null>(null);
const selectedDevice = ref<Device | null>(null);

// ใช้งาน color settings
const { colorRanges } = useColorSettings();

const getColor = (value: number | undefined) => {
  if (value === undefined) return '#808080'; // กรณีไม่มีค่า PM2.5

  // หาช่วงสีจาก colorRanges
  const range = colorRanges.value.find(range => value >= range.min && value <= range.max);
  return range ? range.color : '#808080'; // ถ้าไม่พบค่า, ให้ใช้สีเทา
};

// ฟิลเตอร์ข้อมูล
const filteredDevices = computed(() => {
  
  return devices.value.filter(device =>
    device.place.toLowerCase().includes(searchQuery.value.toLowerCase()) && device.status === 'Active' && device.pm25 != null && device.pm10 != null
  );
});

// ฟังก์ชัน toggle dropdown
const toggleExpand = (id: string) => {
  expandedRow.value = expandedRow.value === id ? null : id;
};

// ฟังก์ชันเปิดป๊อปอัพ
const openDeviceModal = (device: Device) => {
  selectedDevice.value = device;
};

// ฟังก์ชันปิดป๊อปอัพ
const closeDeviceModal = () => {
  selectedDevice.value = null;
};

// ดึงข้อมูล API
onMounted(async () => {
  try {
    const response = await fetch('https://yakkaw.mfu.ac.th/api/yakkaw/devices');
    const res1 = await response.json();
    devices.value = Array.isArray(res1.response) ? res1.response : [];
  } catch (err) {
    error.value = 'เกิดข้อผิดพลาด';
  } finally {
    loading.value = false;
  }
});
</script>
