<template>
  <div
    class="min-h-dvh bg-gradient-to-br from-sky-50 to-sky-200 p-3 sm:p-4 md:p-6 font-sans"
  >
    <!-- Loading -->
    <div
      v-if="loading"
      class="animate-pulse bg-gray-200 h-32 w-full rounded-xl"
    ></div>

    <!-- Error -->
    <div v-else-if="error" class="flex items-center justify-center min-h-dvh">
      <p
        class="text-red-500 text-xl sm:text-3xl font-bold p-4 bg-red-100 rounded-lg"
      >
        ⚠️ {{ error }}
      </p>
    </div>

    <!-- Device Not Found -->
    <div v-else-if="!device" class="flex items-center justify-center min-h-dvh">
      <p
        class="text-yellow-600 text-xl sm:text-3xl font-bold p-4 bg-yellow-100 rounded-lg"
      >
        ⚠️ ไม่พบอุปกรณ์ที่ค้นหา
      </p>
    </div>

    <!-- Main Content -->
    <div
      v-else
      class="bg-white shadow-2xl rounded-3xl 
      p-4 sm:p-6 lg:p-10 
      w-full mx-auto
      max-w-[1500px] lg:max-w-[1600px]"
    >
      <!-- HEADER -->
      <div
        class="flex flex-col sm:flex-row items-center justify-center sm:justify-between mb-6 gap-4"
      >
        <div class="text-center sm:text-left">
          <h2 class="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800">
            {{ lang === "th-TH" ? "คุณภาพอากาศ" : "Air Quality" }}
          </h2>
          <p class="text-sm sm:text-base lg:text-lg text-gray-500 mt-1 font-medium">
            {{ formattedDate }} | {{ formattedTime }}
          </p>
          <p class="text-sm sm:text-base lg:text-lg text-gray-600 mt-1 font-medium">
            📍 {{ device.place }}
          </p>
          <h5 class="text-base sm:text-lg lg:text-xl font-extrabold text-gray-800">
            {{ device.address }}
          </h5>
        </div>

        <div class="flex items-center gap-3 sm:gap-4">
          <button
            @click="toggleLang"
            class="px-3 py-1 rounded-full shadow-md bg-sky-200 hover:bg-sky-300 transition font-semibold text-sm sm:text-base"
          >
            {{ lang === "th-TH" ? "EN" : "TH" }}
          </button>

          <img
            :src="weatherIcon"
            alt="Air Quality Icon"
            class="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full"
          />
        </div>
      </div>

      <!-- PM 2.5 CARD -->
      <div class="flex flex-col gap-6 text-center">
        <div
          :class="[ 
            'rounded-3xl p-6 flex flex-col justify-center items-center shadow-2xl transform transition hover:scale-105 border-8',
            pm25Class,
            pm25BorderClass,
          ]"
        >
          <p class="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-700 mb-2">
            PM 2.5
          </p>
          <p class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900">
            {{ device.pm25 }}
            <span class="text-lg sm:text-2xl lg:text-3xl">µg/m³</span>
          </p>
        </div>

        <!-- Temperature & Humidity -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div
            class="rounded-2xl p-4 bg-gray-50 flex flex-col justify-center items-center shadow-md"
          >
            <p class="text-base sm:text-lg lg:text-xl font-medium text-gray-500">
              {{ lang === "th-TH" ? "อุณหภูมิ 🌤" : "Temperature 🌤" }}
            </p>
            <p class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mt-2">
              {{ device.temperature }}°C
            </p>
          </div>

          <div
            class="rounded-2xl p-4 bg-gray-50 flex flex-col justify-center items-center shadow-md"
          >
            <p class="text-base sm:text-lg lg:text-xl font-medium text-gray-500">
              {{ lang === "th-TH" ? "ความชื้น 💧" : "Humidity 💧" }}
            </p>
            <p class="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mt-2">
              {{ device.humidity }}%
            </p>
          </div>
        </div>
      </div>

      <!-- STATUS MESSAGE -->
      <div class="mt-6 text-center">
        <p :class="statusClass" class="font-extrabold text-2xl sm:text-3xl lg:text-4xl">
          {{ statusMessage.title }}
        </p>

        <p class="text-gray-600 text-base sm:text-lg lg:text-xl mt-2">
          {{ statusMessage.desc }}
        </p>
      </div>

      <!-- PREVENTION TIPS -->
      <div class="mt-6 bg-gray-50 rounded-2xl p-4 sm:p-5 lg:p-7 shadow-inner">
        <h3 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-700 mb-4 text-center">
          {{ lang === "th-TH" ? "🛡 วิธีการป้องกัน" : "🛡 Prevention Tips" }}
        </h3>

        <ul
          class="list-disc list-inside space-y-2 text-sm sm:text-base lg:text-lg text-gray-700"
        >
          <li v-for="tip in preventionTips" :key="tip">{{ tip }}</li>
        </ul>
      </div>

      <div class="text-center mt-6">
        <p class="text-gray-400 text-xs sm:text-sm lg:text-base">
          {{
            lang === "th-TH"
              ? "ข้อมูลจากระบบ ยักษ์ขาว วัดฝุ่น"
              : "Data from Yakkaw System"
          }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const device = ref<Device | null>(null);
const loading = ref(true);
const error = ref<string | null>(null);
const weatherIcon = ref("");

const currentTime = ref(new Date());
const lang = ref<"th-TH" | "en-US">("th-TH");

// Language Toggle
const toggleLang = () => {
  lang.value = lang.value === "th-TH" ? "en-US" : "th-TH";
};

// Date & Time Format
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

// PM2.5 Color + Icon
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

// Border Colors
const pm25BorderClass = computed(() => {
  const v = device.value?.pm25 ?? 0;
  if (v <= 25) return "border-blue-400";
  if (v <= 37) return "border-green-400";
  if (v <= 50) return "border-yellow-400";
  if (v <= 90) return "border-orange-400";
  return "border-red-500";
});

// Status Text
const statusMessage = computed(() => {
  const v = device.value?.pm25 ?? 0;
  if (lang.value === "th-TH") {
    if (v <= 25) return { title: "ดีมาก", desc: "อากาศสะอาด ไม่มีความเสี่ยง" };
    if (v <= 37) return { title: "ดี", desc: "ปลอดภัยต่อการทำกิจกรรม" };
    if (v <= 50) return { title: "ปานกลาง", desc: "ควรระวังการออกกลางแจ้ง" };
    if (v <= 90)
      return { title: "แย่", desc: "หลีกเลี่ยงกิจกรรมกลางแจ้ง และสวมหน้ากาก" };
    return { title: "อันตราย", desc: "ควรงดกิจกรรมกลางแจ้ง และสวมหน้ากาก N95" };
  } else {
    if (v <= 25) return { title: "Very Good", desc: "Clean air, no risk" };
    if (v <= 37) return { title: "Good", desc: "Safe for activities" };
    if (v <= 50) return { title: "Moderate", desc: "Limit outdoor activities" };
    if (v <= 90)
      return { title: "Poor", desc: "Avoid outdoor activities, wear a mask" };
    return {
      title: "Hazardous",
      desc: "Avoid outdoor activities, wear N95 mask",
    };
  }
});

// Status Color
const statusClass = computed(() => {
  const v = device.value?.pm25 ?? 0;
  if (v <= 25) return "text-blue-500";
  if (v <= 37) return "text-green-500";
  if (v <= 50) return "text-yellow-500";
  if (v <= 90) return "text-orange-500";
  return "text-red-600";
});

// Prevention Tips
const preventionTips = computed(() => {
  const v = device.value?.pm25 ?? 0;
if (lang.value === "th-TH") {
    if (v <= 25) {
      return ["สามารถทำกิจกรรมกลางแจ้งได้ตามปกติ", "ออกกำลังกายได้ตามปกติ"];
    } else if (v <= 37) {
      return ["ทำกิจกรรมกลางแจ้งได้", "ผู้มีโรคประจำตัวควรระวังอาการ"];
    } else if (v <= 50) {
      return [
        "ลดเวลาอยู่กลางแจ้ง",
        "ดื่มน้ำมาก ๆ",
        "ผู้ที่มีโรคทางเดินหายใจควรพกยา",
      ];
    } else if (v <= 90) {
      return [
        "หลีกเลี่ยงกิจกรรมกลางแจ้ง",
        "สวมหน้ากาก N95",
        "ปิดประตูหน้าต่าง",
      ];
    }
    return [
      "งดกิจกรรมกลางแจ้งโดยเด็ดขาด",
      "สวมหน้ากาก N95",
      "ใช้เครื่องฟอกอากาศ",
      "ติดตามประกาศจากสาธารณสุข",
    ];
  } else {
    if (v <= 25) {
      return ["Normal outdoor activities", "Stay healthy"];
    } else if (v <= 37) {
      return ["Outdoor activities are fine", "Be cautious with symptoms"];
    } else if (v <= 50) {
      return ["Reduce outdoor time", "Drink water", "Carry medicine"];
    } else if (v <= 90) {
      return ["Avoid outdoor activities", "Wear N95 mask", "Close windows"];
    }
    return [
      "Avoid all outdoor activities",
      "Always wear N95 mask",
      "Use air purifier",
      "Follow public announcements",
    ];
  }
});

// Fetch Data
const fetchDeviceByDvid = async () => {
  try {
    const res = await fetch("https://yakkaw.mfu.ac.th/api/yakkaw/devices");
    const data = await res.json();
    const dvid = route.params.dvid as string;

    device.value = data.response.find((dev: Device) => dev.dvid === dvid);

    if (!device.value) {
      error.value = "⚠️ ไม่พบอุปกรณ์ที่ค้นหา";
    }
  } catch {
    error.value = "เกิดข้อผิดพลาดขณะโหลดข้อมูลอุปกรณ์";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchDeviceByDvid);
</script>
