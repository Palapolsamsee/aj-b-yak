import { ref, computed, defineAsyncComponent, watch, onMounted, type Ref } from "vue";
import type { ColorRange } from "@/utils/api/colorRanges";

type StaticProps = { address?: string };
type Point = { timestamp: number; pm25?: number };

const DEFAULT_VISUAL_COLORS = [
  "#00e400",
  "#ffff00",
  "#ff7e00",
  "#ff0000",
  "#8f3f97",
  "#7e0023",
];

const toMs = (ts: number) => (ts < 1e12 ? ts * 1000 : ts);

export function useStaticChart(options: {
  props: StaticProps;
  baseAirApi?: string;
  colorRanges: Ref<ColorRange[]>;
}) {
  const { props, baseAirApi, colorRanges } = options;

  const VChart = defineAsyncComponent(() =>
    process.client
      ? import("vue-echarts").then((m) => m.default)
      : Promise.resolve({
          render() {
            return null;
          },
        })
  );

  const decodedAddress = computed(() => {
    if (!props.address) return "";
    try {
      return decodeURIComponent(props.address);
    } catch {
      return props.address;
    }
  });

  const chartOptions = ref<any>(null);
  const allData = ref<Point[]>([]);
  const availableYears = ref<number[]>([]);
  const selectedYear = ref<number>(new Date().getFullYear());

  const buildVisualMap = () => {
    const ranges = colorRanges.value;
    if (!ranges.length) {
      return {
        min: 0,
        max: 150,
        calculable: true,
        orient: "horizontal",
        left: "center",
        top: 0,
        inRange: { color: DEFAULT_VISUAL_COLORS },
      };
    }

    const sorted = [...ranges].sort((a, b) => a.min - b.min);
    const min = sorted.reduce(
      (acc, cur) => Math.min(acc, cur.min),
      sorted[0].min
    );
    const max = sorted.reduce(
      (acc, cur) => Math.max(acc, cur.max),
      sorted[0].max
    );
    const pieces = sorted.map(({ min, max, color }) => ({
      min,
      max,
      color,
      label: `${min} - ${max}`,
    }));

    return {
      type: "piecewise" as const,
      min,
      max,
      orient: "horizontal",
      left: "center",
      top: 0,
      pieces,
    };
  };

  const updateChart = () => {
    if (!allData.value.length) {
      chartOptions.value = null;
      return;
    }

    const year = selectedYear.value;
    const yearData = allData.value.filter(
      (d) => new Date(d.timestamp).getFullYear() === year
    );
    const data = yearData.map((d) => [
      new Date(d.timestamp).toISOString().split("T")[0],
      d.pm25 ?? 0,
    ]);

    chartOptions.value = {
      title: { show: false },
      tooltip: {
        confine: true,
        formatter: (p: any) => `${p.value[0]}<br/>PM2.5: ${p.value[1] ?? "-"}`,
      },
      visualMap: buildVisualMap(),
      calendar: {
        top: 50,
        left: 10,
        right: 10,
        cellSize: ["auto", 16],
        range: [`${year}-01-01`, `${year}-12-31`],
        itemStyle: { borderWidth: 0.5, borderColor: "#e5e7eb" },
        yearLabel: { show: false },
      },
      series: [{ type: "heatmap", coordinateSystem: "calendar", data }],
    };
  };

  const fetchHeatmapData = async () => {
    if (!props.address || !baseAirApi) {
      chartOptions.value = null;
      return;
    }
    try {
      const url = `${baseAirApi}/one_year_series?address=${encodeURIComponent(
        props.address
      )}`;
      const res = await $fetch<any>(url);
      const rows: Point[] = Array.isArray(res) ? res : res?.data ?? [];
      allData.value = rows
        .filter((r) => r && typeof r.timestamp === "number")
        .map((r) => ({ ...r, timestamp: toMs(r.timestamp) }));
      const years = new Set(
        allData.value.map((d) => new Date(d.timestamp).getFullYear())
      );
      availableYears.value = Array.from(years).sort((a, b) => b - a);
      selectedYear.value = availableYears.value[0] ?? new Date().getFullYear();
      updateChart();
    } catch (err) {
      console.error("โหลดข้อมูลไม่สำเร็จ:", err);
      chartOptions.value = null;
    }
  };

  const registerEchartsModules = async () => {
    if (!process.client) return;
    try {
      const [
        { use },
        { CanvasRenderer },
        { HeatmapChart },
        {
          TitleComponent,
          TooltipComponent,
          VisualMapComponent,
          CalendarComponent,
        },
      ] = await Promise.all([
        import("echarts/core"),
        import("echarts/renderers"),
        import("echarts/charts"),
        import("echarts/components"),
      ]);
      use([
        CanvasRenderer,
        HeatmapChart,
        TitleComponent,
        TooltipComponent,
        VisualMapComponent,
        CalendarComponent,
      ]);
    } catch (e) {
      console.error("ECharts module registration failed:", e);
    }
  };

  const bootstrapChart = async () => {
    if (!process.client) return;
    await registerEchartsModules();
    await fetchHeatmapData();
  };

  onMounted(() => {
    if (props.address) {
      bootstrapChart();
    }
  });

  watch(
    () => props.address,
    async (val) => {
      if (!process.client) return;
      if (val) {
        await fetchHeatmapData();
      } else {
        chartOptions.value = null;
      }
    }
  );

  watch(selectedYear, () => updateChart());

  watch(
    colorRanges,
    () => {
      if (allData.value.length) {
        updateChart();
      }
    },
    { deep: true }
  );

  return {
    VChart,
    decodedAddress,
    chartOptions,
    availableYears,
    selectedYear,
    fetchHeatmapData,
    updateChart,
  };
}
