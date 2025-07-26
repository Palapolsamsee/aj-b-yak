<template>
  <section id="map" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Air Quality Map</h2>
        <p class="text-gray-600">Monitor air quality across Thailand's major cities</p>
      </div>

      <!-- Filter Bar: Search + Dropdown -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="🔍 ค้นหาสถานที่หรือที่อยู่..."
          class="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2"
        />

        <div>
          <label for="station-count" class="mr-2 text-sm text-gray-600">จำนวนสถานีที่แสดง:</label>
          <select
            v-model="visibleCount"
            id="station-count"
            class="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option :value="4">4 สถานี</option>
            <option :value="8">8 สถานี</option>
            <option :value="12">12 สถานี</option>
            <option :value="100">แสดงทั้งหมด</option>
          </select>
        </div>
      </div>

      <!-- Map Container -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div ref="mapRef" class="h-96 w-full relative"></div>
      </div>

      <!-- Station Details -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(station, index) in filteredStations" :key="index"
             :class="[
               'rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1',
               getStationBackground(station.aqi)
             ]"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="font-bold text-white text-lg">{{ station.place }}</h4>
              <p class="text-white/80 text-sm">{{ station.timestamp }}</p>
            </div>
            <div class="text-right">
              <div class="text-3xl font-bold text-white">{{ station.aqi }}</div>
              <div class="text-white/80 text-xs">AQI</div>
            </div>
          </div>

          <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3 mb-3">
            <div class="flex justify-between items-center">
              <span class="text-white/90 text-sm">PM2.5</span>
              <span class="text-white font-semibold">{{ station.pm25 }} µg/m³</span>
            </div>
          </div>

          <div class="text-white/90 text-sm">
            {{ getAQIStatus(station.aqi) }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useApiBase } from '@/composables/useApiBase'

const { yakkawApi, googlemap_key } = useApiBase()

const mapRef = ref(null)
const map = ref(null)

interface Device {
  dvid: string;
  place: string;
  address: string;
  aqi: number;
  pm25: number;
  timestamp: string;
  latitude: number;
  longitude: number;
}

const allStations = ref<Device[]>([])
const searchQuery = ref('')
const visibleCount = ref(4)
const selectedStation = ref<Device | null>(null)

const fetchStationsFromAPI = async () => {
  try {
    const res = await fetch(yakkawApi)
    const json = await res.json()
    const raw = json.response ?? []

    allStations.value = raw
      .filter((d: any) => d.status === 'Active' && d.pm25 != null && d.latitude && d.longitude)
      .map((d: any) => ({
        dvid: d.dvid,
        place: d.place,
        address: d.address,
        aqi: d.aqi || d.av1h || 0,
        pm25: d.pm25,
        timestamp: new Date(d.timestamp).toLocaleString('th-TH'),
        latitude: d.latitude,
        longitude: d.longitude
      }))
  } catch (e) {
    console.error('โหลดข้อมูล API ล้มเหลว:', e)
  }
}

const filteredStations = computed(() => {
  return allStations.value
    .filter(station =>
      station.place.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    .slice(0, visibleCount.value)
})

const getMarkerColor = (aqi: number) => {
  if (aqi <= 50) return 'green'
  if (aqi <= 100) return 'yellow'
  if (aqi <= 150) return 'orange'
  if (aqi <= 200) return 'red'
  return 'purple'
}

const getStationBackground = (aqi: number) => {
  if (aqi <= 50) return 'bg-gradient-to-br from-green-400 to-green-600'
  if (aqi <= 100) return 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  if (aqi <= 150) return 'bg-gradient-to-br from-orange-400 to-orange-600'
  if (aqi <= 200) return 'bg-gradient-to-br from-red-400 to-red-600'
  return 'bg-gradient-to-br from-purple-400 to-purple-600'
}

const getAQIStatus = (aqi: number) => {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive'
  if (aqi <= 200) return 'Unhealthy'
  return 'Very Unhealthy'
}

const loadGoogleMaps = (apiKey: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) return resolve()
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  await fetchStationsFromAPI()
  await loadGoogleMaps(googlemap_key)

  map.value = new window.google.maps.Map(mapRef.value, {
    center: { lat: 13.7563, lng: 100.5018 },
    zoom: 6
  })

  filteredStations.value.forEach(station => {
    const marker = new window.google.maps.Marker({
      position: { lat: station.latitude, lng: station.longitude },
      map: map.value,
      title: `${station.place} - AQI ${station.aqi}`,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: getMarkerColor(station.aqi),
        fillOpacity: 1,
        strokeWeight: 1,
        strokeColor: '#ffffff'
      }
    })

    marker.addListener('click', () => {
      selectedStation.value = station
      map.value.setCenter(marker.getPosition()!)
    })
  })
})
</script>
