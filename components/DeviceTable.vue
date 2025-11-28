<template>
  <div>
    <div v-if="device">
      <p><strong>รหัสอุปกรณ์:</strong> {{ device.dvid }}</p>
      <p><strong>สถานะ:</strong> {{ device.status }}</p>
      <p><strong>ละติจูด:</strong> {{ device.latitude }}</p>
      <p><strong>ลองจิจูด:</strong> {{ device.longitude }}</p>
      <p><strong>สถานที่:</strong> {{ device.place }}</p>
      <p><strong>ที่อยู่:</strong> {{ device.address }}</p>
      <p><strong>PM 2.5:</strong> {{ device.pm25 }}</p>
      <p><strong>PM 10:</strong> {{ device.pm10 }}</p>
      <p><strong>PM 100:</strong> {{ device.pm100 }}</p>
      <p><strong>อุณหภูมิ:</strong> {{ device.temperature }} °C</p>
      <p><strong>ความชื้น:</strong> {{ device.humidity }} %</p>
      <p><strong>AQI:</strong> {{ device.aqi }}</p>
      <p><strong>สี:</strong> {{ device.color }}</p>
      <p><strong>เทรนด์:</strong> {{ device.trend }}</p>
    </div>
    <div v-else-if="error">
    </div>
    <div v-else>
      <p>กำลังโหลดข้อมูล...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useApiBase } from '@/composables/useApiBase'

const device = ref(null)
const error = ref(null)
 
const { YAKKAW_API } = useApiBase()
const fetchData = async () => {
  try {
    const response = await fetch(YAKKAW_API)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()

    // Assuming the API returns an array, we'll take the first item as an example
    if (data && data.length > 0) {
      device.value = data[0]
    } else {
      error.value = new Error('ไม่พบข้อมูลอุปกรณ์')
    }
  } catch (err) {
    error.value = err
    console.error('Error fetching data:', err)
  }
}

fetchData()
</script>
