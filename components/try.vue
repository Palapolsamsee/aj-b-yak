<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import Card from 'primevue/card'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import ProgressSpinner from 'primevue/progressspinner'
import Chart from 'primevue/chart'
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Tooltip from 'primevue/tooltip'

// Optional: accept initial province/metric from parent
const props = defineProps<{ initialProvince?: string; initialMetric?: string }>()

// ---- UI State ----
const toast = useToast()
const activeTab = ref<'timeseries' | 'ranking' | 'heatmap'>('timeseries')

const province = ref<string>(props.initialProvince ?? '')
const metric = ref<string>(props.initialMetric ?? 'pm25')
const rangeType = ref<string>('24 Hour')

const metricOptions = [
  { label: 'PM2.5', value: 'pm25' },
  { label: 'PM10', value: 'pm10' },
  { label: 'AQI', value: 'aqi' },
  { label: 'Temperature', value: 'temperature' },
  { label: 'Humidity', value: 'humidity' },
]

const rangeOptions = [
  'Today',
  '24 Hour',
  '1 Week',
  '1 Month',
  '3 Month',
  '1 Year',
]

// Ranking controls
const rankDate = ref<Date>(new Date())
const rankGroup = ref<'address' | 'place' | 'province'>('address')
const rankLimit = ref<number>(10)

// ---- Data ----
const loadingTS = ref(false)
const tsError = ref<string | null>(null)
const tsPayload = ref<any>(null)

const loadingRank = ref(false)
const rankError = ref<string | null>(null)
type DailyRankingRow = {
  key: string
  avg: number | null
  rank: number
  count: number
  date?: string
  metric?: string
  group?: string
}
const rankingRows = ref<DailyRankingRow[]>([])

const loadingHeat = ref(false)
const heatError = ref<string | null>(null)
type HeatmapRow = { date: string; avg: number | null }
const heatRows = ref<HeatmapRow[]>([])

// ---- Fetchers ----
async function fetchTimeSeries() {
  loadingTS.value = true
  tsError.value = null
  try {
    const endpoint = rangeType.value === 'Today' ? '/chart/today' : '/chart/data'
    const params = new URLSearchParams()
    if (rangeType.value !== 'Today') params.set('range', rangeType.value)
    if (province.value) params.set('province', province.value)
    if (metric.value) params.set('metric', metric.value)

    const res = await $fetch(endpoint + (params.toString() ? `?${params.toString()}` : ''))
    tsPayload.value = res
  } catch (e: any) {
    tsError.value = e?.data?.error || e?.message || 'Failed to load chart data'
    toast.add({ severity: 'error', summary: 'Time-series Error', detail: tsError.value, life: 4000 })
  } finally {
    loadingTS.value = false
  }
}

async function fetchRanking() {
  loadingRank.value = true
  rankError.value = null
  try {
    const params = new URLSearchParams()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const d = rankDate.value
    const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    params.set('date', dateStr)
    params.set('metric', metric.value)
    params.set('group', rankGroup.value)
    const rawLimit = typeof rankLimit.value === 'number' ? rankLimit.value : Number(rankLimit.value)
    const safeLimit = Math.min(100, Math.max(1, Number.isFinite(rawLimit) ? rawLimit : 10))
    params.set('limit', String(safeLimit))

    const res = await $fetch<any>(`/chart/ranking/daily?${params.toString()}`)
    const rows: DailyRankingRow[] = Array.isArray(res)
      ? res
      : Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res?.items)
          ? res.items
          : []
    rankingRows.value = rows.map((row) => ({
      key: row?.key ?? '',
      avg: row?.avg != null && !Number.isNaN(Number(row.avg)) ? Number(row.avg) : null,
      rank: typeof row?.rank === 'number' ? row.rank : Number(row?.rank ?? 0),
      count: typeof row?.count === 'number' ? row.count : Number(row?.count ?? 0),
      date: row?.date,
      metric: row?.metric,
      group: row?.group,
    }))
  } catch (e: any) {
    rankError.value = e?.data?.error || e?.message || 'Failed to load ranking'
    toast.add({ severity: 'error', summary: 'Ranking Error', detail: rankError.value, life: 4000 })
  } finally {
    loadingRank.value = false
  }
}

async function fetchHeatmap() {
  loadingHeat.value = true
  heatError.value = null
  try {
    const params = new URLSearchParams()
    if (province.value) params.set('province', province.value)
    params.set('metric', metric.value)
    const res = await $fetch<any>(`/chart/heatmap/year?${params.toString()}`)
    const labels: string[] = Array.isArray(res?.labels) ? res.labels : []
    const datasets: any[] = Array.isArray(res?.datasets) ? res.datasets : []
    const rows: HeatmapRow[] = labels.map((label, idx) => {
      const values = datasets
        .map((ds) => (Array.isArray(ds?.data) && ds.data[idx] != null ? Number(ds.data[idx]) : NaN))
        .filter((v) => !Number.isNaN(v))
      const avg = values.length
        ? values.reduce((sum, val) => sum + val, 0) / values.length
        : null
      return { date: label, avg }
    })
    heatRows.value = rows
  } catch (e: any) {
    heatError.value = e?.data?.error || e?.message || 'Failed to load heatmap data'
    toast.add({ severity: 'error', summary: 'Heatmap Error', detail: heatError.value, life: 4000 })
  } finally {
    loadingHeat.value = false
  }
}

