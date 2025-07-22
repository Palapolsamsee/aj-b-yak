<template>
  <section id="map" class="py-16 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">Air Quality Map</h2>
        <p class="text-gray-600">Monitor air quality across Thailand's major cities</p>
      </div>

      <!-- Map Container -->
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
        <div class="h-96 bg-gradient-to-br from-blue-100 to-green-100 relative">
          <!-- Placeholder for Google Maps -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-4xl mb-4">🗺️</div>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">Interactive Map</h3>
              <p class="text-gray-500">Google Maps integration would be implemented here</p>
            </div>
          </div>

          <!-- Sample location markers -->
          <div v-for="(station, index) in stations" :key="index" 
               :class="[
                 'absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform hover:scale-125 transition-transform',
                 getMarkerColor(station.aqi)
               ]"
               :style="{ top: station.y + '%', left: station.x + '%' }"
               @click="selectedStation = station"
          ></div>
        </div>
      </div>

      <!-- Station Details -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="(station, index) in stations" :key="index" 
             :class="[
               'rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow cursor-pointer transform hover:-translate-y-1',
               getStationBackground(station.aqi)
             ]"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h4 class="font-bold text-white text-lg">{{ station.city }}</h4>
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

<script setup>
// Mock station data
const stations = ref([
  {
    city: 'Bangkok',
    aqi: 87,
    pm25: 32,
    timestamp: '10 mins ago',
    x: 60,
    y: 70
  },
  {
    city: 'Chiang Mai',
    aqi: 134,
    pm25: 58,
    timestamp: '5 mins ago',
    x: 45,
    y: 25
  },
  {
    city: 'Phuket',
    aqi: 45,
    pm25: 18,
    timestamp: '15 mins ago',
    x: 35,
    y: 85
  },
  {
    city: 'Pattaya',
    aqi: 76,
    pm25: 28,
    timestamp: '8 mins ago',
    x: 65,
    y: 75
  }
])

const selectedStation = ref(null)

const getMarkerColor = (aqi) => {
  if (aqi <= 50) return 'bg-green-500'
  if (aqi <= 100) return 'bg-yellow-500'
  if (aqi <= 150) return 'bg-orange-500'
  if (aqi <= 200) return 'bg-red-500'
  return 'bg-purple-500'
}

const getStationBackground = (aqi) => {
  if (aqi <= 50) return 'bg-gradient-to-br from-green-400 to-green-600'
  if (aqi <= 100) return 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  if (aqi <= 150) return 'bg-gradient-to-br from-orange-400 to-orange-600'
  if (aqi <= 200) return 'bg-gradient-to-br from-red-400 to-red-600'
  return 'bg-gradient-to-br from-purple-400 to-purple-600'
}

const getAQIStatus = (aqi) => {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive'
  if (aqi <= 200) return 'Unhealthy'
  return 'Very Unhealthy'
}
</script>