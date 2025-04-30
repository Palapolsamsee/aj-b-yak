<template>
    <div class="container mx-auto p-4 aling-center">
      <h1 class="text-2xl font-bold m่่ิิb-4">แบบรายงานสถานการณ์คุณภาพอากาศ</h1>
      
      <!-- Loading and Error States -->
      <div v-if="pending" class="text-center">
        <p class="text-gray-600">Loading data...</p>
      </div>
      <div v-else-if="error" class="text-center text-red-600">
        <p>{{ error }}</p>
      </div>
      <div v-else-if="sensorData.length === 0" class="text-center">
        <p class="text-gray-600">No data available</p>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full bg-white border">
            <thead>
              <tr class="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <!-- <th class="py-3 px-6 text-left">Device ID</th> -->
                <th class="py-3 px-6 text-left">Place</th>
                <th class="py-3 px-6 text-left">PM2.5 (µg/m³)</th>
                <th class="py-3 px-6 text-left">PM10 (µg/m³)</th>
                <th class="py-3 px-6 text-left">AQI</th>
                <th class="py-3 px-6 text-left">Temperature (°C)</th>
                <th class="py-3 px-6 text-left">Humidity (%)</th>
                <th class="py-3 px-6 text-center">Chart</th>
              </tr>
            </thead>
            <tbody class="text-gray-600 text-sm font-light">
              <tr v-for="sensor in displayedSensors" :key="sensor.ID" class="border-b border-gray-200 hover:bg-gray-100">
                <!-- <td class="py-3 px-6 text-left whitespace-nowrap">{{ sensor.deviceid }}</td> -->
                <td class="py-3 px-6 text-left">{{ sensor.place }}</td>
                <td class="py-3 px-6 text-left">{{ sensor.pm25 }}</td>
                <td class="py-3 px-6 text-left">{{ sensor.pm10 }}</td>
                <td class="py-3 px-6 text-left">{{ sensor.aqi }}</td>
                <td class="py-3 px-6 text-left">{{ sensor.temperature }}</td>
                <td class="py-3 px-6 text-left">{{ sensor.humidity }}</td>
                <td class="py-3 px-6 text-center">
                  <button
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    @click="openChartModal(sensor.deviceid)"
                  >
                    View Chart
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Show More Button -->
        <div class="mt-4 text-center">
          <button
            v-if="hasMoreSensors"
            class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
            @click="showMore"
          >
            Show More
          </button>
          <p v-else-if="displayedSensors.length > 0" class="text-gray-600">
            All sensors displayed ({{ displayedSensors.length }})
          </p>
        </div>
      </div>
  
      <!-- Modal for ECharts (ClientOnly to prevent SSR issues) -->
      <ClientOnly>
        <div
          v-if="showModal"
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div class="bg-white p-6 rounded-lg w-3/4 max-w-4xl">
            <h2 class="text-xl font-bold mb-4">{{ selectedSensorPlace }} - PM2.5 Chart</h2>
            <VueECharts
              :option="chartOptions"
              style="height: 400px; width: 100%"
              ref="chart"
            />
            <button
              class="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              @click="closeChartModal"
            >
              Close
            </button>
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
  
  // Compute displayed sensors (limited to visibleItems)
  const displayedSensors = computed(() => {
    return uniqueSensors.value.slice(0, visibleItems.value);
  });
  
  // Check if there are more sensors to show
  const hasMoreSensors = computed(() => {
    return visibleItems.value < uniqueSensors.value.length;
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
  </script>
  
  <style scoped>
  /* Additional styles if needed */
  </style>