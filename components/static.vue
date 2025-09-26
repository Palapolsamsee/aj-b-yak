<template>
  <div
    :class="[
      props.address ? 'max-w-6xl' : 'max-w-sm',
      'w-full mx-auto p-4 sm:p-6 bg-white rounded-xl shadow-lg font-sans flex flex-col h-full'
    ]"
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

    <!-- Pagination controls -->
    <div class="mt-4 flex items-center justify-center gap-3" v-if="totalFilteredCount > 0">
      <button
        class="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        :disabled="!canShowLess"
        @click.stop="showLess"
      >
        แสดงน้อยลง
      </button>
      <span class="text-xs text-gray-500">{{ Math.min(itemsToShow, totalFilteredCount) }} / {{ totalFilteredCount }}</span>
      <button
        class="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        :disabled="!canShowMore"
        @click.stop="showMore"
      >
        แสดงเพิ่มเติม
      </button>
    </div>

    <!-- Heatmap section (optional) -->
    <div v-if="address" class="mt-6">
      <div class="flex items-center justify-between mb-3">
        <h4 class="text-base font-semibold text-gray-900 truncate">
           Heatmap — {{ decodedAddress }}
        </h4>
        <div class="flex items-center gap-2">
          <label class="text-xs text-gray-600">เลือกปี:</label>
          <select v-model="selectedYear" @change="updateChart" class="border rounded p-1 text-xs">
            <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
      </div>

      <ClientOnly>
        <component
          :is="VChart"
          v-if="chartOptions"
          class="h-[360px] w-full"
          :option="chartOptions"
          autoresize
        />
        <p v-else class="text-gray-500 text-center py-10">⏳ กำลังโหลดข้อมูล...</p>
      </ClientOnly>
    </div>

    <!-- Inline Heatmap when a row is clicked (no navigation) -->
    <div v-if="selectedAddress && !address" class="mt-6">
      <Heatmap :key="selectedAddress" :address="selectedAddress" />
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, defineAsyncComponent, watch } from 'vue';
import { useApiBase } from '@/composables/useApiBase'
const { yakkawApi, baseAirApi: baseair, oneWeekApi } = useApiBase()
const airQualityData = ref([]);
const error = ref(null);
const loading = ref(true);
const itemsToShow = ref(5);
const selectedFilter = ref('all');
const showYearlyStats = ref(false);
const selectedDvid = ref(null);
const yearlyData = ref([]);
const props = defineProps<{ address?: string }>()
const emit = defineEmits<{
  (e: 'change-address', address: string): void
}>()

// --- Heatmap state ---
const VChart = defineAsyncComponent(() =>
  process.client
    ? import('vue-echarts').then(m => m.default)
    : Promise.resolve({ render() { return null } })
)
const decodedAddress = computed(() => {
  if (!props.address) return ''
  try { return decodeURIComponent(props.address) } catch { return props.address }
})
type Point = { timestamp: number; pm25?: number }
const chartOptions = ref<any>(null)
const allData = ref<Point[]>([])
const availableYears = ref<number[]>([])
const selectedYear = ref<number>(new Date().getFullYear())
const toMs = (ts: number) => (ts < 1e12 ? ts * 1000 : ts)


// Inline heatmap rendering or bubble up to parent (if address prop is set)
const selectedAddress = ref<string | null>(null)
const goToHeatmap = (address: string) => {
  if (props.address) {
    emit('change-address', address)
  } else {
    selectedAddress.value = address
  }
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

// Derived counts and controls for Show More / Show Less
const totalFilteredCount = computed(() => {
  if (selectedFilter.value === 'all') return airQualityData.value.length
  return airQualityData.value.filter((item) => getAqiLevel(item.avg_pm25) === selectedFilter.value).length
})
const canShowMore = computed(() => itemsToShow.value < totalFilteredCount.value)
const canShowLess = computed(() => itemsToShow.value > 5)
const step = 5
function showMore() {
  itemsToShow.value = Math.min(itemsToShow.value + step, totalFilteredCount.value)
}
function showLess() {
  itemsToShow.value = Math.max(5, itemsToShow.value - step)
}

onMounted(() => {
  fetchData();
  // Register ECharts modules and fetch heatmap data if address provided
  if (process.client && props.address) {
    (async () => {
      try {
        const [{ use }, { CanvasRenderer }, { HeatmapChart }, { TitleComponent, TooltipComponent, VisualMapComponent, CalendarComponent }] = await Promise.all([
          import('echarts/core'),
          import('echarts/renderers'),
          import('echarts/charts'),
          import('echarts/components')
        ])
        use([
          CanvasRenderer,
          HeatmapChart,
          TitleComponent,
          TooltipComponent,
          VisualMapComponent,
          CalendarComponent
        ])
      } catch (e) {
        console.error('ECharts module registration failed:', e)
      }
      await fetchHeatmapData()
    })()
  }
});

watch(() => props.address, async (val) => {
  if (val) await fetchHeatmapData()
})

watch(selectedYear, () => updateChart())

// --- Heatmap functions ---
async function fetchHeatmapData() {
  if (!props.address) { chartOptions.value = null; return }
  try {
    const url = `${baseair}/one_year_series?address=${encodeURIComponent(props.address)}`
    const res = await $fetch<any>(url)
    const rows: Point[] = Array.isArray(res) ? res : res?.data ?? []
    allData.value = rows
      .filter(r => r && typeof r.timestamp === 'number')
      .map(r => ({ ...r, timestamp: toMs(r.timestamp) }))
    const years = new Set(allData.value.map(d => new Date(d.timestamp).getFullYear()))
    availableYears.value = Array.from(years).sort((a, b) => b - a)
    selectedYear.value = availableYears.value[0] ?? new Date().getFullYear()
    updateChart()
  } catch (err) {
    console.error('โหลดข้อมูลไม่สำเร็จ:', err)
    chartOptions.value = null
  }
}

function updateChart() {
  if (!allData.value.length) {
    chartOptions.value = null
    return
  }
  const year = selectedYear.value
  const yearData = allData.value.filter(d => new Date(d.timestamp).getFullYear() === year)
  const data = yearData.map(d => [
    new Date(d.timestamp).toISOString().split('T')[0],
    d.pm25 ?? 0
  ])
  chartOptions.value = {
    title: { show: false },
    tooltip: { confine: true, formatter: (p: any) => `${p.value[0]}<br/>PM2.5: ${p.value[1] ?? '-'}` },
    visualMap: {
      min: 0, max: 150, calculable: true, orient: 'horizontal', left: 'center', top: 0,
      inRange: { color: ['#00e400', '#ffff00', '#ff7e00', '#ff0000', '#8f3f97', '#7e0023'] }
    },
    calendar: {
      top: 50, left: 10, right: 10, cellSize: ['auto', 16],
      range: [`${year}-01-01`, `${year}-12-31`],
      itemStyle: { borderWidth: 0.5, borderColor: '#e5e7eb' }, yearLabel: { show: false }
    },
    series: [{ type: 'heatmap', coordinateSystem: 'calendar', data }]
  }
}
</script>
