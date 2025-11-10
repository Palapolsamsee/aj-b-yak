<template>
  <section id="map" class="bg-gray-50 py-12">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <header class="mb-8 text-center">
        <p class="text-sm font-semibold uppercase tracking-wide text-blue-700">
          พยากรณ์และเฝ้าระวัง
        </p>
        <h2 class="text-3xl font-bold text-gray-900">
          สำรวจคุณภาพอากาศและภัยพิบัติ
        </h2>
        <p class="mx-auto mt-2 max-w-2xl text-sm text-gray-600">
          ค้นหาอัปเดตล่าสุดเกี่ยวกับคุณภาพอากาศ จุดความร้อน และแผ่นดินไหวได้แบบเรียลไทม์
          ผ่านแผนที่อินเทอร์แอคทีฟเดียว
        </p>
      </header>

      <div class="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="relative w-full md:max-w-xl">
          <input
            v-model="searchTerm"
            type="text"
            class="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            placeholder="ค้นหาสถานที่หรือที่อยู่..."
            @keyup.enter="searchLocation"
          />
          <button
            type="button"
            class="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-950"
            @click="searchLocation"
          >
            ค้นหา
          </button>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3">
          <button
            v-for="filter in filterOptions"
            :key="filter.key"
            type="button"
            class="flex w-28 flex-col items-center gap-2 rounded-2xl border bg-white px-3 py-3 text-center text-xs font-medium shadow-sm transition"
            :class="
              filter.model.value
                ? 'border-transparent shadow-md'
                : 'border-gray-200 hover:border-gray-300'
            "
            :aria-pressed="filter.model.value.toString()"
            @click="toggleFilter(filter.model)"
          >
            <span
              class="flex h-11 w-11 items-center justify-center rounded-full text-white"
              :class="
                filter.model.value ? filter.activeIconClass : 'bg-gray-100 text-gray-500'
              "
            >
              <svg
                v-if="filter.key === 'air'"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                />
              </svg>
              <svg
                v-else-if="filter.key === 'fire'"
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
              </svg>
              <svg
                v-else
                class="h-5 w-5"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="9" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
            <span class="text-gray-700">{{ filter.label }}</span>
          </button>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-2xl bg-white shadow-xl">
        <div ref="mapContainer" class="h-[520px] w-full"></div>
      </div>
    </div>

    <Transition name="banner-fade">
      <aside
        v-if="showBanner && selectedLocation"
        class="fixed left-6 top-32 w-72 rounded-2xl border border-gray-200 bg-white/95 p-5 text-sm shadow-2xl backdrop-blur"
      >
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {{ bannerTitle(selectedLocation.type) }}
            </p>
            <p class="text-lg font-bold text-gray-900">
              {{ selectedLocation.place }}
            </p>
          </div>
          <button
            type="button"
            class="text-gray-400 transition hover:text-gray-600"
            @click="closeBanner"
          >
            <span class="sr-only">ปิด</span>
            <svg
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedLocation.type === 'air_quality'" class="mt-4 space-y-4">
          <div class="flex items-center gap-4">
            <img
              :src="selectedLocation.weatherIcon"
              alt="weather"
              class="h-16 w-16 object-contain"
            />
            <div>
              <p class="text-3xl font-bold text-gray-900">
                {{ selectedLocation.pm25 }} µg/m³
              </p>
              <p
                class="text-sm font-semibold"
                :style="{ color: getStatusColor(selectedLocation.airQualityStatus) }"
              >
                {{ selectedLocation.airQualityStatus }}
              </p>
            </div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-xl bg-gray-50 px-3 py-2 text-center">
              <p class="text-xs uppercase text-gray-500">อุณหภูมิ</p>
              <p class="text-base font-semibold text-gray-900">
                {{ selectedLocation.temperature }}°C
              </p>
            </div>
            <div class="rounded-xl bg-gray-50 px-3 py-2 text-center">
              <p class="text-xs uppercase text-gray-500">ความชื้น</p>
              <p class="text-base font-semibold text-gray-900">
                {{ selectedLocation.humidity }}%
              </p>
            </div>
          </div>
        </div>

        <div v-else-if="selectedLocation.type === 'fire'" class="mt-4 space-y-3">
          <div class="flex items-center gap-4">
            <img
              src="/assets/images/fire_icon.png"
              alt="fire"
              class="h-14 w-14 object-contain"
            />
            <div>
              <p class="text-xs uppercase text-gray-500">ระดับความรุนแรง</p>
              <p
                class="text-xl font-semibold"
                :style="{ color: getFireIntensityColor(selectedLocation.intensity) }"
              >
                {{ selectedLocation.intensity }}
              </p>
              <p class="text-sm text-gray-500">
                ความมั่นใจ: {{ selectedLocation.confidence }}%
              </p>
            </div>
          </div>
          <dl class="space-y-1 text-gray-600">
            <div class="flex justify-between">
              <dt>วันที่ตรวจพบ</dt>
              <dd class="font-medium text-gray-900">{{ selectedLocation.date }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>พื้นที่</dt>
              <dd class="font-medium text-gray-900">
                {{ selectedLocation.area }}
                <span v-if="selectedLocation.area !== 'N/A'">ตร.กม.</span>
              </dd>
            </div>
          </dl>
        </div>

        <div v-else class="mt-4 space-y-3">
          <div class="flex items-center gap-4">
            <img
              src="/assets/images/earthquake_icon.png"
              alt="earthquake"
              class="h-14 w-14 object-contain"
            />
            <div>
              <p class="text-xs uppercase text-gray-500">ขนาดแรงสั่น</p>
              <p
                class="text-xl font-semibold"
                :style="{ color: getEarthquakeColor(Number(selectedLocation.magnitude)) }"
              >
                M {{ selectedLocation.magnitude }}
              </p>
              <p class="text-sm text-gray-500">ความลึก: {{ selectedLocation.depth }} กม.</p>
            </div>
          </div>
          <dl class="space-y-1 text-gray-600">
            <div class="flex justify-between">
              <dt>เวลาเกิดเหตุ</dt>
              <dd class="font-medium text-gray-900">{{ selectedLocation.time }}</dd>
            </div>
            <div class="flex justify-between">
              <dt>สึนามิ</dt>
              <dd
                class="font-medium"
                :style="{ color: getTsunamiColor(selectedLocation.tsunami) }"
              >
                {{ selectedLocation.tsunami ? "มีโอกาส" : "ไม่มีโอกาส" }}
              </dd>
            </div>
          </dl>
        </div>

        <p class="mt-4 text-right text-xs text-gray-500">
          อัพเดทล่าสุด: {{ selectedLocation.updateTime }}
        </p>
      </aside>
    </Transition>
  </section>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from "vue";

const searchTerm = ref("");
const showBanner = ref(false);
const selectedLocation = ref(null);

const showAirQuality = ref(true);
const showFires = ref(true);
const showEarthquakes = ref(true);

const devices = ref([]);
const fires = ref([]);
const earthquakes = ref([]);

const lastUpdateTime = ref("");

const mapContainer = ref(null);
const map = ref(null);

const previousPm25Values = new Map();
const airQualityMarkers = new Map();
const fireMarkers = new Map();
const earthquakeMarkers = new Map();

const runtimeConfig = useRuntimeConfig();
const googleMapKey = runtimeConfig.public?.GOOGLEMAPAPI || "";

const filterOptions = [
  {
    key: "air",
    label: "คุณภาพอากาศ",
    activeIconClass: "bg-blue-600",
    model: showAirQuality,
  },
  {
    key: "fire",
    label: "ไฟป่า",
    activeIconClass: "bg-orange-500",
    model: showFires,
  },
  {
    key: "earthquake",
    label: "แผ่นดินไหว",
    activeIconClass: "bg-red-500",
    model: showEarthquakes,
  },
];

const MAP_CENTER = { lat: 13.7563, lng: 100.5018 };
const MAP_SCRIPT_ID = "google-maps-sdk";
const MAP_BASE_URL = "https://maps.googleapis.com/maps/api/js";
const MAP_SCRIPT_SRC = googleMapKey ? `${MAP_BASE_URL}?key=${googleMapKey}` : MAP_BASE_URL;

let refreshIntervalId = null;

onMounted(async () => {
  await fetchAllData();
  loadGoogleMaps();
  refreshIntervalId = window.setInterval(fetchAllData, 30000);
});

onBeforeUnmount(() => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
  }
  closeBanner();
  clearMarkerCollection(airQualityMarkers);
  clearMarkerCollection(fireMarkers);
  clearMarkerCollection(earthquakeMarkers);
});

