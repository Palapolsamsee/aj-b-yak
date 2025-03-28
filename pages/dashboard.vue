<template>
  <div class="dashboard-container">
    <!-- Header -->
    <div class="dashboard-header">
      <h1>Air Quality Dashboard</h1>
      <div class="time-selector">
        <button 
          v-for="period in timePeriods" 
          :key="period.value"
          :class="['time-btn', { active: selectedPeriod === period.value }]"
          @click="changePeriod(period.value)"
          :disabled="isLoading"
        >
          {{ period.label }}
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="search-container">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="ค้นหาตามสถานที่..." 
        class="search-input"
        @input="filterData"
      />
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchData" class="retry-btn">Retry</button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Average PM2.5</h3>
          <div class="stat-value">{{ averagePM25 }} µg/m³</div>
          <div class="stat-trend" :class="pm25Trend">
            {{ pm25TrendValue }}
          </div>
        </div>
        <div class="stat-card">
          <h3>Average PM10</h3>
          <div class="stat-value">{{ averagePM10 }} µg/m³</div>
          <div class="stat-trend" :class="pm10Trend">
            {{ pm10TrendValue }}
          </div>
        </div>
        <div class="stat-card">
          <h3>Average AQI</h3>
          <div class="stat-value">{{ averageAQI }}</div>
          <div class="stat-trend" :class="aqiTrend">
            {{ aqiTrendValue }}
          </div>
        </div>
        <div class="stat-card">
          <h3>Temperature</h3>
          <div class="stat-value">{{ averageTemp }}°C</div>
          <div class="stat-trend" :class="tempTrend">
            {{ tempTrendValue }}
          </div>
        </div>
      </div>

      <!-- Charts Grid -->
      <div class="charts-grid">
        <!-- PM2.5 Heatmap Calendar -->
        <div class="chart-card full-width">
          <h3>PM2.5 Calendar Heatmap</h3>
          <div ref="calendarHeatmapChart" class="chart"></div>
        </div>

        <!-- PM2.5 Heatmap -->
        <div class="chart-card">
          <h3>PM2.5 Levels by Location</h3>
          <div ref="heatmapChart" class="chart"></div>
        </div>

        <!-- Time Series Chart -->
        <div class="chart-card">
          <h3>PM2.5 Trend Over Time</h3>
          <div ref="timeSeriesChart" class="chart"></div>
        </div>

        <!-- Location Distribution -->
        <div class="chart-card">
          <h3>Top Locations by PM2.5</h3>
          <div ref="locationChart" class="chart"></div>
        </div>

        <!-- AQI Distribution -->
        <div class="chart-card">
          <h3>AQI Distribution</h3>
          <div ref="aqiChart" class="chart"></div>
        </div>
      </div>

      <!-- Data Table -->
      <div class="data-table">
        <h3>Detailed Data</h3>
        <table>
          <thead>
            <tr>
              <th>Location</th>
              <th>PM2.5</th>
              <th>PM10</th>
              <th>AQI</th>
              <th>Temperature</th>
              <th>Humidity</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredSensorData" :key="item.ID">
              <td>{{ item.Address }}</td>
              <td>{{ item.PM25 }} µg/m³</td>
              <td>{{ item.PM10 }} µg/m³</td>
              <td>{{ item.AQI }}</td>
              <td>{{ item.Temperature }}°C</td>
              <td>{{ item.Humidity }}%</td>
              <td>{{ formatDate(item.DDate, item.DTime) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, watch } from 'vue';
import * as echarts from 'echarts';
import { useColorSettings } from '@/utils/useColorSettings';

const { colorRanges } = useColorSettings();

// Chart refs
const heatmapChart = ref<HTMLElement | null>(null);
const timeSeriesChart = ref<HTMLElement | null>(null);
const locationChart = ref<HTMLElement | null>(null);
const aqiChart = ref<HTMLElement | null>(null);
const calendarHeatmapChart = ref<HTMLElement | null>(null);

// Chart instances
const heatmapInstance = ref<echarts.ECharts | null>(null);
const timeSeriesInstance = ref<echarts.ECharts | null>(null);
const locationInstance = ref<echarts.ECharts | null>(null);
const aqiInstance = ref<echarts.ECharts | null>(null);
const calendarHeatmapInstance = ref<echarts.ECharts | null>(null);

// State
const selectedPeriod = ref('one_week');
const sensorData = ref<any[]>([]);
const isLoading = ref(false);
const error = ref('');
const searchQuery = ref('');

// Time periods
const timePeriods = [
  { label: '1 Week', value: 'one_week' },
  { label: '1 Month', value: 'one_month' },
  { label: '3 Months', value: 'three_months' },
  { label: '1 Year', value: 'one_year' }
];

// Computed values
const averagePM25 = computed(() => {
  if (!sensorData.value.length) return 0;
  const sum = sensorData.value.reduce((acc, item) => acc + item.PM25, 0);
  return (sum / sensorData.value.length).toFixed(1);
});

const averagePM10 = computed(() => {
  if (!sensorData.value.length) return 0;
  const sum = sensorData.value.reduce((acc, item) => acc + item.PM10, 0);
  return (sum / sensorData.value.length).toFixed(1);
});

const averageAQI = computed(() => {
  if (!sensorData.value.length) return 0;
  const sum = sensorData.value.reduce((acc, item) => acc + item.AQI, 0);
  return Math.round(sum / sensorData.value.length);
});

const averageTemp = computed(() => {
  if (!sensorData.value.length) return 0;
  const sum = sensorData.value.reduce((acc, item) => acc + item.Temperature, 0);
  return (sum / sensorData.value.length).toFixed(1);
});

// Trend calculations
const pm25Trend = computed(() => {
  if (sensorData.value.length < 2) return 'neutral';
  const current = sensorData.value[sensorData.value.length - 1].PM25;
  const previous = sensorData.value[sensorData.value.length - 2].PM25;
  return current > previous ? 'up' : current < previous ? 'down' : 'neutral';
});

const pm25TrendValue = computed(() => {
  if (sensorData.value.length < 2) return '0%';
  const current = sensorData.value[sensorData.value.length - 1].PM25;
  const previous = sensorData.value[sensorData.value.length - 2].PM25;
  const change = ((current - previous) / previous * 100).toFixed(1);
  return `${change}%`;
});

// Add PM10 trend calculations
const pm10Trend = computed(() => {
  if (sensorData.value.length < 2) return 'neutral';
  const current = sensorData.value[sensorData.value.length - 1].PM10;
  const previous = sensorData.value[sensorData.value.length - 2].PM10;
  return current > previous ? 'up' : current < previous ? 'down' : 'neutral';
});

const pm10TrendValue = computed(() => {
  if (sensorData.value.length < 2) return '0%';
  const current = sensorData.value[sensorData.value.length - 1].PM10;
  const previous = sensorData.value[sensorData.value.length - 2].PM10;
  const change = ((current - previous) / previous * 100).toFixed(1);
  return `${change}%`;
});

// Add AQI trend calculations
const aqiTrend = computed(() => {
  if (sensorData.value.length < 2) return 'neutral';
  const current = sensorData.value[sensorData.value.length - 1].AQI;
  const previous = sensorData.value[sensorData.value.length - 2].AQI;
  return current > previous ? 'up' : current < previous ? 'down' : 'neutral';
});

const aqiTrendValue = computed(() => {
  if (sensorData.value.length < 2) return '0%';
  const current = sensorData.value[sensorData.value.length - 1].AQI;
  const previous = sensorData.value[sensorData.value.length - 2].AQI;
  const change = ((current - previous) / previous * 100).toFixed(1);
  return `${change}%`;
});

// Add Temperature trend calculations
const tempTrend = computed(() => {
  if (sensorData.value.length < 2) return 'neutral';
  const current = sensorData.value[sensorData.value.length - 1].Temperature;
  const previous = sensorData.value[sensorData.value.length - 2].Temperature;
  return current > previous ? 'up' : current < previous ? 'down' : 'neutral';
});

const tempTrendValue = computed(() => {
  if (sensorData.value.length < 2) return '0%';
  const current = sensorData.value[sensorData.value.length - 1].Temperature;
  const previous = sensorData.value[sensorData.value.length - 2].Temperature;
  const change = ((current - previous) / previous * 100).toFixed(1);
  return `${change}%`;
});

// Filtered data computed property
const filteredSensorData = computed(() => {
  if (!searchQuery.value) return sensorData.value;
  const query = searchQuery.value.toLowerCase();
  return sensorData.value.filter(item => 
    item.Address.toLowerCase().includes(query)
  );
});

// Add debounce function
function debounce(fn: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function (...args: any[]) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(null, args), delay);
  };
}

