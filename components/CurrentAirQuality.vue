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

<script setup>
// Mock data - in real app, this would come from API
const currentData = ref({
  location: 'Bangkok, Thailand',
  aqi: 87,
  pm25: 32,
  timestamp: new Date().toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

const trendData = ref({
  average: 75,
  highest: 112,
  lowest: 45
})

const globalRank = ref(82)

const getAQIBackground = (aqi) => {
  if (aqi <= 50) return 'bg-gradient-to-br from-green-400 to-green-600'
  if (aqi <= 100) return 'bg-gradient-to-br from-yellow-400 to-yellow-600'
  if (aqi <= 150) return 'bg-gradient-to-br from-orange-400 to-orange-600'
  if (aqi <= 200) return 'bg-gradient-to-br from-red-400 to-red-600'
  return 'bg-gradient-to-br from-purple-400 to-purple-600'
}

const getAQIStatus = (aqi) => {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
  if (aqi <= 200) return 'Unhealthy'
  return 'Very Unhealthy'
}

const getHealthAdvice = (aqi) => {
  if (aqi <= 50) return 'Air quality is good. Perfect for outdoor activities!'
  if (aqi <= 100) return 'Air quality is acceptable for most people. Sensitive individuals should consider reducing outdoor exertion.'
  if (aqi <= 150) return 'Sensitive groups should limit outdoor activities. Others can enjoy outdoor activities normally.'
  if (aqi <= 200) return 'Everyone should limit outdoor activities, especially children and elderly.'
  return 'Avoid outdoor activities. Stay indoors with air purifiers if possible.'
}
</script>