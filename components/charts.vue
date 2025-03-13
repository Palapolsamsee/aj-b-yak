<template>
  <div>
    <div ref="chart" style="height: 400px;"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useColorSettings } from '@/utils/useColorSettings';
import * as echarts from 'echarts';
import pm25Data from '@/assets/data/pm25_data.json';

const chart = ref<HTMLElement | null>(null);
const { colorRanges } = useColorSettings();
const filteredData = ref(pm25Data);  // ใช้ข้อมูลทั้งหมดจาก pm25Data

// ฟังก์ชันสำหรับแปลงข้อมูลให้เข้ากับรูปแบบกราฟ
function getVirtualData(data: any[]) {
  return data.map((item: any) => [item.date, item.pm2_5]);
}

// ฟังก์ชันอัปเดตกราฟ
function updateChart() {
  if (!chart.value) return;
  const myChart = echarts.init(chart.value);

  const option = {
    title: {
      top: 30,
      left: 'center',
      text: 'PM2.5 Levels in Thailand'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        // แสดงข้อมูลวันที่และค่าฝุ่นเมื่อคลิกที่วัน
        const date = new Date(params.value[0]);
        const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        return `${formattedDate}<br/>PM2.5: ${params.value[1]} µg/m³`;
      }
    },
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
      yearLabel: { show: false },
      dayLabel: {
        show: true, // ให้แสดงวันที่ในกราฟ
        formatter: (value: string) => {
          return value; // แสดงวัน
        }
      }
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: getVirtualData(filteredData.value)  // ใช้ข้อมูลทั้งหมด
    }
  };

  myChart.setOption(option);
}

// เรียกใช้ฟังก์ชันอัปเดตกราฟเมื่อคอมโพเนนต์ถูก mount
onMounted(() => {
  updateChart();
});
</script>

<style>
input {
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  font-size: 16px;
}
</style>
