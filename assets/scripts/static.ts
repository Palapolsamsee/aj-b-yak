import { ref, onMounted, computed, watch } from "vue";
import {
  fetchColorRanges,
  matchColorRange,
  toTranslucent,
  DEFAULT_COLOR,
  type ColorRange,
} from "@/utils/api/colorRanges";
import { useApiBase } from "@/composables/useApiBase";
import { useStaticChart } from "./staticChart";

type AirQualityItem = {
  address?: string;
  dvid?: string | null;
  avg_pm25?: number | null;
  avg_pm10?: number | null;
  pm25?: number | string | null;
  aqi?: number | string | null;
  av24h?: number | string | null;
  status?: string | null;
  rankingValue?: number | null;
  [key: string]: unknown;
};

type YearlyStat = {
  timestamp: string | number;
  pm25?: number | string | null;
  [key: string]: unknown;
};

export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];
const DEFAULT_PAGE_SIZE = 5;
const INACTIVE_STATUS = "inactive";
const DEFAULT_CHIP_STYLE = {
  backgroundColor: "rgba(156, 163, 175, 0.14)",
  borderColor: DEFAULT_COLOR,
  color: "#374151",
};

type StaticProps = { address?: string };
type StaticEmit = (event: "change-address", address: string) => void;

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const RANKING_FIELDS = ["aqi", "avg_pm25", "pm25", "av24h"] as const;

const isInactiveStatus = (status: unknown) =>
  typeof status === "string" && status.trim().toLowerCase() === INACTIVE_STATUS;

const pickRankingValue = (item: AirQualityItem) => {
  for (const key of RANKING_FIELDS) {
    const numeric = toNumber(item[key]);
    if (numeric !== null) return numeric;
  }
  return null;
};

const normalizeItem = (item: AirQualityItem): AirQualityItem => {
  const statusText =
    typeof item.status === "string" ? item.status.trim() : undefined;

  const normalized: AirQualityItem = {
    ...item,
    status: statusText,
    avg_pm25: toNumber(item.avg_pm25),
    avg_pm10: toNumber(item.avg_pm10),
    pm25: toNumber(item.pm25),
    aqi: toNumber(item.aqi),
    av24h: toNumber(item.av24h),
  };

  const rankingValue = pickRankingValue(normalized);

  return {
    ...normalized,
    rankingValue,
  };
};

const getAqiLevel = (value: number | string | null | undefined) => {
  const aqiValue = toNumber(value);
  if (aqiValue === null) return "null";
  if (aqiValue <= 50) return "good";
  if (aqiValue <= 100) return "moderate";
  return "unhealthy";
};

export function useStatic(props: StaticProps, emit: StaticEmit) {
  const { yakkawApi, baseAirApi } = useApiBase();

  const airQualityData = ref<AirQualityItem[]>([]);
  const error = ref<string | null>(null);
  const loading = ref(true);
  const pageSize = ref(DEFAULT_PAGE_SIZE);
  const currentPage = ref(1);
  const selectedFilter = ref("all");
  const showYearlyStats = ref(false);
  const yearlyData = ref<YearlyStat[]>([]);
  const colorRanges = ref<ColorRange[]>([]);
  const {
    VChart,
    decodedAddress,
    chartOptions,
    availableYears,
    selectedYear,
    fetchHeatmapData,
    updateChart,
  } = useStaticChart({
    props,
    baseAirApi,
    colorRanges,
  });

  const selectedAddress = ref<string | null>(null);
  const goToHeatmap = (address?: string | null) => {
    if (!address) return;
    if (props.address) {
      emit("change-address", address);
    } else {
      selectedAddress.value = address;
    }
  };

  const loadColorRanges = async () => {
    try {
      colorRanges.value = await fetchColorRanges();
    } catch (error) {
      console.error("[static] Failed to load color ranges:", error);
      colorRanges.value = [];
    }
  };

  const getAqiChipStyles = (
    value: number | string | null | undefined
  ): Record<string, string> => {
    const numeric = toNumber(value);
    if (numeric === null) {
      return { ...DEFAULT_CHIP_STYLE };
    }
    const range = matchColorRange(numeric, colorRanges.value);
    if (!range) {
      return { ...DEFAULT_CHIP_STYLE };
    }

    const baseColor = range.color || DEFAULT_COLOR;
    const background =
      toTranslucent(baseColor, 0.18) ?? DEFAULT_CHIP_STYLE.backgroundColor;

    return {
      backgroundColor: background,
      borderColor: baseColor,
      color: baseColor,
    };
  };

  const formatValue = (value: number | string | null | undefined) => {
    const numeric = toNumber(value);
    return numeric === null ? "-" : numeric.toFixed(0);
  };

  const filteredData = computed(() => {
    if (selectedFilter.value === "all") return airQualityData.value;
    return airQualityData.value.filter(
      (item) => getAqiLevel(item.rankingValue) === selectedFilter.value
    );
  });

  const totalFilteredCount = computed(() => filteredData.value.length);
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(totalFilteredCount.value / pageSize.value))
  );
  const currentOffset = computed(
    () => (currentPage.value - 1) * pageSize.value
  );

  const filteredAndPaginatedData = computed(() => {
    const start = currentOffset.value;
    return filteredData.value.slice(start, start + pageSize.value);
  });

  const canGoPrev = computed(() => currentPage.value > 1);
  const canGoNext = computed(() => currentPage.value < totalPages.value);

  function goPrevPage() {
    if (canGoPrev.value) currentPage.value -= 1;
  }
  function goNextPage() {
    if (canGoNext.value) currentPage.value += 1;
  }

  const fetchData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const resp = await fetch(yakkawApi);
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }

      const data = await resp.json();

      const list = Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.response)
        ? data.response
        : Array.isArray(data)
        ? data
        : [];

      const ranked = list
        .map(normalizeItem)
        .filter((item) => isInactiveStatus(item.status))
        .sort(
          (a, b) =>
            (b.rankingValue ?? Number.NEGATIVE_INFINITY) -
            (a.rankingValue ?? Number.NEGATIVE_INFINITY)
        );

      airQualityData.value = ranked;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
      airQualityData.value = [];
    } finally {
      loading.value = false;
    }
  };

  const showYearlyData = async (dvid?: string | null) => {
    if (!dvid) return;
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(`${baseAirApi}/one_year?dvid=${dvid}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      yearlyData.value = data.data || [];
      showYearlyStats.value = true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : String(err);
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchData();
    loadColorRanges();
  });

  const resetPagination = () => {
    currentPage.value = 1;
  };

  watch([selectedFilter, () => airQualityData.value], resetPagination);
  watch(pageSize, resetPagination);

  watch(totalPages, (pages) => {
    if (currentPage.value > pages) currentPage.value = pages;
    if (currentPage.value < 1) currentPage.value = 1;
  });

  return {
    VChart,
    decodedAddress,
    chartOptions,
    availableYears,
    selectedYear,
    yearlyData,
    showYearlyStats,
    loading,
    error,
    airQualityData,
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
    fetchHeatmapData,
    showYearlyData,
    getAqiChipStyles,
    goToHeatmap,
    updateChart,
  };
}
