<template>
  <div class="section-header text-center mt-8 pt-22"> <!-- Add padding-top here -->
    <h2 class="text-4xl font-bold mb-6">แบบรายงานสถานการณ์คุณภาพอากาศ</h2>
  </div>

  <div class="mt-12"></div>

  <div class="fixed left-0 bottom-12 mb-4 ml-4">
    <button @click="toggleLanguage"
      class="relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">

      <!-- Switch Languages Icon -->
      <svg class="w-6 h-6 absolute transition-opacity duration-300 text-white scale-150"
        :class="lang === 'th' ? 'opacity-100' : 'opacity-0'" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M5 14L5.90909 11.3333M11 14L9.90909 11.3333M9.90909 11.3333L7.72727 6L5.90909 11.3333M9.90909 11.3333H5.90909"
            stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path
            d="M13 11.8462H16.5M20 11.8462H18.25M16.5 11.8462V10M16.5 11.8462H17.375H18.25M18.25 11.8462C18.0556 13.2821 16.2667 17.0154 13 18M18.8333 18C17.6667 17.3846 14.6333 15.1692 14.1667 13.6923"
            stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
      </svg>

      <svg class="w-6 h-6 absolute transition-opacity duration-300 text-white scale-150"
        :class="lang === 'en' ? 'opacity-100' : 'opacity-0'" xmlns="http://www.w3.org/2000/svg">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          <path
            d="M5 14L5.90909 11.3333M11 14L9.90909 11.3333M9.90909 11.3333L7.72727 6L5.90909 11.3333M9.90909 11.3333H5.90909"
            stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
          <path
            d="M13 11.8462H16.5M20 11.8462H18.25M16.5 11.8462V10M16.5 11.8462H17.375H18.25M18.25 11.8462C18.0556 13.2821 16.2667 17.0154 13 18M18.8333 18C17.6667 17.3846 14.6333 15.1692 14.1667 13.6923"
            stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
        </g>
      </svg>
    </button>
  </div>

  <div class="fixed left-0 bottom-0 mb-4 ml-4">
    <button @click="toggleTheme"
      class="relative w-12 h-12 flex items-center justify-center rounded-full transition-all duration-300 bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700">

      <!-- Sun Icon -->
      <svg class="w-6 h-6 absolute transition-opacity duration-300 text-white"
        :class="theme === 'light' ? 'opacity-100' : 'opacity-0'" xmlns="http://www.w3.org/2000/svg" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="5"></circle>
        <path
          d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42">
        </path>
      </svg>

      <!-- Moon Icon -->
      <svg class="w-6 h-6 absolute transition-opacity duration-300"
        :class="theme === 'dark' ? 'opacity-100' : 'opacity-0'" xmlns="http://www.w3.org/2000/svg" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </button>
  </div>


  <!-- แสดงวันที่ -->
  <div class="text-black text-2xl font-bold mb-6 text-center mt-8">
    วันที่ {{ currentDate }}
    <button @click="refreshDate"
      class="ml-4 bg-transparent text-gray-400 p-3 rounded-full hover:text-gray-800 transition-all">
      <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 1 1 2.13 9.36"></path>
      </svg>
    </button>
  </div>

  <div class="max-w-7xl min-h-[80vh] bg-white mx-auto p-6 rounded-lg shadow-lg">
    <!-- ช่องค้นหา -->
    <div class="mb-4 relative">
      <input v-model="searchQuery" placeholder="ค้นหาสถานที่"
        class="w-full px-4 py-3 border border-gray-300 rounded-lg pl-12 pr-12 focus:ring-2 focus:ring-indigo-400 transition-all duration-300 text-gray-800 text-lg shadow-sm" />

      <!-- ไอคอนค้นหา -->
      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-" fill="currentColor"
        viewBox="0 0 24 24">
        <path d="M21 21l-4.35-4.35M15 10A5 5 0 1 1 5 10a5 5 0 0 1 10 0z" stroke="currentColor" stroke-width="2"
          fill="none" stroke-linecap="round" stroke-linejoin="round" />
      </svg>

      <!-- ไอคอนลบเมื่อกรอกคำค้นหา -->
      <svg v-if="searchQuery" @click="searchQuery = ''"
        class="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5 cursor-pointer hover:text-gray-800 transition-all duration-200"
        fill="currentColor" viewBox="0 0 24 24">
        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </div>

    <!-- Loading, Error, และ No Data -->
    <div v-if="loading" class="space-y-4">
      <div class="animate-pulse bg-gray-300 h-24 w-full rounded-lg"></div>
    </div>

    <div v-else-if="error" class="text-red-500 text-lg font-semibold">{{ error }}</div>
    <div v-else-if="filteredDevices.length === 0" class="text-center text-gray-400 text-lg">ไม่พบข้อมูล</div>

    <!-- ตารางข้อมูล -->
    <div v-else class="overflow-x-auto max-h-[600px] overflow-y-auto">
      <table class="w-full table-auto text-center text-sm text-gray-1200 border-collapse shadow-lg bg-gray-200">
        <thead class="bg-gray-100 text-gray-800 border-b-2 border-gray-400">
          <tr>
            <th class="px-4 py-4 text-base font-semibold">สถานที่</th>
            <th class="px-4 py-4 text-base font-semibold">PM2.5(µg/m³)</th>
            <th class="px-4 py-4 text-base font-semibold">PM10(µg/m³)</th>
            <th class="px-4 py-4 text-base font-semibold">อุณหภูมิ(°C)</th>
            <th class="px-4 py-4 text-base font-semibold">ความชื้น(%)</th>
            <th class="px-4 py-4 text-base font-semibold">แนวโน้ม</th>
            <th class="px-4 py-4 text-base font-semibold">ค่าเฉลี่ย</th>
            <th class="px-4 py-4 text-base font-semibold">สถิติค่าฝุ่น</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-400">
          <tr v-for="(device, index) in filteredDevices.slice(0, 50)" :key="device.dvid"
            :class="index % 2 === 0 ? 'bg-gray-200 hover:bg-gray-100' : 'bg-gray-50 hover:bg-gray-100'"
            class="border-t transition-all duration-200">
            <td @click="openDeviceModal(device)"
              class="px-6 py-4 text-gray-800 cursor-pointer whitespace-nowrap hover:underline">{{ device.place }}</td>
            <td class="px-2 py-1 whitespace-nowrap font-bold text-center rounded-md"
              :style="{ backgroundColor: getColor(device.pm25) }">{{ device.pm25 }}</td>
            <td class="px-2 py-1 whitespace-nowrap font-bold text-center rounded-md"
              :style="{ backgroundColor: getColor(device.pm10) }">{{ device.pm10 }}</td>
            <td class="px-6 py-4 text-gray-800 whitespace-nowrap">{{ device.temperature }}</td>
            <td class="px-6 py-4 text-gray-800 whitespace-nowrap">{{ device.humidity }}</td>
            <td class="px-6 py-4 text-gray-800 whitespace-nowrap flex justify-center items-center">
              <span v-if="device.trend === 'd'" class="transform transition-all duration-300 hover:scale-125">
                <svg class="w-6 h-6 text-green-500 hover:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 19L5 12H9L12 15L15 12H19L12 19Z" stroke="currentColor" stroke-width="2" fill="none"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span v-else-if="device.trend === 'u'" class="transform transition-all duration-300 hover:scale-125">
                <svg class="w-6 h-6 text-red-500 hover:text-red-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 5L19 12H15L12 9L9 12H5L12 5Z" stroke="currentColor" stroke-width="2" fill="none"
                    stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <span v-else class="transform transition-all duration-300 hover:scale-125">
                <svg class="w-6 h-6 text-gray-500 hover:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 12h14" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"
                    stroke-linejoin="round" />
                </svg>
              </span>
            </td>
            <!-- คอลัมน์ "ค่าเฉลี่ย" -->
            <td class="px-6 py-4 text-gray-800 whitespace-nowrap relative">
              <!-- ปุ่มเพื่อแสดงข้อมูล -->
              <button @click="toggleExpand(device.dvid)" class="bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300">
                ดูค่าเฉลี่ย ▼
              </button>
              <!-- แสดงข้อมูลค่าเฉลี่ย -->
              <transition name="fade">
                <div v-if="expandedRow === device.dvid"
                  class="absolute left-0 mt-2 bg-gray-100 p-3 rounded-lg shadow-lg w-60 z-10 text-sm text-gray-800">
                  <p>ค่าเฉลี่ย 1 ชั่วโมง: {{ device.av1h ?? '-' }} µg/m³</p>
                  <p>ค่าเฉลี่ย 3 ชั่วโมง: {{ device.av3h ?? '-' }} µg/m³</p>
                  <p>ค่าเฉลี่ย 6 ชั่วโมง: {{ device.av6h ?? '-' }} µg/m³</p>
                  <p>ค่าเฉลี่ย 12 ชั่วโมง: {{ device.av12h ?? '-' }} µg/m³</p>
                  <p>ค่าเฉลี่ย 24 ชั่วโมง: {{ device.av24h ?? '-' }} µg/m³</p>
                </div>
              </transition>
            </td>
            <td class="px-6 py-4 text-gray-800 whitespace-nowrap flex justify-center items-center">
              <!-- แสดงแผนภูมิแท่งเล็กๆ -->
              <span @click="openStatsModal(device)" class="cursor-pointer hover:text-gray-400">
                <svg class="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 12h2V7H4zm4 0h2V5H8zm4 0h2V3h-2zm4 0h2V2h-2z" />
                </svg>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>


    <!-- Device Modal -->
    <div v-if="selectedDevice" class="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-xl max-w-md relative">
        <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ selectedDevice.place }}</h3>
        <p><strong>PM2.5:</strong> {{ selectedDevice.pm25 }} µg/m³</p>
        <p><strong>PM10:</strong> {{ selectedDevice.pm10 }} µg/m³</p>
        <p><strong>ที่อยู่:</strong> {{ selectedDevice.address }}</p>
        <p><strong>อุณหภูมิ:</strong> {{ selectedDevice.temperature }} °C</p>
        <p><strong>ความชื้น:</strong> {{ selectedDevice.humidity }} %</p>
        <p><strong>ละติจูด:</strong> {{ selectedDevice.latitude }} </p>
        <p><strong>ลองติจูด:</strong> {{ selectedDevice.longitude }} </p>

        <button @click="closeDeviceModal"
          class="absolute top-2 right-2 text-black hover:text-gray-600 px-3 py-1 rounded-full transition-all">✖</button>
      </div>
    </div>
  </div>


  <div class="footer text-center mt-8">
    <img src="/assets/images/yakkaw_dust_measure.jpg" alt="Air Quality Alert Levels" class="mx-auto" bt-8>
  </div>
