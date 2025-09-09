<template>
  <div class="min-h-screen bg-gradient-to-br from-sky-50 to-sky-200 p-10 font-sans">
    <!-- Loading -->
    <div v-if="loading" class="animate-pulse bg-gray-200 h-32 w-full rounded-xl"></div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center h-screen">
      <p class="text-red-500 text-3xl font-bold p-4 bg-red-100 rounded-lg">
        ⚠️ {{ error }}
      </p>
    </div>

    <!-- No Device -->
    <div v-else-if="!device" class="flex items-center justify-center h-screen">
      <p class="text-yellow-600 text-3xl font-bold p-4 bg-yellow-100 rounded-lg">
        ⚠️ ไม่พบอุปกรณ์ที่ค้นหา
      </p>
    </div>

    <!-- Main Widget -->
    <div v-else class="bg-white shadow-2xl rounded-3xl p-10 max-w-6xl mx-auto font-sans">
      <!-- Header -->
      <div class="flex items-center justify-between mb-10 flex-wrap">
        <div>
          <h2 class="text-4xl font-extrabold text-gray-800">
            {{ lang === "th-TH" ? "คุณภาพอากาศ" : "Air Quality" }}
          </h2>
          <p class="text-lg text-gray-500 mt-2 font-medium">
            {{ formattedDate }} | {{ formattedTime }}
          </p>
          <p class="text-lg text-gray-600 mt-1 font-medium">
            📍 {{ device.place }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <button
            @click="toggleLang"
            class="px-4 py-2 rounded-full shadow-md bg-sky-200 hover:bg-sky-300 transition font-semibold"
          >
            {{ lang === "th-TH" ? "EN" : "TH" }}
          </button>
          <img :src="weatherIcon" alt="Air Quality Icon" class="w-32 h-32 rounded-full" />
        </div>
      </div>
<!-- Data Grid -->
<div class="flex flex-col gap-10 text-center">
  <!-- PM2.5 (Top, full width) -->
  <div
    :class="[ 
      'rounded-3xl p-10 flex flex-col justify-center items-center shadow-2xl transform transition hover:scale-105 border-8',
      pm25Class,
      pm25BorderClass
    ]"
  >
    <p class="text-3xl font-semibold text-gray-700 mb-2">
      PM 2.5
    </p>
    <p class="text-5xl font-extrabold text-gray-900">
      {{ device.pm25 }}
      <span class="text-3xl">µg/m³</span>
    </p>
  </div>

  <!-- Temperature & Humidity (Bottom, side by side on desktop, stacked on mobile) -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
    <!-- Temperature -->
    <div class="rounded-2xl p-6 bg-gray-50 flex flex-col justify-center items-center shadow-md">
      <p class="text-xl font-medium text-gray-500">
        {{ lang === "th-TH" ? "อุณหภูมิ 🌤" : "Temperature 🌤" }}
      </p>
      <p class="text-4xl font-bold text-gray-800 mt-2">{{ device.temperature }}°C</p>
    </div>

    <!-- Humidity -->
    <div class="rounded-2xl p-6 bg-gray-50 flex flex-col justify-center items-center shadow-md">
      <p class="text-xl font-medium text-gray-500">
        {{ lang === "th-TH" ? "ความชื้น 💧" : "Humidity 💧" }}
      </p>
      <p class="text-4xl font-bold text-gray-800 mt-2">{{ device.humidity }}%</p>
    </div>
  </div>
</div>

      <!-- Health Tips -->
      <div class="mt-12 text-center">
        <p :class="statusClass" class="font-extrabold text-4xl">
          {{ statusMessage.title }}
        </p>
        <p class="text-gray-600 text-2xl mt-2">{{ statusMessage.desc }}</p>
      </div>

      <!-- Prevention Tips -->
      <div class="mt-10 bg-gray-50 rounded-2xl p-8 shadow-inner">
        <h3 class="text-2xl font-bold text-gray-700 mb-4 text-center">
          {{ lang === "th-TH" ? "🛡 วิธีการป้องกัน" : "🛡 Prevention Tips" }}
        </h3>
        <ul class="list-disc list-inside space-y-2 text-lg text-gray-700 max-w-3xl mx-auto">
          <li v-for="tip in preventionTips" :key="tip">{{ tip }}</li>
        </ul>
      </div>

      <!-- Footer -->
      <div class="text-center mt-12">
        <p class="text-gray-400 text-lg">
          {{ lang === "th-TH" ? "ข้อมูลจากระบบ ยักษ์ขาว วัดฝุ่น" : "Data from Yakkaw System" }}
        </p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed } from "vue"
const device = ref<Device | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const weatherIcon = ref("");

const currentTime = ref(new Date());
const lang = ref<"th-TH" | "en-US">("th-TH");

// Toggle Language
const toggleLang = () => {
  lang.value = lang.value === "th-TH" ? "en-US" : "th-TH";
};

