<template>
  <!--
    Wrapper around Static heatmap component.
    - Renders station ranking (worst → best)
    - Click on a row to switch the heatmap station
  -->
  <Static :address="currentAddress" @change-address="onChangeAddress" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

defineOptions({ name: 'Heatmap' })

// Optional initial address; falls back to default if empty
const props = defineProps<{ address?: string }>()

const DEFAULT_ADDRESS = 'ต.พญาเม็งราย อ.พญาเม็งราย จ.เชียงราย'

// Local state so clicks from child can update the current address
const currentAddress = ref<string>('')

function setInitialAddress() {
  const raw = (props.address ?? '').trim()
  currentAddress.value = raw ? raw : DEFAULT_ADDRESS
}
setInitialAddress()

// Keep in sync when parent changes the prop
watch(() => props.address, (val) => {
  if (typeof val === 'string' && val.trim() && val !== currentAddress.value) {
    currentAddress.value = val
  }
})

function onChangeAddress(addr: string) {
  currentAddress.value = addr
}
</script>