// Add retry logic
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (response.status === 503) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        continue;
      }
      
      throw new Error(`HTTP error! status: ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error('Max retries reached');
}

// Update fetchData function
async function fetchData() {
  try {
    isLoading.value = true;
    error.value = '';
    
    console.log('Fetching data for period:', selectedPeriod.value);
    const response = await fetchWithRetry(
      `http://localhost:8080/api/airquality/${selectedPeriod.value}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        mode: 'cors'
      }
    );
    
    const data = await response.json();
    console.log('Received data:', data);

    if (data.data) {
      // Transform the data to match our expected format
      sensorData.value = data.data.map((item: any) => ({
        ID: Math.random(),
        Address: item.address,
        PM25: Math.round(item.avg_pm25),
        PM10: Math.round(item.avg_pm10),
        AQI: calculateAQI(item.avg_pm25),
        Temperature: 0,
        Humidity: 0,
        DDate: new Date(data.current_date).toISOString().split('T')[0],
        DTime: new Date(data.current_date).toLocaleTimeString()
      }));
      updateCharts();
    } else {
      throw new Error('Invalid response format: missing data array');
    }
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = err instanceof Error ? err.message : 'Failed to load data. Please try again later.';
  } finally {
    isLoading.value = false;
  }
}

function changePeriod(period: string) {
  selectedPeriod.value = period;
  fetchData();
}

