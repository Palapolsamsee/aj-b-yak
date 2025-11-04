<template>
  <div
    :class="[
      'static-card',
      props.address ? 'max-w-6xl' : 'max-w-sm',
      'w-full mx-auto bg-white rounded-2xl shadow-md ring-1 ring-black/5 font-sans flex flex-col h-full',
    ]"
  >
    <!-- Header / Toolbar -->
    <div class="p-4 sm:p-6 border-b border-gray-100">
      <div
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <div class="space-y-1">
          <h3
            class="text-xl font-bold tracking-tight text-gray-900 flex items-center gap-2"
          >
            <span>อันดับคุณภาพอากาศ</span>
            <span class="text-sm font-medium text-gray-500">ตามค่า AQI⁺</span>
          </h3>
          <p class="text-xs sm:text-sm text-gray-500">
            จัดอันดับสถานีจากคุณภาพอากาศแย่ที่สุด → ดีที่สุด
          </p>
        </div>
        <div class="flex items-center gap-2 sm:gap-3">
          <label class="text-xs text-gray-600">ตัวกรอง:</label>
          <select
            v-model="selectedFilter"
            class="rounded-xl border-gray-200 text-sm px-3 py-2"
          >
            <option value="all">ทั้งหมด</option>
            <option value="unhealthy">แย่ (≥101)</option>
            <option value="moderate">ปานกลาง (51–100)</option>
            <option value="good">ดี (≤50)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex-1 p-6 grid gap-2">
      <div
        v-for="i in 6"
        :key="i"
        class="flex items-center justify-between p-3 rounded-xl bg-white"
      >
        <div class="flex items-center gap-3 w-3/4">
          <div class="h-7 w-7 rounded-lg bg-gray-100 animate-pulse" />
          <div class="flex-1 space-y-2">
            <div class="h-3 w-40 bg-gray-100 rounded animate-pulse" />
            <div class="h-2 w-24 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <div class="h-9 w-16 rounded-full bg-gray-100 animate-pulse" />
      </div>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="flex-1 p-6 flex flex-col items-center justify-center text-center"
    >
      <p class="text-sm text-red-600 font-medium mb-2">
        ⚠️ เกิดข้อผิดพลาดในการดึงข้อมูล
      </p>
      <button
        @click="fetchData"
        class="px-3 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-50"
      >
        ลองใหม่
      </button>
    </div>

    <!-- Yearly Stats View -->
    <div v-else-if="showYearlyStats" class="flex-1 flex flex-col p-4 sm:p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-xl font-bold text-gray-900">สถิติคุณภาพอากาศรายปี</h3>
        <button
          @click="showYearlyStats = false"
          class="text-sm font-medium text-indigo-600 hover:text-indigo-800"
        >
          ย้อนกลับ
        </button>
      </div>
      <div
        v-if="yearlyData.length"
        class="flex-1 overflow-auto rounded-xl ring-1 ring-gray-200"
      >
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50 sticky top-0">
            <tr>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
              >
                วันที่
              </th>
              <th
                class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
              >
                PM2.5 (µg/m³)
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-100">
            <tr
              v-for="(data, index) in yearlyData"
              :key="index"
              class="hover:bg-gray-50"
            >
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                {{ data.timestamp }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                {{ formatValue(data.pm25) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="text-center text-gray-500 p-6">
        ไม่พบข้อมูลรายปีสำหรับสถานีนี้
      </div>
    </div>

    <!-- Ranking List -->
    <div v-else class="flex-1 p-2 sm:p-3">
      <ul class="divide-y divide-gray-100">
        <li
          v-for="(item, index) in filteredAndPaginatedData"
          :key="item.dvid ?? item.address ?? index"
          class="group flex items-center justify-between px-2 sm:px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          @click="goToHeatmap(item.address)"
        >
          <div class="flex items-center gap-3 min-w-0">
            <span
              class="inline-flex items-center justify-center h-7 w-7 rounded-lg bg-gray-100 text-gray-600 text-xs font-semibold flex-shrink-0"
              >{{ currentOffset + index + 1 }}</span
            >
            <div class="min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">
                {{ item.address }}
              </p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[11px] text-gray-500 truncate"
                  >DVID: {{ item.dvid ?? "-" }}</span
                >
                <button
                  class="text-[11px] text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                  @click.stop="showYearlyData(item.dvid)"
                >
                  ดูรายปี
                </button>
              </div>
            </div>
          </div>
          <div
            class="static-ranking-chip"
            :style="getAqiChipStyles(item.rankingValue)"
          >
            <span class="static-ranking-chip__value">
              {{ formatValue(item.rankingValue) }}
            </span>
          </div>
        </li>
      </ul>

      <div
        v-if="totalFilteredCount === 0"
        class="p-10 text-center text-gray-500 text-sm"
      >
        ไม่พบสถานีที่ตรงกับเงื่อนไข
      </div>

      <!-- Pagination -->
      <div
        class="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3"
        v-if="totalFilteredCount > 0"
      >
        <div class="flex items-center gap-2 text-xs text-gray-500">
          <span>ต่อหน้า:</span>
          <select
            v-model.number="pageSize"
            class="rounded-lg border border-gray-300 px-2 py-1 text-xs"
          >
            <option v-for="size in PAGE_SIZE_OPTIONS" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
        </div>
        <div class="flex items-center gap-3">
          <button
            class="px-3 py-1.5 text-sm rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            :disabled="!canGoPrev"
            @click.stop="goPrevPage"
          >
            ก่อนหน้า
          </button>
          <span class="text-xs text-gray-500"
            >หน้า {{ currentPage }} / {{ totalPages }} ·
            {{ totalFilteredCount }} รายการ</span
          >
          <button
            class="px-3 py-1.5 text-sm rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            :disabled="!canGoNext"
            @click.stop="goNextPage"
          >
            ถัดไป
          </button>
        </div>
      </div>
    </div>

    <!-- Inline Heatmap when a row is clicked (no navigation) -->
    <div
      v-if="selectedAddress && !props.address"
      class="mt-6 px-4 sm:px-6 pb-6"
    >
      <div class="flex items-center justify-between mb-2">
        <h4 class="text-sm font-semibold text-gray-900 truncate">
          Heatmap — {{ selectedAddress }}
        </h4>
        <button
          @click="selectedAddress = null"
          class="text-xs text-gray-600 hover:text-gray-900"
        >
          ปิด
        </button>
      </div>
      <Heatmap :key="selectedAddress" :address="selectedAddress" />
    </div>

    <!-- Dedicated Heatmap when address prop is present -->
    <div v-if="props.address" class="px-4 sm:px-6 pb-6">
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center gap-2 min-w-0">
          <h4 class="text-base font-semibold text-gray-900 truncate">
            Heatmap — {{ decodedAddress }}
          </h4>
        </div>
        <div class="flex items-center gap-2">
          <label class="text-xs text-gray-600">เลือกปี:</label>
          <select
            v-model="selectedYear"
            @change="updateChart"
            class="border rounded-lg px-2 py-1 text-xs"
          >
            <option v-for="year in availableYears" :key="year" :value="year">
              {{ year }}
            </option>
          </select>
        </div>
      </div>
      <ClientOnly>
        <component
          :is="VChart"
          v-if="chartOptions"
          class="h-[360px] w-full"
          :option="chartOptions"
          autoresize
        />
        <p v-else class="text-gray-500 text-center py-10">
          ⏳ กำลังโหลดข้อมูล...
        </p>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStatic, PAGE_SIZE_OPTIONS } from "~/assets/scripts/static";

const props = defineProps<{ address?: string }>();
const emit = defineEmits<{
  (e: "change-address", address: string): void;
}>();

const {
  VChart,
  decodedAddress,
  chartOptions,
  availableYears,
  selectedYear,
  yearlyData,
  showYearlyStats,
  loading,
  error,
  filteredAndPaginatedData,
  totalFilteredCount,
  pageSize,
  currentPage,
  totalPages,
  selectedFilter,
  canGoNext,
  canGoPrev,
  currentOffset,
  selectedAddress,
  formatValue,
  goPrevPage,
  goNextPage,
  fetchData,
  showYearlyData,
  getAqiChipStyles,
  goToHeatmap,
  updateChart,
} = useStatic(props, emit);
</script>

<style scoped src="~/assets/styles/static.css"></style>
