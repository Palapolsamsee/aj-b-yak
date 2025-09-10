<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg font-sans">
    <h2 class="text-2xl font-bold text-gray-900 mb-4">📋 อันดับคุณภาพอากาศ</h2>

    <div v-if="loading" class="text-gray-500">⏳ กำลังโหลด...</div>
    <div v-else-if="error" class="text-red-500">❌ {{ error }}</div>

    <ul v-else class="divide-y divide-gray-200">
      <li
        v-for="(item, index) in stations"
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

const stations = ref<any[]>([])
const loading = ref(true)
const error = ref<string | null>(null)
const router = useRouter()

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
  router.push(`/heatmap/${encodeURIComponent(address)}`)
}

onMounted(fetchData)
</script>
