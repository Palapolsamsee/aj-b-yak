<template>
  <div>
    Static
    <div ref="chart" style="height: 400px;"></div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import * as echarts from 'echarts'
import pm25Data from '@/assets/data/pm25_data.json' // โหลดข้อมูล JSON

const chart = ref<HTMLElement | null>(null)

// ฟังก์ชันแปลงข้อมูลสำหรับ heatmap
function getVirtualData(pm25Data: any[]) {
  const data: [string, number][] = pm25Data.map((item: any) => [
    item.date, // วันที่
    item.pm2_5 // ค่า PM2.5
  ]);
  return data;
}

onMounted(() => {
  try {
    console.log('Imported data:', pm25Data); // Debug ข้อมูลที่โหลดมา

    // ตั้งค่า ECharts
    const myChart = echarts.init(chart.value!);

    const option = {
      title: {
        top: 30,
        left: 'center',
        text: 'PM2.5 Levels in Bangkok'
      },
      tooltip: {},
      visualMap: {
        min: 0,
        max: 150, // ปรับค่า max ตามค่าสูงสุดของข้อมูล PM2.5
        type: 'piecewise',
        orient: 'horizontal',
        left: 'center',
        top: 65,
        inRange: {
          color: ['#50a3ba', '#eac736', '#d94e5d'] // กำหนดสีสำหรับ heatmap
        }
      },
      calendar: {
        top: 120,
        left: 30,
        right: 30,
        cellSize: ['auto', 13],
        range: '2024', // ปรับปีตามข้อมูลของคุณ
        itemStyle: {
          borderWidth: 0.5
        },
        yearLabel: { show: false }
      },
      series: {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: getVirtualData(pm25Data) // ใช้ข้อมูลจาก pm25Data
      }
    };

    // ใช้ option ที่กำหนด
    myChart.setOption(option);
  } catch (error) {
    console.error('Error loading PM2.5 data:', error);
  }
});
</script> 

<style>

</style>