</template>



<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from "vue-router";

// Declare the currentDate as a ref, not computed
const currentDate = ref<string>('');

// ฟังก์ชันรีเฟรชวันที่
const refreshDate = () => {
  const date = new Date();
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };
  currentDate.value = new Intl.DateTimeFormat('th-TH', options).format(date);
};

// เมื่อ component ถูก mounted ก็อัปเดตวันที่ทันที
onMounted(() => {
  refreshDate();
});

// Language and theme setup
const lang = ref<string>('th');
const router = useRouter();
const route = useRoute();


// Toggle between languages and update route
const toggleLanguage = () => {
  const newLang = lang.value === 'th' ? 'en' : 'th';
  lang.value = newLang;

  // Get current path without language prefix
  let currentPath = route.path;

  // Remove existing language prefix if present
  if (currentPath.startsWith('/en')) {
    currentPath = currentPath.substring(3);
  }

  // Add new language prefix if needed
  const newPath = newLang === 'en' ? `/en${currentPath}` : currentPath;

  // Only navigate if the path would actually change
  if (newPath !== route.path) {
    router.push(newPath);
  }
};

// Watch for route changes to update language
watch(() => route.path, (newPath) => {
  if (newPath.startsWith('/en')) {
    lang.value = 'en';
  } else {
    lang.value = 'th';
  }
}, { immediate: true });


