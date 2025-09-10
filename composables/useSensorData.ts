// composables/useSensorData.ts
import { ref, computed } from 'vue'
import axios from 'axios'

import { useApiBase } from '@/composables/useApiBase'
const { yakkawApi, googlemap_key } = useApiBase()

interface Device {
  deviceid: string | null
  place: string
  latitude: number | null
  longitude: number | null
  pm25: number | null
  temperature: number | null
  status: string
}


export function useSensorData() {
  const raw = ref<Device[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function load() {
    pending.value = true
    error.value = null
    try {
      const res = await axios.get<Device[]>(yakkawApi)
      raw.value = res.data.map(d => ({
        deviceid: d.deviceid,
        place: d.place,
        latitude: d.latitude,
        longitude: d.longitude,
        pm25: d.pm25,
        temperature: d.temperature,
        status: d.status
      }))
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch'
    } finally {
      pending.value = false
    }
  }

  function showMore() {
    load()
  }

  const displayedSensors = computed(() =>
    raw.value.filter(d => d.deviceid && d.pm25 != null)
  )

  function getColorByValue(pm25: number | null): string {
    if (pm25 == null) return '#ccc'
    if (pm25 <= 12) return '#10B981'    // green
    if (pm25 <= 35.4) return '#F59E0B'  // yellow
    if (pm25 <= 55.4) return '#EF4444'  // red
    return '#6B21A8'                   // purple
  }

  load()

  return { displayedSensors, showMore, getColorByValue, pending, error }
}
