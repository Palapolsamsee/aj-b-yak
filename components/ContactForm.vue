<script setup>
import { ref } from 'vue';

// โหลดรูปจาก assets ให้ถูกต้อง
const yakkawImage = new URL('/assets/images/yakkaw_nouse.jpg', import.meta.url).href;

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});
const loading = ref(false);
const successMessage = ref('');

const submitForm = () => {
  if (!formData.value.name || !formData.value.email || !formData.value.message) {
    alert('โปรดกรอกข้อมูลให้ครบถ้วน!');
    return;
  }

  loading.value = true;
  successMessage.value = '';

  setTimeout(() => {
    console.log('Form submitted', formData.value);
    formData.value = { name: '', email: '', subject: '', message: '' };
    successMessage.value = 'ข้อความถูกส่งเรียบร้อย!';
    loading.value = false;
  }, 2000);
};
</script>

<template>
  <div class="flex justify-center items-center min-h-screen bg-[#070d22] px-4">
    <div class="bg-white shadow-xl rounded-lg p-8 max-w-3xl w-full flex gap-6 flex-col md:flex-row">
      
      <!-- Contact Form (Left Side) -->
<div class="w-full md:w-1/2 flex flex-col items-center">
  <h2 class="text-2xl font-bold text-gray-800 mb-1 text-center">ติดต่อเรา</h2>
  <h2 class="text-sm text-gray-500 mb-4 text-center">สมาคมยักษ์ขาว</h2>

  <form @submit.prevent="submitForm" class="space-y-4 w-full">
    <div class="form-group">
      <label for="name" class="block font-medium text-gray-700">ชื่อ:</label>
      <input type="text" id="name" v-model="formData.name" required class="input-field" placeholder="กรอกชื่อของคุณ" />
    </div>
    <div class="form-group">
      <label for="email" class="block font-medium text-gray-700">อีเมล:</label>
      <input type="email" id="email" v-model="formData.email" required class="input-field" placeholder="example@mail.com" />
    </div>
    <div class="form-group">
      <label for="subject" class="block font-medium text-gray-700">หัวข้อเรื่อง:</label>
      <input type="text" id="subject" v-model="formData.subject" required class="input-field" placeholder="เรื่องที่ต้องการติดต่อ" />
    </div>
    <div class="form-group">
      <label for="message" class="block font-medium text-gray-700">ข้อความ:</label>
      <textarea id="message" v-model="formData.message" required class="input-field resize-none h-24" placeholder="พิมพ์ข้อความของคุณ..."></textarea>
    </div>
    <button type="submit" class="submit-btn">
      <span v-if="!loading">ส่งข้อความ</span>
      <span v-else class="loading-spinner"></span>
    </button>
    <p v-if="successMessage" class="text-green-600 text-center mt-2">{{ successMessage }}</p>
  </form>
</div>

      <!-- Image Section (Right Side) -->
      <div class="w-full md:w-1/2 flex justify-center items-center">
        <img src="/assets/images/yakkaw_nouse.jpg" alt="ติดต่อเรา" class="rounded-lg w-full">
      </div>

    </div>
  </div>
</template>
<style scoped>
.input-field {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 16px;
  transition: 0.3s ease-in-out;
}
.input-field:focus {
  border-color: #070d22;
  outline: none;
  box-shadow: 0px 0px 8px rgba(79, 70, 229, 0.5);
}
.submit-btn {
  width: 100%;
  background:#070d22;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: 0.3s;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
.submit-btn:hover {
  background: #ff024e;
}
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 3px solid white;
  border-top: 3px solid transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 768px) {
  .max-w-3xl {
    flex-direction: column;
  }
  img {
    max-width: 250px;
  }
}
</style>