function formatDate(date: string, time: string) {
  return `${date} ${time}`;
}

function updateCalendarHeatmap() {
  if (!calendarHeatmapChart.value) return;
  
  if (!calendarHeatmapInstance.value) {
    calendarHeatmapInstance.value = echarts.init(calendarHeatmapChart.value);
  }

  // Get the date range from the selected period
  const now = new Date();
  let startDate = new Date();
  switch (selectedPeriod.value) {
    case 'one_week':
      startDate.setDate(now.getDate() - 7);
      break;
    case 'one_month':
      startDate.setMonth(now.getMonth() - 1);
      break;
    case 'three_months':
      startDate.setMonth(now.getMonth() - 3);
      break;
    case 'one_year':
      startDate.setFullYear(now.getFullYear() - 1);
      break;
  }

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
      inRange: {
        color: ['#30b2fc', '#6dd951', '#e9db51', '#efa628', 'red']
      }
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
      data: sensorData.value.map(item => [
        new Date(item.DDate).getTime(),
        0,
        item.PM25
      ])
    }
  };

  calendarHeatmapInstance.value.setOption(option);
}

function updateHeatmap() {
  if (!heatmapChart.value) return;
  
  if (!heatmapInstance.value) {
    heatmapInstance.value = echarts.init(heatmapChart.value);
  }

  const data = sensorData.value.map((item, index) => [
    0,
    index,
    item.PM25
  ]);

  const option = {
    tooltip: {
      position: 'top',
      formatter: (params: any) => {
        const item = sensorData.value[params.data[1]];
        return `Location: ${item.Address}<br/>PM2.5: ${item.PM25} µg/m³<br/>AQI: ${item.AQI}`;
      }
    },
    grid: {
      height: '70%',
      top: '10%',
      left: '15%'
    },
    xAxis: {
      type: 'category',
      data: ['PM2.5'],
      splitArea: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: sensorData.value.map(item => item.Address),
      splitArea: {
        show: true
      },
      axisLabel: {
        formatter: (value: string) => {
          return value.length > 30 ? value.substring(0, 30) + '...' : value;
        }
      }
    },
    visualMap: {
      min: 0,
      max: 150,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '15%',
      inRange: {
        color: ['#30b2fc', '#6dd951', '#e9db51', '#efa628', 'red']
      }
    },
    series: [{
      name: 'PM2.5',
      type: 'heatmap',
      data: data,
      label: {
        show: true
      }
    }]
  };

  heatmapInstance.value.setOption(option);
}

function updateTimeSeries() {
  if (!timeSeriesChart.value) return;
  
  if (!timeSeriesInstance.value) {
    timeSeriesInstance.value = echarts.init(timeSeriesChart.value);
  }

  const option = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['PM2.5', 'PM10', 'AQI']
    },
    xAxis: {
      type: 'category',
      data: sensorData.value.map(item => item.Address),
      axisLabel: {
        formatter: (value: string) => {
          return value.length > 20 ? value.substring(0, 20) + '...' : value;
        }
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: 'PM2.5',
        type: 'bar',
        data: sensorData.value.map(item => item.PM25)
      },
      {
        name: 'PM10',
        type: 'bar',
        data: sensorData.value.map(item => item.PM10)
      },
      {
        name: 'AQI',
        type: 'line',
        data: sensorData.value.map(item => item.AQI)
      }
    ]
  };

  timeSeriesInstance.value.setOption(option);
}

function updateLocationChart() {
  if (!locationChart.value) return;
  
  if (!locationInstance.value) {
    locationInstance.value = echarts.init(locationChart.value);
  }

  const sortedData = [...sensorData.value]
    .sort((a, b) => b.PM25 - a.PM25)
    .slice(0, 10);

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    xAxis: {
      type: 'value'
    },
    yAxis: {
      type: 'category',
      data: sortedData.map(item => item.Address),
      axisLabel: {
        formatter: (value: string) => {
          return value.length > 20 ? value.substring(0, 20) + '...' : value;
        }
      }
    },
    series: [{
      name: 'PM2.5',
      type: 'bar',
      data: sortedData.map(item => item.PM25)
    }]
  };

  locationInstance.value.setOption(option);
}

