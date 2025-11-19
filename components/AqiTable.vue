<template>
  <section
    id="data"
    class="mx-auto flex w-full max-w-7xl flex-col gap-5 rounded-3xl bg-white/90 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur"
  >
    <header class="flex flex-col items-center gap-1 text-center">
      <span
        class="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500"
        >Air Quality</span
      >
      <h2 class="text-xl font-semibold text-gray-900">ตารางคุณภาพอากาศ</h2>
    </header>

    <div
      class="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white/60 p-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <form
        class="flex w-full flex-col gap-3 sm:flex-row sm:items-center"
        @submit.prevent="applySearch"
      >
        <label class="relative flex-1">
          <span
            class="pointer-events-none absolute inset-y-0 left-3 flex items-center text-gray-400"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              class="h-4 w-4"
            >
              <path
                fill-rule="evenodd"
                d="M8.5 3a5.5 5.5 0 1 1 3.478 9.8l3.386 3.386a.75.75 0 1 1-1.06 1.06l-3.386-3.386A5.5 5.5 0 0 1 8.5 3Zm0 1.5a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"
                clip-rule="evenodd"
              />
            </svg>
          </span>
          <input
            v-model="searchInput"
            type="search"
            placeholder="ค้นหาสถานีหรือที่อยู่"
            class="w-full rounded-xl border border-gray-200 bg-white px-10 py-2 text-lg text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <div class="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
          <button
            type="submit"
            class="inline-flex w-full items-center justify-center rounded-xl bg-[#172554] px-4 py-2 text-base font-medium text-white shadow-sm transition sm:w-auto sm:text-lg"
          >
            ค้นหา
          </button>
          <button
            v-if="searchTerm"
            type="button"
            class="inline-flex w-full items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-base text-gray-600 transition hover:bg-gray-50 sm:w-auto sm:text-lg"
            @click="clearSearch"
          >
            ล้าง
          </button>
        </div>
      </form>
      <div
        class="flex flex-wrap items-center justify-between gap-2 text-sm text-gray-500 sm:flex-nowrap sm:text-lg sm:justify-end"
      >
        <span>แสดง</span>
        <select
          v-model.number="pageSize"
          class="rounded-xl border border-gray-200 bg-white px-2 py-1 text-lg focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option v-for="option in PAGE_OPTIONS" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span class="text-gray-400">รายการ</span>
      </div>
    </div>

    <div v-if="loading" class="py-10 flex justify-center">
      <span class="text-lg text-gray-500 animate-pulse"
        >กำลังโหลดข้อมูล...</span
      >
    </div>

    <div v-else-if="error" class="py-10 text-center">
      <p class="text-lg text-rose-600 font-medium">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </p>
      <button
        class="mt-3 inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-lg text-gray-700 hover:bg-gray-50"
        @click="fetchData"
      >
        ลองอีกครั้ง
      </button>
    </div>

    <div v-else>
      <!-- Mobile Card View -->
      <div class="sm:hidden space-y-4">
        <article
          v-for="(item, index) in paginatedData"
          :key="item.dvid ?? index"
          class="rounded-3xl border border-gray-100 bg-white/80 p-4 shadow-sm ring-1 ring-black/5"
        >
          <div class="flex items-start justify-between gap-3">
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-gray-400">
                อันดับ
              </p>
              <p class="text-2xl font-semibold text-gray-900">
                #{{ pageOffset + index + 1 }}
              </p>
            </div>
            <span
              class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-base font-semibold"
              :style="getCategoryChipStyle(item.pm25)"
            >
              <span
                class="h-2 w-2 rounded-full"
                :style="getCategoryDotStyle(item.pm25)"
              />
              {{ getCategoryLabel(item.pm25) }}
            </span>
          </div>
          <div class="mt-3 space-y-1">
            <p class="text-lg font-semibold text-gray-900">
              {{ item.place ?? "-" }}
            </p>
            <p class="text-sm text-gray-500">
              {{ item.address ?? "-" }}
            </p>
          </div>
          <dl class="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
            <div>
              <dt class="text-xs uppercase tracking-wide text-gray-400">
                จังหวัด
              </dt>
              <dd class="text-base font-medium text-gray-900">
                {{ getProvince(item.address) }}
              </dd>
            </div>
            <div class="text-right">
              <dt class="text-xs uppercase tracking-wide text-gray-400">
                PM2.5
              </dt>
              <dd
                class="text-2xl font-semibold"
                :style="getCategoryTextStyle(item.pm25)"
              >
                {{ formatValue(item.pm25) }}
              </dd>
            </div>
            <div class="col-span-2 flex items-center justify-between text-base">
              <span class="text-gray-500">แนวโน้ม</span>
              <span class="font-semibold uppercase" :class="trendClass(item.trend)">
                {{ trendLabel(item.trend) }}
              </span>
            </div>
          </dl>
          <div class="mt-4 flex items-center justify-between">
            <p class="text-sm text-gray-500">ดูรายละเอียด Heatmap</p>
            <button
              class="inline-flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
              @click="openHeatmap(item)"
              aria-label="ดู Heatmap"
            >
              Heatmap
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.6"
                class="h-4 w-4"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M3 7h6l2-2h10v12H3z"
                />
              </svg>
            </button>
          </div>
        </article>
      </div>

      <p
        v-if="filteredData.length === 0"
        class="mt-4 rounded-2xl border border-dashed border-gray-200 px-4 py-8 text-center text-base text-gray-500 sm:hidden"
      >
        ไม่พบข้อมูลสถานีที่พร้อมใช้งาน
      </p>

      <!-- Desktop Table -->
      <div class="hidden sm:block">
        <div
          class="overflow-hidden rounded-2xl border border-gray-100 bg-white/70"
        >
          <div class="overflow-x-auto">
            <table class="min-w-full text-xs sm:text-base">
            <thead
              class="bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs"
            >
              <tr>
                <th class="px-3 py-2 text-left">อันดับ</th>
                <th class="px-3 py-2 text-left">สถานี</th>
                <th class="px-3 py-2 text-left">จังหวัด</th>
                <th class="px-3 py-2 text-right">PM2.5</th>
                <th class="px-3 py-2 text-left">แนวโน้ม</th>
                <th class="px-3 py-2 text-left">คุณภาพอากา</th>
                <th class="px-3 py-2 text-center">Heatmap</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr
                v-for="(item, index) in paginatedData"
                :key="item.dvid ?? index"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-3 py-2 font-semibold text-gray-900">
                  {{ pageOffset + index + 1 }}
                </td>
                <td class="px-3 py-2 text-gray-800">
                  <p class="font-medium text-gray-900">
                    {{ item.place ?? "-" }}
                  </p>
                  <p class="text-[11px] text-gray-500">
                    {{ item.address ?? "-" }}
                  </p>
                </td>
                <td class="px-3 py-2 text-gray-700">
                  {{ getProvince(item.address) }}
                </td>
                <td class="px-3 py-2 text-right">
                  <span
                    class="font-semibold"
                    :style="getCategoryTextStyle(item.pm25)"
                  >
                    {{ formatValue(item.pm25) }}
                  </span>
                </td>

                <td class="px-3 py-2 text-gray-700">
                  <span class="inline-flex items-center gap-1 text-lg">
                    <span
                      class="uppercase tracking-wide"
                      :class="trendClass(item.trend)"
                    >
                      {{ trendLabel(item.trend) }}
                    </span>
                  </span>
                </td>
                <td class="px-3 py-2">
                  <span
                    class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-lg font-medium"
                    :style="getCategoryChipStyle(item.pm25)"
                  >
                    <span
                      class="h-2 w-2 rounded-full"
                      :style="getCategoryDotStyle(item.pm25)"
                    />
                    {{ getCategoryLabel(item.pm25) }}
                  </span>
                </td>
                <td class="px-3 py-2 text-center">
                  <button
                    class="inline-flex items-center justify-center h-8 w-8 rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100 hover:text-gray-900"
                    @click="openHeatmap(item)"
                    aria-label="ดู Heatmap"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      class="h-4 w-4"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M2.25 4.5A2.25 2.25 0 0 1 4.5 2.25h5.325c.44 0 .868.176 1.182.49l1.253 1.254c.313.313.742.49 1.182.49H19.5A2.25 2.25 0 0 1 21.75 6.75v12a2.25 2.25 0 0 1-2.25 2.25h-15A2.25 2.25 0 0 1 2.25 18.75v-14.25ZM12 17.25a.75.75 0 0 0 .75-.75v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V10.5a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V16.5a.75.75 0 0 0 .75.75Z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredData.length === 0">
                <td
                  colspan="8"
                  class="px-4 py-10 text-center text-lg text-gray-500"
                >
                  ไม่พบข้อมูลสถานีที่พร้อมใช้งาน
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="px-3 py-3 sm:px-5 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 sm:text-lg"
      >
        <p class="text-center sm:text-left">
          ทั้งหมด {{ totalFiltered }} รายการ · หน้า {{ currentPage }} /
          {{ totalPages }}
        </p>
        <div class="flex items-center justify-center gap-2">
          <button
            class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-lg"
            :disabled="!canPrev"
            @click="prevPage"
          >
            ก่อนหน้า
          </button>
          <button
            class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-lg"
            :disabled="!canNext"
            @click="nextPage"
          >
            ถัดไป
          </button>
        </div>
      </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="selectedStation"
        class="fixed inset-0 z-50 flex flex-col bg-black/40 px-0 py-0 sm:flex sm:items-center sm:justify-center sm:px-4 sm:py-6"
        @click.self="closeHeatmap"
      >
        <div
          class="mt-auto flex w-full max-w-none flex-col rounded-t-[32px] bg-white shadow-2xl transition max-h-[95vh] overflow-hidden sm:mt-0 sm:w-auto sm:max-h-[85vh] sm:max-w-3xl sm:rounded-2xl lg:max-w-4xl"
        >
          <header
            class="flex items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:items-center"
          >
            <div>
              <p class="text-xs uppercase tracking-[0.3em] text-gray-400">
                Heatmap
              </p>
              <h3 class="text-lg font-semibold text-gray-900 sm:text-xl">
                {{ selectedStation?.place ?? "ไม่ทราบสถานี" }}
              </h3>
              <p class="text-xs text-gray-500">{{ popupAddress }}</p>
            </div>
            <button
              class="rounded-full border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 hover:text-gray-800"
              @click="closeHeatmap"
              aria-label="ปิด"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                class="h-5 w-5"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M6 18 18 6" />
              </svg>
            </button>
          </header>
          <div
            class="flex-1 overflow-y-auto px-5 py-6 text-base text-gray-600 sm:max-h-full sm:px-6 sm:py-7 sm:text-lg"
          >
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p class="text-sm uppercase tracking-wide text-gray-400">
                  ค่า PM2.5 ปัจจุบัน
                </p>
                <p class="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {{ formatValue(selectedStation?.pm25) }}
                </p>
              </div>
              <div
                v-if="availableYears.length"
                class="flex items-center gap-2 rounded-2xl bg-gray-50 px-3 py-2 text-sm text-gray-500 sm:bg-transparent sm:p-0 sm:text-base"
              >
                <span>เลือกปี</span>
                <select
                  v-model="selectedYear"
                  class="rounded-lg border border-gray-200 bg-white px-3 py-1 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                >
                  <option
                    v-for="year in availableYears"
                    :key="year"
                    :value="year"
                  >
                    {{ year }}
                  </option>
                </select>
              </div>
            </div>
            <ClientOnly>
              <component
                :is="VChart"
                v-if="chartOptions"
                class="mt-5 h-[280px] w-screen"

                :option="chartOptions"
                autoresize
              />
              <div
                v-else
                class="mt-5 flex h-[240px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-base text-gray-400 sm:h-[280px] sm:text-lg"
              >
                กำลังโหลด Heatmap...
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </transition>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useApiBase } from "@/composables/useApiBase";
import { useStaticChart } from "~/assets/scripts/staticChart";
import {
  DEFAULT_COLOR,
  fetchColorRanges,
  toTranslucent,
  type ColorRange,
} from "@/utils/api/colorRanges";

