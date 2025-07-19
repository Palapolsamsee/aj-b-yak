<template>
  <div>
    <h1>Ultimate Dashboard</h1>
    
    <div v-if="loading" class="loading">
      <p>กำลังโหลดข้อมูล...</p>
    </div>
    
    <div v-if="error" class="error">
      <p>{{ error }}</p>
    </div>
    
    <div v-if="!loading && !error">
      <h2>Air Quality Data</h2>
      
      <h3>ข้อมูล 1 สัปดาห์</h3>
      <div v-if="weekData.length">
        <ul>
          <li v-for="(item, index) in weekData" :key="index">
            {{ item.date }} - {{ item.value }} µg/m³
          </li>
        </ul>
      </div>
      
      <h3>ข้อมูล 1 เดือน</h3>
      <div v-if="monthData.length">
        <ul>
          <li v-for="(item, index) in monthData" :key="index">
            {{ item.date }} - {{ item.value }} µg/m³
          </li>
        </ul>
      </div>
      
      <h3>ข้อมูล 3 เดือน</h3>
      <div v-if="threeMonthsData.length">
        <ul>
          <li v-for="(item, index) in threeMonthsData" :key="index">
            {{ item.date }} - {{ item.value }} µg/m³
          </li>
        </ul>
      </div>
      
      <h3>ข้อมูล 1 ปี</h3>
      <div v-if="yearData.length">
        <ul>
          <li v-for="(item, index) in yearData" :key="index">
            {{ item.date }} - {{ item.value }} µg/m³
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const weekData = ref([])
const monthData = ref([])
const threeMonthsData = ref([])
const yearData = ref([])
const loading = ref(true)
const error = ref('')
const config = useRuntimeConfig
const BASE_API =  config.BASE_API
// Function to fetch air quality data for different periods
const fetchData = async () => {
  try {
    // Fetch one-week data
    const weekResponse = await axios.get(`{BASE_API}/one_week`);
    weekData.value = weekResponse.data;

    // Fetch one-month data
    const monthResponse = await axios.get(`{BASE_API}/one_month`);
    monthData.value = monthResponse.data;

    // Fetch three-months data
    const threeMonthsResponse = await axios.get(`{BASE_API}three_months`);
    threeMonthsData.value = threeMonthsResponse.data;

    // Fetch one-year data
    const yearResponse = await axios.get(`{BASE_API}/one_year`);
    yearData.value = yearResponse.data;
  } catch (err) {
    error.value = `เกิดข้อผิดพลาด: ${err.message}`;
  } finally {
    loading.value = false;
  }
};

// Fetch data when the component is mounted
onMounted(() => {
  fetchData()
})
</script>

<style scoped>
.loading {
  font-size: 1.2rem;
  color: #888;
}

.error {
  color: red;
}

ul {
  list-style-type: none;
  padding: 0;
}

h3 {
  margin-top: 20px;
}
</style>