function updateAQIChart() {
  if (!aqiChart.value) return;
  
  if (!aqiInstance.value) {
    aqiInstance.value = echarts.init(aqiChart.value);
  }

  const aqiRanges = [
    { min: 0, max: 50, label: 'Good' },
    { min: 51, max: 100, label: 'Moderate' },
    { min: 101, max: 150, label: 'Unhealthy for Sensitive Groups' },
    { min: 151, max: 200, label: 'Unhealthy' },
    { min: 201, max: 300, label: 'Very Unhealthy' },
    { min: 301, max: 500, label: 'Hazardous' }
  ];

  const data = aqiRanges.map(range => ({
    name: range.label,
    value: sensorData.value.filter(item => 
      item.AQI >= range.min && item.AQI <= range.max
    ).length
  }));

  const option = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [{
      name: 'AQI Distribution',
      type: 'pie',
      radius: '50%',
      data: data,
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }]
  };

  aqiInstance.value.setOption(option);
}

// Add AQI calculation function
function calculateAQI(pm25: number): number {
  // Simple AQI calculation based on PM2.5
  // This is a simplified version - you might want to use a more accurate formula
  if (pm25 <= 12) return Math.round((50/12) * pm25);
  if (pm25 <= 35.4) return Math.round(50 + (50/23.4) * (pm25 - 12));
  if (pm25 <= 55.4) return Math.round(100 + (50/20) * (pm25 - 35.4));
  if (pm25 <= 150.4) return Math.round(150 + (50/95) * (pm25 - 55.4));
  if (pm25 <= 250.4) return Math.round(200 + (50/100) * (pm25 - 150.4));
  return Math.round(300 + (200/149.6) * (pm25 - 250.4));
}

// Debounce the filterData function
const debouncedFilterData = debounce(() => {
  updateCharts();
}, 300);

function filterData() {
  debouncedFilterData();
}

function updateCharts() {
  updateCalendarHeatmap();
  updateHeatmap();
  updateTimeSeries();
  updateLocationChart();
  updateAQIChart();
}

// Update watchers to prevent duplicate fetches
watch(selectedPeriod, (newPeriod, oldPeriod) => {
  if (newPeriod !== oldPeriod) {
    fetchData();
  }
});

// Update the onMounted hook
onMounted(async () => {
  try {
    await fetchData();
    window.addEventListener('resize', handleResize);
    // Force a resize after a short delay to ensure proper initialization
    setTimeout(() => {
      handleResize();
    }, 100);
  } catch (error) {
    console.error('Error during initialization:', error);
    error.value = 'Failed to initialize dashboard. Please refresh the page.';
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  calendarHeatmapInstance.value?.dispose();
  heatmapInstance.value?.dispose();
  timeSeriesInstance.value?.dispose();
  locationInstance.value?.dispose();
  aqiInstance.value?.dispose();
});

function handleResize() {
  calendarHeatmapInstance.value?.resize();
  heatmapInstance.value?.resize();
  timeSeriesInstance.value?.resize();
  locationInstance.value?.resize();
  aqiInstance.value?.resize();
}
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.time-selector {
  display: flex;
  gap: 10px;
}

.time-btn {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.time-btn.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  margin: 10px 0;
}

.stat-trend {
  font-size: 14px;
}

.stat-trend.up {
  color: #f44336;
}

.stat-trend.down {
  color: #4CAF50;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.chart-card h3 {
  margin-bottom: 20px;
  color: #333;
  font-size: 18px;
}

.chart {
  flex: 1;
  min-height: 300px;
  width: 100%;
  background: white;
}

.data-table {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

th {
  background-color: #f5f5f5;
  font-weight: bold;
}

tr:hover {
  background-color: #f9f9f9;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-header {
    flex-direction: column;
    gap: 20px;
  }
  
  .time-selector {
    width: 100%;
    justify-content: center;
  }
  
  .chart-card {
    min-height: 350px;
  }
  
  .full-width {
    min-height: 400px;
  }
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
  text-align: center;
  color: #f44336;
}

.retry-btn {
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.retry-btn:hover {
  background-color: #45a049;
}

.time-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-container {
  margin-bottom: 20px;
  width: 100%;
}

.search-input {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.full-width {
  grid-column: 1 / -1;
  min-height: 500px;
}
</style> 