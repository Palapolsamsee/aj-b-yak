<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg font-sans">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-gray-900">
        🌍 Heatmap คุณภาพอากาศ — {{ decodeURIComponent(address) }}
      </h2>
      <NuxtLink
        to="/"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
      >
        ⬅ ย้อนกลับ
      </NuxtLink>
    </div>

    <v-chart
      v-if="chartOptions"
      class="h-[500px]"
      :option="chartOptions"
      autoresize
    />
    <p v-else class="text-gray-500">⏳ กำลังโหลดข้อมูล...</p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRoute } from "vue-router"
import VChart from "vue-echarts"

const route = useRoute()
const address = route.params.address as string

const chartOptions = ref<any>(null)

onMounted(async () => {
  // เรียก API โดย filter ด้วย address
  const res = await $fetch<{
    data: { timestamp: number; pm25: number; pm10: number; address: string }[]
  }>(
    `http://localhost:8080/api/airquality/one_year?address=${encodeURIComponent(
      address
    )}`
  )

  const xLabels = res.data.map((d) =>
    new Date(d.timestamp).toLocaleDateString("th-TH")
  )

  chartOptions.value = {
    tooltip: { position: "top" },
    grid: { height: "80%", top: "10%" },
    xAxis: {
      type: "category",
      data: xLabels,
      splitArea: { show: true }
    },
    yAxis: {
      type: "category",
      data: ["PM2.5", "PM10"],
      splitArea: { show: true }
    },
    visualMap: {
      min: 0,
      max: 150,
      calculable: true,
      orient: "horizontal",
      left: "center",
      bottom: "5%"
    },
    series: [
      {
        name: "ค่าฝุ่น",
        type: "heatmap",
        data: res.data.flatMap((d, i) => [
          [i, 0, d.pm25],
          [i, 1, d.pm10 || 0]
        ]),
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.5)" }
        }
      }
    ]
  }
})
</script>

<style>
.h-\[500px\] {
  height: 500px;
}
</style>
