<!-- <template>
  <div class="relative w-full h-[600px]">
    <!-- Map -->
    <div id="map" class="w-full h-full rounded-xl overflow-hidden"></div>

    <!-- Floating Widget -->
    <Card
      class="absolute top-4 left-1/2 -translate-x-1/2 w-80"
      shadow
      rounded
      elevated
    >
      <CardHeader>
        <CardTitle class="text-center text-base font-semibold">
          วันนี้อากาศเป็นอย่างไร?
        </CardTitle>
        <CardSubtitle class="text-xs text-gray-500 text-center">
          ข้อมูลค่า PM2.5 เฉลี่ย 24 ชั่วโมง
        </CardSubtitle>
      </CardHeader>

      <CardContent>
        <!-- Location -->
        <div class="flex items-center justify-center text-sm text-gray-600 mb-3">
          <Icon name="map-pin" class="text-sky-500 mr-1" />
          {{ currentData.location }}
        </div>

        <!-- Main Info -->
        <div class="flex items-center justify-between bg-sky-50 rounded-md p-3 mb-3">
          <Badge
            variant="outline"
            color="sky"
            size="sm"
          >
            {{ getAQIStatus(currentData.aqi) }}
          </Badge>

          <div class="flex items-end gap-1">
            <span class="text-2xl font-bold text-sky-600">{{ currentData.pm25 }}</span>
            <span class="text-xs text-gray-500">µg/m³</span>
          </div>
        </div>

        <!-- Weather -->
        <div class="flex justify-around text-xs text-gray-600 mb-3">
          <div class="flex flex-col items-center">
            🌤️ <span>{{ weather.temp }}°C</span>
          </div>
          <div class="flex flex-col items-center">
            💧 <span>{{ weather.humidity }}%</span>
          </div>
          <div class="flex flex-col items-center">
            🌬️ <span>{{ weather.wind }} กม./ชม.</span>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex justify-center">
        <Button
          variant="solid"
          color="sky"
          size="sm"
          icon="download"
        >
          ดาวน์โหลดรายงาน (PDF)
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardSubtitle, CardContent, CardFooter } from "intuitive-vue/card"
import { Button } from "intuitive-vue/button"
import { Badge } from "intuitive-vue/badge"
import { Icon } from "intuitive-vue/icon"

import { useApiBase } from '@/composables/useApiBase'

interface Device {
  dvid: string
  place: string
  latitude: number
  longitude: number
  status?: string
  pm25?: number
  aqi?: number
}

const { yakkawApi } = useApiBase()

const currentData = ref({
  location: 'ไม่ทราบ',
  pm25: 0,
  aqi: 0,
})

const weather = ref({
  temp: 30,
  humidity: 50,
  wind: 2.3,
})

const getAQI = (pm25: number): number => {
  if (pm25 <= 12) return 50
  if (pm25 <= 35.4) return 100
  if (pm25 <= 55.4) return 150
  if (pm25 <= 150.4) return 200
  return 300
}

function getAQIStatus(aqi: number) {
  if (aqi <= 50) return 'ดีมาก'
  if (aqi <= 100) return 'ปานกลาง'
  if (aqi <= 150) return 'อ่อนไหวควรระวัง'
  if (aqi <= 200) return 'ไม่ดีต่อสุขภาพ'
  return 'อันตราย'
}

onMounted(async () => {
  const res = await fetch(`${yakkawApi}`)
  const json = await res.json()
  const allDevices = Array.isArray(json.response) ? json.response : []
  const devices = allDevices.filter((d: Device) => d.status === 'Active')

  if (devices.length > 0) {
    const closest = devices[0]
    currentData.value = {
      location: closest.place,
      pm25: closest.pm25 ?? 0,
      aqi: closest.aqi && closest.aqi > 0 ? closest.aqi : getAQI(closest.pm25 ?? 0),
    }
  }
})
</script> -->