watch(showBanner, (visible) => {
  if (!visible) {
    selectedLocation.value = null;
  }
});

watch([showAirQuality, showFires, showEarthquakes], () => {
  updateMapMarkers();
  ensureBannerVisibility();
});

function toggleFilter(modelRef) {
  modelRef.value = !modelRef.value;
}

async function fetchAllData() {
  try {
    await Promise.all([fetchAirQualityData(), fetchFireData(), fetchEarthquakeData()]);
    updateMapMarkers();
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลทั้งหมด", error);
  }
}

async function fetchAirQualityData() {
  try {
    const response = await fetch("https://yakkaw.mfu.ac.th/api/yakkaw/devices");
    if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลคุณภาพอากาศได้");
    const payload = await response.json();
    const rawDevices = Array.isArray(payload?.response) ? payload.response : [];

    const today = new Date().toISOString().split("T")[0];

    const normalized = rawDevices
      .filter((device) => {
        const status = (device.status || "").toLowerCase();
        return (
          status === "active" &&
          device.pm25 &&
          device.humidity &&
          device.temperature &&
          device.ddate === today
        );
      })
      .map((device) => {
        const lat = Number(device.latitude);
        const lng = Number(device.longitude);
        const pm25 = Number(device.pm25);
        const humidity = Number(device.humidity);
        const temperature = Number(device.temperature);
        if ([lat, lng, pm25, humidity, temperature].some((value) => Number.isNaN(value))) {
          return null;
        }
        const id = String(device.deviceid);
        const previousPm25 = previousPm25Values.get(id) ?? pm25;
        previousPm25Values.set(id, pm25);

        return {
          id,
          place: device.place || "ไม่ทราบสถานที่",
          latitude: lat,
          longitude: lng,
          pm25,
          humidity,
          temperature,
          trend: device.trend || "",
          previousPm25,
          updatedAt: device.updatetime ? Number(device.updatetime) * 1000 : Date.now(),
        };
      })
      .filter(Boolean);

    devices.value = normalized;
    if (normalized.length) {
      lastUpdateTime.value = new Date(normalized[0].updatedAt).toLocaleString("th-TH");
    }
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลคุณภาพอากาศ:", error);
    devices.value = [];
  }
}

