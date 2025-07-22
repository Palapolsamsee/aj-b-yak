<template>
  <section id="advice" class="py-16 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold text-gray-900 mb-4">AQI Health Guide</h2>
        <p class="text-gray-600">Learn how different air quality levels affect your health</p>
      </div>

      <div class="grid gap-6">
        <div v-for="(level, index) in aqiLevels" :key="index"
             :class="[
               'rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1',
               level.bgClass
             ]"
        >
          <div class="flex items-start space-x-4">
            <div class="text-4xl">{{ level.emoji }}</div>
            <div class="flex-1">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <div>
                  <h3 class="text-xl font-bold text-white mb-1">{{ level.title }}</h3>
                  <p class="text-white/90 text-sm">AQI Range: {{ level.range }}</p>
                </div>
                <div class="mt-2 md:mt-0">
                  <span class="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold">
                    {{ level.status }}
                  </span>
                </div>
              </div>
              
              <div class="grid md:grid-cols-2 gap-4">
                <div class="bg-white/15 backdrop-blur-sm rounded-lg p-4">
                  <h4 class="font-semibold text-white mb-2">👥 Who's Affected</h4>
                  <p class="text-white/90 text-sm">{{ level.affected }}</p>
                </div>
                <div class="bg-white/15 backdrop-blur-sm rounded-lg p-4">
                  <h4 class="font-semibold text-white mb-2">🏃‍♂️ Recommended Actions</h4>
                  <p class="text-white/90 text-sm">{{ level.actions }}</p>
                </div>
              </div>
              
              <div class="mt-4 bg-white/15 backdrop-blur-sm rounded-lg p-4">
                <h4 class="font-semibold text-white mb-2">💡 Health Tips</h4>
                <ul class="text-white/90 text-sm space-y-1">
                  <li v-for="tip in level.tips" :key="tip" class="flex items-start">
                    <span class="text-white/60 mr-2">•</span>
                    {{ tip }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const aqiLevels = ref([
  {
    title: 'Good',
    range: '0-50',
    status: 'Excellent',
    emoji: '😊',
    bgClass: 'bg-gradient-to-br from-green-400 to-green-600',
    affected: 'No one affected',
    actions: 'Perfect time for outdoor activities and exercise',
    tips: [
      'Enjoy outdoor activities without restriction',
      'Great air quality for jogging and cycling',
      'Windows can be kept open for fresh air'
    ]
  },
  {
    title: 'Moderate',
    range: '51-100',
    status: 'Acceptable',
    emoji: '🙂',
    bgClass: 'bg-gradient-to-br from-yellow-400 to-yellow-600',
    affected: 'Unusually sensitive people may experience minor symptoms',
    actions: 'Normal outdoor activities are fine for most people',
    tips: [
      'Most people can enjoy outdoor activities normally',
      'Sensitive individuals should monitor their symptoms',
      'Consider reducing prolonged outdoor exertion if sensitive'
    ]
  },
  {
    title: 'Unhealthy for Sensitive Groups',
    range: '101-150',
    status: 'Caution',
    emoji: '😐',
    bgClass: 'bg-gradient-to-br from-orange-400 to-orange-600',
    affected: 'Children, elderly, and people with heart/lung conditions',
    actions: 'Sensitive groups should limit prolonged outdoor activities',
    tips: [
      'Reduce outdoor exercise if you have respiratory issues',
      'Keep windows closed during peak pollution hours',
      'Consider wearing N95 masks outdoors if sensitive'
    ]
  },
  {
    title: 'Unhealthy',
    range: '151-200',
    status: 'Warning',
    emoji: '😷',
    bgClass: 'bg-gradient-to-br from-red-400 to-red-600',
    affected: 'Everyone may experience health effects',
    actions: 'Avoid prolonged outdoor activities, especially exercise',
    tips: [
      'Limit time outdoors, especially for exercise',
      'Use air purifiers indoors if available',
      'Wear N95 masks when going outside',
      'Keep indoor air clean and well-filtered'
    ]
  },
  {
    title: 'Very Unhealthy',
    range: '201-300',
    status: 'Emergency',
    emoji: '🚨',
    bgClass: 'bg-gradient-to-br from-purple-400 to-purple-600',
    affected: 'Serious health effects for everyone',
    actions: 'Avoid all outdoor activities and stay indoors',
    tips: [
      'Stay indoors with doors and windows closed',
      'Use air purifiers and avoid outdoor air',
      'Seek medical attention if experiencing symptoms',
      'Cancel all outdoor events and activities'
    ]
  }
])
</script>