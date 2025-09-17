<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg font-sans">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-900">
        📅 Calendar Heatmap — {{ decodedAddress }}
      </h2>
      <div class="flex gap-2 items-center">
        <NuxtLink to="/" class="text-sm text-indigo-600 hover:text-indigo-800">⬅ กลับ</NuxtLink>
      </div>
    </div>

    <!-- Reuse Static component to render the heatmap -->
    <Static :address="addressParam" />

  </div>
</template>

<script setup lang="ts">
// Disable SSR for this page since it relies on client-side charts
definePageMeta({ ssr: false })

import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const DEFAULT_ADDRESS = 'ต.พญาเม็งราย อ.พญาเม็งราย จ.เชียงราย'

// Use the dynamic route param as an encoded address; fall back to a default
const addressParam = computed(() => {
  const raw = route.params.address as string | undefined
  if (!raw || raw === 'undefined' || raw === 'null' || raw.trim() === '') {
    return encodeURIComponent(DEFAULT_ADDRESS)
  }
  return raw
})

const decodedAddress = computed(() => {
  const a = addressParam.value
  try { return decodeURIComponent(a) } catch { return a }
})
</script>

