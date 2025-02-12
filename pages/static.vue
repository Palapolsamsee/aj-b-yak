<template>
  <div>
    <input v-model="selectedProvince" list="province-list" @input="filterData" placeholder="ค้นหาจังหวัด..." />
    <datalist id="province-list">
      <option v-for="province in uniqueProvinces" :key="province" :value="province"></option>
    </datalist>
    <div ref="chart" style="height: 400px;"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, watch } from 'vue';
import { useColorSettings } from '@/utils/useColorSettings';
import * as echarts from 'echarts';
import pm25Data from '@/assets/data/pm25_data.json';

const chart = ref<HTMLElement | null>(null);
const { colorRanges } = useColorSettings(); 
const selectedProvince = ref('');
const filteredData = ref(pm25Data);

const uniqueProvinces = computed(() => {
  return Array.from(new Set(pm25Data.map((item: any) => item.province)));
});

function filterData() {
  if (!selectedProvince.value) {
    filteredData.value = pm25Data;
  } else {
    filteredData.value = pm25Data.filter((item: any) =>
      item.province === selectedProvince.value
    );
  }
  updateChart();
}

function getVirtualData(data: any[]) {
  return data.map((item: any) => [item.date, item.pm2_5]);
}

function updateChart() {
  if (!chart.value) return;
  const myChart = echarts.init(chart.value);

  const option = {
    title: {
      top: 30,
      left: 'center',
      text: `PM2.5 Levels in ${selectedProvince.value || 'Thailand'}`
    },
    tooltip: {},
    visualMap: {
      min: 0,
      max: 150,
      type: 'piecewise',
      orient: 'horizontal',
      left: 'center',
      top: 65,
      pieces: colorRanges.value.map(range => ({
        min: range.min,
        max: range.max,
        color: range.color
      }))
    },
    calendar: {
      top: 120,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: '2024',
      itemStyle: {
        borderWidth: 0.5
      },
      yearLabel: { show: false }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtualData(filteredData.value)
    }
  };

  myChart.setOption(option);
}

onMounted(() => {
  updateChart();
});

watch(selectedProvince, filterData);
</script>

<style>
input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  font-size: 16px;
}
</style>
