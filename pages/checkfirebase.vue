<script setup lang="ts">
import { useApiBase } from '~/composables/useApiBase'

const { fetchColorRanges } = useApiBase()
const colorRanges = ref([])

onMounted(async () => {
  colorRanges.value = await fetchColorRanges()
})
</script>

<template>
  <div class="p-6">
    <h2 class="text-2xl font-bold mb-4">Color Ranges</h2>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div
        v-for="color in colorRanges"
        :key="color.id"
        class="p-4 rounded-lg shadow text-white"
        :style="{ backgroundColor: color.color }"
      >
        <h3 class="text-lg font-semibold">{{ color.name }}</h3>
        <p class="text-sm">Min: {{ color.min }}</p>
        <p class="text-sm">Max: {{ color.max }}</p>
        <p class="text-sm">Color: {{ color.color }}</p>
      </div>
    </div>
  </div>
</template>
