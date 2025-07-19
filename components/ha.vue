<template>
  <div class="ha-container">
    <h1>Air Quality Data</h1>

    <!-- Data Table -->
    <table class="data-table" v-if="data.length">
      <thead>
        <tr>
          <th>Address</th>
          <th>Average PM10</th>
          <th>Average PM2.5</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.address">
          <td>{{ item.address }}</td>
          <td>{{ item.avg_pm10.toFixed(2) }}</td>
          <td>{{ item.avg_pm25.toFixed(2) }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else>Loading data...</p>

    <!-- Chart -->
    <div ref="chart" class="chart" v-if="data.length"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { useApiBase } from '@/composables/useApiBase'
const {oneWeekApi} = useApiBase()
export default {
  name: 'Ha',
  data() {
    return {
      data: [], // Data will be fetched dynamically
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const response = await fetch(`{oneWeekApi}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        this.data = result.data; // Assign fetched data to the `data` array
        this.renderChart(); // Render the chart after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    },
    renderChart() {
      const chart = echarts.init(this.$refs.chart);

      const option = {
        title: {
          text: 'Average PM2.5 Levels by Address',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
        },
        xAxis: {
          type: 'category',
          data: this.data.map((item) => item.address),
          axisLabel: {
            interval: 0,
            rotate: 45,
            fontSize: 10,
          },
        },
        yAxis: {
          type: 'value',
          name: 'PM2.5 (µg/m³)',
        },
        series: [
          {
            name: 'PM2.5',
            type: 'bar',
            data: this.data.map((item) => item.avg_pm25),
            itemStyle: {
              color: '#5470C6',
            },
          },
        ],
      };

      chart.setOption(option);
      window.addEventListener('resize', () => chart.resize());
    },
  },
};
</script>

<style scoped>
.ha-container {
  padding: 20px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.data-table th,
.data-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.data-table th {
  background-color: #f4f4f4;
}

.chart {
  width: 100%;
  height: 400px;
}
</style>