type ApiItem = {
  dvid?: string | null;
  place?: string | null;
  address?: string | null;
  status?: string | null;
  trend?: string | null;
  aqi?: number | string | null;
  pm25?: number | string | null;
  av24h?: number | string | null;
  av6h?: number | string | null;
  av3h?: number | string | null;
  av1h?: number | string | null;
  [key: string]: unknown;
};

const { yakkawApi, baseAirApi } = useApiBase();

const PAGE_OPTIONS = [5, 10, 20];

const loading = ref(true);
const error = ref<string | null>(null);
const stations = ref<ApiItem[]>([]);
const selectedStation = ref<ApiItem | null>(null);
const searchInput = ref("");
const searchTerm = ref("");
const pageSize = ref(PAGE_OPTIONS[0]);
const currentPage = ref(1);
const colorRanges = ref<ColorRange[]>([]);
const heatmapProps = reactive<{ address?: string }>({ address: undefined });

const {
  VChart,
  decodedAddress,
  chartOptions,
  availableYears,
  selectedYear,
  fetchHeatmapData,
  updateChart,
} = useStaticChart({
  props: heatmapProps,
  baseAirApi,
  colorRanges,
});

const ACTIVE_STATUS = "active";
const RANK_KEYS = ["aqi", "av24h", "pm25", "av6h", "av3h", "av1h"] as const;

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const pickRankingValue = (item: ApiItem) => {
  for (const key of RANK_KEYS) {
    const numeric = toNumber(item[key]);
    if (numeric !== null) return numeric;
  }
  return null;
};

