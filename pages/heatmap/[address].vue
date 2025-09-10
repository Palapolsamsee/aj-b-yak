<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg font-sans">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-900">
        📅 Calendar Heatmap — {{ decodeURIComponent(address) }}
      </h2>
      <div class="flex gap-2 items-center">
        <label class="text-sm text-gray-600">เลือกปี:</label>
        <select v-model="selectedYear" @change="updateChart" class="border rounded p-1 text-sm">
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
        <NuxtLink to="/" class="text-sm text-indigo-600 hover:text-indigo-800">⬅ กลับ</NuxtLink>
      </div>
    </div>

    <v-chart
      v-if="chartOptions"
      class="h-[800px] w-full"
      :option="chartOptions"
      autoresize
    />
    <p v-else class="text-gray-500 text-center py-20">
      ⏳ กำลังโหลดข้อมูล...
    </p>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import VChart from "vue-echarts"
import * as echarts from "echarts/core"
import { CanvasRenderer } from "echarts/renderers"
import { HeatmapChart } from "echarts/charts"
import { TitleComponent, TooltipComponent, VisualMapComponent, CalendarComponent } from "echarts/components"

echarts.use([CanvasRenderer, HeatmapChart, TitleComponent, TooltipComponent, VisualMapComponent, CalendarComponent])

const route = useRoute()
const address = route.params.address as string

const chartOptions = ref<any>(null)
const allData = ref<{ timestamp: number; pm25?: number }[]>([])
const availableYears = ref<number[]>([])
const selectedYear = ref<number>(new Date().getFullYear())

const fetchData = async () => {
  const res = await $fetch<{ data: { timestamp: number; pm25?: number }[] }>(
    `http://localhost:8080/api/airquality/one_year_series?address=${encodeURIComponent(address)}`
  )
  allData.value = res.data

  // หา list ปีที่มีข้อมูล
  const years = new Set(
    res.data.map(d => new Date(d.timestamp).getFullYear())
  )
  availableYears.value = Array.from(years).sort((a, b) => b - a)

  // default เลือกปีล่าสุด
  selectedYear.value = availableYears.value[0] ?? new Date().getFullYear()

  updateChart()
}

const updateChart = () => {
  const yearData = allData.value.filter(
    d => new Date(d.timestamp).getFullYear() === selectedYear.value
  )

  const data = yearData.map(d => [
    new Date(d.timestamp).toISOString().split("T")[0],
    d.pm25 ?? 0,
  ])

  chartOptions.value = {
    title: {
      top: 30,
      left: "center",
      text: `Calendar Heatmap PM2.5 (${selectedYear.value})`,
    },
    tooltip: {
      formatter: (p: any) =>
        `${p.value[0]}<br/>PM2.5: ${p.value[1] ?? "-"} µg/m³`,
    },
    visualMap: {
      min: 0,
      max: 150,
      calculable: true,
      orient: "horizontal",
      left: "center",
      top: 65,
      inRange: {
        color: ["#00e400", "#ffff00", "#ff7e00", "#ff0000", "#8f3f97", "#7e0023"],
      },
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ["auto", 20],
      range: [`${selectedYear.value}-01-01`, `${selectedYear.value}-12-31`],
      itemStyle: { borderWidth: 0.5, borderColor: "#ccc" },
      yearLabel: { show: false },
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        data,
      },
    ],
  }
}

onMounted(fetchData)
</script>
