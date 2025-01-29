<template>
  <div class="overflow-x-auto">
    <table class="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="px-6 py-3">Location ID</th>
          <th scope="col" class="px-6 py-3">PM2.5</th>
          <th scope="col" class="px-6 py-3">Color</th>
          <th scope="col" class="px-6 py-3">Coordinates</th>
          <th scope="col" class="px-6 py-3">สถานที่</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="data in entry" 
          :key="data.id" 
          class="border-b dark:border-gray-700"
        >
          <td class="px-6 py-4 font-medium text-gray-900 dark:text-white">
            {{ data.id }}
          </td>
          <td class="px-6 py-4">{{ data.pm25 }}</td>
          <td class="px-6 py-4">
            <span :style="{ color: getColor(data.pm25) }">
              {{ getColor(data.pm25) }}
            </span>
          </td>
          <td class="px-6 py-4">
            {{ data.lat }}, {{ data.lng }}
          </td>
          <td class="px-6 py-4">{{ data.location }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { useFetch } from "#app";
import { ref, onMounted } from "vue";

// ดึงข้อมูล PM2.5
const { data: entry } = await useFetch('/api/pm25', {
  lazy: true, // โหลดข้อมูลแบบ Lazy
});

// ตัวแปรสำหรับเก็บการตั้งค่าสี
const colorSettings = ref([]);

// โหลดการตั้งค่าจาก API
const loadSettings = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/settings");
    const data = await response.json();
    colorSettings.value = data.colorSettings || [];
  } catch (error) {
    console.error("Error loading settings:", error);
    alert("Failed to load color settings.");
  }
};

// ฟังก์ชันสำหรับหาสีตาม PM2.5
const getColor = (pm25Value) => {
  const setting = colorSettings.value.find(
    (setting) => pm25Value >= setting.min && pm25Value <= setting.max
  );
  return setting ? setting.color : "black"; // สีเริ่มต้นเป็นดำ
};

// ดึงข้อมูลเมื่อ component โหลด
onMounted(() => {
  loadSettings();
});


</script>
