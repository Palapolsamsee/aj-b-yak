<template>
    <div class="container mx-auto p-4">
      <!-- ช่องค้นหา -->
      <div class="mb-4">
        <input 
          v-model="searchQuery" 
          placeholder="ค้นหาสถานที่" 
          class="w-full px-3 py-2 border rounded-lg"
        />
      </div>
  
      <div v-if="loading" class="text-center">กำลังโหลด...</div>
      <div v-else-if="error" class="text-red-500">{{ error }}</div>
      <div v-else-if="filteredDevices.length === 0" class="text-center text-gray-500">
        ไม่พบข้อมูล
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div 
          v-for="device in filteredDevices" 
          :key="device.dvid" 
          class="bg-white shadow-md rounded-lg p-4 border cursor-pointer hover:bg-gray-100"
          @click="selectDevice(device)"
        >
          <h2 class="text-xl font-bold mb-2">อุปกรณ์: {{ device.dvid }}</h2>
          <p class="text-gray-600">สถานที่: {{ device.place }}</p>
        </div>
      </div>
  
      <!-- Modal สำหรับแสดงรายละเอียด (เหมือนเดิม) -->
      <div 
        v-if="selectedDevice" 
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        @click.self="selectedDevice = null"
      >
        <div 
          class="bg-white rounded-lg p-6 max-w-md w-full"
          @click.stop
        >
          <h2 class="text-2xl font-bold mb-4">รายละเอียดอุปกรณ์</h2>
          <div class="space-y-2">
            <p><strong>รหัสอุปกรณ์:</strong> {{ selectedDevice.dvid }}</p>
            <p><strong>สถานที่:</strong> {{ selectedDevice.place }}</p>
            <p><strong>สถานะ:</strong> {{ selectedDevice.status || 'ไม่ระบุ' }}</p>
            <p><strong>พิกัด:</strong> {{ selectedDevice.latitude }}, {{ selectedDevice.longitude }}</p>
            <p><strong>วันที่ติดตั้ง:</strong> {{ selectedDevice.installDate || 'ไม่ระบุ' }}</p>
          </div>
          <button 
            class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            @click="selectedDevice = null"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue'
  
  interface Device {
    dvid: string
    place: string
    status?: string
    latitude?: number
    longitude?: number
    installDate?: string
    [key: string]: any
  }
  
  const devices = ref<Device[]>([])
  const loading = ref(true)
  const error = ref<string | null>(null)
  const selectedDevice = ref<Device | null>(null)
  const searchQuery = ref('')
  
  // กรองอุปกรณ์ตามคำค้นหา
  const filteredDevices = computed(() => {
    if (!searchQuery.value) return devices.value
    
    return devices.value.filter(device => 
      device.place.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  })
  
  const selectDevice = (device: Device) => {
    selectedDevice.value = device
  }
  
  onMounted(async () => {
    try {

      const apikey ='blank'

      const response = await fetch(apikey)
      console.log(response)
    
      if (!response.ok) {
        throw new Error('ไม่สามารถโหลดข้อมูลได้')
      }
      const res1 = await response.json()
      console.log(res1)
      devices.value = await res1.response;

      loading.value = false
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'เกิดข้อผิดพลาด'
      loading.value = false
    }
  })
  </script>