onMounted(() => {
  fetchTimeSeries()
  fetchRanking()
})

watch([rangeType, province, metric], () => {
  if (activeTab.value === 'timeseries') fetchTimeSeries()
  if (activeTab.value === 'heatmap') fetchHeatmap()
})

watch([rankDate, rankGroup, rankLimit, metric], () => {
  if (activeTab.value === 'ranking') fetchRanking()
})

watch(activeTab, (tab) => {
  if (tab === 'timeseries') fetchTimeSeries()
  else if (tab === 'ranking') fetchRanking()
  else if (tab === 'heatmap') fetchHeatmap()
})

const rankGroupHeader = computed(() => {
  switch (rankGroup.value) {
    case 'place':
      return 'Place'
    case 'province':
      return 'Province'
    default:
      return 'Address'
  }
})

// ---- Chart.js adapter ----
const timeSeriesChartData = computed(() => {
  const payload = tsPayload.value
  if (!payload) return null

  // Try to be flexible with payload shapes
  if (Array.isArray(payload?.labels) && Array.isArray(payload?.datasets)) {
    const datasets = payload.datasets
      .map((ds: any) => ({
        label: ds?.label || metricLabel(metric.value),
        data: Array.isArray(ds?.data) ? ds.data : [],
      }))
      .filter((ds: any) => Array.isArray(ds.data))
    return {
      labels: payload.labels,
      datasets: datasets.length
        ? datasets
        : [{ label: metricLabel(metric.value), data: [] }],
    }
  }
  // 1) If payload looks like { labels: [...], values: [...] }
  if (Array.isArray(payload?.labels) && Array.isArray(payload?.values)) {
    return {
      labels: payload.labels,
      datasets: [
        {
          label: metricLabel(metric.value),
          data: payload.values,
        },
      ],
    }
  }
  // 2) If payload is an array of { timestamp/value } or { time/value }
  if (Array.isArray(payload) && payload.length) {
    const labels = payload.map((r: any) => r.timestamp || r.time || r.t || r.date || '')
    const values = payload.map((r: any) => r.value ?? r.avg ?? r.mean ?? r[metric.value] ?? null)
    return {
      labels,
      datasets: [
        {
          label: metricLabel(metric.value),
          data: values,
        },
      ],
    }
  }
  // Fallback: empty
  return {
    labels: [],
    datasets: [
      { label: metricLabel(metric.value), data: [] },
    ],
  }
})

const timeSeriesChartOpts = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: true },
    tooltip: { enabled: true },
  },
  scales: {
    x: {
      ticks: { maxRotation: 0, autoSkip: true },
      grid: { display: false },
    },
    y: {
      beginAtZero: true,
      grid: { drawBorder: false },
    },
  },
}))

function metricLabel(m: string) {
  switch (m) {
    case 'pm25': return 'PM2.5 (µg/m³)'
    case 'pm10': return 'PM10 (µg/m³)'
    case 'aqi': return 'AQI'
    case 'temperature': return 'Temperature (°C)'
    case 'humidity': return 'Humidity (%)'
    default: return m
  }
}

function formatAvg(value: number | null | undefined) {
  if (value == null) return '-'
  const n = Number(value)
  if (Number.isNaN(n)) return '-'
  return n.toFixed(1)
}

// ---- Heatmap helpers ----
const groupedByMonth = computed(() => {
  const map = new Map<string, HeatmapRow[]>()
  for (const row of heatRows.value) {
    const month = (row.date || '').slice(0, 7) // YYYY-MM
    if (!map.has(month)) map.set(month, [])
    map.get(month)!.push(row)
  }
  return Array.from(map.entries()) // [ [month, rows], ... ]
})

function colorForValue(v: number | null) {
  // Tailwind-based scale (feel free to adjust thresholds)
  if (v == null) return 'bg-gray-200'
  const value = Number(v)
  if (Number.isNaN(value)) return 'bg-gray-200'
  if (metric.value === 'temperature') {
    if (value < 18) return 'bg-blue-200'
    if (value < 24) return 'bg-green-200'
    if (value < 28) return 'bg-yellow-200'
    if (value < 34) return 'bg-orange-300'
    return 'bg-red-400'
  }
  // default PM/AQI style
  if (value < 12) return 'bg-green-200'
  if (value < 25) return 'bg-lime-300'
  if (value < 37) return 'bg-yellow-200'
  if (value < 55) return 'bg-orange-300'
  if (value < 150) return 'bg-red-400'
  return 'bg-purple-400'
}

</script>