// Format Date & Time
const formattedDate = computed(() =>
  currentTime.value.toLocaleDateString(lang.value, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
);

const formattedTime = computed(() =>
  currentTime.value.toLocaleTimeString(lang.value, {
    hour: "2-digit",
    minute: "2-digit",
  })
);

// PM2.5 Class & Icon
const pm25Class = computed(() => {
  const value = device.value?.pm25 ?? 0;
  if (value <= 25) {
    weatherIcon.value = "/assets/images/yyakkaw_blue_icon.png";
    return "bg-blue-100";
  } else if (value <= 37) {
    weatherIcon.value = "/assets/images/yyakkaw_green_icon.png";
    return "bg-green-100";
  } else if (value <= 50) {
    weatherIcon.value = "/assets/images/yyakkaw_yellow_icon.png";
    return "bg-yellow-100";
  } else if (value <= 90) {
    weatherIcon.value = "/assets/images/yyakkaw_orange_icon.png";
    return "bg-orange-100";
  } else {
    weatherIcon.value = "/assets/images/yyakkaw_red_icon.png";
    return "bg-red-100";
  }
});
// PM2.5 Border Color
const pm25BorderClass = computed(() => {
  const value = device.value?.pm25 ?? 0;
  if (value <= 25) return "border-blue-400";
  if (value <= 37) return "border-green-400";
  if (value <= 50) return "border-yellow-400";
  if (value <= 90) return "border-orange-400";
  return "border-red-500";
});


// Air Quality Status
const statusMessage = computed(() => {
  const value = device.value?.pm25 ?? 0;
  if (lang.value === "th-TH") {
    if (value <= 25) return { title: "ดีมาก", desc: "อากาศสะอาด ไม่มีความเสี่ยง" };
    if (value <= 37) return { title: "ดี", desc: "ปลอดภัยต่อการทำกิจกรรม" };
    if (value <= 50) return { title: "ปานกลาง", desc: "ควรระวังการออกกลางแจ้ง" };
    if (value <= 90) return { title: "แย่", desc: "หลีกเลี่ยงกิจกรรมกลางแจ้ง และสวมหน้ากาก" };
    return { title: "อันตราย", desc: "ควรงดกิจกรรมกลางแจ้ง และสวมหน้ากาก N95" };
  } else {
    if (value <= 25) return { title: "Very Good", desc: "Clean air, no risk" };
    if (value <= 37) return { title: "Good", desc: "Safe for activities" };
    if (value <= 50) return { title: "Moderate", desc: "Limit outdoor activities" };
    if (value <= 90) return { title: "Poor", desc: "Avoid outdoor activities, wear a mask" };
    return { title: "Hazardous", desc: "Avoid outdoor activities, wear N95 mask" };
  }
});

const statusClass = computed(() => {
  const value = device.value?.pm25 ?? 0;
  if (value <= 25) return "text-blue-500";
  if (value <= 37) return "text-green-500";
  if (value <= 50) return "text-yellow-500";
  if (value <= 90) return "text-orange-500";
  return "text-red-600";
});

// Prevention Tips (dynamic by PM2.5 level)
const preventionTips = computed(() => {
  const value = device.value?.pm25 ?? 0;
  if (lang.value === "th-TH") {
    if (value <= 25) {
      return [
        "สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ",
        "ดูแลสุขภาพและออกกำลังกายได้ตามปกติ",
      ];
    } else if (value <= 37) {
      return [
        "สามารถทำกิจกรรมกลางแจ้งได้ แต่ควรติดตามค่าฝุ่น",
        "ผู้ที่มีโรคประจำตัวควรระวังอาการผิดปกติ",
      ];
    } else if (value <= 50) {
      return [
        "ลดเวลาในการทำกิจกรรมกลางแจ้ง",
        "ดื่มน้ำมาก ๆ และพักผ่อนให้เพียงพอ",
        "ผู้ที่มีโรคทางเดินหายใจควรพกยาประจำตัว",
      ];
    } else if (value <= 90) {
      return [
        "หลีกเลี่ยงกิจกรรมกลางแจ้ง",
        "สวมหน้ากาก N95 เมื่อออกนอกบ้าน",
        "ปิดประตูหน้าต่างเพื่อป้องกันฝุ่นเข้าอาคาร",
      ];
    }
    return [
      "งดกิจกรรมกลางแจ้งโดยเด็ดขาด",
      "สวมหน้ากาก N95 ตลอดเวลาที่อยู่นอกบ้าน",
      "ใช้เครื่องฟอกอากาศในบ้าน",
      "ติดตามประกาศจากหน่วยงานสาธารณสุข",
    ];
  } else {
    if (value <= 25) {
      return [
        "You can do outdoor activities as usual",
        "Stay healthy and exercise regularly",
      ];
    } else if (value <= 37) {
      return [
        "Outdoor activities are fine but monitor dust levels",
        "People with health issues should be cautious",
      ];
    } else if (value <= 50) {
      return [
        "Reduce time outdoors",
        "Drink water and rest well",
        "Carry medicine if you have respiratory issues",
      ];
    } else if (value <= 90) {
      return [
        "Avoid outdoor activities",
        "Wear an N95 mask when outside",
        "Keep doors and windows closed",
      ];
    }
    return [
      "Completely avoid outdoor activities",
      "Always wear an N95 mask outside",
      "Use an air purifier indoors",
      "Follow public health announcements",
    ];
  }
});

// Fetch Device Data
const fetchDeviceByLocation = async () => {
  try {
    const res = await fetch("https://yakkaw.mfu.ac.th/api/yakkaw/devices");
    const data = await res.json();
    const devices = data.response;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        let closest = null;
        let minDistance = Infinity;

        for (const dev of devices) {
          if (dev.latitude && dev.longitude) {
            const dist = getDistance(userLat, userLon, dev.latitude, dev.longitude);
            if (dist < minDistance) {
              minDistance = dist;
              closest = dev;
            }
          }
        }
        device.value = closest ?? null;
        if (!closest) error.value = lang.value === "th-TH"
          ? "ไม่พบอุปกรณ์ในบริเวณใกล้เคียง"
          : "No nearby device found";
      },
      () => {
        error.value = lang.value === "th-TH"
          ? "ไม่สามารถเข้าถึงตำแหน่งผู้ใช้"
          : "Unable to access user location";
      }
    );
  } catch (e) {
    error.value = lang.value === "th-TH"
      ? "เกิดข้อผิดพลาดขณะโหลดข้อมูลอุปกรณ์"
      : "Error loading device data";
  } finally {
    loading.value = false;
  }
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

onMounted(fetchDeviceByLocation);
</script>
