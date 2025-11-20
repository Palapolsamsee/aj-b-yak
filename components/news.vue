<template>
  <div class="container">
    <h1 class="main-title">ข่าวล่าสุด</h1>

    <p v-if="pending" class="loading-text">กำลังโหลดข้อมูล...</p>
    <p v-else-if="error" class="error-text">เกิดข้อผิดพลาด: {{ error.message }}</p>
    <p v-else-if="!news.length" class="empty-text">ไม่มีข้อมูลข่าว</p>

    <div v-else>
      <!-- News Grid Section -->
      <ul class="news-grid">
        <li v-for="item in news" :key="item.id" class="news-card">
          <div class="image-container">
            <img
              v-if="item.image"
              :src="getImageUrl(item.image)"
              alt="News Image"
              class="news-image"
              loading="lazy"
            />
            <div v-else class="image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="placeholder-icon">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5-7l-3 3.72L9 13l-3 4h12l-4-5z"/>
              </svg>
            </div>
          </div>
          <div class="news-text">
            <h3 class="news-title">{{ item.title }}</h3>
            <p class="news-date">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="calendar-icon">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
              </svg>
              {{ formatThaiDate(item.date) }}
            </p>
            <a :href="item.url" target="_blank" rel="noopener noreferrer" class="read-more">
              อ่านเพิ่มเติม
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="arrow-icon">
                <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
              </svg>
            </a>
          </div>
        </li>
      </ul>

      <!-- Facebook Section -->
      <div class="facebook-section">
        <h2 class="section-title">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="facebook-icon">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
          </svg>
          ติดตามเพิ่มเติม
        </h2>
        <div class="facebook-grid">
          <div class="fb-card">
            <div class="fb-header">
              <div class="fb-avatar"></div>
              <div class="fb-page-info">
                <div class="fb-page-name">ห้องเรียนสู้ฝุ่น</div>
                <div class="fb-followers">ติดตามแล้ว 12K</div>
              </div>
            </div>
            <div class="fb-content-wrapper">
              <div class="fb-content">
                <div class="fb-page" 
                    data-href="https://www.facebook.com/p/ห้องเรียนสูฝุ่น-100063582878340"
                    data-tabs="timeline"
                    data-width="400"
                    data-height="400"
                    data-small-header="true"
                    data-adapt-container-width="false"
                    data-hide-cover="true"
                    data-show-facepile="false">
                </div>
              </div>
            </div>
            <a href="https://www.facebook.com/p/ห้องเรียนสูฝุ่น-100063582878340" target="_blank" class="fb-footer">
              ดูบน Facebook
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fb-arrow">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </a>
          </div>

          <div class="fb-card">
            <div class="fb-header">
              <div class="fb-avatar"></div>
              <div class="fb-page-info">
                <div class="fb-page-name">ยักษ์ขาว</div>
                <div class="fb-followers">ติดตามแล้ว 8.5K</div>
              </div>
            </div>
            <div class="fb-content-wrapper">
              <div class="fb-content">
                <div class="fb-page" 
                    data-href="https://www.facebook.com/profile.php?id=100064516369084"
                    data-tabs="timeline"
                    data-width="400"
                    data-height="400"
                    data-small-header="true"
                    data-adapt-container-width="false"
                    data-hide-cover="true"
                    data-show-facepile="false">
                </div>
              </div>
            </div>
            <a href="https://www.facebook.com/profile.php?id=100064516369084" target="_blank" class="fb-footer">
              ดูบน Facebook
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="fb-arrow">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useApiBase } from '@/composables/useApiBase'

const { newsApi } = useApiBase()
const API_URL = newsApi || '/news'
const news = ref([])
const pending = ref(true)
const error = ref(null)

// ฟังก์ชันช่วยเลือกรูป
function getImageUrl(url) {
  return url || 'https://via.placeholder.com/300x200?text=No+Image'
}

// ฟังก์ชันจัดรูปแบบวันที่ไทย
function formatThaiDate(dateString) {
  const date = new Date(dateString)
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Bangkok'
  }
  return date.toLocaleDateString('th-TH', options)
}

// ดึงข้อมูลข่าวจาก API
async function fetchNews() {
  try {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()

    news.value = Array.isArray(data) 
      ? data.sort((a, b) => new Date(b.date) - new Date(a.date))
      : []
  } catch (err) {
    error.value = err
  } finally {
    pending.value = false
  }
}

