<template>
  <section id="data" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Current Air Quality</h2>
        <p class="text-gray-600">Real-time data from your current location</p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Current Location Card -->
        <div class="lg:col-span-2">
          <div 
            :class="[
              'p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300',
              getAQIBackground(currentData.aqi)
            ]"
          >
            <div class="flex items-center justify-between mb-6">
              <div>
                <h3 class="text-2xl font-bold text-white mb-2">{{ currentData.location }}</h3>
                <p class="text-white/80">{{ currentData.timestamp }}</p>
              </div>
              <div class="text-right">
                <div class="text-4xl font-bold text-white">{{ currentData.aqi }}</div>
                <div class="text-white/80 text-sm">AQI</div>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div class="text-white/80 text-sm mb-1">PM2.5</div>
                <div class="text-2xl font-bold text-white">{{ currentData.pm25 }}</div>
                <div class="text-white/60 text-xs">µg/m³</div>
              </div>
              <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                <div class="text-white/80 text-sm mb-1">Status</div>
                <div class="text-lg font-semibold text-white">{{ getAQIStatus(currentData.aqi) }}</div>
              </div>
            </div>
            
            <div class="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <h4 class="font-semibold text-white mb-2">Health Recommendation</h4>
              <p class="text-white/90 text-sm">{{ getHealthAdvice(currentData.aqi) }}</p>
            </div>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="space-y-6">
          <div class="bg-gray-50 rounded-2xl p-6">
            <h4 class="font-semibold text-gray-900 mb-4">24h Trend</h4>
            <div class="space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Average</span>
                <span class="font-semibold">{{ trendData.average }} AQI</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Highest</span>
                <span class="font-semibold text-red-600">{{ trendData.highest }} AQI</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Lowest</span>
                <span class="font-semibold text-green-600">{{ trendData.lowest }} AQI</span>
              </div>
            </div>
          </div>
          
          <div class="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6">
            <h4 class="font-semibold mb-2">🌍 Global Rank</h4>
            <p class="text-sm mb-3">Thailand ranks #{{ globalRank }} in air quality globally</p>
            <div class="text-2xl font-bold">#{{ globalRank }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useApiBase } from '@/composables/useApiBase'

interface Device {
  dvid: string
  place: string
  latitude: number
  longitude: number
  status?: string
  pm25?: number
  aqi?: number
  timestamp?: number
}

const { yakkawApi } = useApiBase()

const devices = ref<Device[]>([])
const currentData = ref({
  location: 'Unknown',
  aqi: 0,
  pm25: 0,
  timestamp: '',
})

const trendData = ref({
  average: 0,
  highest: 0,
  lowest: 0
})

const globalRank = ref(82)

const getAQI = (pm25: number): number => {
  if (pm25 <= 12) return 50
  if (pm25 <= 35.4) return 100
  if (pm25 <= 55.4) return 150
  if (pm25 <= 150.4) return 200
  return 300
}

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (value: number) => value * Math.PI / 180
  const R = 6371
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

onMounted(async () => {
  try {
    const res = await fetch(`${yakkawApi}`)
    const json = await res.json()
    const allDevices = Array.isArray(json.response) ? json.response : []
    devices.value = allDevices.filter((d: Device) => d.status === 'Active')

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords

        let closest: Device | null = null
        let minDist = Infinity

        for (const device of devices.value) {
          if (device.latitude && device.longitude && device.pm25 != null) {
            const dist = getDistance(latitude, longitude, device.latitude, device.longitude)
            if (dist < minDist) {
              minDist = dist
              closest = device
            }
          }
        }

        if (closest) {
          const aqi = closest.aqi && closest.aqi > 0 ? closest.aqi : getAQI(closest.pm25 ?? 0)
          const date = new Date(closest.timestamp ?? Date.now())

          currentData.value = {
            location: closest.place,
            aqi,
            pm25: closest.pm25 ?? 0,
            timestamp: date.toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
          }

          trendData.value = {
            average: Math.round((aqi + 70) / 2),
            highest: aqi + 20,
            lowest: Math.max(10, aqi - 30)
          }
        }
      }, err => {
        console.warn('ไม่สามารถใช้ตำแหน่งได้', err)
      })
    }
  } catch (e) {
    console.error('โหลดข้อมูลไม่สำเร็จ', e)
  }
})

const getAQIBackground = (aqi: number) => {
  if (aqi <= 50) return 'bg-gradient-to-br from-green-400 to-green-600'
  if (aqi <= 100) return 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  if (aqi <= 150) return 'bg-gradient-to-br from-orange-400 to-orange-600'
  if (aqi <= 200) return 'bg-gradient-to-br from-red-400 to-red-600'
  return 'bg-gradient-to-br from-purple-400 to-purple-600'
}

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
  if (aqi <= 200) return 'Unhealthy'
  return 'Very Unhealthy'
}

const getHealthAdvice = (aqi: number) => {
  if (aqi <= 50) return 'Air quality is good. Perfect for outdoor activities!'
  if (aqi <= 100) return 'Air quality is acceptable for most people. Sensitive individuals should consider reducing outdoor exertion.'
  if (aqi <= 150) return 'Sensitive groups should limit outdoor activities. Others can enjoy outdoor activities normally.'
  if (aqi <= 200) return 'Everyone should limit outdoor activities, especially children and elderly.'
  return 'Avoid outdoor activities. Stay indoors with air purifiers if possible.'
}
</script>
