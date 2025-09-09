<template>
  <div class="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900">Device Management</h2>
        <button 
          @click="showMore"
          :disabled="pending"
          class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50 transition-colors duration-200"
        >
          <svg class="w-4 h-4 mr-2 inline-block" :class="{ 'animate-spin': pending }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          Load More
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex items-center justify-center py-12">
      <div class="flex items-center space-x-2 text-gray-500">
        <svg class="animate-spin w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        <span class="text-sm font-medium">Loading sensors...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-1">Failed to load sensors</h3>
        <p class="text-sm text-gray-500 mb-4">{{ error }}</p>
        <button 
          @click="showMore"
          class="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Table Content -->
    <div v-else-if="displayedSensors.length > 0" class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50/80">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Device ID</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Coordinates</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">PM2.5</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Temperature</th>
            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr 
            v-for="(sensor, index) in displayedSensors" 
            :key="sensor.deviceid"
            class="hover:bg-gray-50/50 transition-colors duration-150"
          >
            <!-- Device ID -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="w-2 h-2 rounded-full mr-3" :style="{ backgroundColor: getColorByValue(sensor.pm25) }"></div>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ sensor.deviceid }}</div>
                </div>
              </div>
            </td>

            <!-- Location -->
            <td class="px-6 py-4">
              <div>
                <div class="text-sm font-medium text-gray-900">{{ sensor.place }}</div>
              </div>
            </td>

            <!-- Coordinates -->
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900 font-mono">{{ sensor.latitude }}, {{ sensor.longitude }}</div>
            </td>

            <!-- PM2.5 -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900">{{ sensor.pm25 }}</span>
            </td>

            <!-- Temperature -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-gray-900">{{ sensor.temperature }} °C</span>
            </td>

            <!-- Status -->
            <td class="px-6 py-4 whitespace-nowrap">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
                :style="{ backgroundColor: getColorByValue(sensor.pm25) }"
              >
                Active
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="flex items-center justify-center py-12">
      <div class="text-center">
        <svg class="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 002-2m0 0V3a2 2 0 012-2h2a2 2 0 012-2"/>
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-1">No sensors found</h3>
        <p class="text-sm text-gray-500">There are no sensors to display at the moment.</p>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="displayedSensors.length > 0" class="px-6 py-3 border-t border-gray-100 bg-gray-50/30">
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>Total sensors: {{ displayedSensors.length }}</span>
        <span>Last updated: {{ new Date().toLocaleTimeString() }}</span>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { useSensorData } from '~/composables/useSensorData'

const {
  displayedSensors,
  hasMoreSensors,
  showMore,
  searchQuery,
  getColorByValue,
  pending,
  error
} = useSensorData()
</script>
