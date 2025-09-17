<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg font-sans">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">📋 อันดับคุณภาพอากาศ</h2>

    <div v-if="loading" class="text-gray-500">⏳ กำลังโหลด...</div>
    <div v-else-if="error" class="text-red-500">❌ {{ error }}</div>

    <ul v-else class="divide-y divide-gray-200">
      <li
        v-for="(item, index) in paginatedStations"
        :key="index"
        class="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
        @click="goToHeatmap(item.address)"
      >
        <div class="flex flex-col">
          <span class="font-medium text-gray-900">{{ item.address }}</span>
          <span class="text-sm text-gray-500">PM2.5 เฉลี่ย: {{ item.avg_pm25 }}</span>
        </div>
        <span class="text-sm font-semibold text-indigo-600">ดู Heatmap ➡</span>
      </li>
    </ul>

    <!-- Pagination controls for stations list -->
    <div class="mt-4 flex items-center justify-center gap-3" v-if="stations.length">
      <button
        class="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        :disabled="itemsToShow <= step"
        @click="itemsToShow = Math.max(step, itemsToShow - step)"
      >แสดงน้อยลง</button>
      <span class="text-xs text-gray-500">{{ Math.min(itemsToShow, stations.length) }} / {{ stations.length }}</span>
      <button
        class="px-3 py-1 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
        :disabled="itemsToShow >= stations.length"
        @click="itemsToShow = Math.min(stations.length, itemsToShow + step)"
      >แสดงเพิ่มเติม</button>
    </div>

    <!-- Inline heatmap below the list when an address is selected -->
    <div v-if="selectedAddress" class="mt-6">
      <Heatmap :key="selectedAddress" :address="selectedAddress" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue"

const stations = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const selectedAddress = ref<string | null>(null)
const itemsToShow = ref(10)
const step = 10
const paginatedStations = computed(() => stations.value.slice(0, itemsToShow.value))

const fetchData = async () => {
  try {
    const res = await $fetch<{ data: any[] }>("http://localhost:8080/api/airquality/one_week")
    stations.value = res.data.sort((a, b) => b.avg_pm25 - a.avg_pm25)
  } catch (err: any) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const goToHeatmap = (address: string) => {
  selectedAddress.value = address
}

onMounted(fetchData)
</script>