// โหลด Facebook SDK
function loadFacebookSDK() {
  return new Promise((resolve) => {
    if (window.FB) {
      resolve(window.FB)
      return
    }

    // สร้าง div สำหรับ Facebook root ถ้ายังไม่มี
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div')
      fbRoot.id = 'fb-root'
      document.body.appendChild(fbRoot)
    }

    const script = document.createElement('script')
    script.src = 'https://connect.facebook.net/th_TH/sdk.js#xfbml=1&version=v18.0'
    script.async = true
    script.defer = true
    script.crossOrigin = 'anonymous'
    
    script.onload = () => {
      window.FB.init({
        xfbml: true,
        version: 'v18.0'
      })
      resolve(window.FB)
    }
    
    script.onerror = () => {
      console.error('Failed to load Facebook SDK')
      resolve(null)
    }
    
    document.body.appendChild(script)
  })
}

// เมื่อ component mount
onMounted(async () => {
  await fetchNews()
  
  if (process.client) {
    const fb = await loadFacebookSDK()
    if (fb) {
      // รอให้ DOM อัพเดทก่อน render
      setTimeout(() => {
        fb.XFBML.parse()
        
        // ฟอร์ซขนาดและพื้นหลังหลังจากโหลดเสร็จ
        document.querySelectorAll('.fb-page iframe').forEach(iframe => {
          iframe.style.width = '400px'
          iframe.style.height = '400px'
          iframe.style.backgroundColor = 'white'
        })
      }, 500)
    }
  }
})
</script>

<style scoped>
/* Base Styles */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Segoe UI', 'Prompt', sans-serif;
}

.main-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 2.2rem;
  position: relative;
  padding-bottom: 1rem;
}

.main-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #1877f2, #25d366);
  margin: 0.8rem auto 0;
  border-radius: 2px;
}

.loading-text, .error-text, .empty-text {
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  padding: 2rem;
}

.error-text {
  color: #e74c3c;
}

/* News Grid Styles */
.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
}

.news-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.news-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.12);
}

.image-container {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.news-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.news-card:hover .news-image {
  transform: scale(1.05);
}

.image-placeholder {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-icon {
  width: 50px;
  height: 50px;
  fill: #ccc;
}

.news-text {
  padding: 1.5rem;
}

.news-title {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  color: #2c3e50;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-date {
  display: flex;
  align-items: center;
  color: #7f8c8d;
  margin-bottom: 1.2rem;
  font-size: 0.9rem;
}

.calendar-icon {
  width: 16px;
  height: 16px;
  fill: #7f8c8d;
  margin-right: 6px;
}

.read-more {
  display: inline-flex;
  align-items: center;
  color: #1877f2;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.read-more:hover {
  color: #1565c0;
}

.arrow-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  margin-left: 5px;
  transition: transform 0.3s;
}

.read-more:hover .arrow-icon {
  transform: translateX(3px);
}

/* Facebook Section Styles */
.facebook-section {
  margin: 4rem 0;
  padding: 2rem 0;
  border-top: 1px solid rgba(0,0,0,0.08);
}

.section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #2c3e50;
  margin-bottom: 2.5rem;
}

.facebook-icon {
  width: 28px;
  height: 28px;
  fill: #1877f2;
  margin-right: 10px;
}

.facebook-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2.5rem;
  margin-top: 1.5rem;
  justify-items: center;
}

.fb-card {
  width: 400px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.fb-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.fb-header {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #f0f0f0;
}

.fb-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1877f2;
  margin-right: 12px;
  position: relative;
  overflow: hidden;
}

.fb-avatar::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>') center no-repeat;
  background-size: 60%;
}

.fb-page-info {
  flex: 1;
}

.fb-page-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 2px;
}

.fb-followers {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.fb-content-wrapper {
  position: relative;
  width: 100%;
  height: 400px;
  background: white;
}

.fb-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.fb-page {
  width: 400px;
  height: 400px;
  margin: 0 auto;
}

.fb-page.fb_iframe_widget,
.fb-page.fb_iframe_widget span,
.fb-page iframe {
  width: 400px !important;
  height: 400px !important;
  border: none !important;
  background: white !important;
}

.fb-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  background: white;
  color: #1877f2;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  border-top: 1px solid #f0f0f0;
}

.fb-footer:hover {
  background: #f5f5f5;
}

.fb-arrow {
  width: 16px;
  height: 16px;
  fill: currentColor;
  margin-left: 6px;
  transition: transform 0.3s;
}

.fb-footer:hover .fb-arrow {
  transform: translateX(3px);
}

/* Loading State for Facebook Widget */
.fb-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.9);
}

.fb-loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1877f2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .main-title {
    font-size: 1.8rem;
  }
  
  .news-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .facebook-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .fb-card {
    width: 100%;
    max-width: 400px;
  }
  
  .fb-content-wrapper,
  .fb-page,
  .fb-page iframe {
    width: 100% !important;
    max-width: 400px;
    height: 400px !important;
  }
}

@media (max-width: 480px) {
  .fb-content-wrapper,
  .fb-page,
  .fb-page iframe {
    height: 350px !important;
  }
}
</style>
