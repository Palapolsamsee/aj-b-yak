<template>
  <div class="container mx-auto p-4">

    <!-- ช่องค้นหา -->
    <div class="mb-4">
      <input v-model="searchQuery" placeholder="ค้นหาสถานที่" class="w-full px-3 py-2 border rounded-lg" />
    </div>

    <div v-if="loading" class="text-center">กำลังโหลด...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>
    <div v-else-if="filteredDevices.length === 0" class="text-center text-gray-500">
      ไม่พบข้อมูล
    </div>
    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="device in filteredDevices" :key="device.dvid"
        class="bg-white rounded-lg shadow-lg p-6 max-w-md w-full m-2 cursor-pointer hover:bg-gray-100"
        @click="selectDevice(device)">
        <div class="flex justify-between items-start">
          <div class="flex items-center">

            <div class="text-white rounded-full w-24 h-24 flex flex-col items-center justify-center"
              :style="{ backgroundColor: getColor(device.pm25) }">
              <div class="text-4xl font-bold">{{ device.pm25 }}</div>
              <div class="text-sm">{{ device.temperature }}°C</div>
            </div>

            <div class="ml-4">
              <div class="text-lg font-semibold">{{ device.place }}</div>
              <div class="text-gray-500 text-sm">{{ device.timestamp }}</div>
            </div>
            
          </div>

          <div>
            <i class="far fa-heart text-gray-400 text-xl"></i>
          </div>
        </div>
        <div class="mt-4"> justify-between items-center">
            <!-- <div class="text-gray-500">Average</div> -->
            <div class="text-gray-500">Trend {{ device.trend }}</div>
          </div>
          <div class="flex justify-between items-center mt-2">
            <div class="flex space-x-2">
              <div class="bg-red-100 text-red-500 rounded-lg px-3 py-2 text-center">
                <div class="text-lg font-semibold">{{ device.av1h }}</div>
                <div class="text-xs">1 hour</div>
              </div>
              <div class="bg-red-100 text-red-500 rounded-lg px-3 py-2 text-center">
                <div class="text-lg font-semibold">{{ device.av3h }}</div>
                <div class="text-xs">3 hours</div>
              </div>
              <div class="bg-red-100 text-red-500 rounded-lg px-3 py-2 text-center">
                <div class="text-lg font-semibold">{{ device.av6h }}</div>
                <div class="text-xs">6 hours</div>
              </div>
            </div>
            <div class="flex items-center">
              <i class="fas fa-chart-line text-red-500 text-xl"></i>
            </div>
          </div>
        </div>
        <div class="mt-4 flex justify-between items-center">
          <p :class="{ 'text-green-600': device.status === 'Active', 'text-red-600': device.status === 'InActive' }">
            Status: {{ device.status }}
          </p>

          <img alt="Cartoon character with a mask and a book" class="w-16 h-16" src="https://placehold.co/50x50" />
        </div>
      </div>
    </div>

    <!-- Modal สำหรับแสดงรายละเอียด (เหมือนเดิม) -->
    <div v-if="selectedDevice" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click.self="selectedDevice = null">
      <div class="bg-white rounded-lg p-6 max-w-md w-full" @click.stop>
        <h2 class="text-2xl font-bold mb-4">รายละเอียดอุปกรณ์</h2>
        <div class="space-y-2">
          <p><strong>รหัสอุปกรณ์:</strong> {{ selectedDevice.dvid }}</p>
          <p><strong>สถานที่:</strong> {{ selectedDevice.place }}</p>
          <p><strong>สถานะ:</strong> {{ selectedDevice.status || 'ไม่ระบุ' }}</p>
          <p><strong>พิกัด:</strong> {{ selectedDevice.latitude }}, {{ selectedDevice.longitude }}</p>
          <p><strong>วันที่ติดตั้ง:</strong> {{ selectedDevice.installDate || 'ไม่ระบุ' }}</p>
        </div>
        <button class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600" @click="selectedDevice = null">
          ปิด
        </button>
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
const selectedDevice = ref<Device | null>(null);
const searchQuery = ref('');
const { colorRanges } = useColorSettings();

// ฟังก์ชันเลือกสีจากค่าที่กำหนด
const getColor = (value: number) => {
  const range = colorRanges.value.find(r => value >= r.min && value <= r.max);
  return range ? range.color : '#808080'; // สีเทาถ้าไม่มีช่วงที่กำหนด
};

// กรองอุปกรณ์ตามคำค้นหา
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
    const apikey = 'blank';
    const response = await fetch(apikey);

    if (!response.ok) {
      throw new Error('ไม่สามารถโหลดข้อมูลได้');
    }
    const res1 = await response.json();
    devices.value = res1.response;

    loading.value = false;
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด';
    loading.value = false;
  }
});
</script>
