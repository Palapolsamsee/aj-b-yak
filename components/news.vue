<script setup>
import { ref, computed } from 'vue'

// URL ของ Strapi
const STRAPI_URL = 'http://localhost:1338'

// ดึงข้อมูลข่าวจาก API พร้อม populate รูปภาพ
const { data, error, pending } = await useFetch(`${STRAPI_URL}/api/nameofnews?populate=image`)

// Debug: แสดงข้อมูลที่ดึงมาจาก API
console.log("Fetched data:", data.value)

// เรียงลำดับข่าวตามวันที่ล่าสุด
const news = computed(() => {
  return data.value?.data
    ? [...data.value.data].sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0
        return new Date(b.createdAt) - new Date(a.createdAt)
      })
    : []
})

// ฟังก์ชันสร้าง URL เต็มของรูป โดยรับ object ของรูป (ในที่นี้ใช้รูปแรกจาก array)
const getImageUrl = (imageObj) => {
  if (!imageObj) return ''
  return `${STRAPI_URL}${imageObj.url}`
}
</script>

<template>
  <div class="container">
    <h1>ข่าวล่าสุด</h1>

    <!-- แสดงสถานะการโหลด -->
    <p v-if="pending">กำลังโหลดข้อมูล...</p>
    <!-- แสดงข้อผิดพลาด -->
    <p v-else-if="error">เกิดข้อผิดพลาด: {{ error.message }}</p>
    <!-- ถ้าไม่มีข่าว -->
    <p v-else-if="!news.length">ไม่มีข้อมูลข่าว</p>
    <!-- แสดงข่าว -->
    <ul v-else>
      <li v-for="item in news" :key="item.id">
        <!-- ตรวจสอบว่ามีรูปภาพใน array และแสดงรูปแรก -->
        <img 
          v-if="item.image && item.image.length > 0"
          :src="getImageUrl(item.image[0])" 
          alt="News Image" 
          class="news-image" 
        />
        <div class="news-text">
          <h3>{{ item.title }}</h3>
          <p>📅 {{ formatDate(item.createdAt) }}</p>
          <p>
            <a :href="item.URL" target="_blank">อ่านเพิ่มเติม</a>
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>

.container {
  max-width: 1200px; 
  margin: 0 auto;
  padding: 20px;
  
}

h1 {
  font-size: 40px;      /* ปรับขนาดข่าวล่าสุด*/
  font-weight: bold;    /* ตัวหนา */
  text-align: center;
  background-color: #fff;
  color: #000;
  padding: 10px 20px;
  border-radius: 10px;
  width: fit-content;
  margin: 0 auto;
}

li h3 {
  font-size: 25px;      /* ขนาดหัวข้อข่าว */
  font-weight: bold;    /* ตัวหนา */
  margin: 0;
}

ul {
  list-style: none;
  padding: 0;
}


li {
  background-color: #e8eaec;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 5px;
  text-align: left;
  border-bottom: 1px solid #ccc;
  display: flex;
  align-items: flex-start; /* เดิมเป็น center */
  gap: 30px; /* เพิ่มระยะห่างระหว่างรูปกับข้อความ */
}


.news-image {
  width: 300px;   
  height: 200px;  
  object-fit: cover;
  border-radius: 5px;
}


.news-text p {
  line-height: 2; /* ปรับค่า line-height */
}


a {
  color: blue;
  text-decoration: none;
  font-size: 16px;
 
}
</style>
