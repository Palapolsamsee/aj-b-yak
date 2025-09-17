<template>
  <div class="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg font-sans">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-900">
        📅 Calendar Heatmap — {{ decodedAddress }}
      </h2>
    </div>

    <!-- Reuse Static component to render the heatmap; allow inner list to change address -->
    <Static :address="currentAddress" @change-address="onChangeAddress" />

  </div>
</template>


<script setup lang="ts">
import { computed, ref, watch } from "vue"

// Accept an optional address prop; fallback to a default address
const props = defineProps<{ address?: string }>()

const DEFAULT_ADDRESS = 'ต.พญาเม็งราย อ.พญาเม็งราย จ.เชียงราย'

// Maintain a local, mutable address so inner clicks can update it
const currentAddress = ref<string>('')

function setInitialAddress() {
  const raw = (props.address ?? '').trim()
  currentAddress.value = raw.length ? raw : DEFAULT_ADDRESS
}
setInitialAddress()

// Keep currentAddress in sync if parent changes the prop
watch(() => props.address, (val) => {
  if (val && val !== currentAddress.value) {
    currentAddress.value = val
  }
})

// Decode for display; Static will handle encoding for requests
const decodedAddress = computed(() => {
  const a = currentAddress.value
  try { return decodeURIComponent(a) } catch { return a }
})

function onChangeAddress(addr: string) {
  currentAddress.value = addr
}
</script>
