<template>
  <section
    class="mx-auto flex w-full max-w-4xl flex-col gap-5 rounded-3xl bg-white/90 p-5 shadow-lg ring-1 ring-black/5 backdrop-blur"
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
        class="flex w-full flex-col gap-2 sm:flex-row sm:items-center"
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
            class="w-full rounded-xl border border-gray-200 bg-white px-10 py-2 text-sm text-gray-700 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <div class="flex items-center gap-2">
          <button
            type="submit"
            class="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-700"
          >
            ค้นหา
          </button>
          <button
            v-if="searchTerm"
            type="button"
            class="inline-flex items-center rounded-xl border border-gray-200 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
            @click="clearSearch"
          >
            ล้าง
          </button>
        </div>
      </form>
      <div
        class="flex items-center justify-between gap-2 text-sm text-gray-500 sm:justify-end"
      >
        <span>แสดง</span>
        <select
          v-model.number="pageSize"
          class="rounded-xl border border-gray-200 bg-white px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
        >
          <option v-for="option in PAGE_OPTIONS" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
        <span class="text-gray-400">รายการ</span>
      </div>
    </div>

    <div v-if="loading" class="py-10 flex justify-center">
      <span class="text-sm text-gray-500 animate-pulse"
        >กำลังโหลดข้อมูล...</span
      >
    </div>

    <div v-else-if="error" class="py-10 text-center">
      <p class="text-sm text-rose-600 font-medium">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </p>
      <button
        class="mt-3 inline-flex items-center rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
        @click="fetchData"
      >
        ลองอีกครั้ง
      </button>
    </div>

    <div v-else>
      <div
        class="overflow-hidden rounded-2xl border border-gray-100 bg-white/70"
      >
        <div class="overflow-x-auto">
          <table class="min-w-full text-xs sm:text-sm">
            <thead
              class="bg-gray-50/80 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:text-xs"
            >
              <tr>
                <th class="px-3 py-2 text-left">อันดับ</th>
                <th class="px-3 py-2 text-left">สถานี</th>
                <th class="px-3 py-2 text-left">จังหวัด</th>
                <th class="px-3 py-2 text-right">AQI</th>
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
                    :style="getCategoryTextStyle(item.rankingValue)"
                  >
                    {{ formatValue(item.rankingValue) }}
                  </span>
                </td>
                <td class="px-3 py-2 text-right text-gray-700">
                  {{ formatValue(item.pm25) }}
                </td>
                <td class="px-3 py-2 text-gray-700">
                  <span class="inline-flex items-center gap-1 text-xs">
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
                    class="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[11px] font-medium"
                    :style="getCategoryChipStyle(item.rankingValue)"
                  >
                    <span
                      class="h-2 w-2 rounded-full"
                      :style="getCategoryDotStyle(item.rankingValue)"
                    />
                    {{ getCategoryLabel(item.rankingValue) }}
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
                  class="px-4 py-10 text-center text-sm text-gray-500"
                >
                  ไม่พบข้อมูลสถานีที่พร้อมใช้งาน
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div
        class="px-3 py-3 sm:px-5 sm:py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-xs text-gray-500 sm:text-sm"
      >
        <p class="text-center sm:text-left">
          ทั้งหมด {{ totalFiltered }} รายการ · หน้า {{ currentPage }} /
          {{ totalPages }}
        </p>
        <div class="flex items-center justify-center gap-2">
          <button
            class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            :disabled="!canPrev"
            @click="prevPage"
          >
            ก่อนหน้า
          </button>
          <button
            class="rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
            :disabled="!canNext"
            @click="nextPage"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="selectedStation"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        @click.self="closeHeatmap"
      >
        <div class="w-full max-w-lg rounded-2xl bg-white shadow-xl">
          <header
            class="flex items-center justify-between border-b border-gray-100 px-5 py-4"
          >
            <div>
              <h3 class="text-base font-semibold text-gray-900">
                Heatmap — {{ selectedStation?.place ?? "ไม่ทราบสถานี" }}
              </h3>
              <p class="text-xs text-gray-500">{{ popupAddress }}</p>
            </div>
            <button
              class="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              @click="closeHeatmap"
              aria-label="ปิด"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 0 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </header>
          <div class="px-5 py-6 space-y-4 text-sm text-gray-600">
            <div
              class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p class="text-sm text-gray-500">ค่า AQI ปัจจุบัน</p>
                <p class="text-xl font-semibold text-gray-900">
                  {{ formatValue(selectedStation?.rankingValue) }}
                </p>
              </div>
              <div
                v-if="availableYears.length"
                class="flex items-center gap-2 text-xs text-gray-500 sm:text-sm"
              >
                <span>เลือกปี</span>
                <select
                  v-model="selectedYear"
                  class="rounded-lg border border-gray-200 bg-white px-3 py-1 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
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
                class="h-[320px] w-full"
                :option="chartOptions"
                autoresize
              />
              <div
                v-else
                class="flex h-[320px] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-gray-50 text-sm text-gray-400"
              >
                กำลังโหลด Heatmap...
              </div>
            </ClientOnly>
          </div>
          <footer
            class="flex justify-end gap-2 border-t border-gray-100 px-5 py-4"
          >
            <button
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
              @click="closeHeatmap"
            >
              ปิด
            </button>
            <button
              class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              เปิดหน้ารายละเอียด
            </button>
          </footer>
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
  matchColorRange,
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

const resolveRange = (
  value: number | string | null | undefined
): ColorRange | null => {
  const numeric = toNumber(value);
  if (numeric === null) return null;
  const range = matchColorRange(numeric, colorRanges.value);
  return range ?? null;
};

const getCategoryLabel = (value: number | string | null | undefined) => {
  const numeric = toNumber(value);
  if (numeric === null) return "ไม่ทราบ";
  if (numeric <= 50) return "ดี";
  if (numeric <= 100) return "ปานกลาง";
  return "ไม่ดี";
};

const getCategoryTextStyle = (value: number | string | null | undefined) => {
  const range = resolveRange(value);
  const baseColor = range?.color?.trim() || DEFAULT_COLOR;
  return { color: range ? baseColor : DEFAULT_TEXT_COLOR };
};

const getCategoryChipStyle = (value: number | string | null | undefined) => {
  const range = resolveRange(value);
  if (!range) return { ...DEFAULT_CHIP_STYLE };
  const baseColor = range.color?.trim() || DEFAULT_COLOR;
  const background =
    toTranslucent(baseColor, 0.18) ?? DEFAULT_CHIP_STYLE.backgroundColor;
  return {
    backgroundColor: background,
    borderColor: baseColor,
    color: baseColor,
  };
};

const getCategoryDotStyle = (value: number | string | null | undefined) => {
  const range = resolveRange(value);
  const baseColor = range?.color?.trim() || DEFAULT_COLOR;
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
