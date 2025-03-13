<template>
  <section id="supporters" class="bg-[#070d22] py-12 px-4 md:px-12 rounded-lg">
    <div class="container mx-auto text-center">
      <h2 class="text-2xl font-bold mb-8 text-white">ผู้สนับสนุนโครงการ</h2>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-6">
        <div v-for="(sponsor, index) in sponsors" :key="index" class="supporter-item text-center">
          <img :src="sponsor.image" class="w-full h-auto object-contain mx-auto" alt="Sponsor Logo" />
          <p class="mt-2 text-sm font-medium text-black">{{ sponsor.name }}</p> <!-- เปลี่ยน text-white เป็น text-black -->
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';

import Yakkaw_icon from '@/assets/images/sponsors/Yakkaw_icon.png';
import RMUTL_CR from '@/assets/images/sponsors/RMUTL_CR.png';
import ChiangRaiRajabhat from '@/assets/images/sponsors/ChiangRaiRajabhat.webp';
import MFU_Logo from '@/assets/images/sponsors/MFU_Logo.png';
import ClassroomLogo from '@/assets/images/sponsors/ClassroomLogo.jpeg';
import ThaiHealthFoundation from '@/assets/images/sponsors/ThaiHealthFoundation.png';
import SETLogo from '@/assets/images/sponsors/SETLogo.jpg';
import SrithatLogo from '@/assets/images/sponsors/SrithatLogo.png';
import AISLogo from '@/assets/images/sponsors/AISLogo.webp';
import FulfillSocial from '@/assets/images/sponsors/FulfillSocial.jpg';

const sponsors = ref([
  { image: Yakkaw_icon, name: 'สมาคมยักษ์ขาว' },
  { image: RMUTL_CR, name: 'มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนาเชียงราย' },
  { image: ChiangRaiRajabhat, name: 'มหาวิทยาลัยราชภัฎเชียงราย' },
  { image: MFU_Logo, name: 'มหาวิทยาลัยแม่ฟ้าหลวง' },
  { image: ClassroomLogo, name: 'ห้องเรียนสู้ฝุ่น' },
  { image: ThaiHealthFoundation, name: 'สำนักงานกองทุนสนับสนุนการสร้างเสริมสุขภาพ (สสส.)' },
  { image: SETLogo, name: 'ตลาดหลักทรัพย์แห่งประเทศไทย' },
  { image: SrithatLogo, name: 'เทศบาลตำบลศรีธาตุ' },
  { image: AISLogo, name: 'AIS NB-IoT' },
  { image: FulfillSocial, name: 'ห้างหุ้นส่วนจำกัด เติมเต็มวิสาหกิจเพื่อสังคม' },
]);
</script>

<style scoped>
.supporter-item img {
  transition: transform 0.3s ease-in-out;
}
.supporter-item img:hover {
  transform: scale(1.1);
}

/* ✅ ปรับขนาดและพื้นหลังของรูป */
.supporter-item img {
  width: 150px; 
  height: 150px; 
  object-fit: contain; 
  background-color: white; 
  border-radius: 10px; 
  padding: 10px; 
}

/* ✅ จัดให้รูปอยู่ตรงกลาง */
.supporter-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background-color: white; 
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); 
}

/* เพิ่มระยะห่างจากขอบจอ */
section {
  padding-left: 16px;  
  padding-right: 16px; 
}
</style>