async function fetchFireData() {
  try {
    const response = await fetch("https://yakkaw.mfu.ac.th/blueschool/apis/fires");
    if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลไฟป่าได้");
    const payload = await response.json();

    const rawEntries = extractArray(payload);

    const normalized = rawEntries
      .map((entry, index) => {
        const coords = extractCoordinates(entry);
        if (!coords) return null;

        const brightness = Number(entry.brightness ?? entry.confidence);
        const confidence = Number(entry.confidence ?? entry.brightness);
        if (Number.isNaN(brightness) || Number.isNaN(confidence)) return null;

        return {
          id: `fire_${entry.id || entry.fid || index}`,
          latitude: coords.lat,
          longitude: coords.lng,
          place:
            entry.location ||
            entry.place ||
            entry.name ||
            `จุดความร้อน ${index + 1}`,
          intensity: getFireIntensity(brightness),
          confidence: Math.round(confidence),
          date:
            entry.date ||
            entry.detection_date ||
            new Date().toLocaleDateString("th-TH"),
          area: entry.area || "N/A",
          updateTime: new Date().toLocaleString("th-TH"),
        };
      })
      .filter(Boolean);

    fires.value = normalized;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลไฟป่า:", error);
    fires.value = [];
  }
}

async function fetchEarthquakeData() {
  try {
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    );
    if (!response.ok) throw new Error("ไม่สามารถโหลดข้อมูลแผ่นดินไหวได้");
    const payload = await response.json();

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 4);

    const normalized = (payload?.features || [])
      .filter((feature) => {
        const magnitude = feature?.properties?.mag;
        const time = feature?.properties?.time;
        if (typeof magnitude !== "number" || typeof time !== "number") return false;
        const eventTime = new Date(time);
        return magnitude >= 2 && eventTime >= startDate;
      })
      .map((feature) => {
        const [lng, lat, depth = 0] = feature.geometry?.coordinates || [];
        if ([lat, lng].some((value) => typeof value !== "number")) {
          return null;
        }
        return {
          id: `earthquake_${feature.id}`,
          latitude: lat,
          longitude: lng,
          depth: Number(depth).toFixed(1),
          magnitude: Number(feature.properties.mag).toFixed(1),
          place: feature.properties.place || "ไม่ทราบพื้นที่",
          time: new Date(feature.properties.time).toLocaleString("th-TH"),
          tsunami: feature.properties.tsunami === 1,
          updateTime: new Date().toLocaleString("th-TH"),
        };
      })
      .filter(Boolean);

    earthquakes.value = normalized;
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโหลดข้อมูลแผ่นดินไหว:", error);
    earthquakes.value = [];
  }
}

