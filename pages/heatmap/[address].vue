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

<ClientOnly>
  <component
    :is="VChart"
    v-if="chartOptions"
    class="h-[800px] w-full"
    :option="chartOptions"
    autoresize
  />
  <p v-else class="text-gray-500 text-center py-20">⏳ กำลังโหลดข้อมูล...</p>
</ClientOnly>


  </div>
</template>


<script setup lang="ts">
definePageMeta({ ssr: false })

import { ref, onMounted, computed, watch, defineAsyncComponent } from "vue"
import { useRoute } from "vue-router"
import { useRuntimeConfig } from "#imports"

// --- Lazy load VueECharts ฝั่ง client เท่านั้น ---
const VChart = defineAsyncComponent(() =>
  process.client
    ? import("vue-echarts").then(m => m.default)
    // fallback component ฝั่ง SSR (จะไม่ถูกใช้เพราะ ssr:false แล้ว แต่กันไว้ให้สมบูรณ์)
    : Promise.resolve({ render() { return null } })
)

const config = useRuntimeConfig()
const route = useRoute()
const address = route.params.address as string

const decodedAddress = computed(() => {
  try { return decodeURIComponent(address) } catch { return address }
})

type Point = { timestamp: number; pm25?: number }

const chartOptions = ref<any>(null)
const allData = ref<Point[]>([])
const availableYears = ref<number[]>([])
const selectedYear = ref<number>(new Date().getFullYear())

// แปลง timestamp ให้เป็น ms เสมอ (กันเคส API ส่งเป็นวินาที)
const toMs = (ts: number) => (ts < 1e12 ? ts * 1000 : ts)

const fetchData = async () => {
  try {
    const url = `${config.public.baseair}/one_year_series?address=${encodeURIComponent(address)}`
    const res = await $fetch<any>(url)

    // รองรับทั้ง { data: [...] } และ [...] ตรง ๆ
    const rows: Point[] = Array.isArray(res) ? res : res?.data ?? []

    allData.value = rows
      .filter(r => r && typeof r.timestamp === "number")
      .map(r => ({ ...r, timestamp: toMs(r.timestamp) }))

    const years = new Set(allData.value.map(d => new Date(d.timestamp).getFullYear()))
    availableYears.value = Array.from(years).sort((a, b) => b - a)

    selectedYear.value = availableYears.value[0] ?? new Date().getFullYear()

    updateChart()
  } catch (err) {
    console.error("โหลดข้อมูลไม่สำเร็จ:", err)
    chartOptions.value = null
  }
}

const updateChart = () => {
  if (!allData.value.length) {
    chartOptions.value = null
    return
  }

  const year = selectedYear.value
  const yearData = allData.value.filter(d => new Date(d.timestamp).getFullYear() === year)

  const data = yearData.map(d => [
    new Date(d.timestamp).toISOString().split("T")[0],
    d.pm25 ?? 0
  ])

  chartOptions.value = {
    title: {
      top: 30,
      left: "center",
      text: `Calendar Heatmap PM2.5 (${year})`
    },
    tooltip: {
      confine: true,
      formatter: (p: any) => `${p.value[0]}<br/>PM2.5: ${p.value[1] ?? "-"} µg/m³`
    },
    visualMap: {
      min: 0,
      max: 150,
      calculable: true,
      orient: "horizontal",
      left: "center",
      top: 65,
      inRange: {
        color: ["#00e400", "#ffff00", "#ff7e00", "#ff0000", "#8f3f97", "#7e0023"]
      }
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ["auto", 20],
      range: [`${year}-01-01`, `${year}-12-31`],
      itemStyle: { borderWidth: 0.5, borderColor: "#e5e7eb" },
      yearLabel: { show: false }
    },
    series: [
      {
        type: "heatmap",
        coordinateSystem: "calendar",
        data
      }
    ]
  }
}

watch(selectedYear, updateChart)

// ลงทะเบียน ECharts modules แบบ dynamic ฝั่ง client ก่อนโหลดข้อมูล
onMounted(async () => {
  if (process.client) {
    try {
      const [{ use }, { CanvasRenderer }, { HeatmapChart }, { TitleComponent, TooltipComponent, VisualMapComponent, CalendarComponent }] = await Promise.all([
        import("echarts/core"),
        import("echarts/renderers"),
        import("echarts/charts"),
        import("echarts/components")
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
      console.error("ECharts module registration failed:", e)
    }
  }
  await fetchData()
})
</script>
