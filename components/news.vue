<script setup>

import { computed, onMounted } from 'vue';

// URL ของ API ข่าว
const API_URL = 'http://localhost:8080/news';

// ดึงข้อมูลข่าวจาก API
const { data, error, pending } = await useFetch(`${API_URL}`);
console.log("-------------kuymoon");
console.log(data.value); // ตรวจสอบข้อมูล

// เรียงลำดับข่าวตามวันที่ล่าสุด
const news = computed(() => {
  return data.value?.data
    ? [...data.value.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];
});

// ฟังก์ชันสร้าง URL เต็มของรูป
const getImageUrl = (imageObj) => imageObj ? `${API_URL}${imageObj.url}` : '';

// ข้อมูล Facebook Pages
const facebookPages = [
  "https://www.facebook.com/p/%E0%B8%AB%E0%B9%89%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%A3%E0%B8%B5%E0%B8%A2%E0%B8%99%E0%B8%AA%E0%B8%B9%E0%B8%9D%E0%B8%B8%E0%B9%88%E0%B8%99-100063582878340/?locale=th_TH",
  "https://www.facebook.com/profile.php?id=100064516369084"
];

// โหลด Facebook SDK
const loadFacebookSDK = () => {
  if (!window.FB) {
    const script = document.createElement('script');
    script.src = "https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v22.0";
    script.async = true;
    script.defer = true;
    script.onload = () => window.FB && window.FB.XFBML.parse();
    document.body.appendChild(script);
  } else {
    window.FB.XFBML.parse();
  }
};

onMounted(loadFacebookSDK);
</script>

<template>
  <div class="container">
    <h1>Lasted news</h1>
    <p v-if="pending">dowloading...</p>
    <p v-else-if="error">error: {{ error.message }}</p>
    <p v-else-if="!news.length">no news information</p>
    <ul v-else>
      <li v-for="item in news" :key="item.id">
        <img v-if="item.image" :src="getImageUrl(item.image)" alt="News Image" class="news-image" />
        <div class="news-text">
          <h3>{{ item.title }}</h3>
          <p>📅 {{ new Date(item.createdAt).toLocaleDateString('th-TH') }}</p>
          <p><a :href="item.URL" target="_blank">read more</a></p>
        </div>
      </li>
    </ul>

    <!-- Facebook Feed ด้านล่าง -->
    <div class="facebook-section">
      <h2>Facebook Feed</h2>
      <div v-for="(page, index) in facebookPages" :key="index" class="fb-page" :data-href="page" data-tabs="timeline"
        data-width="340" data-height="500" data-small-header="false" data-adapt-container-width="true"
        data-hide-cover="false" data-show-facepile="true"></div>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1,
h2 {
  text-align: center;
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
  display: flex;
  align-items: flex-start;
  gap: 30px;
}

.news-image {
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
}

.facebook-section {
  margin-top: 40px;
  text-align: center;
}
</style>
