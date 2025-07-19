<template>
  <div class="chart-container">
    <div class="controls">
      <input 
        v-model="selectedProvince" 
        list="province-list" 
        @input="filterData" 
        placeholder="ค้นหาจังหวัด..." 
        class="province-input"
      />
      <datalist id="province-list">
        <option v-for="province in uniqueProvinces" :key="province" :value="province"></option>
      </datalist>
    </div>
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch, onUnmounted } from 'vue';
import { useColorSettings } from '@/utils/useColorSettings';
import * as echarts from 'echarts';

const conifg = useRuntimeConfig();
const BASE_YEAR_API = conifg.oneyear;

const chart = ref<HTMLElement | null>(null);
const chartInstance = ref<echarts.ECharts | null>(null);
const { colorRanges } = useColorSettings(); 
const selectedProvince = ref('');
const chartData = ref<any>([]);
const isLoading = ref(false);
const error = ref('');

const uniqueProvinces = computed(() => {
  return [...new Set(chartData.value.map((item: any) => item.address))];
});

async function fetchChartData() {
  try {
    isLoading.value = true;
    error.value = '';
    
    // Update the API endpoint to match the backend
    const response = await fetch(`{BASE_YEAR_API}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors' // Add CORS mode
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('API endpoint not found. Please check if the backend server is running.');
      } else if (response.status === 503) {
        throw new Error('Service temporarily unavailable. Please try again in a few moments.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Raw API response:', data);
    
    if (data.data) {
      // Transform the data to ensure it has the correct date format
      chartData.value = data.data.map((item: any) => ({
        ...item,
        date: item.date || item.DDate || new Date().toISOString().split('T')[0]
      }));
      updateChart();
    } else {
      throw new Error('Invalid response format: missing data array');
    }
  } catch (error) {
    console.error('Error fetching chart data:', error);
    error.value = error instanceof Error ? error.message : 'Failed to load data. Please check if the backend server is running.';
  } finally {
    isLoading.value = false;
  }
}

function filterData() {
  if (!selectedProvince.value) {
    updateChart();
    return;
  }
  updateChart();
}

function updateChart() {
  if (!chart.value) {
    console.error('Chart container not found');
    return;
  }
  
  if (!chartInstance.value) {
    chartInstance.value = echarts.init(chart.value);
  }

  // Get the date range for the last year
  const now = new Date();
  const startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  // Filter data based on selected province if any
  const filteredData = selectedProvince.value
    ? chartData.value.filter((item: any) => item.address === selectedProvince.value)
    : chartData.value;

  // Transform data for calendar heatmap
  const heatmapData = filteredData.map((item: any) => [
    new Date(item.date).getTime(),
    0,
    item.avg_pm25
  ]);

  const option = {
    title: {
      top: 30,
      left: 'center',
      text: 'PM2.5 Calendar Heatmap'
    },
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const date = new Date(params.data[0]);
        const formattedDate = date.toLocaleDateString();
        return `Date: ${formattedDate}<br/>PM2.5: ${params.data[2]} µg/m³`;
      }
    },
    visualMap: {
      min: 0,
      max: 150,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      pieces: colorRanges.value.map(range => ({
        min: range.min,
        max: range.max,
        color: range.color
      }))
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: [startDate.getTime(), now.getTime()],
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: false }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: heatmapData
    }
  };

  try {
    chartInstance.value.setOption(option);
  } catch (e) {
    console.error('Error setting chart option:', e);
    error.value = 'Error displaying chart. Please try refreshing the page.';
  }
}

// Handle window resize
function handleResize() {
  if (chartInstance.value) {
    chartInstance.value.resize();
  }
}

onMounted(async () => {
  await fetchChartData();
  window.addEventListener('resize', handleResize);
  // Force a resize after a short delay to ensure proper initialization
  setTimeout(() => {
    handleResize();
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
});

watch(selectedProvince, filterData);
</script>

<style scoped>
.chart-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 800px;
}

.controls {
  margin-bottom: 20px;
}

.province-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 10px;
}

.chart {
  height: 700px;
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.loading {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #666;
}

.error {
  text-align: center;
  padding: 20px;
  font-size: 18px;
  color: #ff4444;
  background-color: #ffebee;
  border-radius: 4px;
  margin-bottom: 20px;
}
</style>