const normalizedStations = computed(() =>
  stations.value.map((item) => ({
    ...item,
    rankingValue: pickRankingValue(item),
  }))
);

const rankedData = computed(() =>
  normalizedStations.value
    .filter(
      (item) =>
        (item.status ?? "").toString().trim().toLowerCase() === ACTIVE_STATUS &&
        item.rankingValue !== null
    )
    .sort(
      (a, b) =>
        (b.rankingValue ?? Number.NEGATIVE_INFINITY) -
        (a.rankingValue ?? Number.NEGATIVE_INFINITY)
    )
);

const filteredData = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term) return rankedData.value;
  return rankedData.value.filter((item) => {
    const place = (item.place ?? "").toString().toLowerCase();
    const address = (item.address ?? "").toString().toLowerCase();
    return place.includes(term) || address.includes(term);
  });
});

const totalFiltered = computed(() => filteredData.value.length);
const totalPages = computed(() =>
  Math.max(1, Math.ceil(totalFiltered.value / pageSize.value))
);
const pageOffset = computed(() => (currentPage.value - 1) * pageSize.value);
const paginatedData = computed(() =>
  filteredData.value.slice(pageOffset.value, pageOffset.value + pageSize.value)
);
const canPrev = computed(() => currentPage.value > 1);
const canNext = computed(() => currentPage.value < totalPages.value);