// Set theme mode (light/dark)
const theme = ref<string>('light');

// Watch the theme state and update body class
watch(theme, (newTheme) => {
  if (newTheme === 'dark') {
    document.body.classList.add('dark');
    document.body.style.backgroundColor = '#1a202c'; // สีเทาเข้ม
  } else {
    document.body.classList.remove('dark');
    document.body.style.backgroundColor = '#ffffff'; // สีขาว
  }
});


// Toggle between light and dark theme
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};


// Device interface and other variables
interface Device {
  dvid: string;
  place: string;
  status?: string;
  pm25?: number;
  pm10?: number;
  temperature?: number;
  humidity?: number;
  av1h?: number;
  trend?: string;
}

const devices = ref<Device[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const expandedRow = ref<string | null>(null);
const selectedDevice = ref<Device | null>(null);

// Color settings and filter function
const { colorRanges } = useColorSettings();

const getColor = (value: number | undefined) => {
  if (value === null) return '#808080'; // กรณีไม่มีค่า PM2.5
  const range = colorRanges.value.find(range => value >= range.min && value <= range.max);
  return range ? range.color : '#808080'; // ถ้าไม่พบค่า, ให้ใช้สีเทา
};

const filteredDevices = computed(() => {
  return devices.value.filter(device =>
    device.place.toLowerCase().includes(searchQuery.value.toLowerCase()) &&
    device.status === 'Active' && device.pm25 != null && device.pm10 != null
  );
});

// Toggle expand function
const toggleExpand = (id: string) => {
  expandedRow.value = expandedRow.value === id ? null : id;
};

// Device modal open and close functions
const openDeviceModal = (device: Device) => {
  selectedDevice.value = device;
};

const closeDeviceModal = () => {
  selectedDevice.value = null;
};

// API call to fetch devices
onMounted(async () => {
  try {
    const response = await fetch('https://yakkaw.mfu.ac.th/api/yakkaw/devices');
    const res1 = await response.json();
    devices.value = Array.isArray(res1.response) ? res1.response : [];
  } catch (err) {
    error.value = 'เกิดข้อผิดพลาด';
  } finally {
    loading.value = false;
  }
});
</script>


<style>
@import url("https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;700&display=swap");

.container {
  font-family: "Sarabun", sans-serif;
  font-size: 14pt;
  text-align: center;
  margin: 50px;
}

nav {
  margin-top: 20px;
}

a {
  font-size: 14pt;
  text-decoration: none;
  margin: 0 10px;
  color: #007bff;
}



/* Light Mode */
body {
  background-color: #ffffff;
  /* White background for light mode */
  color: #121212;
  /* Dark text color for light mode */
}

/* Dark Mode */
body.dark {
  background-color: #182742;
  /* Dark background for dark mode */
  color: white;
  /* table pm2.5 */
}

/* Adjust background for specific elements in Dark Mode */
body.dark .bg-white {
  background-color: #676565 !important;
  /* Dark background for white elements in dark mode */
}


body.dark .bg-gray-200 {
  background-color: #9f9e9e !important;
  /* Darker gray background for gray-200 elements */
}

body.dark .bg-gray-300 {
  background-color: #676565 !important;
  /* Darker gray background for gray-300 elements */
}

/* Text color in both modes */
body .text-black {
  color: #080808 !important;
  /* Ensure text stays dark in both modes */
}

body.dark .text-black {
  color: #e0e0e0 !important;
  /* White text color in dark mode for text-black class */
}

body .text-gray-800 {
  color: #333333 !important;
  /* Dark gray color for text-gray-800 in light mode */
}

body.dark .text-gray-800 {
  color: #000000 !important;
  /* Lighter gray for text-gray-800 in dark mode */
}

body .text-gray-400 {
  color: #b0b0b0 !important;
  /* Light gray color for text-gray-400 in both modes */
}

body.dark .text-gray-400 {
  color: #d1d1d1 !important;
  /* Lighter gray for dark mode */
}

/* Text input and search bar in Dark Mode */
body.dark input,
body.dark .searchQuery {
  color: #ffffff !important;
  /* White text color for input fields in dark mode */
}

/* Additional text gray styling in both modes */
body.dark .text-gray-500 {
  color: #000000 !important;
  /* Lighter gray color for text-gray-500 in dark mode */
}

body .text-gray-500 {
  color: #888888 !important;
  /* Lighter gray color for text-gray-500 in light mode */
}
</style>