<template>
  <div class="flex flex-col gap-4">
    <!-- Controls -->
    <Card class="shadow-sm">
      <template #content>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-600">Metric</label>
            <Dropdown v-model="metric" :options="metricOptions" optionLabel="label" optionValue="value" class="w-full"/>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-600">Range</label>
            <Dropdown v-model="rangeType" :options="rangeOptions" class="w-full"/>
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-sm text-gray-600">Province (optional)</label>
            <InputText v-model="province" placeholder="e.g., Chiang Rai" class="w-full"/>
          </div>

          <div class="flex flex-col gap-1" v-if="activeTab === 'ranking'">
            <label class="text-sm text-gray-600">Date</label>
            <Calendar v-model="rankDate" dateFormat="yy-mm-dd" class="w-full"/>
          </div>

          <div class="flex items-center gap-2">
            <Button label="Refresh" icon="pi pi-refresh" @click="() => { if (activeTab==='timeseries') fetchTimeSeries(); else if(activeTab==='ranking') fetchRanking(); else fetchHeatmap(); }" />
          </div>
        </div>

        <div class="mt-3">
          <Tabs v-model:value="activeTab" class="">
            <TabList>
              <Tab value="timeseries">Time Series</Tab>
              <Tab value="ranking">Daily Ranking</Tab>
              <Tab value="heatmap">Year Heatmap</Tab>
            </TabList>
            <TabPanels>
              <!-- Time Series Panel -->
              <TabPanel value="timeseries">
                <div class="h-80">
                  <div v-if="loadingTS" class="flex justify-center items-center h-80">
                    <ProgressSpinner />
                  </div>
                  <div v-else>
                    <Chart type="line" :data="timeSeriesChartData || { labels: [], datasets: [] }" :options="timeSeriesChartOpts" class="h-80" />
                    <div v-if="tsError" class="text-red-500 mt-2 text-sm">{{ tsError }}</div>
                  </div>
                </div>
              </TabPanel>

              <!-- Ranking Panel -->
              <TabPanel value="ranking">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Group By</label>
                    <Dropdown v-model="rankGroup" :options="[{label:'Address', value:'address'},{label:'Place', value:'place'},{label:'Province', value:'province'}]" optionLabel="label" optionValue="value" class="w-full"/>
                  </div>
                  <div class="flex flex-col gap-1">
                    <label class="text-sm text-gray-600">Limit</label>
                    <InputNumber v-model="rankLimit" :min="1" :max="100" class="w-full"/>
                  </div>
                </div>

                <div v-if="loadingRank" class="flex justify-center items-center h-40">
                  <ProgressSpinner />
                </div>
                <div v-else>
                  <div v-if="!rankingRows.length" class="text-gray-500 text-sm py-6 text-center">No ranking data</div>
                  <DataTable v-else :value="rankingRows" paginator :rows="10" class="p-datatable-sm">
                    <Column field="rank" header="#" style="width: 60px" sortable></Column>
                    <Column field="key" :header="rankGroupHeader" sortable>
                      <template #body="{ data }">
                        {{ data.key || '-' }}
                      </template>
                    </Column>
                    <Column field="avg" :header="metricLabel(metric)" sortable>
                      <template #body="{ data }">
                        {{ formatAvg(data.avg) }}
                      </template>
                    </Column>
                    <Column field="count" header="Samples" sortable></Column>
                  </DataTable>
                  <div v-if="rankError" class="text-red-500 mt-2 text-sm">{{ rankError }}</div>
                </div>
              </TabPanel>

              <!-- Heatmap Panel -->
              <TabPanel value="heatmap">
                <p class="text-sm text-gray-600 mb-2">Daily averages over the last 12 months</p>
                <div v-if="loadingHeat" class="flex justify-center items-center h-40"><ProgressSpinner /></div>
                <div v-else>
                  <div v-if="!heatRows.length" class="text-gray-500 text-sm">No data</div>
                  <div v-else class="space-y-4">
                    <div v-for="([month, rows]) in groupedByMonth" :key="month" class="">
                      <div class="text-xs font-medium text-gray-600 mb-1">{{ month }}</div>
                      <div class="grid grid-cols-14 gap-1">
                        <div v-for="r in rows" :key="r.date" :class="['h-5 w-5 rounded', colorForValue(r.avg), 'hover:ring-2 hover:ring-black/10 transition']" v-tooltip="`${r.date}: ${formatAvg(r.avg)}`"></div>
                      </div>
                    </div>
                  </div>
                  <div v-if="heatError" class="text-red-500 mt-2 text-sm">{{ heatError }}</div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </template>
    </Card>

    <!-- Toast host -->
    <Toast />
  </div>
</template>

<script lang="ts">
// Register directives/components locally if not globally
export default {
  directives: { tooltip: Tooltip },
  components: { Card, Dropdown, InputText, InputNumber, Calendar, Button, DataTable, Column, ProgressSpinner, Chart, Tabs, TabList, Tab, TabPanels, TabPanel }
}
</script>

<style scoped>
/* Ensure heatmap grid shows many small squares per row */
.grid-cols-14 {
  grid-template-columns: repeat(14, minmax(0, 1fr));
}
</style>
