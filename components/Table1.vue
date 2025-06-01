<template>
  <div class="container max-w-screen-lg mx-auto p-4">
    <h1 class="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
      แบบรายงานสถานการณ์คุณภาพอากาศ
    </h1>

    <!-- Search Input -->
    <div class="flex justify-center mb-6">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="🔍 ค้นหาด้วยสถานที่..."
        class="w-full md:max-w-md p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      />
    </div>

    <!-- States -->
    <div v-if="pending" class="text-center text-gray-500">Loading data...</div>
    <div v-else-if="error" class="text-center text-red-500">{{ error }}</div>
    <div v-else-if="filteredSensors.length === 0" class="text-center text-gray-500">
      ไม่พบข้อมูล
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto rounded-lg shadow-md">
      <table class="min-w-full bg-white border border-gray-200 text-sm text-left">
        <thead class="bg-blue-50 text-gray-600 uppercase">
          <tr>
            <th class="py-3 px-4">สถานที่</th>
            <th class="py-3 px-4">PM2.5</th>
            <th class="py-3 px-4">PM10</th>
            <th class="py-3 px-4">AQI</th>
            <th class="py-3 px-4">อุณหภูมิ</th>
            <th class="py-3 px-4">ความชื้น</th>
            <th class="py-3 px-4 text-center">กราฟ</th>
          </tr>
        </thead>
        <tbody class="text-gray-700">
          <tr v-for="sensor in displayedSensors" :key="sensor.ID" class="border-t hover:bg-gray-50 transition">
            <td class="py-3 px-4">{{ sensor.place }}</td>
            <td class="py-3 px-4"><span :style="{ color: getColorByValue(sensor.pm25) }">{{ sensor.pm25 }}</span></td>
            <td class="py-3 px-4"><span :style="{ color: getColorByValue(sensor.pm10) }">{{ sensor.pm10 }}</span></td>
            <td class="py-3 px-4">{{ sensor.aqi }}</td>
            <td class="py-3 px-4">{{ sensor.temperature }}</td>
            <td class="py-3 px-4">{{ sensor.humidity }}</td>
            <td class="py-3 px-4 text-center">
              <button class="btn-primary" @click="openChartModal(sensor.deviceid)">ดูกราฟ</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Show More -->
    <div class="mt-6 text-center">
      <button v-if="hasMoreSensors" @click="showMore" class="btn-primary">แสดงเพิ่มเติม</button>
      <p v-else class="text-gray-500 mt-2">แสดงข้อมูลครบแล้ว ({{ displayedSensors.length }})</p>
    </div>

    <!-- Modal Chart -->
    <ClientOnly>
      <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 relative">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">{{ selectedSensorPlace }} - ค่าฝุ่น PM2.5</h2>
          <VueECharts :option="chartOptions" style="height: 400px; width: 100%" ref="chart" />
          <button class="btn-danger absolute top-4 right-4" @click="closeChartModal">✕</button>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue';
import { useAsyncData } from '#app';

// Dynamically import VueECharts only on the client side
const VueECharts = process.client ? await import('vue-echarts').then(module => module.default) : null;
if (process.client) {
await import('echarts');
}

// State for incremental loading
const itemsPerPage = 5;
const visibleItems = ref(itemsPerPage);

// Search state
const searchQuery = ref('');

// Modal state
const showModal = ref(false);
const selectedDeviceId = ref(null);
const selectedSensorPlace = ref('');

// Fetch data using useAsyncData
const { data: sensorData, pending, error } = useAsyncData('sensorData', async () => {
try {
  const response = await $fetch('http://localhost:8080/api/airquality/sensor_data/week');
  return response || [];
} catch (err) {
  console.error('Error fetching sensor data:', err);
  return [];
}
}, { default: () => [] });

// Get unique sensors (latest entry per deviceid)
const uniqueSensors = computed(() => {
if (!sensorData.value) return [];
const latestSensors = {};
sensorData.value.forEach(sensor => {
  if (
    !latestSensors[sensor.deviceid] ||
    sensor.timestamp > latestSensors[sensor.deviceid].timestamp
  ) {
    latestSensors[sensor.deviceid] = sensor;
  }
});
return Object.values(latestSensors).sort((a, b) => a.deviceid.localeCompare(b.deviceid));
});

// Filter sensors based on search query
const filteredSensors = computed(() => {
if (!searchQuery.value) return uniqueSensors.value;
return uniqueSensors.value.filter(sensor =>
  sensor.place.toLowerCase().includes(searchQuery.value.toLowerCase())
);
});

// Compute displayed sensors (limited to visibleItems and filtered by search)
const displayedSensors = computed(() => {
return filteredSensors.value.slice(0, visibleItems.value);
});

// Check if there are more sensors to show
const hasMoreSensors = computed(() => {
return visibleItems.value < filteredSensors.value.length;
});

// Method to show more sensors
const showMore = () => {
visibleItems.value += itemsPerPage;
};

// Chart options for ECharts
const chartOptions = computed(() => {
if (!selectedDeviceId.value || !process.client) return {};

// Filter data for the selected device
const deviceData = sensorData.value
  .filter(sensor => sensor.deviceid === selectedDeviceId.value)
  .sort((a, b) => a.timestamp - b.timestamp);

// Prepare time and PM2.5 data
const timeData = deviceData.map(sensor => `${sensor.ddate} ${sensor.dtime}`);
const pm25Data = deviceData.map(sensor => sensor.pm25);

return {
  title: {
    text: 'PM2.5 Over Time',
    left: 'center',
  },
  xAxis: {
    type: 'category',
    data: timeData,
    axisLabel: {
      rotate: 45,
      interval: Math.floor(timeData.length / 10) || 0,
    },
  },
  yAxis: {
    type: 'value',
    name: 'PM2.5 (µg/m³)',
  },
  series: [
    {
      name: 'PM2.5',
      type: 'line',
      data: pm25Data,
      smooth: true,
      lineStyle: { color: '#1890ff' },
      itemStyle: { color: '#1890ff' },
    },
  ],
  tooltip: { trigger: 'axis' },
  grid: { left: '10%', right: '10%', bottom: '20%' },
};
});

// Methods for modal
const openChartModal = (deviceId) => {
if (!process.client) return;
selectedDeviceId.value = deviceId;
const sensor = sensorData.value.find(s => s.deviceid === deviceId);
selectedSensorPlace.value = sensor ? sensor.place : 'Unknown';
showModal.value = true;
};

const closeChartModal = () => {
if (!process.client) return;
showModal.value = false;
selectedDeviceId.value = null;
selectedSensorPlace.value = '';
};

const { data: colorRanges } = await useAsyncData('colorRanges', async () => {
  try {
    const response = await $fetch('http://localhost:8080/colorranges');
    return response || [];
  } catch (err) {
    console.error('Error fetching color ranges:', err);
    return [];
  }
});
const getColorByValue = (value, type = 'pm25') => {
  if (!colorRanges.value) return '#000'; // fallback
  const matched = colorRanges.value.find(range => value >= range.min && value <= range.max);
  return matched ? matched.color : '#000'; // default: black if not matched
};


</script>

<style scoped>
.btn-primary {
  @apply bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition;
}

.btn-danger {
  @apply bg-red-600 text-white px-3 py-2 rounded-full hover:bg-red-700 transition;
}
/* Additional styles for search input */
input {
transition: all 0.3s ease;
}
input:focus {
box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>