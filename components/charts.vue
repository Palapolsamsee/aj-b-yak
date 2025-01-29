<template>
  <div class="chart-container-wrapper">
    <div ref="chart" class="chart-container"></div>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  mounted() {
    this.initChart();
  },
  methods: {
    // Generate virtual data for a specific year
    getVirtualData(year) {
      const date = +echarts.time.parse(year + '-01-01');
      const end = +echarts.time.parse(+year + 1 + '-01-01');
      const dayTime = 3600 * 24 * 1000;
      const data = [];
      for (let time = date; time < end; time += dayTime) {
        data.push([
          echarts.time.format(time, '{yyyy}-{MM}-{dd}', false),
          Math.floor(Math.random() * 10000),
        ]);
      }
      return data;
    },

    // Initialize the chart
    initChart() {
      const chartDom = this.$refs.chart;
      const myChart = echarts.init(chartDom);

      // Set the option for the chart
      const option = {
        title: {
          top: 30,
          left: 'center',
          text: 'สถิติค่าฝุ่น',
        },
        tooltip: {},
        visualMap: {
          min: 0,
          max: 10000,
          type: 'piecewise',
          orient: 'horizontal',
          left: 'center',
          top: 65,
        },
        calendar: {
          top: 120,
          left: 30,
          right: 30,
          cellSize: ['auto', 13],
          range: '2016', // Change this to the required year, if needed
          itemStyle: {
            borderWidth: 0.5,
          },
          yearLabel: { show: false },
        },
        series: {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          data: this.getVirtualData('2016'), // Replace with the year you want
        },
      };

      // Set the chart option
      myChart.setOption(option);

      // Resize the chart when the window is resized
      window.addEventListener('resize', () => myChart.resize());
    },
  },
};
</script>

<style scoped>
.chart-container-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
}

.chart-container {
  width: 100%;
  max-width: 600px; /* Max width for larger screens */
  height: 50vh; /* Dynamic height based on viewport height */
  min-height: 300px; /* Minimum height for small screens */
}
</style>