const popupAddress = computed(
  () => decodedAddress.value || selectedStation.value?.address || "-"
);

const loadColorRanges = async () => {
  try {
    colorRanges.value = await fetchColorRanges();
  } catch (err) {
    console.error("[AqiTable] Failed to load color ranges:", err);
    colorRanges.value = [];
  }
  if (process.client && heatmapProps.address) {
    await fetchHeatmapData();
    updateChart();
  } else if (chartOptions.value) {
    updateChart();
  }
};

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const resp = await fetch(yakkawApi);
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status}`);
    }
    const payload = await resp.json();
    const data = Array.isArray(payload?.data)
      ? payload.data
      : Array.isArray(payload?.response)
      ? payload.response
      : Array.isArray(payload)
      ? payload
      : [];
    stations.value = data;
    currentPage.value = 1;
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
    stations.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchData();
  loadColorRanges();
});

const applySearch = () => {
  searchTerm.value = searchInput.value.trim();
  currentPage.value = 1;
};

const clearSearch = () => {
  searchInput.value = "";
  searchTerm.value = "";
  currentPage.value = 1;
};

const prevPage = () => {
  if (canPrev.value) currentPage.value -= 1;
};

const nextPage = () => {
  if (canNext.value) currentPage.value += 1;
};

const getProvince = (address?: string | null) => {
  if (!address || typeof address !== "string") return "-";
  const parts = address.split("จ.");
  if (parts.length > 1) {
    return parts[parts.length - 1].trim();
  }
  const alt = address.split("จังหวัด");
  if (alt.length > 1) {
    return alt[alt.length - 1].trim();
  }
  return address.trim();
};

const formatValue = (value: number | string | null | undefined) => {
  const numeric = toNumber(value);
  return numeric === null ? "-" : numeric.toFixed(0);
};

const DEFAULT_TEXT_COLOR = "#4b5563";
const DEFAULT_CHIP_STYLE = {
  backgroundColor: "rgba(156, 163, 175, 0.18)",
  borderColor: DEFAULT_COLOR,
  color: DEFAULT_TEXT_COLOR,
};
const CATEGORY_COLORS: Record<string, string> = {
  ไม่ทราบ: "#6b7280", // gray-600
  ดี: "#16a34a", // green-600
  ปานกลาง: "#ca8a04", // amber-600
  ไม่ดี: "#dc2626", // red-600
};

const getCategoryLabel = (value: number | string | null | undefined) => {
  const numeric = toNumber(value);
  if (numeric === null) return "ไม่ทราบ";
  if (numeric <= 50) return "ดี";
  if (numeric <= 100) return "ปานกลาง";
  return "ไม่ดี";
};

const getCategoryTextStyle = (value: number | string | null | undefined) => {
  const label = getCategoryLabel(value);
  const color = CATEGORY_COLORS[label] ?? DEFAULT_TEXT_COLOR;
  return { color };
};

const getCategoryChipStyle = (value: number | string | null | undefined) => {
  const label = getCategoryLabel(value);
  const baseColor = CATEGORY_COLORS[label];
  if (!baseColor) return { ...DEFAULT_CHIP_STYLE };
  const background =
    toTranslucent(baseColor, 0.18) ?? DEFAULT_CHIP_STYLE.backgroundColor;
  return {
    backgroundColor: background,
    borderColor: baseColor,
    color: baseColor,
  };
};

const getCategoryDotStyle = (value: number | string | null | undefined) => {
  const label = getCategoryLabel(value);
  const baseColor = CATEGORY_COLORS[label] ?? DEFAULT_TEXT_COLOR;
  return { backgroundColor: baseColor };
};

const trendLabel = (trend?: string | null) => {
  const normalized = (trend ?? "").toString().toLowerCase();
  if (normalized === "u") return "เพิ่ม";
  if (normalized === "d") return "ลด";
  if (normalized === "s") return "คงที่";
  return "ไม่ทราบ";
};

const trendClass = (trend?: string | null) => {
  const normalized = (trend ?? "").toString().toLowerCase();
  if (normalized === "u") return "text-emerald-600";
  if (normalized === "d") return "text-rose-600";
  if (normalized === "s") return "text-blue-600";
  return "text-gray-500";
};

const openHeatmap = async (item: ApiItem) => {
  selectedStation.value = item;
  heatmapProps.address = item.address ?? undefined;
  if (process.client) {
    await fetchHeatmapData();
    updateChart();
  }
};

const closeHeatmap = () => {
  selectedStation.value = null;
  heatmapProps.address = undefined;
  chartOptions.value = null;
  availableYears.value = [];
  selectedYear.value = new Date().getFullYear();
};

watch(pageSize, () => {
  currentPage.value = 1;
});

watch(totalPages, (pages) => {
  if (currentPage.value > pages) currentPage.value = pages;
  if (currentPage.value < 1) currentPage.value = 1;
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>