function loadGoogleMaps() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  if (window.google?.maps) {
    initMap();
    return;
  }

  const existingScript = document.getElementById(MAP_SCRIPT_ID);

  if (existingScript) {
    existingScript.addEventListener("load", initMap, { once: true });
    return;
  }

  const script = document.createElement("script");
  script.id = MAP_SCRIPT_ID;
  script.src = MAP_SCRIPT_SRC;
  script.async = true;
  script.defer = true;
  script.addEventListener("load", initMap, { once: true });
  document.head.appendChild(script);
}

function initMap() {
  if (typeof window === "undefined" || !mapContainer.value || !window.google?.maps) return;

  map.value = new window.google.maps.Map(mapContainer.value, {
    center: MAP_CENTER,
    zoom: 6,
    styles: [
      {
        featureType: "poi",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "transit",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  updateMapMarkers();
}

function updateMapMarkers() {
  if (typeof window === "undefined" || !map.value || !window.google?.maps) return;

  clearMarkerCollection(airQualityMarkers);
  clearMarkerCollection(fireMarkers);
  clearMarkerCollection(earthquakeMarkers);

  if (showAirQuality.value) {
    addAirQualityMarkers();
  }
  if (showFires.value) {
    addFireMarkers();
  }
  if (showEarthquakes.value) {
    addEarthquakeMarkers();
  }
}

function clearMarkerCollection(collection) {
  const canClearEvents = typeof window !== "undefined" && window.google?.maps?.event;
  collection.forEach((marker) => {
    if (marker?.setMap) {
      marker.setMap(null);
    }
    if (canClearEvents && marker) {
      window.google.maps.event.clearInstanceListeners(marker);
    }
  });
  collection.clear();
}

function addAirQualityMarkers() {
  if (
    !devices.value.length ||
    !map.value ||
    typeof window === "undefined" ||
    !window.google?.maps
  )
    return;

  devices.value.forEach((device) => {
    const marker = new window.google.maps.Marker({
      position: { lat: device.latitude, lng: device.longitude },
      map: map.value,
      icon: createCustomMarker(device.pm25, device.previousPm25, device.trend),
      title: device.place,
    });

    airQualityMarkers.set(device.id, marker);

    marker.addListener("mouseover", () => showBannerFor(buildAirQualityPayload(device)));
    marker.addListener("mouseout", closeBanner);
    marker.addListener("click", () => {
      if (!map.value) return;
      map.value.setCenter(marker.getPosition());
      map.value.setZoom(12);
      showBannerFor(buildAirQualityPayload(device));
    });
  });
}

function addFireMarkers() {
  if (!fires.value.length || !map.value || typeof window === "undefined" || !window.google?.maps)
    return;

  fires.value.forEach((fire) => {
    const marker = new window.google.maps.Marker({
      position: { lat: fire.latitude, lng: fire.longitude },
      map: map.value,
      icon: createFireMarker(fire.intensity),
      title: `จุดความร้อน - ${fire.place}`,
    });

    fireMarkers.set(fire.id, marker);

    marker.addListener("mouseover", () => showBannerFor(buildFirePayload(fire)));
    marker.addListener("mouseout", closeBanner);
    marker.addListener("click", () => {
      if (!map.value) return;
      map.value.setCenter(marker.getPosition());
      map.value.setZoom(12);
      showBannerFor(buildFirePayload(fire));
    });
  });
}

function addEarthquakeMarkers() {
  if (
    !earthquakes.value.length ||
    !map.value ||
    typeof window === "undefined" ||
    !window.google?.maps
  )
    return;

  earthquakes.value.forEach((quake) => {
    const marker = new window.google.maps.Marker({
      position: { lat: quake.latitude, lng: quake.longitude },
      map: map.value,
      icon: createEarthquakeMarker(Number(quake.magnitude)),
      title: `แผ่นดินไหว M${quake.magnitude} - ${quake.place}`,
    });

    earthquakeMarkers.set(quake.id, marker);

    marker.addListener("mouseover", () => showBannerFor(buildEarthquakePayload(quake)));
    marker.addListener("mouseout", closeBanner);
    marker.addListener("click", () => {
      if (!map.value) return;
      map.value.setCenter(marker.getPosition());
      map.value.setZoom(12);
      showBannerFor(buildEarthquakePayload(quake));
    });
  });
}

function buildAirQualityPayload(device) {
  const { status, icon } = resolveAirQualityStatus(device.pm25);
  return {
    type: "air_quality",
    place: device.place,
    pm25: device.pm25,
    temperature: device.temperature,
    humidity: device.humidity,
    airQualityStatus: status,
    weatherIcon: icon,
    updateTime: lastUpdateTime.value || new Date().toLocaleString("th-TH"),
  };
}

function buildFirePayload(fire) {
  return {
    type: "fire",
    place: fire.place,
    intensity: fire.intensity,
    confidence: fire.confidence,
    date: fire.date,
    area: fire.area,
    updateTime: fire.updateTime,
  };
}

function buildEarthquakePayload(quake) {
  return {
    type: "earthquake",
    place: quake.place,
    magnitude: quake.magnitude,
    depth: quake.depth,
    time: quake.time,
    tsunami: quake.tsunami,
    updateTime: quake.updateTime,
  };
}

function showBannerFor(payload) {
  selectedLocation.value = payload;
  showBanner.value = true;
}

function closeBanner() {
  showBanner.value = false;
  selectedLocation.value = null;
}

function ensureBannerVisibility() {
  if (!selectedLocation.value) return;
  const type = selectedLocation.value.type;
  const hidden =
    (type === "air_quality" && !showAirQuality.value) ||
    (type === "fire" && !showFires.value) ||
    (type === "earthquake" && !showEarthquakes.value);
  if (hidden) {
    closeBanner();
  }
}

function searchLocation() {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term || !map.value) return;

  const match =
    devices.value.find((device) => device.place.toLowerCase().includes(term)) ||
    fires.value.find((fire) => fire.place.toLowerCase().includes(term)) ||
    earthquakes.value.find((quake) => quake.place.toLowerCase().includes(term));

  if (!match) {
    if (typeof window !== "undefined") {
      window.alert("ไม่พบสถานที่ที่ค้นหา");
    } else {
      console.warn("ไม่พบสถานที่ที่ค้นหา");
    }
    return;
  }

  map.value.setCenter({ lat: match.latitude, lng: match.longitude });
  map.value.setZoom(12);

  if ("pm25" in match) {
    showBannerFor(buildAirQualityPayload(match));
  } else if ("intensity" in match) {
    showBannerFor(buildFirePayload(match));
  } else {
    showBannerFor(buildEarthquakePayload(match));
  }
}

function createCustomMarker(pm25, pm25Prev, trend) {
  if (typeof document === "undefined") return "";

  const size = 50;
  const circleSize = 30;
  const arrowCircleSize = 20;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  context.beginPath();
  context.arc(size / 2 - 5, size / 2, circleSize / 2, 0, 2 * Math.PI);
  context.fillStyle = getMarkerColor(pm25);
  context.fill();

  context.fillStyle = "white";
  context.font = 'bold 18px "Sarabun", sans-serif';
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(pm25, size / 2 - 5, size / 2);

  const arrowBaseX = size - arrowCircleSize / 2 - 2;
  const arrowBaseY = arrowCircleSize / 2 + 2;

  context.beginPath();
  context.arc(arrowBaseX, arrowBaseY, arrowCircleSize / 2, 0, 2 * Math.PI);
  context.fillStyle = "white";
  context.fill();
  context.strokeStyle = "black";
  context.lineWidth = 2;
  context.stroke();

  context.beginPath();
  if (trend === "d" || pm25 < pm25Prev) {
    context.moveTo(arrowBaseX, arrowBaseY + 5);
    context.lineTo(arrowBaseX - 5, arrowBaseY - 5);
    context.lineTo(arrowBaseX + 5, arrowBaseY - 5);
    context.fillStyle = "#22c55e";
    context.closePath();
    context.fill();
  } else if (trend === "u" || pm25 > pm25Prev) {
    context.moveTo(arrowBaseX, arrowBaseY - 5);
    context.lineTo(arrowBaseX - 5, arrowBaseY + 5);
    context.lineTo(arrowBaseX + 5, arrowBaseY + 5);
    context.fillStyle = "#ef4444";
    context.closePath();
    context.fill();
  } else {
    context.moveTo(arrowBaseX - 5, arrowBaseY);
    context.lineTo(arrowBaseX + 5, arrowBaseY);
    context.strokeStyle = "#9ca3af";
    context.lineWidth = 2;
    context.stroke();
  }

  return canvas.toDataURL();
}

function createFireMarker(intensity) {
  if (typeof document === "undefined") return "";

  const size = 40;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  context.fillStyle = getFireIntensityColor(intensity);
  context.beginPath();
  context.moveTo(size / 2, 5);
  context.bezierCurveTo(size / 2, 5, 5, size - 5, size / 2, size - 5);
  context.bezierCurveTo(size / 2, size - 5, size - 5, size - 5, size / 2, 5);
  context.fill();

  context.fillStyle = "rgba(255,255,255,0.5)";
  context.beginPath();
  context.arc(size / 2, size / 2, size / 4, 0, 2 * Math.PI);
  context.fill();

  return canvas.toDataURL();
}

function createEarthquakeMarker(magnitude) {
  if (typeof document === "undefined") return "";

  const size = 34;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");

  const color = getEarthquakeColor(magnitude);
  context.strokeStyle = color;
  context.lineWidth = 3;

  for (let i = 0; i < 3; i += 1) {
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2 - i * 5, 0, 2 * Math.PI);
    context.stroke();
  }

  context.fillStyle = color;
  context.beginPath();
  context.arc(size / 2, size / 2, 4, 0, 2 * Math.PI);
  context.fill();

  return canvas.toDataURL();
}

function getMarkerColor(value) {
  if (value <= 15) return "#30b2fc";
  if (value <= 25) return "#6dd951";
  if (value <= 37.5) return "#e9db51";
  if (value <= 75) return "#efa628";
  return "#ef4444";
}

function getStatusColor(status) {
  const colorMap = {
    ดีมาก: "#30b2fc",
    ดี: "#6dd951",
    ปานกลาง: "#e9db51",
    แย่: "#efa628",
    อันตราย: "#ef4444",
  };
  return colorMap[status] || "#111827";
}

function getFireIntensity(brightness) {
  if (brightness > 300) return "สูงมาก";
  if (brightness > 200) return "สูง";
  if (brightness > 100) return "ปานกลาง";
  return "ต่ำ";
}

function getFireIntensityColor(intensity) {
  const map = {
    สูงมาก: "#dc2626",
    สูง: "#f97316",
    ปานกลาง: "#facc15",
    ต่ำ: "#86efac",
  };
  return map[intensity] || "#f97316";
}

function getEarthquakeColor(magnitude) {
  if (magnitude >= 7) return "#dc2626";
  if (magnitude >= 6) return "#f97316";
  if (magnitude >= 4) return "#facc15";
  return "#22c55e";
}

function getTsunamiColor(tsunami) {
  return tsunami ? "#dc2626" : "#22c55e";
}

function resolveAirQualityStatus(pm25) {
  if (pm25 <= 15) {
    return { status: "ดีมาก", icon: "/assets/images/yyakkaw_blue_icon.png" };
  }
  if (pm25 <= 25) {
    return { status: "ดี", icon: "/assets/images/yyakkaw_green_icon.png" };
  }
  if (pm25 <= 37.5) {
    return { status: "ปานกลาง", icon: "/assets/images/yyakkaw_yellow_icon.png" };
  }
  if (pm25 <= 75) {
    return { status: "แย่", icon: "/assets/images/yyakkaw_orange_icon.png" };
  }
  return { status: "อันตราย", icon: "/assets/images/yyakkaw_red_icon.png" };
}

function extractArray(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.response)) return payload.response;
  if (Array.isArray(payload?.features)) return payload.features;
  if (Array.isArray(payload?.fires)) return payload.fires;
  return Object.values(payload || {}).filter((entry) => typeof entry === "object");
}

function extractCoordinates(entry) {
  const latDirect = Number(entry.latitude ?? entry.lat);
  const lngDirect = Number(entry.longitude ?? entry.lng);
  if (!Number.isNaN(latDirect) && !Number.isNaN(lngDirect)) {
    return { lat: latDirect, lng: lngDirect };
  }

  if (Array.isArray(entry.geometry?.coordinates)) {
    const [lng, lat] = entry.geometry.coordinates;
    if (!Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))) {
      return { lat: Number(lat), lng: Number(lng) };
    }
  }
  return null;
}

function bannerTitle(type) {
  if (type === "air_quality") return "คุณภาพอากาศ";
  if (type === "fire") return "จุดความร้อน";
  return "แผ่นดินไหว";
}
</script>

<style scoped>
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.banner-fade-enter-from,
.banner-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
