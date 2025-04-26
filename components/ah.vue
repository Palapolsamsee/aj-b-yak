<template>
  <div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">Ultimate PM2.5 Chart</h1>

    <!-- Dropdown เลือกจังหวัด -->
    <div class="mb-4">
      <label for="province" class="block text-gray-700 mb-2">เลือกจังหวัด:</label>
      <select
        id="province"
        v-model="selectedProvince"
        @change="updateChart"
        class="border border-gray-300 rounded p-2 w-full"
      >
        <option value="">ทั้งหมด</option>
        <option v-for="(province, index) in provinces" :key="index" :value="province">
          {{ province }}
        </option>
      </select>
    </div>

    <!-- กราฟ EChart -->
    <client-only>
      <VChart class="w-full h-96" :option="chartOption" autoresize />
    </client-only>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import VChart from 'vue-echarts'
import axios from 'axios'

// ต้อง import renderer และ chart component ที่ต้องใช้
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'

// ลงทะเบียนส่วนที่ต้องใช้กับ ECharts
use([CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

// URL สำหรับดึงข้อมูล API
const API_URL = 'http://localhost:8080/api/chartdata';

// Reactive state สำหรับเก็บข้อมูล API และการเลือกจังหวัด
const apiData = ref([]) // ข้อมูลทั้งหมดจาก API
const selectedProvince = ref('') // จังหวัดที่เลือก
const chartOption = ref({}) // Option สำหรับ ECharts

// คำนวณรายชื่อจังหวัดที่ไม่ซ้ำจาก apiData
const provinces = computed(() => {
  const allProvinces = apiData.value.map((dataset) => dataset.label)
  return [...new Set(allProvinces)].filter((province) => province) // กรองเฉพาะที่ไม่ใช่ค่าว่าง
})

// ฟังก์ชันดึงข้อมูลจาก API
const fetchData = async () => {
  try {
    const response = await axios.get(API_URL)
    apiData.value = response.data.datasets || [] // สมมุติว่า API ส่งข้อมูลในรูปแบบ datasets
    updateChart() // อัปเดตกราฟเมื่อดึงข้อมูลสำเร็จ
  } catch (err) {
    console.error('Error fetching API data:', err)
  }
}

// ฟังก์ชันอัปเดตตัวเลือกของกราฟตามจังหวัดที่เลือก
const updateChart = () => {
  // ถ้ามีการเลือกจังหวัด ให้กรองข้อมูล มิฉะนั้นใช้ทั้งหมด
  const filteredData = selectedProvince.value
    ? apiData.value.filter((dataset) => dataset.label === selectedProvince.value)
    : apiData.value

  // ดึง labels จาก apiData (สมมุติว่า labels อยู่ใน apiData[0].labels)
  const labels = apiData.value.length > 0 ? apiData.value[0].labels : []

  // กำหนด option สำหรับ ECharts
  chartOption.value = {
    title: {
      text: selectedProvince.value ? `PM2.5 Levels in ${selectedProvince.value}` : 'PM2.5 Levels in All Provinces',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: filteredData.map((dataset) => dataset.label),
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: labels, // ใช้ labels จาก apiData
      axisLabel: {
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: {
      type: 'value',
      name: 'PM2.5 (µg/m³)'
    },
    series: filteredData.map((dataset) => ({
      name: dataset.label,
      type: 'line',
      data: dataset.data,
      smooth: true, // ทำให้เส้นโค้ง
      lineStyle: {
        width: 2
      },
      itemStyle: {
        color: getRandomColor() // ใช้สีสุ่มสำหรับแต่ละเส้น
      }
    }))
  }
}

// ฟังก์ชันสุ่มสีสำหรับแต่ละเส้น
const getRandomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

// ดึงข้อมูล API เมื่อ component ถูก mounted
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.container {
  max-width: 1000px;
}
</style>