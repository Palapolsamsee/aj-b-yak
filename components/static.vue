<template>
  <div
    class="max-w-sm mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg font-sans flex flex-col h-full"
  >
    <div class="flex flex-col gap-1 mb-4">
      <h3 class="text-xl font-bold text-gray-900">
        <span class="mr-2">อันดับคุณภาพอากาศ</span>
        <span class="text-sm font-normal text-gray-500">ตามค่า AQI⁺</span>
      </h3>
      <p class="text-sm text-gray-500 mt-1">
        จัดอันดับสถานีจากคุณภาพอากาศแย่ที่สุดไปดีที่สุด
      </p>
    </div>

    <div v-if="loading" class="flex-grow flex items-center justify-center p-6">
      <svg
        class="animate-spin h-8 w-8 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>

    <div v-else-if="error" class="flex-grow flex items-center justify-center p-4 text-center text-red-500">
      <p class="text-sm">⚠️ เกิดข้อผิดพลาดในการดึงข้อมูล</p>
    </div>

    <div v-else-if="showYearlyStats" class="flex-grow flex flex-col">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-900">
          สถิติคุณภาพอากาศรายปี
        </h3>
        <button
          @click="showYearlyStats = false"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          ย้อนกลับ
        </button>
      </div>

      <div v-if="yearlyData.length" class="flex flex-col gap-2 overflow-y-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">วันที่</th>
              <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">PM2.5 (µg/m³)</th>
              </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(data, index) in yearlyData" :key="index">
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{{ data.timestamp }}</td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{{ formatValue(data.pm25) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 p-6">ไม่พบข้อมูลรายปีสำหรับสถานีนี้</div>
    </div>
    
<div
  v-for="(item, index) in filteredAndPaginatedData"
  :key="index"
  class="flex items-center justify-between p-3 rounded-xl transition-colors duration-200 ease-in-out hover:bg-gray-50 cursor-pointer"
  @click="goToHeatmap(item.address)"
>
  <div class="flex items-center gap-3 w-3/4">
    <span class="text-base font-semibold text-gray-600 w-6 flex-shrink-0">{{ index + 1 }}</span>
    <div class="flex flex-col truncate">
      <p class="text-sm text-gray-900 font-medium truncate">{{ item.address }}</p>
      <p class="text-xs text-gray-500">{{ formatValue(item.dvid) }}</p>
    </div>
  </div>
  <div
    class="flex-shrink-0 w-12 h-8 rounded-full flex items-center justify-center border-2"
    :class="getAqiColorClass(item.avg_pm25)"
  >
    <p class="text-sm font-bold" :class="getAqiValueColor(item.avg_pm25)">
      {{ formatValue(item.avg_pm25) }}
    </p>
  </div>
</div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useApiBase } from '@/composables/useApiBase'
const { yakkawApi ,baseair,oneWeekApi} = useApiBase()
const airQualityData = ref([]);
const error = ref(null);
const loading = ref(true);
const itemsToShow = ref(5);
const selectedFilter = ref('all');
const showYearlyStats = ref(false);
const selectedDvid = ref(null);
const yearlyData = ref([]);


const router = useRouter()

const goToHeatmap = (address) => {
  router.push(`/heatmap/${encodeURIComponent(address)}`)
}
const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await fetch(oneWeekApi);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    if (data && data.data) {
      airQualityData.value = data.data.sort(
        (a, b) => parseFloat(b.avg_pm25) - parseFloat(a.avg_pm25)
      );
    } else {
      airQualityData.value = [];
    }
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const showYearlyData = async (dvid) => {
  loading.value = true;
  error.value = null;
  selectedDvid.value = dvid;
  try {
    const response = await fetch(baseair+`/one_year?dvid=${dvid}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    yearlyData.value = data.data || [];
    showYearlyStats.value = true;
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const getAqiLevel = (value) => {
  if (value === null || value === undefined) return 'null';
  const aqiValue = parseFloat(value);
  if (aqiValue <= 50) return 'good';
  if (aqiValue <= 100) return 'moderate';
  return 'unhealthy';
};

const formatValue = (value) => {
  return typeof value === 'number' ? value.toFixed(0) : '-';
};

const getAqiColorClass = (value) => {
  const level = getAqiLevel(value);
  switch (level) {
    case 'good': return 'bg-green-50 border-green-400';
    case 'moderate': return 'bg-yellow-100 border-yellow-400';
    case 'unhealthy': return 'bg-orange-100 border-orange-400';
    default: return 'bg-gray-100 border';
  }
};

const getAqiValueColor = (value) => {
  const level = getAqiLevel(value);
  switch (level) {
    case 'good': return 'text-green-700';
    case 'moderate': return 'text-yellow-700';
    case 'unhealthy': return 'text-orange-700';
    default: return 'text-gray-600';
  }
};

const filteredAndPaginatedData = computed(() => {
  let filteredData = airQualityData.value;
  if (selectedFilter.value !== 'all') {
    filteredData = airQualityData.value.filter(
      (item) => getAqiLevel(item.avg_pm25) === selectedFilter.value
    );
  }
  return filteredData.slice(0, itemsToShow.value);
});

onMounted(() => {
  fetchData();
});
</script>